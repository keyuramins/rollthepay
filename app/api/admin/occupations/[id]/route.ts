// app/api/admin/occupations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOccupationById, updateOccupationSalary } from '@/lib/db/queries';
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

// GET /api/admin/occupations/[id] - Get occupation by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const occupationId = parseInt(id);

    if (isNaN(occupationId)) {
      return NextResponse.json(
        { error: 'Invalid occupation ID' },
        { status: 400 }
      );
    }

    const occupation = await getOccupationById(occupationId);

    if (!occupation) {
      return NextResponse.json(
        { error: 'Occupation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: occupation
    });

  } catch (error) {
    console.error('Error in GET /api/admin/occupations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/occupations/[id] - Update salary fields (for user contributions)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const occupationId = parseInt(id);

    if (isNaN(occupationId)) {
      return NextResponse.json(
        { error: 'Invalid occupation ID' },
        { status: 400 }
      );
    }

    const salaryData: SalaryUpdateData = await request.json();

    // Validate that at least one salary field is provided
    const validSalaryFields = [
      'avg_annual_salary', 'avg_hourly_salary',
      'hourly_low_value', 'hourly_high_value', 'fortnightly_salary',
      'monthly_salary', 'total_pay_min', 'total_pay_max',
      'bonus_range_min', 'bonus_range_max',
      'profit_sharing_min', 'profit_sharing_max', 'commission_min', 'commission_max',
      'entry_level', 'early_career', 'mid_career', 'experienced', 'late_career',
      'one_yr', 'one_four_yrs', 'five_nine_yrs', 'ten_nineteen_yrs', 'twenty_yrs_plus',
      'percentile_10', 'percentile_25', 'percentile_50', 'percentile_75', 'percentile_90'
    ];

    const providedFields = Object.keys(salaryData);
    const validFields = providedFields.filter(field => validSalaryFields.includes(field));

    if (validFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid salary fields provided', validFields: validSalaryFields },
        { status: 400 }
      );
    }

    // Filter to only valid fields
    const filteredSalaryData: SalaryUpdateData = {};
    validFields.forEach(field => {
      filteredSalaryData[field as keyof SalaryUpdateData] = salaryData[field as keyof SalaryUpdateData];
    });

    const updatedOccupation = await updateOccupationSalary(occupationId, filteredSalaryData);

    if (!updatedOccupation) {
      return NextResponse.json(
        { error: 'Occupation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOccupation,
      message: 'Salary data updated successfully',
      updatedFields: validFields
    });

  } catch (error) {
    console.error('Error in PATCH /api/admin/occupations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/occupations/[id] - Delete occupation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authenticate(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const occupationId = parseInt(id);

    if (isNaN(occupationId)) {
      return NextResponse.json(
        { error: 'Invalid occupation ID' },
        { status: 400 }
      );
    }

    // Check if occupation exists first
    const existingOccupation = await getOccupationById(occupationId);
    if (!existingOccupation) {
      return NextResponse.json(
        { error: 'Occupation not found' },
        { status: 404 }
      );
    }

    // Import deleteOccupation function
    const { deleteOccupation } = await import('@/lib/db/queries') as { deleteOccupation: (id: number) => Promise<boolean> };
    const deleted = await deleteOccupation(occupationId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete occupation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Occupation deleted successfully',
      deletedOccupation: {
        id: occupationId,
        title: existingOccupation.title,
        country: existingOccupation.country
      }
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/occupations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
