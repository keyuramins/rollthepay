import Link from "next/link";

interface OccupationCTASectionProps {
  countryName: string;
  locationText: string;
  record: any;
}

export function OccupationCTASection({ countryName, locationText, record }: OccupationCTASectionProps) {
  return (
    <section 
      className="bg-green-100 py-16" 
      aria-labelledby="cta-heading"
      role="region"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">
          Explore More Salary Data
        </h2>
        <p className="text-xl text-primary mb-8 max-w-3xl mx-auto">
          Compare salaries across different locations and discover career opportunities 
          in {locationText}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link prefetch={true} href={`/${countryName.toLowerCase().replace(/\s+/g, '-')}`}>
            <button className="inline-flex items-center justify-center text-base bg-secondary text-primary px-8 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card transition-colors min-h-[44px] min-w-[44px] cursor-pointer">
              View All Salary Data in {countryName}
            </button>
          </Link>
          
          {record.state && (
            <Link prefetch={true} href={`/${countryName.toLowerCase().replace(/\s+/g, '-')}/${record.state.toLowerCase().replace(/\s+/g, '-')}`}>
              <button className="inline-flex items-center justify-center text-base bg-secondary text-primary px-8 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card transition-colors min-h-[44px] min-w-[44px] cursor-pointer">
                View All Salary Data in {record.state}
              </button>
            </Link>
          )}
          
          {record.location && (
            <Link prefetch={true} href={`/${countryName.toLowerCase().replace(/\s+/g, '-')}/${record.state.toLowerCase().replace(/\s+/g, '-')}/${record.location.toLowerCase().replace(/\s+/g, '-')}`}>
              <button className="inline-flex items-center justify-center text-base bg-secondary text-primary px-8 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card transition-colors min-h-[44px] min-w-[44px] cursor-pointer">
                View All Salary Data in {record.location}
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
