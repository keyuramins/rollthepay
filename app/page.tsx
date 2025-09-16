import { Metadata } from "next";
import { getDataset } from "@/lib/data/parse";
import { NewHeader } from "@/components/navigation/new-header";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { MissionSection } from "@/components/home/mission-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/ui/footer";




export const revalidate = 31536000;
export const dynamicParams = false;

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

// Shorter revalidation for testing (can be increased later)
// 1 minute for testing
export async function generateMetadata(): Promise<Metadata> {
  const { all } = await getDataset();
  const totalSalaries = all.length;
  const countries = new Set(all.map(rec => rec.country)).size;

  return {
    title: "RollThePay - Accurate Salary Data & Career Insights",
    description: `Discover comprehensive salary information for ${totalSalaries}+ jobs across ${countries} countries. Get accurate compensation data, salary ranges, experience levels, and career insights to advance your career.`,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "RollThePay - Accurate Salary Data & Career Insights",
      description: `Discover comprehensive salary information for ${totalSalaries}+ jobs across ${countries} countries. Get accurate compensation data, salary ranges, experience levels, and career insights to advance your career.`,
      type: "website",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: "RollThePay - Accurate Salary Data & Career Insights",
      description: `Discover comprehensive salary information for ${totalSalaries}+ jobs across ${countries} countries. Get accurate compensation data, salary ranges, experience levels, and career insights to advance your career.`,
    },
  };
}

export default async function Home() {
  // Force data initialization and caching on homepage load
  console.log('🏠 Homepage: Component is running!');
  console.log('🏠 Homepage: Timestamp:', new Date().toISOString());
  console.log('🏠 Homepage: Initializing dataset and caching all continents/countries...');
  console.log('🏠 Homepage: Environment check - NODE_ENV:', process.env.NODE_ENV);
  console.log('🏠 Homepage: Environment check - NEXT_PHASE:', process.env.NEXT_PHASE);
  console.log('🏠 Homepage: Environment check - FILEBROWSER_BASE_URL:', process.env.FILEBROWSER_BASE_URL ? 'SET' : 'NOT SET');
  console.log('🏠 Homepage: Environment check - FILEBROWSER_API_KEY:', process.env.FILEBROWSER_API_KEY ? 'SET' : 'NOT SET');
  
  let all: any[] = [];
  let byCountry = new Map<string, any[]>();
  let totalSalaries = 0;
  let countries = 0;
  let error: Error | null = null;
  
  try {
    console.log('🏠 Homepage: About to call getDataset()...');
    const dataset = await getDataset();
    console.log('🏠 Homepage: getDataset() completed successfully!');
    
    all = dataset.all;
    byCountry = dataset.byCountry;
    totalSalaries = all.length;
    countries = new Set(all.map(rec => rec.country)).size;
    
    // Log the data that was loaded and cached
    console.log(`🏠 Homepage: Successfully loaded and cached ${totalSalaries} salary records`);
    console.log(`🏠 Homepage: Data covers ${countries} countries`);
    console.log(`🏠 Homepage: Countries available: ${Array.from(byCountry.keys()).join(', ')}`);
    
    // Force cache warmup for all continents and countries
    const continents = new Set<string>();
    for (const record of all) {
      if (record.country) {
        continents.add(record.country);
      }
    }
    console.log(`🏠 Homepage: Cached data for continents: ${Array.from(continents).join(', ')}`);
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err));
    console.error('🏠 Homepage: Failed to load dataset:', err);
    
    // Check if it's an environment variable issue
    if (!process.env.FILEBROWSER_BASE_URL || !process.env.FILEBROWSER_API_KEY) {
      console.error('🏠 Homepage: Missing Filebrowser environment variables');
      console.error('🏠 Homepage: Please set FILEBROWSER_BASE_URL and FILEBROWSER_API_KEY in .env.local');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 overflow-x-hidden">
      {/* <NewHeader /> */}
      <HeroSection />
      <StatsSection totalSalaries={totalSalaries} countries={countries} />
      <MissionSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
      
      {/* Show error message if dataset loading failed */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded shadow-lg max-w-md">
          <strong className="font-bold">Data Loading Error:</strong>
          <br />
          <span className="text-sm">
            {error instanceof Error ? error.message : String(error)}
          </span>
          <br />
          <span className="text-xs mt-2 block">
            Please check your Filebrowser configuration and environment variables.
          </span>
        </div>
      )}
    </div>
  );
}