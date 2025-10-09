interface CountryHeroSectionProps {
  countryName: string;
  totalJobs: number;
}

export function CountryHeroSection({ 
  countryName, 
  totalJobs
}: CountryHeroSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
      <h1>Salary Information in {countryName}</h1>
      <p className="mt-4 leading-8 max-w-3xl mx-auto">
        Discover accurate salary data for {totalJobs}+ jobs across {countryName}. 
        Get the compensation insights you need to advance your career.
      </p>
    </section>
  );
}
