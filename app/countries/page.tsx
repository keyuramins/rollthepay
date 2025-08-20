import { Metadata } from "next";
import { getDataset } from "@/lib/data/parse";
import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { CountriesHeroSection } from "@/components/countries/hero-section";
import { ContinentSection } from "@/components/countries/continent-section";
import { GlobalStats } from "@/components/countries/global-stats";

export const revalidate = 31536000;
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Countries - RollThePay",
  description: "Explore salary information by country. Find accurate salary data for jobs across different countries and regions.",
  alternates: {
    canonical: "/countries",
  },
};

const CONTINENTS = [
  { name: "Africa", code: "africa", description: "Salary data from African countries" },
  { name: "Asia", code: "asia", description: "Salary information across Asian markets" },
  { name: "Europe", code: "europe", description: "European salary data and compensation trends" },
  { name: "Middle East", code: "middle_east", description: "Middle Eastern salary insights" },
  { name: "North America", code: "north_america", description: "North American salary data" },
  { name: "Oceania", code: "oceania", description: "Oceania salary information and trends" },
  { name: "South America", code: "south_america", description: "South American salary data" },
];

export default function CountriesPage() {
  const { all, byCountry } = getDataset();
  
  // Get unique countries from data
  const countryStats = Array.from(byCountry.keys()).map(country => ({
    name: country,
    slug: country,
    count: byCountry.get(country)?.length || 0,
    avgSalary: (byCountry.get(country)?.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) || 0) / (byCountry.get(country)?.length || 1),
  }));

  // Group countries by continent (simplified mapping)
  const continentMapping: Record<string, string> = {
    "australia": "oceania",
    "india": "asia",
    "united states": "north_america",
    "united kingdom": "europe",
    "canada": "north_america",
    "germany": "europe",
    "france": "europe",
    "japan": "asia",
    "brazil": "south_america",
    "south africa": "africa",
  };

  const groupedCountries = CONTINENTS.map(continent => ({
    ...continent,
    countries: countryStats.filter(country => 
      continentMapping[country.name.toLowerCase()] === continent.code
    )
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <NewHeader />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs
              breadcrumbs={[
                { name: "Home", href: "/" },
                { name: "Countries", href: "#", current: true },
              ]}
            />
          </div>
        </div>
        
        <CountriesHeroSection countryCount={countryStats.length} />
        
        {/* Countries by Continent */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {groupedCountries.map((continent) => (
              <ContinentSection key={continent.code} continent={continent} />
            ))}
          </div>
        </section>

        <GlobalStats 
          totalRecords={all.length}
          countryCount={countryStats.length}
          continentCount={CONTINENTS.length}
        />
      </main>
    </div>
  );
}
