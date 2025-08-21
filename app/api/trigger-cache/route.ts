import { NextRequest, NextResponse } from 'next/server';
import { getDataset, clearCache } from '@/lib/data/parse';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    // Check if it's a valid trigger request
    const body = await request.json();
    const { trigger } = body;
    
    if (trigger !== 'cache-all-csv') {
      return NextResponse.json(
        { error: 'Invalid trigger. Use: {"trigger": "cache-all-csv"}' },
        { status: 400 }
      );
    }

    console.log('🚀 Triggering CSV cache refresh...');
    
    // Clear existing cache first
    clearCache();
    console.log('🧹 Existing cache cleared');
    
    // Fetch and cache all CSV data
    console.log('📥 Fetching all CSV files from Filebrowser...');
    const dataset = await getDataset();
    
    const totalRecords = dataset.all.length;
    const countries = Array.from(dataset.byCountry.keys());
    
    console.log(`✅ Cache refresh completed successfully!`);
    console.log(`📊 Total records cached: ${totalRecords}`);
    console.log(`🌍 Countries cached: ${countries.join(', ')}`);
    console.log(`⏰ Cache will be valid for 1 year`);
    
    return NextResponse.json({
      success: true,
      message: 'CSV cache refreshed successfully',
      data: {
        totalRecords,
        countries,
        cacheDuration: '1 year',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Cache refresh failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Cache refresh failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'CSV Cache Trigger API',
    usage: {
      method: 'POST',
      body: { trigger: 'cache-all-csv' },
      description: 'Triggers refresh of all CSV data from Filebrowser with 1-year caching'
    },
    example: 'curl -X POST /api/trigger-cache -H "Content-Type: application/json" -d \'{"trigger": "cache-all-csv"}\''
  });
}
