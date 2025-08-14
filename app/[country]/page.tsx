import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset } from "@/lib/data/parse";
import { Header } from "@/components/navigation/header";
import { formatCurrency } from "@/lib/format/currency";

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
  const states = Array.from(new Set(countryData.map(rec => rec.state).filter(Boolean)));
  
  // Group by occupation category
  const occupationGroups = countryData.reduce((groups, record) => {
    const occupation = record.occupation || "Other";
    if (!groups[occupation]) {
      groups[occupation] = [];
    }
    groups[occupation].push(record);
    return groups;
  }, {} as Record<string, typeof countryData>);

  // Sort occupations by number of records
  const sortedOccupations = Object.entries(occupationGroups)
    .sort(([, a], [, b]) => b.length - a.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-4">
                <Link 
                  href="/countries" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Back to Countries
                </Link>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Salary Information in {countryName}
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                Discover accurate salary data for {totalJobs}+ jobs across {countryName}. 
                Get the compensation insights you need to advance your career.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span className="mr-2">💼</span>
                  {totalJobs} Jobs Available
                </div>
                {avgSalary > 0 && (
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <span className="mr-2">💰</span>
                                         Avg: {formatCurrency(avgSalary, countryLower, undefined)}
                  </div>
                )}
                {states.length > 0 && (
                  <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    <span className="mr-2">📍</span>
                    {states.length} States/Regions
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Occupation Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore Jobs by Category
              </h2>
              <p className="text-lg text-gray-600">
                Browse salary information organized by job categories and specializations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {sortedOccupations.map(([occupation, records]) => {
                const occupationAvgSalary = records.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) / records.length;
                const hasStates = records.some(rec => rec.state);
                
                return (
                  <div key={occupation} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{occupation}</h3>
                      <div className="text-sm text-gray-500">
                        {records.length} {records.length === 1 ? 'job' : 'jobs'}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                                                 {occupationAvgSalary > 0 && (
                             <div className="flex justify-between text-sm">
                               <span className="text-gray-600">Average Salary:</span>
                               <span className="font-medium text-gray-900">
                                 {formatCurrency(occupationAvgSalary, countryLower, undefined)}
                               </span>
                             </div>
                           )}
                      
                      <div className="pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 gap-3">
                          {records.slice(0, 5).map((record) => (
                            <Link
                              key={record.slug_url}
                              href={`/${countryLower}${record.state ? `/${record.state.toLowerCase().replace(/\s+/g, '-')}` : ''}/${record.slug_url}`}
                              className="block p-3 rounded-md border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {record.title}
                                  </h4>
                                  {record.location && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      📍 {record.location}
                                      {record.state && `, ${record.state}`}
                                    </p>
                                  )}
                                </div>
                                {record.avgAnnualSalary && (
                                  <div className="text-sm font-medium text-gray-900 ml-4">
                                    {formatCurrency(record.avgAnnualSalary, countryLower, record)}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                          
                          {records.length > 5 && (
                            <div className="text-center pt-2">
                              <Link
                                href={`/${countryLower}?occupation=${encodeURIComponent(occupation)}`}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View all {records.length} {occupation} jobs →
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* States/Regions Section */}
        {states.length > 0 && (
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Explore by State/Region
                </h2>
                <p className="text-lg text-gray-600">
                  Find salary data specific to different regions within {countryName}.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {states.map((state) => {
                  const stateRecords = countryData.filter(rec => rec.state === state);
                  const stateAvgSalary = stateRecords.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) / stateRecords.length;
                  
                  return (
                                         <Link
                       key={state}
                       href={`/${countryLower}/${state?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                       className="block group"
                     >
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {state}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Jobs:</span>
                            <span className="font-medium text-gray-900">{stateRecords.length}</span>
                          </div>
                                                     {stateAvgSalary > 0 && (
                             <div className="flex justify-between">
                               <span className="text-gray-600">Avg Salary:</span>
                               <span className="font-medium text-gray-900">
                                 {formatCurrency(stateAvgSalary, countryLower, undefined)}
                               </span>
                             </div>
                         )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Explore More Salary Data?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover salary information for specific jobs, compare compensation across regions, 
              and get the insights you need to advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/countries">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Browse All Countries
                </button>
              </Link>
              <Link href="/">
                <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
