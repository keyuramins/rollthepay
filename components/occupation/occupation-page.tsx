import { Breadcrumbs } from "./breadcrumbs";
import { OccupationHeroSection } from "./hero-section";
import { CompensationAnalysis } from "./compensation-analysis";
import { SalaryPercentilesChart } from "./salary-percentiles-chart";
import { ExperienceLevelSalariesChart } from "./experience-level-salaries-chart";
import { TopSkillsMarketDemand } from "./top-skills-market-demand";
import { RelatedOpportunitiesSmart } from "./related-opportunities-smart";
import { GenderComparison } from "./gender-comparison";
import { OccupationCTASection } from "./cta-section";
import { findRecordByPath, getDataset } from "@/lib/data/parse";
import { RelatedOpportunitiesSimple } from "./related-opportunities-simple";
import { formatLocationString } from "@/lib/utils/title-cleaner";

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
  
  const locationText = formatLocationString(locationName || undefined, stateName || undefined, countryName || undefined);
  
  return (
    <>
      <main>
        <OccupationHeroSection record={record} country={country} locationText={locationText} />
        <Breadcrumbs breadcrumbs={breadcrumbs} />  
        <CompensationAnalysis record={record} country={country} location={location} />
        <GenderComparison record={record} />
        <SalaryPercentilesChart record={record} country={country} />
        <ExperienceLevelSalariesChart record={record} country={country} />
        <TopSkillsMarketDemand record={record} />
        <RelatedOpportunitiesSmart record={record} allRecords={(await getDataset()).all} />
        <RelatedOpportunitiesSimple 
          record={record} 
          allOccupations={(await getDataset()).all.map(rec => ({
            country: rec.country.toLowerCase(),
            title: rec.title || rec.h1Title || "",
            slug: rec.slug_url,
            state: rec.state ? rec.state : null,
            location: rec.location ? rec.location : null,
          }))} 
        />

        <OccupationCTASection countryName={countryName} locationText={locationText} record={record} />
      </main>
    </>
  );
}