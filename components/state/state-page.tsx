// components/state/state-page.tsx
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { StateHeroSection } from "./state-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { LocationsGrid } from "./locations-grid";
import { 
  getAllLocations, 
  getCountryData, 
  getStateData,
  getOccupationsForStateCursor,
} from "@/lib/db/queries";
import { rememberNextCursor } from "@/lib/db/cursor-registry";
import { slugify } from "@/lib/format/slug";

interface StatePageProps {
  country: string;
  state: string;
  location?: string;
}

export async function StatePage({ country, state }: StatePageProps) {
  // The route handler now passes the database name directly, so use it as-is
  const normalizedState = state;

  // Get state data directly from database
  const stateData = await getStateData(country, normalizedState);
  
  if (!stateData) {
    notFound();
  }
  
  // Get country name from database
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  const stateName = stateData.name;
  
  // Get locations for this state using database query
  const locations = await getAllLocations(country, stateName);
  
  // Fetch first 50 occupations with cursor pagination (no cursor for first page)
  const limit = 50;
  
  const [{ items: occupationItems, nextCursor }] = await Promise.all([
    getOccupationsForStateCursor({
      country,
      state: normalizedState,
      limit,
    }),
  ]);

  rememberNextCursor(
    { country, state: normalizedState, limit },
    1,
    nextCursor
  );

  const hasNextPage = Boolean(nextCursor);
  const basePath = `/${country}/${slugify(stateName)}`;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    { name: stateName, href: "#", current: true },
  ];
  
  return (
    <>
      <main>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        
        <StateHeroSection 
          stateName={stateName}
          countryName={countryName}
        />

        <OccupationList 
          items={occupationItems}
          title="Explore Salaries by Occupation"
          description={`Browse salary information organized by respective categories and specializations in ${stateName}.`}
          states={[stateName]}
          currentState={slugify(stateName)}
          countrySlug={country}
          currentPage={1}
          totalPages={hasNextPage ? 2 : 1}
          totalItems={occupationItems.length}
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
    </>
  );
}
