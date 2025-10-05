import Link from "next/link";

interface OccupationCTASectionProps {
  countryName: string;
  locationText: string;
  record: any;
}

export function OccupationCTASection({ countryName, locationText, record }: OccupationCTASectionProps) {
  return (
    <section className="cta-section">
      <div className="cta-section__container">
        <h2 className="cta-section__title">
          Explore More Salary Data
        </h2>
        <p className="cta-section__description">
          Compare salaries across different locations and discover career opportunities 
          in {locationText}.
        </p>
        <div className="cta-section__buttons">
          <Link prefetch={true} href={`/${countryName.toLowerCase().replace(/\s+/g, '-')}`}>
            <button className="cta-section__button">
              View All Salary Data in {countryName}
            </button>
          </Link>
          
          {record.state && (
            <Link prefetch={true} href={`/${countryName.toLowerCase().replace(/\s+/g, '-')}/${record.state.toLowerCase().replace(/\s+/g, '-')}`}>
              <button className="cta-section__button">
                View All Salary Data in {record.state}
              </button>
            </Link>
          )}
          
          {record.location && (
            <Link prefetch={true} href={`/${countryName.toLowerCase().replace(/\s+/g, '-')}/${record.state.toLowerCase().replace(/\s+/g, '-')}/${record.location.toLowerCase().replace(/\s+/g, '-')}`}>
              <button className="cta-section__button">
                View All Salary Data in {record.location}
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
