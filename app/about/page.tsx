import { Metadata } from "next";
import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { AboutHeroSection } from "@/components/about/hero-section";
import { AboutMissionSection } from "@/components/about/mission-section";
import { WhatWeDoSection } from "@/components/about/what-we-do-section";
import { WhyItMattersSection } from "@/components/about/why-it-matters-section";
import { DataQualitySection } from "@/components/about/data-quality-section";
import { AboutCTASection } from "@/components/about/cta-section";

export const revalidate = 31536000;
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "About - RollThePay",
  description: "Learn about RollThePay's mission to provide accurate salary information and increase transparency in the labor market.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewHeader />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs
              breadcrumbs={[
                { name: "Home", href: "/" },
                { name: "About", href: "#", current: true },
              ]}
            />
          </div>
        </div>
        
        <AboutHeroSection />
        <AboutMissionSection />
        <WhatWeDoSection />
        <WhyItMattersSection />
        <DataQualitySection />
        <AboutCTASection />
      </main>
    </div>
  );
}
