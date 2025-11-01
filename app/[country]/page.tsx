import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";
import { 
  getAllCountries,
  getCountryData,
  getOccupationsForCountryCursor,
  getAllStates,
  getAvailableLettersForCountry
} from "@/lib/db/queries";
import { rememberNextCursor } from "@/lib/db/cursor-registry";
import { slugify } from "@/lib/format/slug";

export const routeSegmentConfig = { revalidate: 31536000 };
export const fetchCache = 'force-cache';

export async function generateStaticParams() {
  const countries = await getAllCountries();
  return countries.map((country) => ({
    country: slugify(country),
  }));
}

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;
  return {
    title: `${countryName} Salary Information`,
    description: `Explore salary records for jobs in ${countryName}.`,
    alternates: { canonical: `/${country}` },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  const countryData = await getCountryData(country);
  
  if (!countryData) {
    notFound();
  }
  
  const countryName = countryData.countryName;
  
  // Fetch first 50 occupations with cursor pagination (no cursor on first page)
  const limit = 50;
  const [{ items: occupationItems, nextCursor }, states, availableLetters] = await Promise.all([
    getOccupationsForCountryCursor({ country, limit }),
    getAllStates(country),
    getAvailableLettersForCountry({ country }),
  ]);
  const basePath = `/${country}`;
  const hasNextPage = Boolean(nextCursor);

  rememberNextCursor(
    { country, limit },
    1,
    nextCursor
  );

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: countryName, href: "#", current: true },
        ]}
      />
      <CountryHeroSection
        countryName={countryName}
        totalJobs={countryData.totalJobs}
      />

      <OccupationList
        items={occupationItems}
        title="Explore Salaries by Occupation"
        description="Browse salary information organized by respective categories and specializations."
        countrySlug={country}
        currentPage={1}
        totalPages={hasNextPage ? 2 : 1}
        totalItems={occupationItems.length}
        basePath={basePath}
        hasNextPage={hasNextPage}
        availableLetters={availableLetters}
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
  );
}