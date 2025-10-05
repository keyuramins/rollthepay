interface StatsSectionProps {
  totalSalaries: number;
  countries: number;
}

export function StatsSection({ totalSalaries, countries }: StatsSectionProps) {
  return (
    <section className="stats-section">
      <div className="stats-section__container">
        <div className="stats-section__grid">
          <div className="stats-section__item">
            <div className="stats-section__value">{totalSalaries.toLocaleString()}+</div>
            <div className="stats-section__label">Published Salaries</div>
          </div>
          <div className="stats-section__item">
            <div className="stats-section__value">{countries}</div>
            <div className="stats-section__label">Countries Covered</div>
          </div>
          <div className="stats-section__item stats-section__item--span">
            <div className="stats-section__value">100%</div>
            <div className="stats-section__label">Data Transparency</div>
          </div>
        </div>
      </div>
    </section>
  );
}
