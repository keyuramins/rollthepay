import { notFound } from "next/navigation";
import { findOccupationSalaryByPath } from "@/lib/data/parse";
import { Breadcrumbs } from "./breadcrumbs";
import { OccupationHeroSection } from "./hero-section";
import { CompensationAnalysis } from "./compensation-analysis";
import { SalaryPercentilesChart } from "./salary-percentiles-chart";
import { ExperienceLevelSalariesChart } from "./experience-level-salaries-chart";
import { TopSkillsMarketDemand } from "./top-skills-market-demand";
import { GenderComparison } from "./gender-comparison";
import { OccupationCTASection } from "./cta-section";
import { searchOccupations } from "@/lib/db/queries";
import { RelatedOpportunitiesSmart } from "./related-opportunities-smart";
import { getCurrencyCode } from "@/lib/format/currency";
import type { OccupationRecord } from "@/lib/data/types";
import { getJobCategoryInfo } from "./job-category-detector";
import { locationStateCountryString } from "@/lib/utils/locationStateCountryString";

interface OccupationPageProps {
  country: string;
  state?: string;
  location?: string;
  slug: string;
}

// Helper function to generate Occupation schema
function generateOccupationSchema(record: OccupationRecord, country: string, state?: string, location?: string) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    "name": record.occ_name || record.title,
    "description": `Salary information for ${record.occ_name} in ${locationStateCountryString(location, state, country)}`,
  };

  // Add location information with proper hierarchy
  if (country) {
    // Start with country as the base location
    let locationData: any = {
      "@type": "Country",
      "name": record.country
    };

    // If state exists, make it the primary location with country as parent
    if (state && record.state) {
      locationData = {
        "@type": "State",
        "name": record.state,
        "containedInPlace": {
          "@type": "Country", 
          "name": record.country
        }
      };
    }

    // If location exists, make it the primary location with state and country as parents
    if (location && record.location) {
      locationData = {
        "@type": "City",
        "name": record.location,
        "containedInPlace": {
          "@type": "State",
          "name": record.state,
          "containedInPlace": {
            "@type": "Country",
            "name": record.country
          }
        }
      };
    }

    schema.occupationLocation = locationData;
  }

  // Add estimated salary if available
  if (record.avgAnnualSalary && record.avgAnnualSalary > 0) {
    const currency = getCurrencyCode(country);
    schema.estimatedSalary = {
      "@type": "MonetaryAmountDistribution",
      "currency": currency,
      "duration": "1Y",
      "median": record.avgAnnualSalary
    };

    // Add percentiles if available
    if (record["10P"]) schema.estimatedSalary.percentile10 = record["10P"];
    if (record["25P"]) schema.estimatedSalary.percentile25 = record["25P"];
    if (record["75P"]) schema.estimatedSalary.percentile75 = record["75P"];
    if (record["90P"]) schema.estimatedSalary.percentile90 = record["90P"];
  }

  // Add skills if available
  const skills = [
    record.skillsNameOne,
    record.skillsNameTwo,
    record.skillsNameThree,
    record.skillsNameFour,
    record.skillsNameFive
  ].filter((skill): skill is string => Boolean(skill));

  if (skills.length > 0) {
    schema.skills = skills;
  }

  // Get detailed job category information
  const jobCategoryInfo = getJobCategoryInfo(record.occ_name || '');
  const jobCategory = jobCategoryInfo.category;
  // Add occupational category if available
  if (jobCategory) {
    schema.occupationalCategory = jobCategory;
  }

  return schema;
}

export async function OccupationPage({ country, state, location, slug }: OccupationPageProps) {
  const record = await findOccupationSalaryByPath({ country, state, location, slug });
  
  if (!record) {
    notFound();
  }
  
  const countryName = record.country;
  const stateName = record.state;
  const locationName = record.location;
  const title = record.title || record.occ_name || '';
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: countryName, href: `/${country}` },
    ...(stateName ? [{ name: stateName, href: `/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    ...(locationName ? [{ name: locationName, href: `/${country}/${stateName?.toLowerCase().replace(/\s+/g, '-')}/${locationName.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    { name: title, href: "#", current: true },
  ];
  
  const locationText = locationStateCountryString(locationName || undefined, stateName || undefined, countryName || undefined);
  
  // Generate the Occupation schema
  const occupationSchema = generateOccupationSchema(record, country, state, location);

  return (
    <>
      <script
        id="occupation-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(occupationSchema, null, 2)
        }}
      />
      <main id="main-content" role="main" aria-label={`Salary information`}>
        <article>
          <OccupationHeroSection record={record} country={country} locationText={locationText} />
          <Breadcrumbs breadcrumbs={breadcrumbs} />  
          <CompensationAnalysis record={record} country={country} location={location} />
          <GenderComparison record={record} />
          <SalaryPercentilesChart record={record} country={country} />
          <ExperienceLevelSalariesChart record={record} country={country} />
          <TopSkillsMarketDemand record={record} />
          <RelatedOpportunitiesSmart record={record} allRecords={await searchOccupations('', record.country, 5000)} />
          <OccupationCTASection countryName={countryName} locationText={locationText} record={record} />
        </article>
      </main>
    </>
  );
}