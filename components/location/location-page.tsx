import Link from "next/link";
import { Header } from "@/components/navigation/header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { LocationHeroSection } from "@/components/location/location-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
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
    <>
      <Header allOccupations={all.map(rec => ({
        country: rec.country.toLowerCase(),
        title: rec.title || rec.h1Title || "",
        slug: rec.slug_url,
        state: rec.state ? rec.state : null,
        location: rec.location ? rec.location : null,
      }))} />
      
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
          currentState={stateName.toLowerCase().replace(/\s+/g, '-')}
          currentLocation={locationName.toLowerCase().replace(/\s+/g, '-')}
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
