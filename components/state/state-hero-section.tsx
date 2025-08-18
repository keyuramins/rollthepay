interface StateHeroSectionProps {
  stateName: string;
  countryName: string;
  jobCount: number;
}

export function StateHeroSection({ stateName, countryName, jobCount }: StateHeroSectionProps) {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {stateName} Salary Data
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            Explore salary information and career opportunities in {stateName}, {countryName}
          </p>
          
          <div className="mt-8">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-lg font-medium">
              <span className="mr-2">💼</span>
              {jobCount} Salary Records Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
