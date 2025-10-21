// app/page.tsx
import { Metadata } from "next";
import { getHomepageStats } from "@/lib/db/queries";
import dynamicImport from "next/dynamic";
import { HeroSectionWrapper } from "@/components/home/HeroSectionWrapper";
import { StatsSectionWrapper } from "@/components/home/StatsSectionWrapper";












export const revalidate = 31536000;
export const dynamicParams = false;

// Optimized caching for PostgreSQL - shorter revalidation since data is now in database
// 1 hour - database queries are fast
//Dynamically import components
const FeaturesSectionDynamic = dynamicImport(() => import("@/components/home/features-section").then(mod => mod.FeaturesSection), { ssr: true, loading: () => <div>Loading Features...</div> });
const TrustSectionDynamic = dynamicImport(() => import("@/components/home/trust-section").then(mod => mod.TrustSection), { ssr: true, loading: () => <div>Loading Trust...</div> });
const MissionSectionDynamic = dynamicImport(() => import("@/components/home/mission-section").then(mod => mod.MissionSection), { ssr: true, loading: () => <div>Loading Mission...</div> });
const CTASectionDynamic = dynamicImport(() => import("@/components/home/cta-section").then(mod => mod.CTASection), { ssr: true, loading: () => <div>Loading CTA...</div> });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const stats = await getHomepageStats();
    const totalSalaries = stats.totalRecords;
    const countries = stats.uniqueCountries;

    return {
      title: "RollThePay - Discover What Jobs Really Pay Worldwide",
      description: `Get accurate, up-to-date salary data from ${totalSalaries}+ records across ${countries}+ countries.`,
      alternates: { canonical: "/" },
    openGraph: { title: "RollThePay", description: `Get accurate, up-to-date salary data from ${totalSalaries}+ records across ${countries}+ countries.`, type: "website", url: "/" },
    twitter: { card: "summary_large_image", title: "RollThePay", description: `Get accurate, up-to-date salary data from ${totalSalaries}+ records across ${countries}+ countries.` },
  };
  } catch (error) {
    console.error('Error generating homepage metadata:', error);
    // Fallback metadata if database is not available
    return {
      title: "RollThePay - Discover What Jobs Really Pay Worldwide",
      description: "Get accurate, up-to-date salary data from thousands of records across multiple countries.",
      alternates: { canonical: "/" },
      openGraph: { title: "RollThePay", description: "Get accurate, up-to-date salary data from thousands of records across multiple countries.", type: "website", url: "/" },
      twitter: { card: "summary_large_image", title: "RollThePay", description: "Get accurate, up-to-date salary data from thousands of records across multiple countries." },
    };
  }
}

export default async function Home() {
  let error: Error | null = null;
  let totalSalaries = 0;
  let countries = 0;
  let allOccupations: any[] = [];
  
  try {
    const stats = await getHomepageStats();
    totalSalaries = stats.totalRecords;
    countries = stats.uniqueCountries;
    
    // Empty array for occupations (not needed for homepage)
    allOccupations = [];
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 overflow-x-hidden">
      <HeroSectionWrapper occupations={allOccupations} />
      <StatsSectionWrapper countries={countries} totalSalaries={totalSalaries} />
      <FeaturesSectionDynamic />
      <TrustSectionDynamic />
      <MissionSectionDynamic />
      <CTASectionDynamic />
    </div>
  );
}