// components/state/state-page.tsx
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { StateHeroSection } from "./state-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { LocationsGrid } from "./locations-grid";
import { getAllLocations, getCountryData, getStateData } from "@/lib/db/queries";

interface StatePageProps {
  country: string;
  state: string;
  location?: string;
}

export async function StatePage({ country, state }: StatePageProps) {
  const normalizedState = state.replace(/-/g, ' ');

  // Get state data directly from database
  const stateData = await getStateData(country, normalizedState);
  
  if (!stateData) {
    notFound();
  }
  
  // Get country name from database
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  const stateName = stateData.name;
  const jobs = stateData.jobs;
  
  // Get locations for this state using database query
  const locations = await getAllLocations(country, stateName);
  
  // Prepare occupation data for the list (only occupations in this state)
  const occupationItems = jobs.map((job: any) => {
    const baseTitle = job.title || job.occ_name || 'Unknown Occupation';
    const atCompany = job.company_name ? ` at ${job.company_name}` : "";
    const place = job.location || stateName || countryName;
    const inPlace = place ? ` in ${place}` : "";
    
    return {
      id: job.slug,
      displayName: `${baseTitle}${atCompany}${inPlace}`,
      originalName: job.title || '',
      slug_url: job.slug,
      location: job.location || undefined,
      state: stateName,
      avgAnnualSalary: job.avgAnnualSalary || undefined,
      countrySlug: country,
      company_name: job.company_name || undefined,
    };
  });
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
          currentState={state.toLowerCase().replace(/\s+/g, '-')}
          countrySlug={country}
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
