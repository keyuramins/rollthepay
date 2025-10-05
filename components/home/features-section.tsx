export function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-section__container">
        <div className="features-section__header">
          <h2 className="features-section__title">
            Search Salary By Jobs, Location & Industry
          </h2>
          <p className="features-section__description">
            Our website is easy to use and requires one step to access all available information. You can look at our list of jobs and sort them by location, title, industry or date published.
          </p>
        </div>

        <div className="features-section__grid">
          <div className="features-section__item">
            <div className="features-section__icon-container">
              <svg className="features-section__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="features-section__item-title">Easy Search</h3>
            <p className="features-section__item-description">Find salary information with simple search terms and filters</p>
          </div>

          <div className="features-section__item">
            <div className="features-section__icon-container">
              <svg className="features-section__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="features-section__item-title">Accurate Data</h3>
            <p className="features-section__item-description">Gathered directly from employees and employers</p>
          </div>

          <div className="features-section__item features-section__item--span">
            <div className="features-section__icon-container">
              <svg className="features-section__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="features-section__item-title">Global Coverage</h3>
            <p className="features-section__item-description">Salary data from countries around the world</p>
          </div>
        </div>
      </div>
    </section>
  );
}
