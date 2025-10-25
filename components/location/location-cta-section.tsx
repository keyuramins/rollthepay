// components/location/location-cta-section.tsx
import Link from "next/link";

interface LocationCTASectionProps {
  country: string;
  state?: string;
  location?: string;
  countryName: string;
  stateName?: string;
  locationName?: string;
}

export function LocationCTASection({ 
  country, 
  state, 
  location, 
  countryName, 
  stateName, 
  locationName 
}: LocationCTASectionProps) {
  const destinationText = locationName
    ? `${locationName}, ${stateName}, ${countryName}`
    : stateName
    ? `${stateName}, ${countryName}`
    : countryName;

  return (
    <section
      className="bg-green-100 py-16"
      role="region"
      aria-labelledby="location-cta-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="location-cta-heading" className="text-3xl font-bold text-primary mb-6">
          Explore More Salary Data
        </h2>
        <p className="text-xl text-primary mb-8 max-w-3xl mx-auto">
          Compare salaries across different locations and discover career opportunities in {destinationText}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${country}`}
            className="inline-flex items-center justify-center text-base bg-secondary text-primary px-8 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
            title={`View all salary data in ${countryName}`}
          >
            View All Salary Data in {countryName}
          </Link>

          {state && location && stateName && (
            <Link
              href={`/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center justify-center text-base bg-secondary text-primary px-8 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
              title={`View all salary data in ${stateName}`}
            >
              View All Salary Data in {stateName}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
