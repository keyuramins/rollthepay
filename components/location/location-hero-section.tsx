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
    <section role="region" aria-labelledby="location-hero-heading" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
      <h1 id="location-hero-heading">
        Salary Data in {locationName}, {stateName}, {countryName}
      </h1>
      <p className="mt-4 max-w-4xl mx-auto">
        Discover comprehensive salary information and career opportunities in {locationName}, {stateName}. 
        Get detailed compensation data for various occupations and experience levels.
      </p>
    </section>
  );
}
