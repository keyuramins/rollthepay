import { Metadata } from "next";
import { getDataset, extractUniqueCountries, extractDatasetStats } from "@/lib/data/parse";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { MissionSection } from "@/components/home/mission-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/ui/footer";

export const revalidate = 0;
export const dynamicParams = true;

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

// Shorter revalidation for testing (can be increased later)
// 1 minute for testing
export async function generateMetadata(): Promise<Metadata> {
  const { all } = await getDataset();
  const totalSalaries = all.length;
  const countries = extractUniqueCountries(all).length;

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
    
    // Use safe extraction functions to get statistics
    const stats = extractDatasetStats(all);
    totalSalaries = stats.totalRecords;
    countries = stats.uniqueCountries;
    
    // Log the data that was loaded and cached using safe extraction
    console.log(`🏠 Homepage: Successfully loaded and cached ${totalSalaries} salary records`);
    console.log(`🏠 Homepage: Data covers ${countries} countries`);
    console.log(`🏠 Homepage: Countries available: ${stats.countriesWithData.join(', ')}`);
    console.log(`🏠 Homepage: Records with salary data: ${stats.recordsWithSalaryData}`);
    
    // Log validation results
    console.log(`🏠 Homepage: Data validation - Valid: ${stats.validation.validRecords}, Invalid: ${stats.validation.invalidRecords}`);
    if (stats.validation.invalidRecords > 0) {
      console.log(`🏠 Homepage: Sample validation errors: ${stats.validation.sampleErrors.join('; ')}`);
    }
    
    // Log sample record for debugging (safely extracted)
    if (stats.sampleRecord) {
      console.log('🏠 Homepage: Sample record:', {
        title: stats.sampleRecord.title,
        country: stats.sampleRecord.country,
        state: stats.sampleRecord.state,
        location: stats.sampleRecord.location,
        hasSalaryData: stats.sampleRecord.hasSalaryData
      });
    }
    
    // Force cache warmup for all continents and countries using safe extraction
    const continents = extractUniqueCountries(all);
    console.log(`🏠 Homepage: Cached data for continents: ${continents.join(', ')}`);
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
    <div className="page-main--home">
      {/* <NewHeader /> */}
      <HeroSection />
      <StatsSection totalSalaries={totalSalaries} countries={countries} />
      <MissionSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
      
      {/* Show error message if dataset loading failed */}
      {error && (
        <div className="error-message">
          <strong className="error-message__title">Data Loading Error:</strong>
          <br />
          <span className="error-message__content">
            {error instanceof Error ? error.message : String(error)}
          </span>
          <br />
          <span className="error-message__help">
            Please check your Filebrowser configuration and environment variables.
          </span>
        </div>
      )}
    </div>
  );
}