import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { StateHeroSection } from "@/components/state/state-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { LocationsGrid } from "@/components/state/locations-grid";
import { 
  getOccupationsForStateCursor,
  getAllLocations,
  getCountryData,
  getStateData
} from "@/lib/db/queries";
import { rememberNextCursor, resolveCursorForPage } from "@/lib/db/cursor-registry";
import { deslugify, slugify } from "@/lib/format/slug";

export const routeSegmentConfig = { revalidate: 31536000 };
export const fetchCache = 'force-cache';

interface StatePagedPageProps {
  params: Promise<{ country: string; state: string; page: string }>;
  searchParams: Promise<{ q?: string; letter?: string }>;
}

export async function generateMetadata({ params, searchParams }: StatePagedPageProps): Promise<Metadata> {
  const { country, state, page } = await params;
  const { q, letter } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  
  const stateName = deslugify(state);
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  
  let title = `${stateName} Salary Data`;
  let description = `Explore salary information and job opportunities in ${stateName}, ${countryName}.`;
  
  if (q) {
    title = `Search Results for "${q}" in ${stateName}`;
    description = `Salary data and job opportunities matching "${q}" in ${stateName}, ${countryName}.`;
  } else if (letter) {
    title = `${stateName} Jobs Starting with "${letter.toUpperCase()}"`;
    description = `Browse ${stateName} occupations starting with the letter "${letter.toUpperCase()}" in ${countryName}.`;
  }
  
  // Page 1 canonical should be base route without /page/1
  const canonical = pageNum === 1 
    ? `/${country}/${state}` 
    : `/${country}/${state}/page/${pageNum}`;
  
  return {
    title,
    description,
    alternates: { canonical },
  };
}

export default async function StatePagedPage({ params, searchParams }: StatePagedPageProps) {
  const { country, state, page } = await params;
  const { q, letter } = await searchParams;
  
  const pageNum = Math.max(1, Number(page) || 1);
  const searchQuery = typeof q === 'string' ? q.trim().slice(0, 100) : undefined;
  const letterFilter = typeof letter === 'string' && letter.trim().length === 1 
    ? letter.trim().toLowerCase() 
    : undefined;
  
  const normalizedState = deslugify(state);
  
  // Verify state exists
  const stateData = await getStateData(country, normalizedState);
  if (!stateData) {
    notFound();
  }
  
  // Get country and state names
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  const stateName = stateData.name;
  
  // Fetch paginated occupations and total count
  const limit = 50;

  const cursorResolution = await resolveCursorForPage(
    {
      country,
      state: normalizedState,
      limit,
      searchQuery,
      letterFilter,
    },
    pageNum,
    (pageCursor) =>
      getOccupationsForStateCursor({
        country,
        state: normalizedState,
        q: searchQuery,
        letter: letterFilter,
        limit,
        cursor: pageCursor,
      })
  );

  if (pageNum > 1 && !cursorResolution.available) {
    notFound();
  }

  const { items, nextCursor } = await getOccupationsForStateCursor({
    country,
    state: normalizedState,
    q: searchQuery,
    letter: letterFilter,
    limit,
    cursor: cursorResolution.cursor,
  });

  rememberNextCursor(
    { country, state: normalizedState, limit, searchQuery, letterFilter },
    pageNum,
    nextCursor
  );

  const hasNextPage = Boolean(nextCursor);
  const basePath = `/${country}/${slugify(stateName)}`;
  
  // Get locations for this state
  const locations = await getAllLocations(country, stateName);
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    { name: stateName, href: `/${country}/${slugify(stateName)}` },
    pageNum > 1 ? { name: `Page ${pageNum}`, href: "#", current: true } : null,
  ].filter(Boolean) as Array<{ name: string; href: string; current?: boolean }>;
  
  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      
      <StateHeroSection 
        stateName={stateName}
        countryName={countryName}
      />

      <OccupationList 
        items={items}
        title="Explore Salaries by Occupation"
        description={`Browse salary information organized by respective categories and specializations in ${stateName}.`}
        currentState={slugify(stateName)}
        countrySlug={country}
        currentPage={pageNum}
        totalPages={hasNextPage ? pageNum + 1 : pageNum}
        totalItems={items.length}
        searchQuery={searchQuery}
        letterFilter={letterFilter}
        basePath={basePath}
        hasNextPage={hasNextPage}
      />

      {locations.length > 0 && (
        <LocationsGrid
          country={country}
          state={stateName}
          title="Explore Salaries by Location"
          description={`Find salary data specific to different locations within ${stateName}.`}
        />
      )}

      <LocationCTASection 
        country={country}
        state={state}
        countryName={countryName}
        stateName={stateName}
      />
    </main>
  );
}
