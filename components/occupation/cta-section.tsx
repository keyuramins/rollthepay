import Link from "next/link";
import { slugify } from "@/lib/format/slug";

interface OccupationCTASectionProps {
  countryName: string;
  locationText: string;
  record: any;
}

export function OccupationCTASection({ countryName, locationText, record }: OccupationCTASectionProps) {
  return (
    <section 
      className="bg-green-100 py-12 sm:py-16 lg:py-20" 
      aria-labelledby="cta-heading"
      role="region"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4 sm:mb-6">
          Explore More Salary Data
        </h2>
        <p className="text-lg sm:text-xl text-primary mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
          Compare salaries across different locations and discover career opportunities 
          in {locationText}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link 
            href={`/${slugify(countryName)}`}
            className="w-full sm:w-auto"
          >
            <button 
              className="w-full sm:w-auto inline-flex items-center justify-center text-base bg-secondary text-primary px-6 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
              aria-describedby="cta-heading"
            >
              View All Salary Data in {countryName}
            </button>
          </Link>
          
          {record.state && (
            <Link 
              href={`/${slugify(countryName)}/${slugify(record.state)}`}
              className="w-full sm:w-auto"
            >
              <button 
                className="w-full sm:w-auto inline-flex items-center justify-center text-base bg-secondary text-primary px-6 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
                aria-describedby="cta-heading"
              >
                View All Salary Data in {record.state}
              </button>
            </Link>
          )}
          
          {record.location && (
            <Link 
              href={`/${slugify(countryName)}/${slugify(record.state)}/${slugify(record.location)}`}
              className="w-full sm:w-auto"
            >
              <button 
                className="w-full sm:w-auto inline-flex items-center justify-center text-base bg-secondary text-primary px-6 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
                aria-describedby="cta-heading"
              >
                View All Salary Data in {record.location}
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
