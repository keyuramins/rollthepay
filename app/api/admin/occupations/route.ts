import { NextRequest, NextResponse } from 'next/server';
import { 
  getOccupationById, 
  insertOccupation, 
  updateOccupation, 
  updateOccupationSalary, 
  deleteOccupation,
  getOccupationStats,
  searchOccupations
} from '@/lib/db/queries';
import type { OccupationRecord } from '@/lib/data/types';
import type { SalaryUpdateData } from '@/lib/db/types';

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

// GET /api/admin/occupations - List occupations with optional filters
export async function GET(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const state = searchParams.get('state');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let result;

    if (search) {
      // Full-text search
      result = await searchOccupations(search, country || undefined, limit);
    } else {
      // Filtered list (implement basic filtering)
      // For now, return stats - you can extend this with more complex filtering
      result = await getOccupationStats();
    }

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        limit,
        offset,
        total: Array.isArray(result) ? result.length : 1
      }
    });

  } catch (error) {
    console.error('Error in GET /api/admin/occupations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/occupations - Create new occupation
export async function POST(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data: Partial<OccupationRecord> = await request.json();

    // Validate required fields
    if (!data.title || !data.slug_url || !data.country) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug_url, country' },
        { status: 400 }
      );
    }

    const newOccupation = await insertOccupation(data);

    return NextResponse.json({
      success: true,
      data: newOccupation,
      message: 'Occupation created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/occupations:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Occupation already exists with this path (country/state/location/slug_url)' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/occupations - Update occupation (full update)
export async function PUT(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const updatedOccupation = await updateOccupation(id, data);

    if (!updatedOccupation) {
      return NextResponse.json(
        { error: 'Occupation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOccupation,
      message: 'Occupation updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/occupations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/occupations - Delete occupation
export async function DELETE(request: NextRequest) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const deleted = await deleteOccupation(parseInt(id));

    if (!deleted) {
      return NextResponse.json(
        { error: 'Occupation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Occupation deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/occupations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
