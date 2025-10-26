import { Metadata } from "next";
import { notFound } from "next/navigation";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";
import { Suspense } from "react";

// Next.js 16: Using cacheComponents in next.config.ts instead of individual page configs

// 1 day
// Optimized caching for PostgreSQL - shorter revalidation since data is now in database
// 1 day - database queries are fast
interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  
  // Use static metadata for better Next.js 16 compatibility
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  
  return {
    title: `${countryName} Salary Information`,
    description: `Explore salary records for jobs in ${countryName}. Find accurate salary data, compensation trends, and career insights.`,
    alternates: {
      canonical: `/${country}`,
    },
    openGraph: {
      title: `${countryName} Salary Information`,
      description: `Discover salary data for jobs in ${countryName}. Get accurate compensation information to advance your career.`,
      type: "website",
      url: `/${country}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${countryName} Salary Information`,
      description: `Discover salary data for jobs in ${countryName}. Get accurate compensation information to advance your career.`,
    },
  };
}

async function CountryPageContent({ country }: { country: string }) {
  // Use a try-catch to handle potential data access issues
  let countryData;
  try {
    countryData = await optimizedDataAccess.getCountryData(country);
  } catch (error) {
    console.error('Error fetching country data:', error);
    notFound();
  }
  
  if (!countryData) {
    notFound();
  }

  // Normalize the fetched country name and compare with slug
  const normalizedFetchedName = countryData.countryName.toLowerCase().replace(/\s+/g, '-');
  if (normalizedFetchedName !== country.toLowerCase()) {
    notFound();
  }

  const { countryName, totalJobs, states, occupationItems } = countryData;

  return (
    <>
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { name: "Home", href: "/" },
            { name: countryName, href: "#", current: true },
          ]}
        />
        
        <CountryHeroSection
          countryName={countryName}
          totalJobs={totalJobs}
        />

          <OccupationList
            items={occupationItems}
            title="Explore Salaries by Occupation"
            description="Browse salary information organized by respective categories and specializations."
            states={states}
            countrySlug={country}
          />

        {states.length > 0 && (
          <StatesGrid
            states={states}
            countrySlug={country}
            title="Explore Salaries by State/Region"
            description={`Find salary data specific to different regions within ${countryName}.`}
          />
        )}

        <CountryCTASection />
      </main>
    </>
  );
}
export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  
  return (
    <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded-md"></div>}>
      <CountryPageContent country={country} />
    </Suspense>
  );
}

