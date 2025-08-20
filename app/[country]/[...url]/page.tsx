import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataset, findRecordByPath, getStateData } from "@/lib/data/parse";

import { StatePage } from "@/components/state/state-page";
import { OccupationPage } from "@/components/occupation/occupation-page";

export const revalidate = 31536000; // 1 year
export const dynamicParams = false; // Guarantee static paths only

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



// Generate static params for all possible routes
export async function generateStaticParams() {
  const { all } = getDataset();
  const params: { country: string; url: string[] }[] = [];
  
  // Group records by country
  const countryGroups = new Map<string, any[]>();
  for (const record of all) {
    const country = record.country.toLowerCase();
    if (!countryGroups.has(country)) {
      countryGroups.set(country, []);
    }
    countryGroups.get(country)!.push(record);
  }
  
  // Generate params for each country
  for (const [country, records] of countryGroups) {
    // Add country-level occupation pages: /[country]/[slug]
    for (const record of records) {
      if (!record.state) {
        params.push({
          country,
          url: [record.slug_url]
        });
      }
    }
    
    // Add state-level occupation pages: /[country]/[state]/[slug]
    for (const record of records) {
      if (record.state) {
        params.push({
          country,
          url: [normalizeStateName(record.state), record.slug_url]
        });
      }
    }
    
    // Add state pages: /[country]/[state]
    const stateGroups = getStateData(country);
    for (const [stateKey] of stateGroups) {
      params.push({
        country,
        url: [stateKey]
      });
    }
  }
  
  return params;
}

// Helper function to remove "Average" from titles
function cleanTitle(title: string): string {
  return title.replace(/^Average\s+/i, '').replace(/\s+Salary\s+in\s+Australia$/i, '');
}



export async function generateMetadata({ params }: UnifiedPageProps): Promise<Metadata> {
  const { country, url } = await params;
  
  if (url.length === 1) {
    const stateOrSlug = url[0];
    const stateGroups = getStateData(country);
    const stateData = stateGroups.get(stateOrSlug);
    
    if (stateData) {
      // It's a state page
      const countryName = getDataset().all.find(r => r.country.toLowerCase() === country)?.country || country;
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
      const record = findRecordByPath({ country, slug: stateOrSlug });
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
    // This is a state-level occupation page
    const [state, slug] = url;
    const record = findRecordByPath({ country, state: denormalizeStateName(state), slug });
    
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
        canonical: `/${country}/${state}/${slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: "website",
        url: `/${country}/${state}/${slug}`,
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
    const stateGroups = getStateData(country);
    const stateData = stateGroups.get(url[0]);
    
    if (stateData) {
      // This is a state page: /[country]/[state]
      return <StatePageComponent country={country} state={url[0]} />;
    } else {
      // This is a country-level occupation page: /[country]/[slug]
      return <OccupationPageComponent country={country} slug={url[0]} />;
    }
  } else if (url.length === 2) {
    // This is a state-level occupation page: /[country]/[state]/[slug]
    return <OccupationPageComponent country={country} state={denormalizeStateName(url[0])} slug={url[1]} />;
  } else {
    notFound(); // Invalid URL structure
  }
}

// State Page Component
function StatePageComponent({ country, state }: { country: string; state: string }) {
  const stateGroups = getStateData(country);
  const stateData = stateGroups.get(state);
  
  if (!stateData) {
    notFound();
  }
  
  return <StatePage country={country} state={state} />;
}

// Occupation Page Component
function OccupationPageComponent({ country, state, slug }: { country: string; state?: string; slug: string }) {
  const record = findRecordByPath({ country, state, slug });
  
  if (!record) {
    notFound();
  }
  
  return <OccupationPage country={country} state={state} slug={slug} />;
}


