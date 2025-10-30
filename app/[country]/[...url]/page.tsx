import { Metadata } from "next";
import { notFound } from "next/navigation";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";

import { OccupationPage } from "@/components/occupation/occupation-page";
import { StatePage } from "@/components/state/state-page";
import { LocationPage } from "@/components/location/location-page";

import { decodeSlugFromURL, slugify, deslugify } from "@/lib/format/slug";

/* -------------------------------------------------
   Route Configuration
-------------------------------------------------- */
export const routeSegmentConfig = { revalidate: 86400 };
export const dynamic = 'error';
export const dynamicParams = false;


interface UnifiedPageProps {
  params: Promise<{ country: string; url: string[] }>;
}

/* -------------------------------------------------
   Utility functions
-------------------------------------------------- */
const normalizeStateName = (name: string) => slugify(name);

const denormalizeStateName = (name: string) => deslugify(name);

const normalizeLocationName = (name: string) => slugify(name);

const denormalizeLocationName = (name: string) => deslugify(name);

/* -------------------------------------------------
   Metadata generation
-------------------------------------------------- */
export async function generateMetadata({ params }: UnifiedPageProps): Promise<Metadata> {
  const { country, url } = await params;
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);

  try {
    if (url.length === 1) {
      const stateOrSlug = url[0];
      const states = await optimizedDataAccess.getAllStates(country);
      const stateMatch = states.find((s) => normalizeStateName(s) === stateOrSlug);

      if (stateMatch) {
        return {
          title: `${stateMatch} Salary Data`,
          description: `Explore salary information and job opportunities in ${stateMatch}, ${countryName}.`,
          alternates: { canonical: `/${country}/${stateOrSlug}` },
        };
      }

      const record = await optimizedDataAccess.findOccupationSalaryByPath({
        country,
        slug: decodeSlugFromURL(stateOrSlug),
      });
      if (!record) return { title: "Occupation Not Found", description: "No data available." };

      const baseTitle =
        record.title || record.occ_name;
      const atCompany = record.company_name ? ` at ${record.company_name}` : "";
      const place =
      record.location || (country ? country.split("-").map((w: string) => (w ? w[0].toUpperCase() + w.slice(1) : "")).join(" ") : "");
      const inPlace = place ? ` in ${place}` : "";
      const occupationName = `${baseTitle}${atCompany}${inPlace}`;
      return {
        title: occupationName,
        description: `Detailed salary data for ${occupationName} in ${countryName}.`,
        alternates: { canonical: `/${country}/${stateOrSlug}` },
      };
    }

    if (url.length === 2) {
      const [state, locationOrSlug] = url;
      const stateName = denormalizeStateName(state);
      
      // Check if this is a location page or state occupation page
      const locations = await optimizedDataAccess.getAllLocations(country, stateName);
      const locationMatch = locations.find((l) => normalizeLocationName(l) === locationOrSlug);
      
      if (locationMatch) {
        // This is a location page
        const locationName = denormalizeLocationName(locationOrSlug);
        return {
          title: `${locationName}, ${stateName} Salaries`,
          description: `Salary data and job trends in ${locationName}, ${stateName}, ${countryName}.`,
          alternates: { canonical: `/${country}/${state}/${locationOrSlug}` },
        };
      } else {
        // This is a state occupation page
        const record = await optimizedDataAccess.findOccupationSalaryByPath({
          country,
          state: stateName,
          slug: decodeSlugFromURL(locationOrSlug),
        });
        if (!record) return { title: "Occupation Not Found", description: "No data available." };

        const baseTitle =
        record.title || record.occ_name;
      const atCompany = record.company_name ? ` at ${record.company_name}` : "";
      const place =
        record.location || (country ? country.split("-").map((w: string) => (w ? w[0].toUpperCase() + w.slice(1) : "")).join(" ") : "");
      const inPlace = place ? ` in ${place}` : "";
      const occupationName = `${baseTitle}${atCompany}${inPlace}`;
        return {
          title: occupationName,
          description: `Detailed salary data for ${occupationName} in ${stateName}, ${countryName}.`,
          alternates: { canonical: `/${country}/${state}/${locationOrSlug}` },
        };
      }
    }

    if (url.length === 3) {
      const [state, location, slug] = url;
      const denormalizedState = denormalizeStateName(state);
      const denormalizedLocation = denormalizeLocationName(location);
      const record = await optimizedDataAccess.findOccupationSalaryByPath({
        country,
        state: denormalizedState,
        location: denormalizedLocation,
        slug: decodeSlugFromURL(slug),
      });
      if (!record) return { title: "Occupation Not Found", description: "No data available." };

      const baseTitle =
        record.title || record.occ_name;
      const atCompany = record.company_name ? ` at ${record.company_name}` : "";
      const place =
      record.location || record.state || (country ? country.split("-").map((w: string) => (w ? w[0].toUpperCase() + w.slice(1) : "")).join(" ") : "");
      const inPlace = place ? ` in ${place}` : "";

      const occupationName = `${baseTitle}${atCompany}${inPlace}`;
      return {
        title: occupationName,
        description: `Comprehensive salary details for ${occupationName} in ${location}, ${state}, ${countryName}.`,
        alternates: { canonical: `/${country}/${state}/${location}/${slug}` },
      };
    }

    return { title: `${countryName} Salaries`, description: "Salary data by region." };
  } catch (err) {
    console.error("Metadata error:", err);
    return { title: "Error", description: "Unable to load page metadata." };
  }
}

/* -------------------------------------------------
   Unified Page Router
-------------------------------------------------- */
export default async function UnifiedPage({ params }: UnifiedPageProps) {
  const { country, url } = await params;

  // --- STATE PAGE OR COUNTRY-LEVEL OCCUPATION PAGE ---
  if (url.length === 1) {
    const stateOrSlug = url[0];
    const states = await optimizedDataAccess.getAllStates(country);
    const stateMatch = states.find((s) => normalizeStateName(s) === stateOrSlug);
    if (stateMatch) {
      // This is a state page; pass display name to StatePage
      return (
        <main>
          <StatePage country={country} state={stateMatch} />
        </main>
      );
    } else {
      // This is a country-level occupation page
      return (
        <main>
          <OccupationPage country={country} slug={decodeSlugFromURL(stateOrSlug)} />
        </main>
      );
    }
  }

  // --- LOCATION PAGE OR STATE OCCUPATION PAGE ---
  if (url.length === 2) {
    const [state, locationOrSlug] = url;
    const stateDisplayName = deslugify(state);
    
    // Check if this is a location page by looking for locations in this state
    const locations = await optimizedDataAccess.getAllLocations(country, stateDisplayName);
    const locationMatch = locations.find((l) => slugify(l) === locationOrSlug);
    
    if (locationMatch) {
      // This is a location page
      return (
        <main>
          <LocationPage country={country} state={state} location={locationOrSlug} />
        </main>
      );
    } else {
      // This is a state occupation page
      const denormalizedState = deslugify(state);
      return (
        <main>
          <OccupationPage country={country} state={denormalizedState} slug={decodeSlugFromURL(locationOrSlug)} />
        </main>
      );
    }
  }

  // --- OCCUPATION PAGE ---
  if (url.length === 3) {
    const [state, location, slug] = url;
    const denormalizedState = deslugify(state);
    const denormalizedLocation = deslugify(location);
    return (
      <main>
        <OccupationPage country={country} state={denormalizedState} location={denormalizedLocation} slug={decodeSlugFromURL(slug)} />
      </main>
    );
  }

  notFound();
}