import { StateCard } from "./state-card";

interface StatesSectionProps {
  states: Array<{
    name: string;
    recordCount: number;
    avgSalary: number;
  }>;
  countryName: string;
  countrySlug: string;
}

export function StatesSection({ states, countryName, countrySlug }: StatesSectionProps) {
  if (states.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore by State/Region
          </h2>
          <p className="text-lg text-gray-600">
            Find salary data specific to different regions within {countryName}.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((state) => (
            <StateCard
              key={state.name}
              state={state.name}
              recordCount={state.recordCount}
              avgSalary={state.avgSalary}
              countrySlug={countrySlug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
