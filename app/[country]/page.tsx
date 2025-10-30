import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";
import { optimizedDataAccess } from "@/lib/data/optimized-parse";
import { getAllCountries } from "@/lib/db/queries";

export const routeSegmentConfig = { revalidate: 86400 };
export const dynamic = 'error';

export async function generateStaticParams() {
  const countries = await getAllCountries();
  return countries.map((country) => ({
    country: country.toLowerCase().replace(/\s+/g, '-'),
  }));
}

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  const countryName = country?.split("-")
  .map((w: string) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
  return {
    title: `${countryName} Salary Information`,
    description: `Explore salary records for jobs in ${countryName}.`,
    alternates: { canonical: `/${country}` },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  const countryData = await optimizedDataAccess.getCountryData(country);
  const countryDisplayName = country?.split("-")
      .map((w: string) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
        .join(" ");
  if (!countryData) notFound();

  return (
    <main>
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