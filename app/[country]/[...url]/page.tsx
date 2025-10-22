// app/[country]/[...url]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";
import { StatePage } from "@/components/state/state-page";
import { LocationPage } from "@/components/location/location-page";
import { OccupationPage } from "@/components/occupation/occupation-page";
import { cleanTitle } from "@/lib/utils/title-cleaner";
import { removeAveragePrefix } from "@/lib/utils/remove-average-cleaner";



export const revalidate = 31536000;
export const dynamicParams = false;

// 1 day
// Optimized caching for PostgreSQL - shorter revalidation since data is now in database
// 1 hour - database queries are fast
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

// Helper function to normalize slugs for comparison (handles special characters)
function normalizeSlugForComparison(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
}

// Helper function to generate occupation metadata
async function generateOccupationMetadata(country: string, state?: string, location?: string, slug?: string): Promise<Metadata> {
  if (!slug) {
    return {
      title: "Invalid URL - RollThePay",
      description: "The requested URL is invalid. Please check the URL or browse our available occupations.",
    };
  }
  
  const record = await optimizedDataAccess.findOccupationSalaryByPath({ country, state, location, slug });
  
  if (!record) {
    return {
      title: "Occupation Not Found - RollThePay",
      description: "The requested occupation could not be found. Please check the URL or browse our available occupations.",
    };
  }
  
  const countryName = record.country;
  const stateName = record.state;
  const locationName = record.location;
  const occupationName = removeAveragePrefix(record.title || record.h1Title || record.occupation || "");
  
  // Build location string for metadata
  let locationString = "";
  if (locationName && stateName) {
    locationString = `${locationName}, ${stateName}, ${countryName}`;
  } else if (stateName) {
    locationString = `${stateName}, ${countryName}`;
  } else {
    locationString = countryName;
  }
  
  // Meta title must match the H1 exactly; layout template will append the site name
  const metaTitle = occupationName;
  const metaDescription = `Discover comprehensive salary information for ${cleanTitle(record.title)} in ${locationString}. Get detailed compensation data, salary ranges, experience levels, skills analysis, and career insights.`;
  
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `/${country}${state ? `/${normalizeStateName(state)}` : ''}${location ? `/${normalizeLocationName(location)}` : ''}/${slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
      url: `/${country}${state ? `/${normalizeStateName(state)}` : ''}${location ? `/${normalizeLocationName(location)}` : ''}/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export async function generateMetadata({ params }: UnifiedPageProps): Promise<Metadata> {
  const { country, url } = await params;
  
  try {
    if (url.length === 1) {
      const stateOrSlug = url[0];
      const states = await optimizedDataAccess.getAllStates(country);
      const stateData = states.find(s => normalizeStateName(s) === stateOrSlug);
      
      if (stateData) {
        // It's a state page
        const countryName = country.charAt(0).toUpperCase() + country.slice(1);
        
        const metaTitle = `${stateData} Salary Data - RollThePay`;
        const metaDescription = `Explore salary information and job opportunities in ${stateData}, ${countryName}. Get comprehensive compensation data for various occupations.`;
        
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
          twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
          },
        };
      } else {
        // It's a country-level occupation page
        return await generateOccupationMetadata(country, undefined, undefined, stateOrSlug);
      }
    } else if (url.length === 2) {
      // This could be either a state-level occupation page OR a location page
      const [state, secondSegment] = url;
      const states = await optimizedDataAccess.getAllStates(country);
      const stateData = states.find(s => normalizeStateName(s) === state);
      
      if (stateData) {
        // Check if it's a location page
        const locations = await optimizedDataAccess.getAllLocations(country, stateData);
        const locationData = locations.find(l => normalizeLocationName(l) === secondSegment);
        
        if (locationData) {
          // It's a location page
          const countryName = country.charAt(0).toUpperCase() + country.slice(1);
          
          const metaTitle = `${locationData}, ${stateData} Salary Data - RollThePay`;
          const metaDescription = `Explore salary information and job opportunities in ${locationData}, ${stateData}, ${countryName}. Get comprehensive compensation data for various occupations.`;
          
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
            twitter: {
              card: "summary_large_image",
              title: metaTitle,
              description: metaDescription,
            },
          };
        } else {
          // This is a state-level occupation page: /[country]/[state]/[slug]
          return await generateOccupationMetadata(country, denormalizeStateName(state), undefined, secondSegment);
        }
      } else {
        return { 
          title: "Page Not Found - RollThePay",
          description: "The requested page could not be found. Please check the URL or browse our available content.",
        };
      }
    } else if (url.length === 3) {
      // This is a location-level occupation page: /[country]/[state]/[location]/[slug]
      const [state, location, slug] = url;
      return await generateOccupationMetadata(
        country, 
        denormalizeStateName(state), 
        denormalizeLocationName(location), 
        slug
      );
    } else {
      return { 
        title: "Page Not Found - RollThePay",
        description: "The requested page could not be found. Please check the URL or browse our available content.",
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Error - RollThePay",
      description: "An error occurred while loading this page. Please try again or contact support.",
    };
  }
}

export default async function UnifiedPage({ params }: UnifiedPageProps) {
  const { country, url } = await params;
  
  // Determine the page type based on URL structure
  if (url.length === 1) {
    // This could be either a state page OR a country-level occupation page
    // We need to check if it's a valid state first
    const states = await optimizedDataAccess.getAllStates(country);
    const stateData = states.find(s => normalizeStateName(s) === url[0]);
    
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
    const states = await optimizedDataAccess.getAllStates(country);
    const stateData = states.find(s => normalizeStateName(s) === decodeURIComponent(state));
    
    if (stateData) {
      // Check if it's a location page by looking for a location with this name
      const locations = await optimizedDataAccess.getAllLocations(country, stateData);
      const hasLocation = locations.some(loc => normalizeLocationName(loc) === decodeURIComponent(secondSegment));
      
      if (hasLocation) {
        // This is a location page: /[country]/[state]/[location]
        return <LocationPageComponent country={country} state={state} location={decodeURIComponent(secondSegment)} />;
      } else {
        // Check if this is an occupation page with both state and location
        const occupationRecord = await optimizedDataAccess.findOccupationSalaryByPath({
          country,
          state: stateData,
          slug: decodeURIComponent(secondSegment)
        });
        
        if (occupationRecord && occupationRecord.location) {
          // This is a location-level occupation page: /[country]/[state]/[slug] but should redirect to /[country]/[state]/[location]/[slug]
          // For now, we'll treat it as a state-level occupation page
          return <OccupationPageComponent country={country} state={stateData} slug={decodeURIComponent(secondSegment)} />;
        } else {
          // This is a state-level occupation page: /[country]/[state]/[slug]
          return <OccupationPageComponent country={country} state={stateData} slug={decodeURIComponent(secondSegment)} />;
        }
      }
    } else {
      notFound(); // Invalid state
    }
  } else if (url.length === 3) {
    // This is a location-level occupation page: /[country]/[state]/[location]/[slug]
    const [state, location, slug] = url;
    
    // Find the record with this specific location
    const record = await optimizedDataAccess.findOccupationSalaryByPath({
      country,
      state: denormalizeStateName(decodeURIComponent(state)),
      location: denormalizeLocationName(decodeURIComponent(location)),
      slug: decodeURIComponent(slug)
    });
    
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
  const states = await optimizedDataAccess.getAllStates(country);
  const stateData = states.find(s => normalizeStateName(s) === decodeURIComponent(state));
  
  if (!stateData) {
    notFound();
  }
  
  return <StatePage country={country} state={state} />;
}

// Occupation Page Component
async function OccupationPageComponent({ country, state, location, slug }: { country: string; state?: string; location?: string; slug: string }) {
  const record = await optimizedDataAccess.findOccupationSalaryByPath({ country, state, location, slug });
  
  if (!record) {
    notFound();
  }
  
  return <OccupationPage country={country} state={state} location={location} slug={slug} />;
}

// Location Page Component
async function LocationPageComponent({ country, state, location }: { country: string; state: string; location: string }) {
  // Decode the URL parameters
  const decodedState = decodeURIComponent(state);
  const decodedLocation = decodeURIComponent(location);
  
  // Find the actual state name from the normalized state slug
  const states = await optimizedDataAccess.getAllStates(country);
  const stateData = states.find(s => normalizeStateName(s) === decodedState);
  
  if (!stateData) {
    notFound();
  }
  
  // Find the actual location name from the normalized location slug
  const locations = await optimizedDataAccess.getAllLocations(country, stateData);
  const locationData = locations.find(l => normalizeLocationName(l) === decodedLocation);

  if (!locationData) {
    notFound();
  }

  // Pass the actual state and location names to the LocationPage component
  return <LocationPage country={country} state={stateData} location={locationData} />;
}