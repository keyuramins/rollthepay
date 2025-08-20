interface OccupationHeroSectionProps {
  title: string;
  subtitle: string;
  avgSalary?: string;
  occupation?: string;
}

export function OccupationHeroSection({ 
  title, 
  subtitle, 
  avgSalary,
  occupation
}: OccupationHeroSectionProps) {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Occupation Badge */}
          {/* {occupation && (
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200">
                <span className="mr-2">💼</span>
                {occupation}
              </span>
            </div>
          )} */}
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
          
          {avgSalary && (
            <div className="mt-8">
              <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full text-lg font-medium">
                <span className="mr-2">💰</span>
                Average Annual Salary: {avgSalary}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
