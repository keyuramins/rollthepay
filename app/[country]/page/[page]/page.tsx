import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountryHeroSection } from "@/components/country/hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { StatesGrid } from "@/components/country/states-grid";
import { CountryCTASection } from "@/components/country/cta-section";
import { 
  getOccupationsForCountryCursor,
  getCountryData,
  getAllStates,
  getAvailableLettersForCountry
} from "@/lib/db/queries";
import { rememberNextCursor, resolveCursorForPage } from "@/lib/db/cursor-registry";

export const routeSegmentConfig = { revalidate: 31536000 };
export const fetchCache = 'force-cache';

interface CountryPagedPageProps {
  params: Promise<{ country: string; page: string }>;
  searchParams: Promise<{ q?: string; letter?: string }>;
}

export async function generateMetadata({ params, searchParams }: CountryPagedPageProps): Promise<Metadata> {
  const { country, page } = await params;
  const { q, letter } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  
  const countryData = await getCountryData(country);
  if (!countryData) {
    return { title: "Country Not Found", description: "No data available." };
  }
  
  const countryName = countryData.countryName;
  
  let title = `${countryName} Salary Information`;
  let description = `Explore salary records for jobs in ${countryName}.`;
  
  if (q) {
    title = `Search Results for "${q}" in ${countryName}`;
    description = `Salary data and job opportunities matching "${q}" in ${countryName}.`;
  } else if (letter) {
    title = `${countryName} Jobs Starting with "${letter.toUpperCase()}"`;
    description = `Browse ${countryName} occupations starting with the letter "${letter.toUpperCase()}".`;
  }
  
  // Page 1 canonical should be base route without /page/1
  const canonical = pageNum === 1 
    ? `/${country}` 
    : `/${country}/page/${pageNum}`;
  
  return {
    title,
    description,
    alternates: { canonical },
  };
}

export default async function CountryPagedPage({ params, searchParams }: CountryPagedPageProps) {
  const { country, page } = await params;
  const { q, letter } = await searchParams;
  
  const pageNum = Math.max(1, Number(page) || 1);
  const searchQuery = typeof q === 'string' ? q.trim().slice(0, 100) : undefined;
  const letterFilter = typeof letter === 'string' && letter.trim().length === 1 
    ? letter.trim().toLowerCase() 
    : undefined;
  
  // Get country data
  const countryData = await getCountryData(country);
  if (!countryData) {
    notFound();
  }
  
  const countryName = countryData.countryName;
  
  // Fetch paginated occupations and total count
  const limit = 50;

  const [cursorResolution, states, availableLetters] = await Promise.all([
    resolveCursorForPage(
      {
        country,
        limit,
        searchQuery,
        letterFilter,
      },
      pageNum,
      (pageCursor) =>
        getOccupationsForCountryCursor({
          country,
          q: searchQuery,
          letter: letterFilter,
          limit,
          cursor: pageCursor,
        })
    ),
    getAllStates(country),
    getAvailableLettersForCountry({ country, q: searchQuery }),
  ]);

  if (pageNum > 1 && !cursorResolution.available) {
    notFound();
  }

  const { items, nextCursor } = await getOccupationsForCountryCursor({
    country,
    q: searchQuery,
    letter: letterFilter,
    limit,
    cursor: cursorResolution.cursor,
  });

  rememberNextCursor(
    { country, limit, searchQuery, letterFilter },
    pageNum,
    nextCursor
  );

  const hasNextPage = Boolean(nextCursor);
  const basePath = `/${country}`;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    pageNum > 1 ? { name: `Page ${pageNum}`, href: "#", current: true } : null,
  ].filter(Boolean) as Array<{ name: string; href: string; current?: boolean }>;
  
  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      
      <CountryHeroSection
        countryName={countryName}
        totalJobs={countryData.totalJobs}
      />

      <OccupationList 
        items={items}
        title="Explore Salaries by Occupation"
        description="Browse salary information organized by respective categories and specializations."
        countrySlug={country}
        currentPage={pageNum}
        totalPages={hasNextPage ? pageNum + 1 : pageNum}
        totalItems={items.length}
        searchQuery={searchQuery}
        letterFilter={letterFilter}
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
