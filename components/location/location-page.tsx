import Link from "next/link";
import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { LocationHeroSection } from "@/components/location/location-hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { getDataset } from "@/lib/data/parse";

interface LocationPageProps {
  country: string;
  state: string;
  location: string;
}

export async function LocationPage({ country, state, location }: LocationPageProps) {
  const { all } = await getDataset();
  
  // The state and location parameters are now the actual names, not normalized slugs
  const stateName = state;
  const locationName = location;
  
  // Get jobs for this specific location
  const locationJobs = all.filter(rec => 
    rec.country.toLowerCase() === country.toLowerCase() &&
    rec.state === stateName &&
    rec.location === locationName
  );
  
  if (locationJobs.length === 0) {
    return null; // This should be handled by the parent component
  }
  
  const countryName = all.find(r => r.country.toLowerCase() === country)?.country || country;
  
  // Prepare occupation data for the list
  const occupationItems = locationJobs.map(record => ({
    id: record.slug_url,
    displayName: record.title || record.h1Title || "Unknown Occupation",
    originalName: record.title || record.h1Title || "Unknown Occupation",
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
    { name: stateName, href: `/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}` },
    { name: locationName, href: "#", current: true },
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
        
        <LocationHeroSection 
          locationName={locationName}
          stateName={stateName}
          countryName={countryName}
          jobCount={locationJobs.length}
        />

        <OccupationList 
          items={occupationItems}
          title="Explore Jobs by Category"
          description={`Browse salary information organized by job categories and specializations in ${locationName}, ${stateName}.`}
          states={[stateName]}
          currentState={stateName.toLowerCase().replace(/\s+/g, '-')}
          currentLocation={locationName.toLowerCase().replace(/\s+/g, '-')}
        />

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Explore More Salary Data
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Discover comprehensive salary information for various occupations and locations
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                href={`/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                View State Data
              </Link>
              <Link
                href={`/${country}`}
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors"
              >
                View Country Data
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
