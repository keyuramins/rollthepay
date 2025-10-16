import { Metadata } from "next";
import { notFound } from "next/navigation";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";



























export const revalidate = 31536000;
export const dynamicParams = false;

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  const countryData = await optimizedDataAccess.getCountryData(country);
  
  if (!countryData) {
    return {
      title: "Country Not Found - RollThePay",
    };
  }

  const { countryName, totalJobs } = countryData;

  return {
    title: `${countryName} Salary Information - RollThePay`,
    description: `Explore ${totalJobs}+ salary records for jobs in ${countryName}. Find accurate salary data, compensation trends, and career insights.`,
    alternates: {
      canonical: `/${country}`,
    },
    openGraph: {
      title: `${countryName} Salary Information - RollThePay`,
      description: `Discover salary data for ${totalJobs}+ jobs in ${countryName}. Get accurate compensation information to advance your career.`,
      type: "website",
      url: `/${country}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${countryName} Salary Information - RollThePay`,
      description: `Discover salary data for ${totalJobs}+ jobs in ${countryName}. Get accurate compensation information to advance your career.`,
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  
  const countryData = await optimizedDataAccess.getCountryData(country);
  
  if (!countryData) {
    notFound();
  }

  const { countryName, totalJobs, states, occupationItems, headerOccupations } = countryData;

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
