import Link from "next/link";
import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { StateHeroSection } from "./state-hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { LocationsGrid } from "./locations-grid";
import { getStateData, getDataset, getLocationData } from "@/lib/data/parse";

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
    <div className="min-h-screen bg-gray-50">
      <NewHeader allOccupations={all.map(rec => ({
        country: rec.country.toLowerCase(),
        title: rec.title || rec.h1Title || "",
        slug: rec.slug_url,
        state: rec.state ? rec.state : null,
        location: rec.location ? rec.location : null,
      }))} />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
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

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Explore More Salary Data
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Compare salaries across different locations and discover career opportunities 
              in {stateName}, {countryName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${country}`}>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  View All Salary Data in {countryName}
                </button>
              </Link>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
