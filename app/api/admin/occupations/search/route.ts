// /app/api/occupations/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchOccupationsServer } from "@/lib/db/queries";
import type { OccupationSearchResult } from "@/lib/db/queries";
import { deslugify } from "@/lib/format/slug";

// Next.js 16: Route segment configuration for search API
export const routeSegmentConfig = { revalidate: 3600 }; // 1 hour for search results

export async function GET(req: NextRequest) {
  const { searchParams } = req.url ? new URL(req.url) : { searchParams: new URLSearchParams() };
  const countrySlug = searchParams.get("country") || "";
  const q = searchParams.get("q") || "";

  try {
    if (!countrySlug || !q) {
      return NextResponse.json({ occupations: [] });
    }

    // Convert slug to database country name (e.g., "australia" -> "Australia", "united-states" -> "United States")
    const dbCountryName = deslugify(countrySlug);

    let occupations = await searchOccupationsServer(dbCountryName, q, 50) as OccupationSearchResult[];

    // Transform the data to match frontend interface
    const transformedOccupations = occupations.map(occ => ({
      country: dbCountryName,
      title: occ.title,
      slug: occ.slug,
      state: occ.state,
      location: occ.location,
      averageSalary: occ.avg_salary,
      currencyCode: occ.currency_code
    }));

    return NextResponse.json({ occupations: transformedOccupations });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
