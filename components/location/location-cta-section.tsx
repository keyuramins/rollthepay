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
  return (
    <section className="cta-section">
      <div className="cta-section__container">
        <h2 className="cta-section__title">
          Explore More Salary Data
        </h2>
        <p className="cta-section__description">
          Compare salaries across different locations and discover career opportunities 
          in {locationName ? `${locationName}, ${stateName}, ${countryName}` : stateName ? `${stateName}, ${countryName}` : countryName}.
        </p>
        <div className="cta-section__buttons">
          {/* Always show country button */}
          <Link prefetch={true} href={`/${country}`}>
            <button className="cta-section__button">
              View All Salary Data in {countryName}
            </button>
          </Link>
          
          {/* Show state button only if we're on a location page (have both state and location) */}
          {state && location && stateName && (
            <Link prefetch={true} href={`/${country}/${stateName.toLowerCase().replace(/\s+/g, '-')}`}>
              <button className="cta-section__button">
                View All Salary Data in {stateName}
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
