import Link from "next/link";
import { formatCurrency } from "@/lib/format/currency";

interface CountryHeroSectionProps {
  countryName: string;
  totalJobs: number;
  avgSalary: number;
  statesCount: number;
  countrySlug: string;
}

export function CountryHeroSection({ 
  countryName, 
  totalJobs, 
  avgSalary, 
  statesCount, 
  countrySlug 
}: CountryHeroSectionProps) {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* <div className="mb-4">
            <Link 
              href="/countries" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Countries
            </Link>
          </div> */}
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Salary Information in {countryName}
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            Discover accurate salary data for {totalJobs}+ jobs across {countryName}. 
            Get the compensation insights you need to advance your career.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <span className="mr-2">💼</span>
              {totalJobs} Salary Information
            </div>
            {avgSalary > 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="mr-2">💰</span>
                Avg: {formatCurrency(avgSalary, countrySlug, undefined)}
              </div>
            )}
            {statesCount > 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                <span className="mr-2">📍</span>
                {statesCount} States/Regions
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
