import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataset, findRecordByPath, getStateData, getLocationData } from "@/lib/data/parse";

import { StatePage } from "@/components/state/state-page";
import { LocationPage } from "@/components/location/location-page";
import { OccupationPage } from "@/components/occupation/occupation-page";

export const revalidate = 31536000; // 1 year
export const dynamicParams = true; // Allow dynamic page generation

interface UnifiedPageProps {
  params: Promise<{ country: string; url: string[] }>;
}

// Helper function to normalize state names for URL matching
function normalizeStateName(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to denormalize state names (convert back from URL format)
function denormalizeStateName(normalizedState: string): string {
  // Convert back from URL format: lowercase-hyphenated -> Proper Case with Spaces
  return normalizedState
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

// Helper function to normalize location names for URL matching
function normalizeLocationName(locationName: string): string {
  return locationName.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to denormalize location names (convert back from URL format)
function denormalizeLocationName(normalizedLocation: string): string {
  // Convert back from URL format: lowercase-hyphenated -> Proper Case with Spaces
  return normalizedLocation
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

// Helper function to remove "Average" from titles
function cleanTitle(title: string): string {
  return title.replace(/^Average\s+/i, '').replace(/\s+Salary\s+in\s+Australia$/i, '');
}

// Helper function to normalize slugs for comparison (handles special characters)
function normalizeSlugForComparison(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
}



export async function generateMetadata({ params }: UnifiedPageProps): Promise<Metadata> {
  const { country, url } = await params;
  
  if (url.length === 1) {
    const stateOrSlug = url[0];
    const stateGroups = await getStateData(country);
    const stateData = stateGroups.get(stateOrSlug);
    
    if (stateData) {
      // It's a state page
      const countryName = (await getDataset()).all.find(r => r.country.toLowerCase() === country)?.country || country;
      const stateName = stateData.name;
      
      const metaTitle = `${stateName} Salary Data - RollThePay`;
      const metaDescription = `Explore salary information and job opportunities in ${stateName}, ${countryName}. Get comprehensive compensation data for various occupations.`;
      
      return {
        title: metaTitle,
        description: metaDescription,
        alternates: {
          canonical: `/${country}/${stateOrSlug}`,
        },
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          type: "website",
          url: `/${country}/${stateOrSlug}`,
        },
      };
    } else {
      // It's a country-level occupation page
      const record = await findRecordByPath({ country, slug: stateOrSlug });
      if (!record) {
        return { title: "Occupation Not Found - RollThePay" };
      }
      
      const countryName = record.country;
      const title = cleanTitle(record.title);
      const occupation = record.occupation;
      const location = record.location;
      
      const metaTitle = `${title} in ${countryName} - RollThePay`;
      const metaDescription = `Discover comprehensive salary information for ${title} in ${location ? location + ', ' : ''}${countryName}. Get detailed compensation data, salary ranges, experience levels, skills analysis, and career insights.`;
      
      return {
        title: metaTitle,
        description: metaDescription,
        alternates: {
          canonical: `/${country}/${stateOrSlug}`,
        },
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          type: "website",
          url: `/${country}/${stateOrSlug}`,
        },
      };
    }
  } else if (url.length === 2) {
    // This could be either a state-level occupation page OR a location page
    const [state, secondSegment] = url;
    const stateGroups = await getStateData(country);
    const stateData = stateGroups.get(state);
    
    if (stateData) {
      // Check if it's a location page
      const locationGroups = await getLocationData(country, stateData.name);
      const locationData = locationGroups.get(secondSegment);
      
      if (locationData) {
        // It's a location page
        const countryName = (await getDataset()).all.find(r => r.country.toLowerCase() === country)?.country || country;
        const stateName = stateData.name;
        const locationName = locationData.name;
        
        const metaTitle = `${locationName}, ${stateName} Salary Data - RollThePay`;
        const metaDescription = `Explore salary information and job opportunities in ${locationName}, ${stateName}, ${countryName}. Get comprehensive compensation data for various occupations.`;
        
        return {
          title: metaTitle,
          description: metaDescription,
          alternates: {
            canonical: `/${country}/${state}/${secondSegment}`,
          },
          openGraph: {
            title: metaTitle,
            description: metaDescription,
            type: "website",
            url: `/${country}/${state}/${secondSegment}`,
          },
        };
      } else {
        // This is a state-level occupation page: /[country]/[state]/[slug]
        const record = await findRecordByPath({ country, state: denormalizeStateName(state), slug: secondSegment });
        
        if (!record) {
          return { title: "Occupation Not Found - RollThePay" };
        }
        
        const countryName = record.country;
        const stateName = record.state;
        const title = cleanTitle(record.title);
        
        const metaTitle = `${title} in ${stateName}, ${countryName} - RollThePay`;
        const metaDescription = `Discover comprehensive salary information for ${title} in ${stateName}, ${countryName}. Get detailed compensation data, salary ranges, experience levels, skills analysis, and career insights.`;
        
        return {
          title: metaTitle,
          description: metaDescription,
          alternates: {
            canonical: `/${country}/${state}/${secondSegment}`,
          },
          openGraph: {
            title: metaTitle,
            description: metaDescription,
            type: "website",
            url: `/${country}/${state}/${secondSegment}`,
          },
        };
      }
    } else {
      return { title: "Page Not Found - RollThePay" };
    }
  } else if (url.length === 3) {
    // This is a location-level occupation page: /[country]/[state]/[location]/[slug]
    const [state, location, slug] = url;
    const record = await findRecordByPath({ 
      country, 
      state: denormalizeStateName(state), 
      slug 
    });
    
    if (!record) {
      return { title: "Occupation Not Found - RollThePay" };
    }
    
    const countryName = record.country;
    const stateName = record.state;
    const locationName = record.location;
    const title = cleanTitle(record.title);
    
    const metaTitle = `${title} in ${locationName}, ${stateName}, ${countryName} - RollThePay`;
    const metaDescription = `Discover comprehensive salary information for ${title} in ${locationName}, ${stateName}, ${countryName}. Get detailed compensation data, salary ranges, experience levels, skills analysis, and career insights.`;
    
    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: `/${country}/${state}/${location}/${slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: "website",
        url: `/${country}/${state}/${location}/${slug}`,
      },
    };
  } else {
    return { title: "Page Not Found - RollThePay" };
  }
}

export default async function UnifiedPage({ params }: UnifiedPageProps) {
  const { country, url } = await params;
  
  // Determine the page type based on URL structure
  if (url.length === 1) {
    // This could be either a state page OR a country-level occupation page
    // We need to check if it's a valid state first
    const stateGroups = await getStateData(country);
    const stateData = stateGroups.get(url[0]);
    
    if (stateData) {
      // This is a state page: /[country]/[state]
      return <StatePageComponent country={country} state={url[0]} />;
    } else {
      // This is a country-level occupation page: /[country]/[slug]
      return <OccupationPageComponent country={country} slug={url[0]} />;
    }
  } else if (url.length === 2) {
    // This could be either a state-level occupation page OR a location page
    const [state, secondSegment] = url;
    const stateGroups = await getStateData(country);
    const stateData = stateGroups.get(decodeURIComponent(state));
    
    if (stateData) {
      // Check if it's a location page by looking for a location with this name
      const { all } = await getDataset();
      const hasLocation = all.some(rec => 
        rec.country.toLowerCase() === country.toLowerCase() &&
        rec.state === stateData.name &&
        rec.location &&
        normalizeLocationName(rec.location) === decodeURIComponent(secondSegment)
      );
      
      if (hasLocation) {
        // This is a location page: /[country]/[state]/[location]
        return <LocationPageComponent country={country} state={state} location={decodeURIComponent(secondSegment)} />;
      } else {
        // Check if this is an occupation page with both state and location
                  const occupationRecord = all.find(rec => 
            rec.country.toLowerCase() === country.toLowerCase() &&
            rec.state === stateData.name &&
            normalizeSlugForComparison(rec.slug_url) === normalizeSlugForComparison(decodeURIComponent(secondSegment))
          );
        
        if (occupationRecord && occupationRecord.location) {
          // This is a location-level occupation page: /[country]/[state]/[slug] but should redirect to /[country]/[state]/[location]/[slug]
          // For now, we'll treat it as a state-level occupation page
          return <OccupationPageComponent country={country} state={stateData.name} slug={decodeURIComponent(secondSegment)} />;
        } else {
          // This is a state-level occupation page: /[country]/[state]/[slug]
          return <OccupationPageComponent country={country} state={stateData.name} slug={decodeURIComponent(secondSegment)} />;
        }
      }
    } else {
      notFound(); // Invalid state
    }
  } else if (url.length === 3) {
    // This is a location-level occupation page: /[country]/[state]/[location]/[slug]
    const [state, location, slug] = url;
    
    // Find the record with this specific location
    const { all } = await getDataset();
          const record = all.find(rec => 
        rec.country.toLowerCase() === country.toLowerCase() &&
        rec.state?.toLowerCase().replace(/\s+/g, '-') === decodeURIComponent(state) &&
        rec.location?.toLowerCase().replace(/\s+/g, '-') === decodeURIComponent(location) &&
        normalizeSlugForComparison(rec.slug_url) === normalizeSlugForComparison(decodeURIComponent(slug))
      );
    
    if (!record) {
      notFound();
    }
    
    // Pass the actual state and location names, not the normalized slugs
    return <OccupationPageComponent country={country} state={record.state || undefined} location={record.location || undefined} slug={decodeURIComponent(slug)} />;
  } else {
    notFound(); // Invalid URL structure
  }
}

// State Page Component
async function StatePageComponent({ country, state }: { country: string; state: string }) {
  const stateGroups = await getStateData(country);
  const stateData = stateGroups.get(decodeURIComponent(state));
  
  if (!stateData) {
    notFound();
  }
  
  return <StatePage country={country} state={state} />;
}

// Occupation Page Component
async function OccupationPageComponent({ country, state, location, slug }: { country: string; state?: string; location?: string; slug: string }) {
  const record = await findRecordByPath({ country, state, location, slug });
  
  if (!record) {
    notFound();
  }
  
  return <OccupationPage country={country} state={state} location={location} slug={slug} />;
}

// Location Page Component
async function LocationPageComponent({ country, state, location }: { country: string; state: string; location: string }) {
  const locationGroups = await getLocationData(country, denormalizeStateName(decodeURIComponent(state)));
  const locationData = locationGroups.get(decodeURIComponent(location));

  if (!locationData) {
    notFound();
  }

  return <LocationPage country={country} state={state} location={location} />;
}


