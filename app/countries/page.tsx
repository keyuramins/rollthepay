import { Metadata } from "next";
import Link from "next/link";
import { getDataset } from "@/lib/data/parse";
import { Header } from "@/components/navigation/header";

export const revalidate = 31536000;
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Countries - Roll The Pay",
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
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Explore Salaries by Country
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                Discover accurate salary information for jobs across different countries and regions. 
                Find the data you need to make informed career decisions.
              </p>
              <div className="mt-8">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span className="mr-2">🌍</span>
                  {countryStats.length} Countries Available
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Countries by Continent */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {groupedCountries.map((continent) => (
              <div key={continent.code} className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{continent.name}</h2>
                  <p className="text-lg text-gray-600">{continent.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {continent.countries.map((country) => (
                    <Link
                      key={country.slug}
                      href={`/${country.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="capitalize text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {country.name}
                          </h3>
                          <div className="text-sm text-gray-500">
                            {country.count} jobs
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Average Salary:</span>
                            <span className="font-medium text-gray-900">
                              {country.avgSalary > 0 
                                ? new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                  }).format(country.avgSalary)
                                : 'N/A'
                              }
                            </span>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-100">
                            <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                              View Details →
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {continent.countries.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">📊</div>
                    <p className="text-gray-500">No salary data available for this region yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Check back soon for updates!</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Global Stats */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Global Salary Data Overview
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive salary information from thousands of employers worldwide, 
                helping you understand compensation trends across different markets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {all.length.toLocaleString()}+
                </div>
                <div className="text-lg text-gray-600">Total Salary Records</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {countryStats.length}
                </div>
                <div className="text-lg text-gray-600">Countries Covered</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {CONTINENTS.length}
                </div>
                <div className="text-lg text-gray-600">Continents Represented</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
