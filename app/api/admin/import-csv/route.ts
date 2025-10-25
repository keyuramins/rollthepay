// app/api/admin/import-csv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { bulkInsertOccupations } from '@/lib/db/queries';
import type { RawCsvRow } from '@/lib/data/types';
import { Pool } from 'pg';

// Middleware for API key authentication
function authenticate(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.ADMIN_API_KEY;
  
  if (!expectedKey) {
    console.error('ADMIN_API_KEY environment variable is not set');
    return false;
  }
  
  return apiKey === expectedKey;
}

// Helper function to convert number to word (for skills column mapping)
function numToWord(num: number): string {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return words[num] || '';
}

// Helper function to check if value is invalid
function isInvalidToken(value: unknown): boolean {
  if (value == null) return true;
  const v = String(value).trim();
  return v.length === 0 || v.toUpperCase() === "#REF!";
}

// Helper function to coerce number
function coerceNumber(value: unknown): number | null {
  if (isInvalidToken(value)) return null;
  // Remove commas and currency symbols, keep digits, sign and decimal point
  const normalized = String(value).replace(/[^0-9+\-.]/g, "");
  if (normalized.length === 0) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

// Helper function to safe string
function safeString(value: unknown): string | null {
  if (isInvalidToken(value)) return null;
  return String(value).trim();
}

// Transform CSV row to database format
function transformCsvRowToDb(row: RawCsvRow): any {
  const title = safeString(row.title) ?? safeString(row.h1Title);
  const slug = safeString(row.slug_url);
  const country = safeString(row.country);
  
  if (!title || !slug || !country) {
    return null; // Skip invalid rows
  }

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

// POST /api/admin/import-csv - Import CSV data
export async function POST(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV file' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    console.log(`📁 Processing CSV file: ${file.name} (${file.size} bytes)`);

    // Read and parse CSV
    const csvContent = await file.text();
    const rows = parse(csvContent, { columns: true, skip_empty_lines: true }) as RawCsvRow[];
    
    console.log(`📄 Parsed ${rows.length} rows from CSV`);

    // Transform rows to database format
    const validRecords = [];
    let skippedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const transformed = transformCsvRowToDb(rows[i]);
        if (transformed) {
          validRecords.push(transformed);
        } else {
          skippedCount++;
          errors.push(`Row ${i + 1}: Missing required fields (title, slug_url, or country)`);
        }
      } catch (error) {
        skippedCount++;
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`✅ ${validRecords.length} valid records, ${skippedCount} skipped`);

    if (validRecords.length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid records found in CSV',
          details: errors.slice(0, 10) // Show first 10 errors
        },
        { status: 400 }
      );
    }

    // Bulk insert records
    console.log('💾 Starting bulk insert...');
    const startTime = Date.now();
    const insertedCount = await bulkInsertOccupations(validRecords);
    const duration = Date.now() - startTime;

    console.log(`✅ Inserted ${insertedCount} records in ${duration}ms`);

    // Refresh materialized views
    console.log('🔄 Refreshing materialized views...');
    const { pool } = await import('@/lib/db/client') as { pool: Pool };
    await pool.query('REFRESH MATERIALIZED VIEW mv_country_stats');
    await pool.query('REFRESH MATERIALIZED VIEW mv_state_stats');

    return NextResponse.json({
      success: true,
      message: 'CSV import completed successfully',
      summary: {
        fileName: file.name,
        fileSize: file.size,
        totalRows: rows.length,
        validRecords: validRecords.length,
        insertedRecords: insertedCount,
        skippedRecords: skippedCount,
        duration: `${duration}ms`,
        errors: errors.slice(0, 20) // Show first 20 errors
      }
    });

  } catch (error) {
    console.error('Error in POST /api/admin/import-csv:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Some records already exist in the database (duplicate key constraint)' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'CSV import failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/import-csv - Get import status/help
export async function GET(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'CSV Import API',
    usage: {
      method: 'POST',
      endpoint: '/api/admin/import-csv',
      headers: {
        'x-api-key': 'Your admin API key',
        'Content-Type': 'multipart/form-data'
      },
      body: {
        file: 'CSV file (max 50MB)'
      }
    },
    requirements: {
      csvFormat: 'Must have columns: title, slug_url, country',
      fileSize: 'Maximum 50MB',
      fileType: 'CSV files only'
    },
    example: {
      curl: `curl -X POST \\
  -H "x-api-key: your-api-key" \\
  -F "file=@data.csv" \\
  http://localhost:3000/api/admin/import-csv`
    }
  });
}
