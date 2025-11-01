// app/page.tsx
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSectionWrapper } from "@/components/home/HeroSectionWrapper";
import { StatsSectionWrapper } from "@/components/home/StatsSectionWrapper";

export const routeSegmentConfig = { revalidate: 31536000 };
export const fetchCache = "force-cache";

// Next.js 16: Updated dynamic imports with proper syntax
const FeaturesSectionDynamic = dynamic(() => import("@/components/home/features-section").then(mod => mod.FeaturesSection), { 
  ssr: true, 
  loading: () => <div>Loading...</div>
});

const TrustSectionDynamic = dynamic(() => import("@/components/home/trust-section").then(mod => mod.TrustSection), { 
  ssr: true, 
  loading: () => <div>Loading...</div>
});

const MissionSectionDynamic = dynamic(() => import("@/components/home/mission-section").then(mod => mod.MissionSection), { 
  ssr: true, 
  loading: () => <div>Loading...</div>
});

const CTASectionDynamic = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection), { 
  ssr: true, 
  loading: () => <div>Loading...</div>
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RollThePay - Discover What Jobs Really Pay Worldwide",
    description: `Get accurate, up-to-date salary data from 350,000+ occupations across 111 countries.`,
     alternates: { canonical: "/" },
    openGraph: {
      title: "RollThePay",
      description: `Get accurate, up-to-date salary data from 350,000+ occupations across 111 countries.`,
     type: "website",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: "RollThePay",
      description: `Get accurate, up-to-date salary data from 350,000+ occupations across 111 countries.`,
    },
  };
}

export default async function Home() {
  const totalSalaries = 360000;
  const countries = 111;
  
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