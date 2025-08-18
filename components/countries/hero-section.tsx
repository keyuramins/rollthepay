interface CountriesHeroSectionProps {
  countryCount: number;
}

export function CountriesHeroSection({ countryCount }: CountriesHeroSectionProps) {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Explore Salaries by Country
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            Discover accurate salary information for jobs across different countries and regions. 
            Find the data you need to make informed career decisions.
          </p>
          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <span className="mr-2">🌍</span>
              {countryCount} Countries Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
