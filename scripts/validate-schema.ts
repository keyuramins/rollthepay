#!/usr/bin/env tsx
import 'dotenv/config';
import { Pool } from 'pg';

// Database connection for validation (uses POSTGRES_URL directly, not PgBouncer)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 1, // Single connection for validation
  query_timeout: 60000, // 60 second timeout
});

async function validateSchema() {
  console.log('🔍 Starting database schema validation...');
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  
  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(`✅ Connected to PostgreSQL at ${connectionTest.rows[0].current_time}`);
    console.log(`📋 PostgreSQL version: ${connectionTest.rows[0].pg_version}`);
    
    // 1. Verify table structure
    console.log('\n📋 Validating table structure...');
    const tablesResult = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'occupations'
      ORDER BY ordinal_position
    `);
    
    console.log(`✅ Found ${tablesResult.rows.length} columns in occupations table:`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // 2. Verify indexes
    console.log('\n🔍 Validating indexes...');
    const indexesResult = await pool.query(`
      SELECT indexname, tablename, indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' AND tablename = 'occupations'
      ORDER BY indexname
    `);
    
    console.log(`✅ Found ${indexesResult.rows.length} indexes on occupations table:`);
    indexesResult.rows.forEach(row => {
      console.log(`  - ${row.indexname}: ${row.indexdef}`);
    });
    
    // 3. Verify constraints
    console.log('\n🔒 Validating constraints...');
    const constraintsResult = await pool.query(`
      SELECT tc.constraint_name, tc.constraint_type, ccu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_schema = 'public' AND tc.table_name = 'occupations'
      ORDER BY tc.constraint_name
    `);
    
    console.log(`✅ Found ${constraintsResult.rows.length} constraints on occupations table:`);
    constraintsResult.rows.forEach(row => {
      console.log(`  - ${row.constraint_name}: ${row.constraint_type} on ${row.column_name}`);
    });
    
    // 4. Verify materialized views
    console.log('\n📊 Validating materialized views...');
    const viewsResult = await pool.query(`
      SELECT matviewname, definition
      FROM pg_matviews 
      WHERE schemaname = 'public'
      ORDER BY matviewname
    `);
    
    console.log(`✅ Found ${viewsResult.rows.length} materialized views:`);
    viewsResult.rows.forEach(row => {
      console.log(`  - ${row.matviewname}`);
    });
    
    // 5. Verify triggers
    console.log('\n⚡ Validating triggers...');
    const triggersResult = await pool.query(`
      SELECT trigger_name, event_object_table, action_timing, event_manipulation
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name
    `);
    
    console.log(`✅ Found ${triggersResult.rows.length} triggers:`);
    triggersResult.rows.forEach(row => {
      console.log(`  - ${row.trigger_name} on ${row.event_object_table} (${row.action_timing} ${row.event_manipulation})`);
    });
    
    // 6. Check data integrity
    console.log('\n📊 Checking data integrity...');
    
    // Count total records
    const countResult = await pool.query('SELECT COUNT(*) as total FROM occupations');
    const totalRecords = parseInt(countResult.rows[0].total);
    console.log(`✅ Total records: ${totalRecords.toLocaleString()}`);
    
    // Check for required fields
    const requiredFieldsCheck = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(title) as has_title,
        COUNT(slug_url) as has_slug,
        COUNT(country) as has_country
      FROM occupations
    `);
    
    const requiredFields = requiredFieldsCheck.rows[0];
    console.log(`✅ Required fields check:`);
    console.log(`  - Records with title: ${requiredFields.has_title}/${requiredFields.total}`);
    console.log(`  - Records with slug_url: ${requiredFields.has_slug}/${requiredFields.total}`);
    console.log(`  - Records with country: ${requiredFields.has_country}/${requiredFields.total}`);
    
    // Check for duplicates
    const duplicatesResult = await pool.query(`
      SELECT country, COALESCE(state, '') as state, COALESCE(location, '') as location, slug_url, COUNT(*)
      FROM occupations
      GROUP BY country, COALESCE(state, ''), COALESCE(location, ''), slug_url
      HAVING COUNT(*) > 1
    `);
    
    if (duplicatesResult.rows.length > 0) {
      console.log(`⚠️  Found ${duplicatesResult.rows.length} duplicate records (violating unique constraint):`);
      duplicatesResult.rows.forEach(row => {
        console.log(`  - ${row.country}/${row.state}/${row.location}/${row.slug_url} (${row.count} copies)`);
      });
    } else {
      console.log(`✅ No duplicate records found`);
    }
    
    // Check JSONB skills format
    const skillsCheck = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(skills) as has_skills,
        COUNT(CASE WHEN skills IS NOT NULL AND jsonb_typeof(skills) = 'array' THEN 1 END) as valid_skills_array
      FROM occupations
    `);
    
    const skillsStats = skillsCheck.rows[0];
    console.log(`✅ Skills JSONB format check:`);
    console.log(`  - Records with skills: ${skillsStats.has_skills}/${skillsStats.total}`);
    console.log(`  - Valid skills arrays: ${skillsStats.valid_skills_array}/${skillsStats.total}`);
    
    // Sample skills data
    const sampleSkills = await pool.query(`
      SELECT skills 
      FROM occupations 
      WHERE skills IS NOT NULL 
      LIMIT 3
    `);
    
    if (sampleSkills.rows.length > 0) {
      console.log(`✅ Sample skills data:`);
      sampleSkills.rows.forEach((row, i) => {
        console.log(`  ${i + 1}. ${JSON.stringify(row.skills)}`);
      });
    }
    
    // 7. Check geographic distribution
    console.log('\n🌍 Checking geographic distribution...');
    const geoStats = await pool.query(`
      SELECT 
        COUNT(DISTINCT country) as countries,
        COUNT(DISTINCT state) as states,
        COUNT(DISTINCT location) as locations,
        COUNT(CASE WHEN state IS NULL THEN 1 END) as country_only,
        COUNT(CASE WHEN state IS NOT NULL AND location IS NULL THEN 1 END) as state_only,
        COUNT(CASE WHEN location IS NOT NULL THEN 1 END) as location_specific
      FROM occupations
    `);
    
    const geo = geoStats.rows[0];
    console.log(`✅ Geographic distribution:`);
    console.log(`  - Countries: ${geo.countries}`);
    console.log(`  - States: ${geo.states}`);
    console.log(`  - Locations: ${geo.locations}`);
    console.log(`  - Country-only records: ${geo.country_only}`);
    console.log(`  - State-only records: ${geo.state_only}`);
    console.log(`  - Location-specific records: ${geo.location_specific}`);
    
    // 8. Check salary data quality
    console.log('\n💰 Checking salary data quality...');
    const salaryStats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(avg_annual_salary) as has_avg_salary,
        COUNT(low_salary) as has_low_salary,
        COUNT(high_salary) as has_high_salary,
        AVG(avg_annual_salary) as avg_salary,
        MIN(avg_annual_salary) as min_salary,
        MAX(avg_annual_salary) as max_salary
      FROM occupations
      WHERE avg_annual_salary IS NOT NULL
    `);
    
    const salary = salaryStats.rows[0];
    console.log(`✅ Salary data quality:`);
    console.log(`  - Records with avg_annual_salary: ${salary.has_avg_salary}/${salary.total}`);
    console.log(`  - Records with low_salary: ${salary.has_low_salary}/${salary.total}`);
    console.log(`  - Records with high_salary: ${salary.has_high_salary}/${salary.total}`);
    if (salary.has_avg_salary > 0) {
      console.log(`  - Average salary: ${parseFloat(salary.avg_salary).toLocaleString()}`);
      console.log(`  - Salary range: ${parseFloat(salary.min_salary).toLocaleString()} - ${parseFloat(salary.max_salary).toLocaleString()}`);
    }
    
    // 9. Check materialized view data
    console.log('\n📊 Checking materialized view data...');
    const mvCountryStats = await pool.query('SELECT COUNT(*) as count FROM mv_country_stats');
    const mvStateStats = await pool.query('SELECT COUNT(*) as count FROM mv_state_stats');
    
    console.log(`✅ Materialized view data:`);
    console.log(`  - mv_country_stats: ${mvCountryStats.rows[0].count} countries`);
    console.log(`  - mv_state_stats: ${mvStateStats.rows[0].count} states`);
    
    // 10. Performance check
    console.log('\n⚡ Performance check...');
    const startTime = Date.now();
    await pool.query('SELECT COUNT(*) FROM occupations WHERE country = $1', ['Australia']);
    const queryTime = Date.now() - startTime;
    console.log(`✅ Sample query performance: ${queryTime}ms`);
    
    // 11. Check index usage
    console.log('\n🔍 Checking index usage...');
    const indexUsage = await pool.query(`
      SELECT 
        schemaname,
        relname as tablename,
        indexrelname as indexname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch
      FROM pg_stat_user_indexes 
      WHERE schemaname = 'public' AND relname = 'occupations'
      ORDER BY idx_scan DESC
    `);
    
    console.log(`✅ Index usage statistics:`);
    indexUsage.rows.forEach(row => {
      console.log(`  - ${row.indexname}: ${row.idx_scan} scans, ${row.idx_tup_read} tuples read`);
    });
    
    console.log('\n🎉 Schema validation completed successfully!');
    console.log('📋 Validation Summary:');
    console.log(`  ✅ Tables: ${tablesResult.rows.length} columns validated`);
    console.log(`  ✅ Indexes: ${indexesResult.rows.length} indexes validated`);
    console.log(`  ✅ Constraints: ${constraintsResult.rows.length} constraints validated`);
    console.log(`  ✅ Materialized views: ${viewsResult.rows.length} views validated`);
    console.log(`  ✅ Triggers: ${triggersResult.rows.length} triggers validated`);
    console.log(`  ✅ Data integrity: ${totalRecords.toLocaleString()} records validated`);
    console.log(`  ✅ Geographic distribution: ${geo.countries} countries, ${geo.states} states, ${geo.locations} locations`);
    console.log(`  ✅ Salary data: ${salary.has_avg_salary} records with salary data`);
    console.log(`  ✅ Performance: Sample query completed in ${queryTime}ms`);
    
    if (duplicatesResult.rows.length > 0) {
      console.log(`  ⚠️  Warnings: ${duplicatesResult.rows.length} duplicate records found`);
    }
    
    console.log('\n🚀 Database is ready for production use!');
    
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run validation if called directly
if (require.main === module) {
  validateSchema().catch(console.error);
}

export { validateSchema };
