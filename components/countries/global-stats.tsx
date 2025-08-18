interface GlobalStatsProps {
  totalRecords: number;
  countryCount: number;
  continentCount: number;
}

export function GlobalStats({ totalRecords, countryCount, continentCount }: GlobalStatsProps) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Global Salary Data Overview
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive salary information from thousands of employers worldwide, 
            helping you understand compensation trends across different markets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {totalRecords.toLocaleString()}+
            </div>
            <div className="text-lg text-gray-600">Total Salary Records</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {countryCount}
            </div>
            <div className="text-lg text-gray-600">Countries Covered</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {continentCount}
            </div>
            <div className="text-lg text-gray-600">Continents Represented</div>
          </div>
        </div>
      </div>
    </section>
  );
}
