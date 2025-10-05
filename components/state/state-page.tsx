import { Header } from "@/components/navigation/header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { StateHeroSection } from "./state-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { LocationsGrid } from "./locations-grid";
import { getStateData, getDataset } from "@/lib/data/parse";

interface StatePageProps {
  country: string;
  state: string;
}

export async function StatePage({ country, state }: StatePageProps) {
  const stateGroups = await getStateData(country);
  const stateData = stateGroups.get(state);
  
  if (!stateData) {
    return null; // This should be handled by the parent component
  }
  
  const countryName = (await getDataset()).all.find(r => r.country.toLowerCase() === country)?.country || country;
  const stateName = stateData.name;
  const jobs = stateData.jobs;
  
  // Get unique locations if they exist
  const locations = Array.from(new Set(
    (await getDataset()).all
      .filter(rec => rec.country.toLowerCase() === country.toLowerCase() && rec.state === stateName)
      .map(rec => rec.location)
      .filter(Boolean)
  )) as string[];
  
  // Prepare occupation data for the list (only jobs in this state)
  const { all } = await getDataset();
  const occupationItems = all
    .filter(rec => rec.country.toLowerCase() === country.toLowerCase() && rec.state === stateName)
    .map(record => ({
      id: record.slug_url,
      displayName: record.title || record.h1Title || "Unknown Job",
      originalName: record.title || record.h1Title || "Unknown Job",
      slug_url: record.slug_url,
      location: record.location || undefined,
      state: record.state || undefined,
      avgAnnualSalary: record.avgAnnualSalary || undefined,
      countrySlug: country
    }));

  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    { name: stateName, href: "#", current: true },
  ];
  
  return (
    <div className="page-container">
      <Header allOccupations={all.map(rec => ({
        country: rec.country.toLowerCase(),
        title: rec.title || rec.h1Title || "",
        slug: rec.slug_url,
        state: rec.state ? rec.state : null,
        location: rec.location ? rec.location : null,
      }))} />
      
      <main className="page-main">
        {/* Breadcrumbs */}
          <div className="breadcrumbs-wrapper">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        
        <StateHeroSection 
          stateName={stateName}
          countryName={countryName}
          jobCount={jobs.length}
        />

        <OccupationList 
          items={occupationItems}
          title="Explore Jobs by Category"
          description={`Browse salary information organized by job categories and specializations in ${stateName}.`}
          states={[stateName]}
          currentState={state.toLowerCase().replace(/\s+/g, '-')}
        />

        {locations.length > 0 && (
          <LocationsGrid
            country={country}
            state={stateName}
            title="Explore by Location"
            description={`Find salary data specific to different cities and locations within ${stateName}.`}
            className="bg-white"
          />
        )}

        <LocationCTASection 
          country={country}
          state={state}
          countryName={countryName}
          stateName={stateName}
        />
      </main>
    </div>
  );
}
