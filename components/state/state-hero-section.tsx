interface StateHeroSectionProps {
  stateName: string;
  countryName: string;
  jobCount: number;
}

export function StateHeroSection({ stateName, countryName, jobCount }: StateHeroSectionProps) {
  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {stateName} Salary Data
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            Explore salary information and career opportunities in {stateName}, {countryName}
          </p>
          
        </div>
      </div>
    </section>
  );
}
