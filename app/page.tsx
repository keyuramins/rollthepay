// app/page.tsx
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSectionWrapper } from "@/components/home/HeroSectionWrapper";
import { StatsSectionWrapper } from "@/components/home/StatsSectionWrapper";
import { getHomepageStats } from "@/lib/db/queries";

// Next.js 16: Using cacheComponents in next.config.ts instead of individual page configs

// Next.js 16: Updated dynamic imports with proper syntax
const FeaturesSectionDynamic = dynamic(() => import("@/components/home/features-section").then(mod => mod.FeaturesSection), { 
  ssr: true, 
  loading: () => <div className="h-32 bg-gray-200 animate-pulse rounded-md"></div> 
});

const TrustSectionDynamic = dynamic(() => import("@/components/home/trust-section").then(mod => mod.TrustSection), { 
  ssr: true, 
  loading: () => <div className="h-32 bg-gray-200 animate-pulse rounded-md"></div> 
});

const MissionSectionDynamic = dynamic(() => import("@/components/home/mission-section").then(mod => mod.MissionSection), { 
  ssr: true, 
  loading: () => <div className="h-32 bg-gray-200 animate-pulse rounded-md"></div> 
});

const CTASectionDynamic = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection), { 
  ssr: true, 
  loading: () => <div className="h-32 bg-gray-200 animate-pulse rounded-md"></div> 
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RollThePay - Discover What Jobs Really Pay Worldwide",
    description: `Get accurate, up-to-date salary data from 350,000+ occupations across 110+ countries.`,
    alternates: { canonical: "/" },
    openGraph: {
      title: "RollThePay",
      description: `Get accurate, up-to-date salary data from 350,000+ occupations across 110+ countries.`,
      type: "website",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: "RollThePay",
      description: `Get accurate, up-to-date salary data from 350,000+ occupations across 110+ countries.`,
    },
  };
}

export default async function Home() {
  let error: Error | null = null;
  let totalSalaries = 360000;
  let countries = 111;
  try {
    const stats = await getHomepageStats();
    totalSalaries = stats.totalRecords;
    countries = stats.uniqueCountries;
  } catch (err) {
    console.error("Error fetching homepage stats:", err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 overflow-x-hidden">
      <HeroSectionWrapper />
      <StatsSectionWrapper countries={countries} totalSalaries={totalSalaries} />
      <FeaturesSectionDynamic />
      <TrustSectionDynamic />
      <MissionSectionDynamic />
      <CTASectionDynamic />
    </div>
  );
}