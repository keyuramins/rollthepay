#!/usr/bin/env tsx
import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

// Database connection for setup (uses POSTGRES_URL directly, not PgBouncer)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 1, // Single connection for setup
  query_timeout: 60000, // 60 second timeout for setup operations
});

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(`✅ Connected to PostgreSQL at ${connectionTest.rows[0].current_time}`);
    console.log(`📋 PostgreSQL version: ${connectionTest.rows[0].pg_version}`);
    
    // Read schema file
    console.log('📖 Reading schema file...');
    const schemaPath = join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    console.log('🏗️ Creating database schema...');
    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully');
    
    // Verify tables exist
    console.log('🔍 Verifying tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verify indexes exist
    console.log('🔍 Verifying indexes...');
    const indexesResult = await pool.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);
    
    console.log('📋 Created indexes:');
    indexesResult.rows.forEach(row => {
      console.log(`  - ${row.indexname} on ${row.tablename}`);
    });
    
    // Verify materialized views exist
    console.log('🔍 Verifying materialized views...');
    const viewsResult = await pool.query(`
      SELECT matviewname 
      FROM pg_matviews 
      WHERE schemaname = 'public' 
      ORDER BY matviewname
    `);
    
    console.log('📋 Created materialized views:');
    viewsResult.rows.forEach(row => {
      console.log(`  - ${row.matviewname}`);
    });
    
    // Verify triggers exist
    console.log('🔍 Verifying triggers...');
    const triggersResult = await pool.query(`
      SELECT trigger_name, event_object_table 
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public' 
      ORDER BY event_object_table, trigger_name
    `);
    
    console.log('📋 Created triggers:');
    triggersResult.rows.forEach(row => {
      console.log(`  - ${row.trigger_name} on ${row.event_object_table}`);
    });
    
    // Test basic operations
    console.log('🧪 Testing basic operations...');
    
    // Test insert
    const testRecord = {
      slug_url: 'test-occupation',
      title: 'Test Occupation',
      country: 'Test Country',
      currency_code: 'USD',
      avg_annual_salary: 50000,
      data_source: 'admin_import'
    };
    
    const insertResult = await pool.query(`
      INSERT INTO occupations (slug_url, title, country, currency_code, avg_annual_salary, data_source)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [testRecord.slug_url, testRecord.title, testRecord.country, testRecord.currency_code, testRecord.avg_annual_salary, testRecord.data_source]);
    
    const testId = insertResult.rows[0].id;
    console.log(`✅ Test record inserted with ID: ${testId}`);
    
    // Test select
    const selectResult = await pool.query('SELECT * FROM occupations WHERE id = $1', [testId]);
    console.log(`✅ Test record retrieved: ${selectResult.rows[0].title}`);
    
    // Test update
    await pool.query('UPDATE occupations SET avg_annual_salary = $1 WHERE id = $2', [60000, testId]);
    const updateResult = await pool.query('SELECT avg_annual_salary FROM occupations WHERE id = $1', [testId]);
    console.log(`✅ Test record updated: salary = ${updateResult.rows[0].avg_annual_salary}`);
    
    // Test trigger (contribution_count should increment)
    await pool.query('UPDATE occupations SET avg_annual_salary = $1 WHERE id = $2', [70000, testId]);
    const triggerResult = await pool.query('SELECT contribution_count FROM occupations WHERE id = $1', [testId]);
    console.log(`✅ Trigger test: contribution_count = ${triggerResult.rows[0].contribution_count}`);
    
    // Clean up test record
    await pool.query('DELETE FROM occupations WHERE id = $1', [testId]);
    console.log('✅ Test record cleaned up');
    
    // Test materialized view refresh
    console.log('🔄 Testing materialized view refresh...');
    await pool.query('REFRESH MATERIALIZED VIEW mv_country_stats');
    await pool.query('REFRESH MATERIALIZED VIEW mv_state_stats');
    console.log('✅ Materialized views refreshed successfully');
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`  - Tables created: ${tablesResult.rows.length}`);
    console.log(`  - Indexes created: ${indexesResult.rows.length}`);
    console.log(`  - Materialized views created: ${viewsResult.rows.length}`);
    console.log(`  - Triggers created: ${triggersResult.rows.length}`);
    console.log('');
    console.log('🚀 Ready for data migration!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

export { setupDatabase };
