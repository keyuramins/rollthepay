import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";

import { OccupationPage } from "@/components/occupation/occupation-page";
import { StatePage } from "@/components/state/state-page";
import { LocationPage } from "@/components/location/location-page";
import { OccupationListSkeleton } from "@/components/ui/skeletons";

import { cleanTitle } from "@/lib/utils/title-cleaner";
import { removeAveragePrefix } from "@/lib/utils/remove-average-cleaner";

/* -------------------------------------------------
   Route Configuration
-------------------------------------------------- */
export const routeSegmentConfig = { revalidate: 86400 };

interface UnifiedPageProps {
  params: Promise<{ country: string; url: string[] }>;
}

/* -------------------------------------------------
   Utility functions
-------------------------------------------------- */
const normalizeStateName = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-");

const denormalizeStateName = (name: string) =>
  name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const normalizeLocationName = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-");

const denormalizeLocationName = (name: string) =>
  name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
        slug: stateOrSlug,
      });
      if (!record) return { title: "Occupation Not Found", description: "No data available." };

      const occupationName = removeAveragePrefix(record.title || record.h1Title || "");
      return {
        title: occupationName,
        description: `Detailed salary data for ${occupationName} in ${countryName}.`,
        alternates: { canonical: `/${country}/${stateOrSlug}` },
      };
    }

    if (url.length === 2) {
      const [state, location] = url;
      const locationName = denormalizeLocationName(location);
      const stateName = denormalizeStateName(state);
      return {
        title: `${locationName}, ${stateName} Salaries`,
        description: `Salary data and job trends in ${locationName}, ${stateName}, ${countryName}.`,
        alternates: { canonical: `/${country}/${state}/${location}` },
      };
    }

    if (url.length === 3) {
      const [state, location, slug] = url;
      const record = await optimizedDataAccess.findOccupationSalaryByPath({
        country,
        state,
        location,
        slug,
      });
      if (!record) return { title: "Occupation Not Found", description: "No data available." };

      const occupationName = removeAveragePrefix(record.title || record.h1Title || "");
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

  const countryDisplayName = country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, " ");

  // --- STATE PAGE ---
  if (url.length === 1) {
    const stateSlug = url[0];
    const stateDisplayName = denormalizeStateName(stateSlug);

    return (
      <main>
          <StatePage country={country} state={stateSlug} />
      </main>
    );
  }

  // --- LOCATION PAGE ---
  if (url.length === 2) {
    const [state, location] = url;
    const stateDisplayName = denormalizeStateName(state);
    const locationDisplayName = denormalizeLocationName(location);

    return (
      <main>
        <LocationPage country={country} state={state} location={location} />
      </main>
    );
  }

  // --- OCCUPATION PAGE ---
  if (url.length === 3) {
    const [state, location, slug] = url;
    return (
      <main>
        <OccupationPage country={country} state={state} location={location} slug={slug} />
      </main>
    );
  }

  notFound();
}
