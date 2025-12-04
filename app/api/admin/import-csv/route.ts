// app/api/admin/import-csv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { bulkInsertOccupations } from '@/lib/db/queries';
import type { RawCsvRow } from '@/lib/data/types';
import { Pool } from 'pg';
import { transformCsvRowToDb } from '@/lib/csv/transform';

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
    const result = await bulkInsertOccupations(validRecords);
    const duration = Date.now() - startTime;

    console.log(`✅ Inserted ${result.inserted} records, skipped ${result.skipped} existing records in ${duration}ms`);

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
        insertedRecords: result.inserted,
        skippedExisting: result.skipped,
        skippedInvalid: skippedCount,
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
