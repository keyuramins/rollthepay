interface StatsSectionProps {
  totalSalaries: number;
  countries: number;
}

export function StatsSection({ totalSalaries, countries }: StatsSectionProps) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{totalSalaries.toLocaleString()}+</div>
            <div className="mt-2 text-lg text-gray-600">Published Salaries</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{countries}</div>
            <div className="mt-2 text-lg text-gray-600">Countries Covered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">100%</div>
            <div className="mt-2 text-lg text-gray-600">Data Transparency</div>
          </div>
        </div>
      </div>
    </section>
  );
}
