import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataset } from "@/lib/data/parse";
import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";

export const revalidate = 31536000;
export const dynamicParams = true;

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  const { byCountry } = await getDataset();
  const countryLower = country.toLowerCase();
  const countryData = byCountry.get(countryLower);
  
  if (!countryData || countryData.length === 0) {
    return {
      title: "Country Not Found - RollThePay",
    };
  }

  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const totalJobs = countryData.length;
  const avgSalary = countryData.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) / countryData.length;

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
  const { byCountry } = await getDataset();
  const countryLower = country.toLowerCase();
  const countryData = byCountry.get(countryLower);
  
  if (!countryData || countryData.length === 0) {
    notFound();
  }

  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const totalJobs = countryData.length;
  const avgSalary = countryData.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) / totalJobs;
  
  // Get unique states if they exist
  const states = Array.from(new Set(countryData.map(rec => rec.state).filter(Boolean))) as string[];
  
  // Prepare occupation data for the list
  const occupationItems = countryData.map(record => ({
    id: record.slug_url,
    displayName: record.title || record.h1Title || "Unknown Occupation",
    originalName: record.title || record.h1Title || "Unknown Occupation",
    slug_url: record.slug_url,
    location: record.location || undefined,
    state: record.state || undefined,
    avgAnnualSalary: record.avgAnnualSalary || undefined,
    countrySlug: countryLower
  }));

  // Build header suggestions array
  const headerOccupations = countryData.map(rec => ({
    country: rec.country.toLowerCase(),
    title: rec.title || rec.h1Title || "",
    slug: rec.slug_url,
    state: rec.state ? rec.state : null,
    location: rec.location ? rec.location : null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <NewHeader allOccupations={headerOccupations} />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-white">
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
          countrySlug={countryLower}
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
            countrySlug={countryLower}
            title="Explore by State/Region"
            description={`Find salary data specific to different regions within ${countryName}.`}
            className="bg-white"
          />
        )}

        <CountryCTASection />
      </main>
    </div>
  );
}
