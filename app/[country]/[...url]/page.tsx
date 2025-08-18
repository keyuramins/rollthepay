import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset, findRecordByPath } from "@/lib/data/parse";
import { Header } from "@/components/navigation/header";
import { formatCurrency, formatHourlyRate } from "@/lib/format/currency";
import { StateHeroSection } from "@/components/state/state-hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { OccupationHeroSection } from "@/components/occupation/hero-section";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { SalaryRangeCard } from "@/components/occupation/salary-range-card";
import { HourlyRateCard } from "@/components/occupation/hourly-rate-card";
import { ExperienceLevelsSection } from "@/components/occupation/experience-levels-section";
import { OccupationCTASection } from "@/components/occupation/cta-section";
import { ComprehensiveStats } from "@/components/ui/comprehensive-stats";
import { SalaryDistributionChart } from "@/components/ui/salary-distribution-chart";
import { SkillsChart } from "@/components/ui/skills-chart";
import { ExperienceTimelineChart } from "@/components/ui/experience-timeline-chart";
import { SalaryBreakdownTable } from "@/components/ui/salary-breakdown-table";

export const revalidate = 31536000; // 1 year
export const dynamicParams = false; // Guarantee static paths only

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

// Generate static params for all possible routes
export async function generateStaticParams() {
  const { all } = getDataset();
  const params: { country: string; url: string[] }[] = [];
  
  // Group records by country
  const countryGroups = new Map<string, any[]>();
  for (const record of all) {
    const country = record.country.toLowerCase();
    if (!countryGroups.has(country)) {
      countryGroups.set(country, []);
    }
    countryGroups.get(country)!.push(record);
  }
  
  // Generate params for each country
  for (const [country, records] of countryGroups) {
    // Add country-level occupation pages: /[country]/[slug]
    for (const record of records) {
      if (!record.state) {
        params.push({
          country,
          url: [record.slug_url]
        });
      }
    }
    
    // Add state-level occupation pages: /[country]/[state]/[slug]
    for (const record of records) {
      if (record.state) {
        params.push({
          country,
          url: [normalizeStateName(record.state), record.slug_url]
        });
      }
    }
    
    // Add state pages: /[country]/[state]
    const stateGroups = getStateData(country);
    for (const [stateKey] of stateGroups) {
      params.push({
        country,
        url: [stateKey]
      });
    }
  }
  
  return params;
}

// Helper function to remove "Average" from titles
function cleanTitle(title: string): string {
  return title.replace(/^Average\s+/i, '').replace(/\s+Salary\s+in\s+Australia$/i, '');
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
      const title = cleanTitle(record.title);
      const occupation = record.occupation;
      const location = record.location;
      
      const metaTitle = `${title} in ${countryName} - Roll The Pay`;
      const metaDescription = `Discover comprehensive salary information for ${title} in ${location ? location + ', ' : ''}${countryName}. Get detailed compensation data, salary ranges, experience levels, skills analysis, and career insights.`;
      
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
    const title = cleanTitle(record.title);
    
    const metaTitle = `${title} in ${stateName}, ${countryName} - Roll The Pay`;
    const metaDescription = `Discover comprehensive salary information for ${title} in ${stateName}, ${countryName}. Get detailed compensation data, salary ranges, experience levels, skills analysis, and career insights.`;
    
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
        {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
        
        <StateHeroSection 
          stateName={stateName}
          countryName={countryName}
          jobCount={jobs.length}
        />

        <OccupationList 
          items={jobs.map(job => ({
            id: job.slug,
            displayName: job.title || "Unknown Job",
            originalName: job.title || "Unknown Job",
            slug_url: job.slug,
            location: undefined,
            state: undefined,
            avgAnnualSalary: job.avgAnnualSalary,
            countrySlug: country
          }))}
          title={`Salary Records in ${stateName}`}
          description={`Explore salary information and job opportunities in ${stateName}, ${countryName}.`}
          currentState={normalizeStateName(stateName)}
        />

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
                  View All Salary Data in {countryName}
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
  const title = cleanTitle(record.title);
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

  // Salary breakdown table data
  const salaryBreakdownData = [
    { period: 'Weekly', amount: record.weeklySalary ? `$${record.weeklySalary.toLocaleString()}` : 'N/A', description: 'Gross weekly salary' },
    { period: 'Fortnightly', amount: record.fortnightlySalary ? `$${record.fortnightlySalary.toLocaleString()}` : 'N/A', description: 'Gross fortnightly salary' },
    { period: 'Monthly', amount: record.monthlySalary ? `$${record.monthlySalary.toLocaleString()}` : 'N/A', description: 'Gross monthly salary', highlight: true },
    { period: 'Annual', amount: record.avgAnnualSalary ? `$${record.avgAnnualSalary.toLocaleString()}` : 'N/A', description: 'Gross annual salary', highlight: true },
  ].filter(row => row.amount !== 'N/A');

  // Chart data preparation
  const salaryDistributionData = [
    { name: 'Low', value: record.lowSalary || 0, color: '#EF4444' },
    { name: 'Average', value: record.avgAnnualSalary || 0, color: '#10B981' },
    { name: 'High', value: record.highSalary || 0, color: '#3B82F6' },
  ];

  const skillsData = [
    { name: record.skillsNameOne, value: record.skillsNamePercOne || 0, color: '#0088FE' },
    { name: record.skillsNameTwo, value: record.skillsNamePercTwo || 0, color: '#00C49F' },
    { name: record.skillsNameThree, value: record.skillsNamePercThree || 0, color: '#FFBB28' },
    { name: record.skillsNameFour, value: record.skillsNamePercFour || 0, color: '#FF8042' },
    { name: record.skillsNameFive, value: record.skillsNamePercFive || 0, color: '#8884D8' },
  ].filter(skill => skill.name && skill.name !== '#REF!' && skill.value > 0)
    .map(skill => ({ name: skill.name!, value: skill.value, color: skill.color }));

  const experienceTimelineData = experienceLevels.map(level => ({
    name: level.label,
    value: level.value || 0,
    color: level.color
  }));
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
        
        <OccupationHeroSection 
          title={title}
          subtitle={`Comprehensive salary information for ${occupation || 'this position'} in ${locationText}`}
          avgSalary={record.avgAnnualSalary ? formatCurrency(record.avgAnnualSalary, country, record) : undefined}
        />

        {/* Comprehensive Statistics */}
        <section className="py-16 pt-4 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ComprehensiveStats record={record} country={country} />
          </div>
        </section>

        {/* Traditional Salary Cards */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Annual Salary Details */}
              <SalaryRangeCard 
                lowSalary={record.lowSalary ? formatCurrency(record.lowSalary, country, record) : undefined}
                highSalary={record.highSalary ? formatCurrency(record.highSalary, country, record) : undefined}
                avgSalary={record.avgAnnualSalary ? formatCurrency(record.avgAnnualSalary, country, record) : undefined}
              />

              {/* Hourly Rate Details */}
              {hasHourlyData && (
                <HourlyRateCard 
                  avgHourlyRate={record.avgHourlySalary ? formatHourlyRate(record.avgHourlySalary, country) : undefined}
                  lowHourlyRate={record.hourlyLowValue ? formatHourlyRate(record.hourlyLowValue, country) : undefined}
                  highHourlyRate={record.hourlyHighValue ? formatHourlyRate(record.hourlyHighValue, country) : undefined}
                />
              )}
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                Salary Analysis & Insights
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
                Visual breakdown of salary data, skills analysis, and experience progression
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Salary Distribution Chart */}
              <SalaryDistributionChart 
                data={salaryDistributionData}
                title="Salary Distribution"
                subtitle="Annual salary ranges for this position"
              />

              {/* Skills Chart */}
              {skillsData.length > 0 && (
                <SkillsChart 
                  data={skillsData}
                  title="Top Skills & Proficiency"
                  subtitle="Most valued skills and their importance"
                />
              )}
            </div>

            {/* Experience Timeline Chart */}
            {experienceTimelineData.length > 0 && (
              <div className="mb-12">
                <ExperienceTimelineChart 
                  data={experienceTimelineData}
                  title="Salary Progression by Experience Level"
                  subtitle="How salaries increase with career progression"
                />
              </div>
            )}

            {/* Salary Breakdown Table */}
            {salaryBreakdownData.length > 0 && (
              <div className="mb-12">
                <SalaryBreakdownTable 
                  data={salaryBreakdownData}
                  title="Salary Breakdown by Period"
                  subtitle="Detailed breakdown of compensation across different time periods"
                />
              </div>
            )}
          </div>
        </section>

        {/* Experience Levels */}
        {/* <ExperienceLevelsSection 
          experienceLevels={experienceLevels.map(level => ({
            label: level.label,
            value: formatCurrency(level.value || null, country, record),
            color: level.color
          }))}
        /> */}

        <OccupationCTASection 
          countryName={countryName}
          locationText={locationText}
        />
      </main>
    </div>
  );
}
