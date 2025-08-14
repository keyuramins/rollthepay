import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset, findRecordByPath } from "@/lib/data/parse";
import { Header } from "@/components/navigation/header";
import { formatCurrency, formatHourlyRate } from "@/lib/format/currency";

export const revalidate = 31536000; // 1 year
export const dynamicParams = true; // Allow dynamic generation

interface UnifiedPageProps {
  params: Promise<{ country: string; url: string[] }>;
}

// Helper function to normalize state names for URL matching
function normalizeStateName(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to denormalize state names (convert back from URL format)
function denormalizeStateName(normalizedState: string): string {
  // Convert back from URL format: lowercase-hyphenated -> Proper Case with Spaces
  return normalizedState
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

// Helper function to group records by state
function getStateData(country: string) {
  const { all } = getDataset();
  const countryRecords = all.filter(record => 
    record.country.toLowerCase() === country.toLowerCase()
  );
  
  const stateGroups = new Map<string, { name: string; jobs: any[] }>();
  
  for (const record of countryRecords) {
    if (record.state) {
      const stateKey = normalizeStateName(record.state);
      if (!stateGroups.has(stateKey)) {
        stateGroups.set(stateKey, {
          name: record.state,
          jobs: []
        });
      }
      
      stateGroups.get(stateKey)!.jobs.push({
        slug: record.slug_url,
        title: record.title,
        occupation: record.occupation,
        avgAnnualSalary: record.avgAnnualSalary,
        avgHourlySalary: record.avgHourlySalary
      });
    }
  }
  
  return stateGroups;
}

export async function generateMetadata({ params }: UnifiedPageProps): Promise<Metadata> {
  const { country, url } = await params;
  
  if (url.length === 1) {
    const stateOrSlug = url[0];
    const stateGroups = getStateData(country);
    const stateData = stateGroups.get(stateOrSlug);
    
    if (stateData) {
      // It's a state page
      const countryName = getDataset().all.find(r => r.country.toLowerCase() === country)?.country || country;
      const stateName = stateData.name;
      
      const metaTitle = `${stateName} Salary Data - Roll The Pay`;
      const metaDescription = `Explore salary information and job opportunities in ${stateName}, ${countryName}. Get comprehensive compensation data for various occupations.`;
      
      return {
        title: metaTitle,
        description: metaDescription,
        alternates: {
          canonical: `/${country}/${stateOrSlug}`,
        },
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          type: "website",
          url: `/${country}/${stateOrSlug}`,
        },
      };
    } else {
      // It's a country-level occupation page
      const record = findRecordByPath({ country, slug: stateOrSlug });
      if (!record) {
        return { title: "Occupation Not Found - Roll The Pay" };
      }
      
      const countryName = record.country;
      const title = record.title;
      const occupation = record.occupation;
      const location = record.location;
      
      const metaTitle = `${title} in ${countryName} - Roll The Pay`;
      const metaDescription = `Discover salary information for ${title} in ${location ? location + ', ' : ''}${countryName}. Get accurate compensation data, salary ranges, and career insights.`;
      
      return {
        title: metaTitle,
        description: metaDescription,
        alternates: {
          canonical: `/${country}/${stateOrSlug}`,
        },
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          type: "website",
          url: `/${country}/${stateOrSlug}`,
        },
      };
    }
  } else if (url.length === 2) {
    // This is a state-level occupation page
    const [state, slug] = url;
    const record = findRecordByPath({ country, state: denormalizeStateName(state), slug });
    
    if (!record) {
      return { title: "Occupation Not Found - Roll The Pay" };
    }
    
    const countryName = record.country;
    const stateName = record.state;
    const title = record.title;
    
    const metaTitle = `${title} in ${stateName}, ${countryName} - Roll The Pay`;
    const metaDescription = `Discover salary information for ${title} in ${stateName}, ${countryName}. Get accurate compensation data, salary ranges, and career insights.`;
    
    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: `/${country}/${state}/${slug}`,
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: "website",
        url: `/${country}/${state}/${slug}`,
      },
    };
  } else {
    return { title: "Page Not Found - Roll The Pay" };
  }
}

export default async function UnifiedPage({ params }: UnifiedPageProps) {
  const { country, url } = await params;
  
  // Determine the page type based on URL structure
  if (url.length === 1) {
    // This could be either a state page OR a country-level occupation page
    // We need to check if it's a valid state first
    const stateGroups = getStateData(country);
    const stateData = stateGroups.get(url[0]);
    
    if (stateData) {
      // This is a state page: /[country]/[state]
      return <StatePage country={country} state={url[0]} />;
    } else {
      // This is a country-level occupation page: /[country]/[slug]
      return <OccupationPage country={country} slug={url[0]} />;
    }
  } else if (url.length === 2) {
    // This is a state-level occupation page: /[country]/[state]/[slug]
    return <OccupationPage country={country} state={denormalizeStateName(url[0])} slug={url[1]} />;
  } else {
    notFound(); // Invalid URL structure
  }
}

// State Page Component
function StatePage({ country, state }: { country: string; state: string }) {
  const stateGroups = getStateData(country);
  const stateData = stateGroups.get(state);
  
  if (!stateData) {
    notFound();
  }
  
  const countryName = getDataset().all.find(r => r.country.toLowerCase() === country)?.country || country;
  const stateName = stateData.name;
  const jobs = stateData.jobs;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Countries", href: "/countries" },
    { name: countryName, href: `/${country}` },
    { name: stateName, href: "#", current: true },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.name}>
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-gray-500">{breadcrumb.name}</span>
                      ) : (
                        <Link
                          href={breadcrumb.href}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {breadcrumb.name}
                        </Link>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <span className="ml-4 text-gray-400">→</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {stateName} Salary Data
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                Explore salary information and job opportunities in {stateName}, {countryName}
              </p>
              
              <div className="mt-8">
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-lg font-medium">
                  <span className="mr-2">💼</span>
                  {jobs.length} Job Categories Available
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Job Categories in {stateName}
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job: any) => (
                <Link
                  key={job.slug}
                  href={`/${country}/${state}/${job.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {job.occupation || 'Professional role'}
                    </p>
                    
                    {job.avgAnnualSalary && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Average Salary</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(job.avgAnnualSalary, country, job)}
                        </span>
                      </div>
                    )}
                    
                    {job.avgHourlySalary && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">Hourly Rate</span>
                        <span className="text-sm font-medium text-blue-600">
                          {formatHourlyRate(job.avgHourlySalary, country)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Explore More Salary Data
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Compare salaries across different locations and discover career opportunities 
              in {stateName}, {countryName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${country}`}>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  View All Jobs in {countryName}
                </button>
              </Link>
              <Link href="/countries">
                <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Browse All Countries
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Occupation Page Component
function OccupationPage({ country, state, slug }: { country: string; state?: string; slug: string }) {
  const record = findRecordByPath({ country, state, slug });
  
  if (!record) {
    notFound();
  }
  
  const countryName = record.country;
  const stateName = record.state;
  const title = record.title;
  const occupation = record.occupation;
  const location = record.location;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Countries", href: "/countries" },
    { name: countryName, href: `/${country}` },
    ...(stateName ? [{ name: stateName, href: `/${country}/${normalizeStateName(stateName)}` }] : []),
    { name: title, href: "#", current: true },
  ];
  
  // Experience level data
  const experienceLevels = [
    { label: "Entry Level", value: record.entryLevel, color: "blue" },
    { label: "Early Career", value: record.earlyCareer, color: "green" },
    { label: "Mid Career", value: record.midCareer, color: "yellow" },
    { label: "Experienced", value: record.experienced, color: "orange" },
    { label: "Late Career", value: record.lateCareer, color: "red" },
  ].filter(level => level.value != null);
  
  // Salary ranges
  const hasSalaryRange = record.lowSalary && record.highSalary;
  const hasHourlyData = record.avgHourlySalary || record.hourlyLowValue || record.hourlyHighValue;
  
  const locationText = stateName ? 
    `${location ? location + ', ' : ''}${stateName}, ${countryName}` : 
    `${location ? location + ', ' : ''}${countryName}`;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.name}>
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-gray-500">{breadcrumb.name}</span>
                      ) : (
                        <Link
                          href={breadcrumb.href}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {breadcrumb.name}
                        </Link>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <span className="ml-4 text-gray-400">→</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {title}
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                Salary information for {occupation || 'this position'} in {locationText}
              </p>
              
              {record.avgAnnualSalary && (
                <div className="mt-8">
                  <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full text-lg font-medium">
                    <span className="mr-2">💰</span>
                    Average Annual Salary: {formatCurrency(record.avgAnnualSalary, country, record)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Salary Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Annual Salary Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Annual Salary Information</h2>
                
                {hasSalaryRange && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Low Range</span>
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(record.lowSalary, country, record)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">High Range</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(record.highSalary, country, record)}
                      </span>
                    </div>
                  </div>
                )}
                
                {record.avgAnnualSalary && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(record.avgAnnualSalary, country, record)}
                      </div>
                      <div className="text-sm text-blue-600">Average Annual Salary</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hourly Rate Details */}
              {hasHourlyData && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Hourly Rate Information</h2>
                  
                  {record.avgHourlySalary && (
                    <div className="p-4 bg-green-50 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {formatHourlyRate(record.avgHourlySalary, country)}
                        </div>
                        <div className="text-sm text-green-600">Average Hourly Rate</div>
                      </div>
                    </div>
                  )}
                  
                  {(record.hourlyLowValue || record.hourlyHighValue) && (
                    <div className="space-y-3">
                      {record.hourlyLowValue && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Low Hourly</span>
                          <span className="font-medium text-red-600">
                            {formatHourlyRate(record.hourlyLowValue, country)}
                          </span>
                        </div>
                      )}
                      {record.hourlyHighValue && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">High Hourly</span>
                          <span className="font-medium text-green-600">
                            {formatHourlyRate(record.hourlyHighValue, country)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Experience Levels */}
        {experienceLevels.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Salary by Experience Level
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {experienceLevels.map((level) => (
                  <div key={level.label} className="bg-gray-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{level.label}</h3>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(level.value || null, country, record)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Explore More Salary Data
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Compare salaries across different locations and discover career opportunities 
              in {locationText}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${country}`}>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  View All Jobs in {countryName}
                </button>
              </Link>
              <Link href="/countries">
                <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Browse All Countries
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
