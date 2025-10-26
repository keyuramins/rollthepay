import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";

export const routeSegmentConfig = { revalidate: 86400 }; // 1 day for country data
// Pages generate on-demand with ISR (Incremental Static Regeneration)

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  return {
    title: `${countryName} Salary Information`,
    description: `Explore salary records for jobs in ${countryName}.`,
    alternates: { canonical: `/${country}` },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  const countryDisplayName = country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, " ");

  const countryData = await optimizedDataAccess.getCountryData(country);
  if (!countryData) notFound();

  return (
    <main>
      {/* Instant shell */}
      <Breadcrumbs
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: countryDisplayName, href: "#", current: true },
        ]}
      />

      <CountryHeroSection
        countryName={countryDisplayName}
        totalJobs={countryData.totalJobs}
      />

      {/* Occupation list now handles its own Suspense internally */}
      <OccupationList
        items={countryData.occupationItems}
        title="Explore Salaries by Occupation"
        description="Browse salary information organized by respective categories and specializations."
        states={countryData.states}
        countrySlug={country}
      />

      {countryData.states.length > 0 && (
        <StatesGrid
          states={countryData.states}
          countrySlug={country}
          title="Explore Salaries by State/Region"
          description={`Find salary data specific to different regions within ${countryData.countryName}.`}
        />
      )}

      <CountryCTASection />
    </main>
  );
}


