import { Metadata } from "next";
import { notFound } from "next/navigation";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";
import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";








export const revalidate = 31536000;
export const dynamicParams = false;

// Shorter revalidation for testing (can be increased later)
// 1 minute for testing
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
    <div className="min-h-screen bg-muted">
      <NewHeader allOccupations={headerOccupations} />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs
              breadcrumbs={[
                { name: "Home", href: "/" },
                { name: countryName, href: "#", current: true },
              ]}
            />
          </div>
        </div>
        
        <CountryHeroSection
          countryName={countryName}
          totalJobs={totalJobs}
          avgSalary={avgSalary}
          statesCount={states.length}
          countrySlug={country}
        />

        <OccupationList
          items={occupationItems}
          title="Explore Jobs by Category"
          description="Browse salary information organized by job categories and specializations."
          states={states}
        />

        {states.length > 0 && (
          <StatesGrid
            states={states}
            countrySlug={country}
            title="Explore by State/Region"
            description={`Find salary data specific to different regions within ${countryName}.`}
            className="bg-background"
          />
        )}

        <CountryCTASection />
      </main>
    </div>
  );
}
