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
import { transformCsvRowToDb } from '@/lib/csv/transform';

// DB pool (only for refreshing materialized views)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PGBOUNCER_URL,
  max: 10,
});

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
  const result = await bulkInsertOccupations(validRecords as Partial<OccupationRecord>[]);

  const durationDb = Date.now() - startDb;
  console.log(`✅ Inserted ${result.inserted} records, skipped ${result.skipped} existing records in ${durationDb}ms`);

  console.log('🔄 Refreshing materialized views...');
  await pool.query('REFRESH MATERIALIZED VIEW mv_country_stats');
  await pool.query('REFRESH MATERIALIZED VIEW mv_state_stats');
  console.log('✅ Materialized views refreshed');

  return {
    totalRows: rows.length,
    validRecords: validRecords.length,
    insertedCount: result.inserted,
    skippedCount: skippedCount + result.skipped, // validation skipped + database skipped
    databaseSkipped: result.skipped, // records that already existed
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
    console.log(`   Total rows in CSV:     ${summary?.totalRows ?? 0}`);
    console.log(`   Valid records:        ${summary?.validRecords ?? 0}`);
    console.log(`   Inserted (new):       ${summary?.insertedCount ?? 0}`);
    console.log(`   Skipped (existing):   ${summary?.databaseSkipped ?? 0}`);
    console.log(`   Skipped (invalid):    ${(summary?.skippedCount ?? 0) - (summary?.databaseSkipped ?? 0)}`);
    console.log(`   Duration:              ${duration}ms`);
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
  //npx tsx scripts/bulk-insert-csv.ts /Users/keyur/Downloads/saint_lucia_new.csv
  //git add . && git commit -m "Added Saint Lucia" && git pull --rebase origin main && git push origin main