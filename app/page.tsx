import { Metadata } from "next";
import { getDataset, extractUniqueCountries, extractDatasetStats } from "@/lib/data/parse";
import dynamicImport from "next/dynamic";
import { HeroSectionWrapper } from "@/components/home/HeroSectionWrapper";
import { StatsSectionWrapper } from "@/components/home/StatsSectionWrapper";







export const revalidate = 31536000;
export const dynamicParams = false;

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

//Dynamically import components
const FeaturesSectionDynamic = dynamicImport(() => import("@/components/home/features-section").then(mod => mod.FeaturesSection), { ssr: true, loading: () => <div>Loading Features...</div> });
const TrustSectionDynamic = dynamicImport(() => import("@/components/home/trust-section").then(mod => mod.TrustSection), { ssr: true, loading: () => <div>Loading Trust...</div> });
const MissionSectionDynamic = dynamicImport(() => import("@/components/home/mission-section").then(mod => mod.MissionSection), { ssr: true, loading: () => <div>Loading Mission...</div> });
const CTASectionDynamic = dynamicImport(() => import("@/components/home/cta-section").then(mod => mod.CTASection), { ssr: true, loading: () => <div>Loading CTA...</div> });
//const FooterDynamic = dynamicImport(() => import("@/components/ui/footer").then(mod => mod.Footer), { ssr: true, loading: () => <div>Loading Footer...</div> });

// Shorter revalidation for testing (can be increased later)
// 1 minute for testing
export async function generateMetadata(): Promise<Metadata> {
  const { all } = await getDataset();
  const totalSalaries = all.length;
  const countries = extractUniqueCountries(all).length;

  return {
    title: "RollThePay - Discover What Jobs Really Pay Worldwide",
    description: `Get accurate, up-to-date salary data from ${totalSalaries}+ records across ${countries}+ countries.`,
    alternates: { canonical: "/" },
    openGraph: { title: "RollThePay", description: `Get accurate, up-to-date salary data from ${totalSalaries}+ records across ${countries}+ countries.`, type: "website", url: "/" },
    twitter: { card: "summary_large_image", title: "RollThePay", description: `Get accurate, up-to-date salary data from ${totalSalaries}+ records across ${countries}+ countries.` },
  };
}

export default async function Home() {
  let error: Error | null = null;
  let all: any[] = [];
  let byCountry = new Map<string, any[]>();
  let totalSalaries = 0;
  let countries = 0;
  
  try {
    console.log('🏠 Homepage: About to call getDataset()...');
    const dataset = await getDataset();
    console.log('🏠 Homepage: getDataset() completed successfully!');
    
    all = dataset.all;
    byCountry = dataset.byCountry;
    
    // Use safe extraction functions to get statistics
    const stats = extractDatasetStats(all);
    totalSalaries = stats.totalRecords;
    countries = stats.uniqueCountries;
    
    // Force cache warmup for all continents and countries using safe extraction
    const continents = extractUniqueCountries(all);
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 overflow-x-hidden">
      {/* <NewHeader /> */}
      <HeroSectionWrapper occupations={all} />
      <StatsSectionWrapper countries={countries} totalSalaries={totalSalaries} />
      <FeaturesSectionDynamic />
      <TrustSectionDynamic />
      <MissionSectionDynamic />
      <CTASectionDynamic />
      {/* <FooterDynamic /> */}
    </div>
  );
}