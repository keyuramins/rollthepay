import { Header } from "@/components/navigation/header";
import { Breadcrumbs } from "./breadcrumbs";
import { OccupationHeroSection } from "./hero-section";
import { CompensationAnalysis } from "./compensation-analysis";
import { SalaryPercentilesChart } from "./salary-percentiles-chart";
import { ExperienceLevelSalariesChart } from "./experience-level-salaries-chart";
import { TopSkillsMarketDemand } from "./top-skills-market-demand";
import { RelatedOpportunitiesSmart } from "./related-opportunities-smart";
import { GenderComparison } from "./gender-comparison";
import { OccupationCTASection } from "./cta-section";
import { DataOverviewSection } from "./data-overview-section";
import { ContentSections } from "./content-sections";
import { findRecordByPath, getDataset } from "@/lib/data/parse";
import { RelatedOpportunitiesSimple } from "./related-opportunities-simple";

interface OccupationPageProps {
  country: string;
  state?: string;
  location?: string;
  slug: string;
}

export async function OccupationPage({ country, state, location, slug }: OccupationPageProps) {
  const record = await findRecordByPath({ country, state, location, slug });
  
  if (!record) {
    return null;
  }
  
  const countryName = record.country;
  const stateName = record.state;
  const locationName = record.location;
  const title = record.title || record.h1Title || record.occupation || record.slug_url;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    ...(stateName ? [{ name: stateName, href: `/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    ...(locationName ? [{ name: locationName, href: `/${country}/${stateName?.toLowerCase().replace(/\s+/g, '-')}/${locationName.toLowerCase().replace(/\s+/g, '-')}` }] : []),
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
    `${locationName ? locationName + ', ' : ''}${stateName}, ${countryName}` : 
    `${locationName ? locationName + ', ' : ''}${countryName}`;

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
    <section>
      <Header allOccupations={(await getDataset()).all.map(rec => ({
        country: rec.country.toLowerCase(),
        title: rec.title || rec.h1Title || "",
        slug: rec.slug_url,
        state: rec.state ? rec.state : null,
        location: rec.location ? rec.location : null,
      }))} />
      
      <main>
        <OccupationHeroSection record={record} country={country} locationText={locationText} />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <CompensationAnalysis record={record} country={country} />
        <GenderComparison record={record} />
        <SalaryPercentilesChart record={record} country={country} />
        <ExperienceLevelSalariesChart record={record} country={country} />
        <TopSkillsMarketDemand record={record} />
        <RelatedOpportunitiesSmart record={record} allRecords={(await getDataset()).all} />
        <RelatedOpportunitiesSimple 
          content={undefined} 
          record={record} 
          allOccupations={(await getDataset()).all.map(rec => ({
            country: rec.country.toLowerCase(),
            title: rec.title || rec.h1Title || "",
            slug: rec.slug_url,
            state: rec.state ? rec.state : null,
            location: rec.location ? rec.location : null,
          }))} 
        />

        {/* Data Overview Section */}
        {/* <DataOverviewSection record={record} country={country} /> */}

        <OccupationCTASection countryName={countryName} locationText={locationText} record={record} />
      </main>
    </section>
  );
}