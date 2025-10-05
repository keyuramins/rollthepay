interface StateHeroSectionProps {
  stateName: string;
  countryName: string;
  jobCount: number;
}

export function StateHeroSection({ stateName, countryName, jobCount }: StateHeroSectionProps) {
  return (
    <section className="state-hero-section">
      <div className="state-hero-section__container">
        <div className="state-hero-section__content">
          <h1 className="state-hero-section__title">
            {stateName} Salary Data
          </h1>
          <p className="state-hero-section__description">
            Explore salary information and career opportunities in {stateName}, {countryName}
          </p>
          
        </div>
      </div>
    </section>
  );
}
