import { getDataset } from "@/lib/data/parse";
import { NewHeader } from "@/components/navigation/new-header";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { MissionSection } from "@/components/home/mission-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/ui/footer";

export const revalidate = 31536000;

export default function Home() {
  const { all } = getDataset();
  const totalSalaries = all.length;
  const countries = new Set(all.map(rec => rec.country)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
      {/* <Header /> */}
      <HeroSection />
      <StatsSection totalSalaries={totalSalaries} countries={countries} />
      <MissionSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}