import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { LocationHeroSection } from "@/components/location/location-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { 
  getOccupationsForLocationCursor,
  getCountryData,
  getLocationData
} from "@/lib/db/queries";
import { rememberNextCursor, resolveCursorForPage } from "@/lib/db/cursor-registry";
import { deslugify, slugify } from "@/lib/format/slug";

export const routeSegmentConfig = { revalidate: 31536000 };
export const fetchCache = 'force-cache';

interface LocationPagedPageProps {
  params: Promise<{ country: string; state: string; location: string; page: string }>;
  searchParams: Promise<{ q?: string; letter?: string }>;
}

export async function generateMetadata({ params, searchParams }: LocationPagedPageProps): Promise<Metadata> {
  const { country, state, location, page } = await params;
  const { q, letter } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  
  const stateName = deslugify(state);
  const locationName = deslugify(location);
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  
  let title = `${locationName}, ${stateName} Salaries`;
  let description = `Salary data and job trends in ${locationName}, ${stateName}, ${countryName}.`;
  
  if (q) {
    title = `Search Results for "${q}" in ${locationName}`;
    description = `Salary data and job opportunities matching "${q}" in ${locationName}, ${stateName}, ${countryName}.`;
  } else if (letter) {
    title = `${locationName} Jobs Starting with "${letter.toUpperCase()}"`;
    description = `Browse ${locationName} occupations starting with the letter "${letter.toUpperCase()}" in ${stateName}, ${countryName}.`;
  }
  
  // Page 1 canonical should be base route without /page/1
  const canonical = pageNum === 1 
    ? `/${country}/${state}/${location}` 
    : `/${country}/${state}/${location}/page/${pageNum}`;
  
  return {
    title,
    description,
    alternates: { canonical },
  };
}

export default async function LocationPagedPage({ params, searchParams }: LocationPagedPageProps) {
  const { country, state, location, page } = await params;
  const { q, letter } = await searchParams;
  
  const pageNum = Math.max(1, Number(page) || 1);
  const searchQuery = typeof q === 'string' ? q.trim().slice(0, 100) : undefined;
  const letterFilter = typeof letter === 'string' && letter.trim().length === 1 
    ? letter.trim().toLowerCase() 
    : undefined;
  
  const stateName = deslugify(state);
  const locationName = deslugify(location);
  
  // Verify location exists
  const locationData = await getLocationData(country, stateName, locationName);
  if (!locationData || locationData.jobs.length === 0) {
    notFound();
  }
  
  // Get country name
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  
  // Fetch paginated occupations and total count
  const limit = 50;

  const cursorResolution = await resolveCursorForPage(
    {
      country,
      state: stateName,
      location: locationName,
      limit,
      searchQuery,
      letterFilter,
    },
    pageNum,
    (pageCursor) =>
      getOccupationsForLocationCursor({
        country,
        state: stateName,
        location: locationName,
        q: searchQuery,
        letter: letterFilter,
        limit,
        cursor: pageCursor,
      })
  );

  if (pageNum > 1 && !cursorResolution.available) {
    notFound();
  }

  const { items, nextCursor } = await getOccupationsForLocationCursor({
    country,
    state: stateName,
    location: locationName,
    q: searchQuery,
    letter: letterFilter,
    limit,
    cursor: cursorResolution.cursor,
  });

  rememberNextCursor(
    { country, state: stateName, location: locationName, limit, searchQuery, letterFilter },
    pageNum,
    nextCursor
  );

  const hasNextPage = Boolean(nextCursor);
  const basePath = `/${country}/${slugify(stateName)}/${slugify(locationName)}`;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    { name: stateName, href: `/${country}/${slugify(stateName)}` },
    { name: locationName, href: basePath },
    pageNum > 1 ? { name: `Page ${pageNum}`, href: "#", current: true } : null,
  ].filter(Boolean) as Array<{ name: string; href: string; current?: boolean }>;
  
  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      
      <LocationHeroSection 
        locationName={locationName}
        stateName={stateName}
        countryName={countryName}
      />

      <OccupationList 
        items={items}
        title="Explore Salaries by Occupation"
        description={`Browse salary information organized by job categories and specializations in ${locationName}, ${stateName}.`}
        currentState={slugify(stateName)}
        currentLocation={slugify(locationName)}
        countrySlug={country}
        currentPage={pageNum}
        totalPages={hasNextPage ? pageNum + 1 : pageNum}
        totalItems={items.length}
        searchQuery={searchQuery}
        letterFilter={letterFilter}
        basePath={basePath}
        hasNextPage={hasNextPage}
      />

      <LocationCTASection 
        country={country}
        state={state}
        location={location}
        countryName={countryName}
        stateName={stateName}
        locationName={locationName}
      />
    </main>
  );
}
