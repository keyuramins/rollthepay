import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "./breadcrumbs";
import { OccupationHeroSection } from "./hero-section";
import { ComprehensiveStats } from "@/components/ui/comprehensive-stats";
import { SalaryDistributionChart } from "@/components/ui/salary-distribution-chart";
import { SkillsChart } from "@/components/ui/skills-chart";
import { ExperienceTimelineChart } from "@/components/ui/experience-timeline-chart";
import { OccupationCTASection } from "./cta-section";
import { formatCurrency, formatHourlyRate } from "@/lib/format/currency";
import { findRecordByPath } from "@/lib/data/parse";
import type { OccupationRecord } from "@/lib/data/types";

interface OccupationPageProps {
  country: string;
  state?: string;
  slug: string;
}

export function OccupationPage({ country, state, slug }: OccupationPageProps) {
  const record = findRecordByPath({ country, state, slug });
  
  if (!record) {
    return null; // This should be handled by the parent component
  }
  
  const countryName = record.country;
  const stateName = record.state;
  const title = record.title || record.h1Title || record.occupation || record.slug_url;
  const occupation = record.occupation;
  const location = record.location;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    ...(stateName ? [{ name: stateName, href: `/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}` }] : []),
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

  // Salary breakdown moved to ComprehensiveStats component

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
      <NewHeader />
      
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
          occupation={record.occupation || undefined}
        />

        {/* Comprehensive Statistics */}
        <section className="py-16 pt-4 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ComprehensiveStats record={record} country={country} />
          </div>
        </section>

        {/* Total Pay Information */}

        <OccupationCTASection 
          countryName={countryName}
          locationText={locationText}
        />
      </main>
    </div>
  );
}


