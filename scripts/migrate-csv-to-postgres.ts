#!/usr/bin/env tsx
import 'dotenv/config';
import { parse } from 'csv-parse/sync';
import { Pool } from 'pg';
import { getAllCsvFiles, getObject } from '../lib/filebrowser/client';
import { transformOccupationRecordToDb } from '../lib/db/types';
import type { RawCsvRow } from '../lib/data/types';

// Database connection for migration (uses POSTGRES_URL directly, not PgBouncer)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 10, // 10 connections for migration
  query_timeout: 300000, // 5 minute timeout for large operations
});

// Helper function to convert number to word (for skills column mapping)
function numToWord(num: number): string {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return words[num] || '';
}

// Helper function to check if value is invalid or empty
function isInvalidToken(value: unknown): boolean {
  if (value == null) return true;
  if (value === undefined) return true;
  if (value === '') return true;
  
  const v = String(value).trim();
  return v.length === 0 || v.toUpperCase() === "#REF!" || v.toUpperCase() === "NULL" || v === "-";
}

// Helper function to coerce number with robust empty cell handling
function coerceNumber(value: unknown): number | null {
  if (isInvalidToken(value)) return null;
  
  // Handle various empty cell representations
  if (value === '' || value === ' ' || value === '\t' || value === '\n') return null;
  
  const str = String(value).trim();
  if (str === '' || str === '-' || str === 'N/A' || str === 'n/a') return null;
  
  // Remove commas, currency symbols, and other non-numeric characters
  // Keep digits, decimal point, and negative sign
  const normalized = str.replace(/[^0-9+\-.]/g, "");
  
  if (normalized.length === 0) return null;
  
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

// Helper function to safe string with comprehensive empty cell handling
function safeString(value: unknown): string | null {
  if (isInvalidToken(value)) return null;
  
  // Handle various empty representations
  if (value === '' || value === ' ' || value === '\t' || value === '\n') return null;
  
  const str = String(value).trim();
  if (str === '' || str === '-' || str === 'N/A' || str === 'n/a') return null;
  
  return str;
}

// Validate row has required fields (not empty/null)
function validateRequiredFields(row: RawCsvRow): { isValid: boolean; missingFields: string[] } {
  const required = ['title', 'slug_url', 'country'];
  const missing = [];
  
  for (const field of required) {
    const value = row[field as keyof RawCsvRow];
    if (isInvalidToken(value)) {
      missing.push(field);
    }
  }
  
  // If title is missing, try h1Title as fallback
  if (missing.includes('title') && !isInvalidToken(row.h1Title)) {
    missing.splice(missing.indexOf('title'), 1);
  }
  
  return { isValid: missing.length === 0, missingFields: missing };
}

// Transform CSV row to database format
function transformCsvRowToDb(row: RawCsvRow): any {
  // Validate required fields first
  const validation = validateRequiredFields(row);
  if (!validation.isValid) {
    return null; // Skip rows missing required fields
  }
  
  const title = safeString(row.title) ?? safeString(row.h1Title);
  const slug = safeString(row.slug_url);
  const country = safeString(row.country);

  // Transform skills columns to JSONB array
  const skills: Array<{ name: string; percentage: number }> = [];
  for (let i = 1; i <= 10; i++) {
    const name = safeString(row[`skillsName${numToWord(i)}` as keyof RawCsvRow]);
    const percentage = coerceNumber(row[`skillsNamePerc${numToWord(i)}` as keyof RawCsvRow]);
    
    if (name && percentage !== null) {
      skills.push({ name, percentage });
    }
  }

  return {
    slug_url: slug,
    title,
    h1_title: safeString(row.h1Title),
    occupation: safeString(row.occupation),
    country,
    state: safeString(row.state),
    location: safeString(row.location),
    currency_code: safeString(row.currency),

    // Salary fields
    avg_annual_salary: coerceNumber(row.avgAnnualSalary),
    low_salary: coerceNumber(row.lowSalary),
    high_salary: coerceNumber(row.highSalary),
    avg_hourly_salary: coerceNumber(row.avgHourlySalary),
    hourly_low_value: coerceNumber(row.hourlyLowValue),
    hourly_high_value: coerceNumber(row.hourlyHighValue),
    weekly_salary: coerceNumber(row.WeeklySalary),
    fortnightly_salary: coerceNumber(row.fortnightlySalary),
    monthly_salary: coerceNumber(row.monthlySalary),
    total_pay_min: coerceNumber(row.totalPayMin),
    total_pay_max: coerceNumber(row.totalPayMax),
    total_hourly_low_value: coerceNumber(row.totalHourlyLowValue),
    total_hourly_high_value: coerceNumber(row.totalHourlyHighValue),

    // Additional compensation
    bonus_range_min: coerceNumber(row.bonusRangeMin),
    bonus_range_max: coerceNumber(row.bonusRangeMax),
    profit_sharing_min: coerceNumber(row.profitSharingMin),
    profit_sharing_max: coerceNumber(row.profitSharingMax),
    commission_min: coerceNumber(row.commissionMin),
    commission_max: coerceNumber(row.commissionMax),

    // Gender distribution
    gender_male: coerceNumber(row.genderMale),
    gender_female: coerceNumber(row.genderFemale),

    // Experience level salaries
    entry_level: coerceNumber(row.entryLevel),
    early_career: coerceNumber(row.earlyCareer),
    mid_career: coerceNumber(row.midCareer),
    experienced: coerceNumber(row.experienced),
    late_career: coerceNumber(row.lateCareer),

    // Years of experience salaries
    one_yr: coerceNumber(row.oneYr),
    one_four_yrs: coerceNumber(row.oneFourYrs),
    five_nine_yrs: coerceNumber(row.fiveNineYrs),
    ten_nineteen_yrs: coerceNumber(row.tenNineteenYrs),
    twenty_yrs_plus: coerceNumber(row.twentyYrsPlus),

    // Salary percentiles
    percentile_10: coerceNumber(row["10P"]),
    percentile_25: coerceNumber(row["25P"]),
    percentile_50: coerceNumber(row["50P"]),
    percentile_75: coerceNumber(row["75P"]),
    percentile_90: coerceNumber(row["90P"]),

    // Skills as JSONB
    skills: skills.length > 0 ? JSON.stringify(skills) : null,

    // Metadata
    data_source: 'admin_import',
    contribution_count: 0,
  };
}

// Deduplicate records by unique constraint before batch insert
function deduplicateRecords(records: any[]): any[] {
  const seen = new Set<string>();
  const deduplicated = [];
  
  for (const record of records) {
    // Create unique key from constraint fields
    const key = `${record.country}|${record.state || ''}|${record.location || ''}|${record.slug_url}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(record);
    }
  }
  
  return deduplicated;
}

// Batch insert with UPSERT - optimized for large datasets
async function batchInsert(records: any[]): Promise<number> {
  if (records.length === 0) return 0;

  let insertedCount = 0;
  const BATCH_SIZE = 500;
  
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    
    // Deduplicate batch to prevent "affect row a second time" errors
    const deduplicatedBatch = deduplicateRecords(batch);
    const duplicatesRemoved = batch.length - deduplicatedBatch.length;
    
    if (duplicatesRemoved > 0) {
      console.log(`  🔄 Removed ${duplicatesRemoved} duplicate records from batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Build bulk INSERT statement using deduplicated batch
      const fields = Object.keys(deduplicatedBatch[0]);
      const fieldNames = fields.join(', ');
      
      // Create VALUES clause for all records in deduplicated batch
      const valuesClauses = [];
      const allValues = [];
      
      for (let j = 0; j < deduplicatedBatch.length; j++) {
        const record = deduplicatedBatch[j];
        const placeholders = fields.map((_, k) => `$${j * fields.length + k + 1}`).join(', ');
        valuesClauses.push(`(${placeholders})`);
        
        // Ensure we get the values in the same order as fields
        const recordValues = fields.map(field => record[field]);
        allValues.push(...recordValues);
      }
      
      const valuesClause = valuesClauses.join(', ');
      
      // Debug: Log batch info
      console.log(`  🔧 Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${deduplicatedBatch.length} records (${batch.length} original), ${fields.length} fields each`);
      console.log(`  🔧 Total placeholders: ${allValues.length}, Expected: ${deduplicatedBatch.length * fields.length}`);
      
      // Validate batch data before insert
      const nullCount = allValues.filter(v => v === null || v === undefined).length;
      if (nullCount > 0) {
        console.log(`  📊 Batch contains ${nullCount} null values (${Math.round(nullCount/allValues.length*100)}%)`);
      }
      
      // Execute bulk UPSERT
      await client.query(
        `INSERT INTO occupations (${fieldNames}) 
         VALUES ${valuesClause}
         ON CONFLICT (country, state, location, slug_url)
         DO UPDATE SET
           title = EXCLUDED.title,
           avg_annual_salary = EXCLUDED.avg_annual_salary,
           low_salary = EXCLUDED.low_salary,
           high_salary = EXCLUDED.high_salary,
           skills = EXCLUDED.skills,
           updated_at = NOW()`,
        allValues
      );
      
      await client.query('COMMIT');
      insertedCount += deduplicatedBatch.length;
      
      // Progress update
      const progress = Math.round(((i + batch.length) / records.length) * 100);
      console.log(`  📊 Progress: ${progress}% (${i + batch.length}/${records.length} records)`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Failed to insert batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
      
      // Fallback: try individual records in this deduplicated batch
      console.log(`  🔄 Falling back to individual record insertion for batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
      let fallbackCount = 0;
      
      for (const record of deduplicatedBatch) {
        try {
          await client.query('BEGIN');
          
          const fields = Object.keys(record);
          const values = Object.values(record);
          const placeholders = fields.map((_, k) => `$${k + 1}`).join(', ');
          const fieldNames = fields.join(', ');
          
          await client.query(
            `INSERT INTO occupations (${fieldNames}) 
             VALUES (${placeholders})
             ON CONFLICT (country, state, location, slug_url)
             DO UPDATE SET
               title = EXCLUDED.title,
               avg_annual_salary = EXCLUDED.avg_annual_salary,
               low_salary = EXCLUDED.low_salary,
               high_salary = EXCLUDED.high_salary,
               skills = EXCLUDED.skills,
               updated_at = NOW()`,
            values
          );
          
          await client.query('COMMIT');
          fallbackCount++;
          
        } catch (fallbackError) {
          await client.query('ROLLBACK');
          console.error(`❌ Failed to insert individual record: ${record.title} (${record.country})`, fallbackError);
        }
      }
      
      insertedCount += fallbackCount;
      console.log(`  ✅ Fallback completed: ${fallbackCount}/${deduplicatedBatch.length} records inserted`);
      
    } finally {
      client.release();
    }
  }
  
  return insertedCount;
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting CSV → PostgreSQL migration...');
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW() as current_time');
    console.log(`✅ Connected to PostgreSQL at ${connectionTest.rows[0].current_time}`);
    
    // Get all CSV files from Filebrowser
    console.log('📁 Discovering CSV files from Filebrowser...');
    const files = await getAllCsvFiles();
    console.log(`📋 Found ${files.length} CSV files: ${files.join(', ')}`);
    
    if (files.length === 0) {
      throw new Error('No CSV files found in Filebrowser. Please ensure data has been uploaded.');
    }
    
    let totalRecords = 0;
    let totalProcessed = 0;
    let totalSkipped = 0;
    const startTime = Date.now();
    
    // Process each CSV file
    for (const file of files) {
      console.log(`\n📊 Processing ${file}...`);
      
      try {
        // Get CSV content from Filebrowser
        const csvContent = await getObject(file);
        const rows = parse(csvContent, { columns: true, skip_empty_lines: true }) as RawCsvRow[];
        
        console.log(`  📄 Parsed ${rows.length} rows from CSV`);
        
        // Transform rows to database format
        const validRecords = [];
        let skippedInFile = 0;
        let emptyCellIssues = 0;
        
        for (const row of rows) {
          const transformed = transformCsvRowToDb(row);
          if (transformed) {
            validRecords.push(transformed);
          } else {
            skippedInFile++;
            // Log first few skipped rows for debugging
            if (skippedInFile <= 3) {
              console.log(`    ⚠️  Skipped row ${skippedInFile}: title="${row.title}", slug="${row.slug_url}", country="${row.country}"`);
            }
          }
        }
        
        if (skippedInFile > 0) {
          console.log(`    📊 Skipped ${skippedInFile} invalid rows (missing title/slug/country)`);
        }
        
        console.log(`  ✅ ${validRecords.length} valid records, ${skippedInFile} skipped`);
        
        // Batch insert records
        if (validRecords.length > 0) {
          const inserted = await batchInsert(validRecords);
          console.log(`  💾 Inserted ${inserted} records into database`);
          totalRecords += inserted;
        }
        
        totalProcessed += rows.length;
        totalSkipped += skippedInFile;
        
      } catch (error) {
        console.error(`❌ Failed to process file ${file}:`, error);
        // Continue with other files
      }
    }
    
    // Refresh materialized views
    console.log('\n🔄 Refreshing materialized views...');
    await pool.query('REFRESH MATERIALIZED VIEW mv_country_stats');
    await pool.query('REFRESH MATERIALIZED VIEW mv_state_stats');
    console.log('✅ Materialized views refreshed');
    
    // Generate migration report
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('📋 Migration Report:');
    console.log(`  📁 Files processed: ${files.length}`);
    console.log(`  📄 Total rows processed: ${totalProcessed}`);
    console.log(`  ✅ Records inserted: ${totalRecords}`);
    console.log(`  ⏭️  Records skipped: ${totalSkipped}`);
    console.log(`  ⏱️  Duration: ${duration} seconds`);
    console.log(`  📊 Average: ${Math.round(totalRecords / duration)} records/second`);
    
    // Verify final counts
    console.log('\n🔍 Verifying migration...');
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_occupations,
        COUNT(DISTINCT country) as total_countries,
        COUNT(DISTINCT state) as total_states,
        COUNT(DISTINCT location) as total_locations
      FROM occupations
    `);
    
    const stats = statsResult.rows[0];
    console.log('📊 Final database statistics:');
    console.log(`  🏢 Total occupations: ${stats.total_occupations}`);
    console.log(`  🌍 Total countries: ${stats.total_countries}`);
    console.log(`  🏛️  Total states: ${stats.total_states}`);
    console.log(`  🏙️  Total locations: ${stats.total_locations}`);
    
    console.log('\n✅ Migration verification completed!');
    console.log('🚀 Database is ready for use!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate().catch(console.error);
}

export { migrate };
