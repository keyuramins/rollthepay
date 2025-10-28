// components/location/location-page.tsx
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { LocationHeroSection } from "@/components/location/location-hero-section";
import { LocationCTASection } from "@/components/location/location-cta-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { getLocationData, getCountryData } from "@/lib/db/queries";

interface LocationPageProps {
  country: string;
  state: string;
  location: string;
}

export async function LocationPage({ country, state, location }: LocationPageProps) {
  // De-slugify state and location (hyphens -> spaces) for DB matching
  const stateName = state
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  
  const locationName = location
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  
  // Get jobs for this specific location using database query
  const locationData = await getLocationData(country, stateName, locationName);
  
  if (!locationData || locationData.jobs.length === 0) {
    notFound();
  }
  
  // Get country name from database
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  
  // Prepare occupation data for the list
  const occupationItems = locationData.jobs.map(job => {
    const baseTitle = job.title || job.occ_name || 'Unknown Occupation';
    const atCompany = job.company_name ? ` at ${job.company_name}` : "";
    const place = job.location || locationName || stateName || countryName;
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
    { name: stateName, href: `/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}` },
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
          currentState={stateName.toLowerCase().replace(/\s+/g, '-')}
          currentLocation={locationName.toLowerCase().replace(/\s+/g, '-')}
          countrySlug={country}
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
