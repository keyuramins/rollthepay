import { Metadata } from "next";
import { notFound } from "next/navigation";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";
import { Header } from "@/components/navigation/header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import dynamicImport from "next/dynamic";

// import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";
import { OccupationListSkeleton } from "@/components/ui/occupation-list-skeleton";



export const revalidate = 31536000;
export const dynamicParams = false;

const OccupationList = dynamicImport(() => import("@/components/ui/occupation-list").then(mod => mod.OccupationList), { ssr: true, loading: () => (
  <OccupationListSkeleton
    title="Explore Salaries by Occupation"
    description="Browse salary information organized by job categories and specializations."
  />
) });




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

  const { countryName, totalJobs, avgSalary, states, occupationItems, headerOccupations } = countryData;

  return (
    <section>
      <Header allOccupations={headerOccupations} />
      
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
          description="Browse salary information organized by job categories and specializations."
          states={states}
        />

        {states.length > 0 && (
          <StatesGrid
            states={states}
            countrySlug={country}
            title="Explore Salaries by State/Region"
            description={`Find salary data specific to different regions within ${countryName}.`}
            className="bg-white"
          />
        )}

        <CountryCTASection />
      </main>
    </section>
  );
}
