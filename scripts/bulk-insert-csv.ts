#!/usr/bin/env tsx
/**
 * Bulk CSV Import Script (uses existing bulkInsertOccupations)
 *
 * Usage: tsx scripts/bulk-insert-csv.ts /path/to/file.csv
 */

import 'dotenv/config';
import { readFile } from 'fs/promises';
import { Pool } from 'pg';
import { parse } from 'csv-parse/sync';
import type { RawCsvRow, OccupationRecord } from '@/lib/data/types';
import { bulkInsertOccupations } from '@/lib/db/queries';

// DB pool (only for refreshing materialized views)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PGBOUNCER_URL,
  max: 10,
});

// Helper: number → word (for skills columns)
function numToWord(num: number): string {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return words[num] || '';
}

// Helper: invalid token check
function isInvalidToken(value: unknown): boolean {
  if (value == null) return true;
  const v = String(value).trim();
  return v.length === 0 || v.toUpperCase() === '#REF!';
}

// Helper: coerce to number|null
function coerceNumber(value: unknown): number | null {
  if (isInvalidToken(value)) return null;
  const normalized = String(value).replace(/[^0-9+\-.]/g, '');
  if (normalized.length === 0) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

// Helper: safe string or null
function safeString(value: unknown): string | null {
    if (value == null) return null;
  
    const s = String(value).trim();
    if (s === '' || s.toUpperCase() === '#REF!') return null;
  
    return s;
  }
  

// Transform CSV row → DB-compatible object (same as API route)
function transformCsvRowToDb(row: RawCsvRow): any {
  const title = safeString(row.title);
  const slug = safeString(row.slug_url);
  const country = safeString(row.country);

  if (!title || !slug || !country) {
    return null; // skip invalid rows
  }

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
    occ_name: safeString(row.occ_name),
    company_name: safeString(row.company_name),
    country,
    state: safeString(row.state),
    location: safeString(row.location),

    avg_annual_salary: coerceNumber(row.avgAnnualSalary),
    avg_hourly_salary: coerceNumber(row.avgHourlySalary),
    hourly_low_value: coerceNumber(row.hourlyLowValue),
    hourly_high_value: coerceNumber(row.hourlyHighValue),
    fortnightly_salary: coerceNumber(row.fortnightlySalary),
    monthly_salary: coerceNumber(row.monthlySalary),
    total_pay_min: coerceNumber(row.totalPayMin),
    total_pay_max: coerceNumber(row.totalPayMax),

    bonus_range_min: coerceNumber(row.bonusRangeMin),
    bonus_range_max: coerceNumber(row.bonusRangeMax),
    profit_sharing_min: coerceNumber(row.profitSharingMin),
    profit_sharing_max: coerceNumber(row.profitSharingMax),
    commission_min: coerceNumber(row.commissionMin),
    commission_max: coerceNumber(row.commissionMax),

    gender_male: coerceNumber(row.genderMale),
    gender_female: coerceNumber(row.genderFemale),

    one_yr: coerceNumber(row.oneYr),
    one_four_yrs: coerceNumber(row.oneFourYrs),
    five_nine_yrs: coerceNumber(row.fiveNineYrs),
    ten_nineteen_yrs: coerceNumber(row.tenNineteenYrs),
    twenty_yrs_plus: coerceNumber(row.twentyYrsPlus),

    percentile_10: coerceNumber(row['10P']),
    percentile_25: coerceNumber(row['25P']),
    percentile_50: coerceNumber(row['50P']),
    percentile_75: coerceNumber(row['75P']),
    percentile_90: coerceNumber(row['90P']),

    skills: skills.length > 0 ? JSON.stringify(skills) : null,

    data_source: 'admin_import',
    contribution_count: 0,
  };
}

async function bulkInsertFromCSV(csvFilePath: string) {
  console.log(`📁 Reading CSV file: ${csvFilePath}...`);
  const csvContent = await readFile(csvFilePath, 'utf-8');

  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as RawCsvRow[];

  console.log(`📄 Parsed ${rows.length} rows from CSV`);

  const validRecords: any[] = [];
  let skippedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    try {
      const transformed = transformCsvRowToDb(rows[i]);
      if (transformed) {
        validRecords.push(transformed);
      } else {
        skippedCount++;
        if (skippedCount <= 10) {
          console.warn(`⚠️  Skipped row ${i + 1}: missing required fields (title, slug_url, or country)`);
        }
      }
    } catch (err) {
      skippedCount++;
      if (skippedCount <= 10) {
        console.warn(
          `⚠️  Error transforming row ${i + 1}: ${
            err instanceof Error ? err.message : 'Unknown error'
          }`,
        );
      }
    }
  }

  console.log(`✅ ${validRecords.length} valid records, ${skippedCount} skipped`);

  if (validRecords.length === 0) {
    console.log('❌ No valid records to insert. Aborting.');
    return {
      totalRows: rows.length,
      validRecords: 0,
      insertedCount: 0,
      skippedCount,
    };
  }

  const startDb = Date.now();
  console.log('💾 Inserting/updating records via bulkInsertOccupations...');
  const insertedCount = await bulkInsertOccupations(validRecords as Partial<OccupationRecord>[]);

  const durationDb = Date.now() - startDb;
  console.log(`✅ Inserted/updated ${insertedCount} records in ${durationDb}ms`);

  console.log('🔄 Refreshing materialized views...');
  await pool.query('REFRESH MATERIALIZED VIEW mv_country_stats');
  await pool.query('REFRESH MATERIALIZED VIEW mv_state_stats');
  console.log('✅ Materialized views refreshed');

  return {
    totalRows: rows.length,
    validRecords: validRecords.length,
    insertedCount,
    skippedCount,
  };
}

// Main
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('❌ Usage: tsx scripts/bulk-insert-csv.ts <path-to-csv-file>');
  console.error('   Example: tsx scripts/bulk-insert-csv.ts /Users/keyur/Downloads/kazakhstan.csv');
  process.exit(1);
}

const start = Date.now();

bulkInsertFromCSV(csvFilePath)
  .then((summary) => {
    const duration = Date.now() - start;
    console.log('\n📊 Summary:');
    console.log(`   Total rows in CSV: ${summary?.totalRows ?? 0}`);
    console.log(`   Valid records:      ${summary?.validRecords ?? 0}`);
    console.log(`   Inserted/updated:   ${summary?.insertedCount ?? 0}`);
    console.log(`   Skipped:            ${summary?.skippedCount ?? 0}`);
    console.log(`   Duration:           ${duration}ms`);
    console.log('\n✅ Bulk insert completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Bulk insert failed:', err);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });

  //psql $DATABASE_URL -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename='occupations';"
  //npx tsx scripts/bulk-insert-csv.ts /Users/keyur/Downloads/kazakhstan.csv