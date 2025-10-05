interface CountryHeroSectionProps {
  countryName: string;
  totalJobs: number;
}

export function CountryHeroSection({ 
  countryName, 
  totalJobs
}: CountryHeroSectionProps) {
  return (
    <section className="country-hero-section">
      <div className="country-hero-section__container">
        <div className="country-hero-section__content">
          <h1 className="country-hero-section__title">
            Salary Information in {countryName}
          </h1>
          <p className="country-hero-section__description">
            Discover accurate salary data for {totalJobs}+ jobs across {countryName}. 
            Get the compensation insights you need to advance your career.
          </p>
        </div>
      </div>
    </section>
  );
}
