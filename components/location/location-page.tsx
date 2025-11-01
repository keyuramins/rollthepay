// components/location/location-page.tsx
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { LocationHeroSection } from "@/components/location/location-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { 
  getLocationData, 
  getCountryData,
  getOccupationsForLocationCursor,
  getAvailableLettersForLocation
} from "@/lib/db/queries";
import { rememberNextCursor } from "@/lib/db/cursor-registry";
import { deslugify, slugify } from "@/lib/format/slug";

interface LocationPageProps {
  country: string;
  state: string;
  location: string;
}

export async function LocationPage({ country, state, location }: LocationPageProps) {
  // De-slugify state and location using the centralized function
  const stateName = deslugify(state);
  const locationName = deslugify(location);
  
  // Get jobs for this specific location using database query (verify location exists)
  const locationData = await getLocationData(country, stateName, locationName);
  
  if (!locationData || locationData.jobs.length === 0) {
    notFound();
  }
  
  // Get country name from database
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  
  // Fetch first 50 occupations with cursor pagination
  const limit = 50;
  
  const [{ items: occupationItems, nextCursor }, availableLetters] = await Promise.all([
    getOccupationsForLocationCursor({
      country,
      state: stateName,
      location: locationName,
      limit,
    }),
    getAvailableLettersForLocation({ country, state: stateName, location: locationName }),
  ]);

  rememberNextCursor(
    { country, state: stateName, location: locationName, limit },
    1,
    nextCursor
  );

  const hasNextPage = Boolean(nextCursor);
  const basePath = `/${country}/${slugify(stateName)}/${slugify(locationName)}`;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    { name: stateName, href: `/${country}/${slugify(stateName)}` },
    { name: locationName, href: "#", current: true },
  ];
  
  return (
    <>
      <main>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        
        <LocationHeroSection 
          locationName={locationName}
          stateName={stateName}
          countryName={countryName}
        />

        <OccupationList 
          items={occupationItems}
          title="Explore Salaries by Occupation"
          description={`Browse salary information organized by job categories and specializations in ${locationName}, ${stateName}.`}
          states={[stateName]}
          currentState={slugify(stateName)}
          currentLocation={slugify(locationName)}
          countrySlug={country}
          currentPage={1}
        totalPages={hasNextPage ? 2 : 1}
          totalItems={occupationItems.length}
          basePath={basePath}
        hasNextPage={hasNextPage}
        availableLetters={availableLetters}
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
    </>
  );
}
