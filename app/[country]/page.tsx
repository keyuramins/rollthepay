import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataset } from "@/lib/data/parse";
import { Header } from "@/components/navigation/header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { CountryCTASection } from "@/components/country/cta-section";

export const revalidate = 31536000;
export const dynamicParams = false;

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  const { byCountry } = getDataset();
  const countryLower = country.toLowerCase();
  const countryData = byCountry.get(countryLower);
  
  if (!countryData || countryData.length === 0) {
    return {
      title: "Country Not Found - Roll The Pay",
    };
  }

  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const totalJobs = countryData.length;
  const avgSalary = countryData.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) / countryData.length;

  return {
    title: `${countryName} Salary Information - Roll The Pay`,
    description: `Explore ${totalJobs}+ salary records for jobs in ${countryName}. Find accurate salary data, compensation trends, and career insights.`,
    alternates: {
      canonical: `/${country}`,
    },
    openGraph: {
      title: `${countryName} Salary Information - Roll The Pay`,
      description: `Discover salary data for ${totalJobs}+ jobs in ${countryName}. Get accurate compensation information to advance your career.`,
      type: "website",
      url: `/${country}`,
    },
  };
}

export async function generateStaticParams() {
  const { byCountry } = getDataset();
  return Array.from(byCountry.keys()).map((country) => ({
    country: country.toLowerCase(),
  }));
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  const { byCountry } = getDataset();
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

  // Prepare states data for the list
  const stateItems = states.map(state => {
    const stateRecords = countryData.filter(rec => rec.state === state);
    const stateAvgSalary = stateRecords.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) / stateRecords.length;
    
    return {
      id: state!,
      displayName: state!,
      originalName: state!,
      slug_url: state!.toLowerCase().replace(/\s+/g, '-'), // Convert state name to URL-friendly format
      location: undefined,
      state: undefined,
      avgAnnualSalary: stateAvgSalary,
      countrySlug: countryLower
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs
              breadcrumbs={[
                { name: "Home", href: "/" },
                { name: "Countries", href: "/countries" },
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
          <OccupationList
            items={stateItems}
            title="Explore by State/Region"
            description={`Find salary data specific to different regions within ${countryName}.`}
            className="bg-white"
            states={states}
          />
        )}

        <CountryCTASection />
      </main>
    </div>
  );
}
