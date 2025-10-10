interface StateHeroSectionProps {
  stateName: string;
  countryName: string;
}

export function StateHeroSection({ stateName, countryName }: StateHeroSectionProps) {
  return (
    <section role="region" aria-labelledby="state-hero-heading" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
      <h1 id="state-hero-heading">
        {stateName} Salary Data
      </h1>
      <p className="mt-4 max-w-4xl mx-auto">
        Explore salary information and career opportunities in {stateName}, {countryName}
      </p>
    </section>
  );
}
