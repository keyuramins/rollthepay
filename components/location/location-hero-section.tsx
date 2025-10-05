interface LocationHeroSectionProps {
  locationName: string;
  stateName: string;
  countryName: string;
}

export function LocationHeroSection({ 
  locationName, 
  stateName,
  countryName
}: LocationHeroSectionProps) {
  return (
    <section className="location-hero-section">
      <div className="location-hero-section__container">
        <div className="location-hero-section__content">
          <h1 className="location-hero-section__title">
            Salary Data in {locationName}, {stateName}, {countryName}
          </h1>
          <p className="location-hero-section__description">
            Discover comprehensive salary information and career opportunities in {locationName}, {stateName}. 
            Get detailed compensation data for various occupations and experience levels.
          </p>
        </div>
      </div>
    </section>
  );
}
