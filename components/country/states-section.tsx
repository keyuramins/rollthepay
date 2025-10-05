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
    <section className="states-section">
      <div className="states-section__container">
        <div className="states-section__header">
          <h2 className="states-section__title">
            Explore by State/Region
          </h2>
          <p className="states-section__description">
            Find salary data specific to different regions within {countryName}.
          </p>
        </div>
        
        <div className="states-section__grid">
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
