export function DataQualitySection() {
  return (
    <section className="data-quality-section">
      <div className="data-quality-section__container">
        <div className="data-quality-section__header">
          <h2 className="data-quality-section__title">
            Our Commitment to Data Quality
          </h2>
          <p className="data-quality-section__description">
            We take data accuracy seriously and have implemented rigorous processes to ensure the information we provide is reliable.
          </p>
        </div>
        
        <div className="data-quality-section__grid">
          <div className="data-quality-section__item">
            <div className="data-quality-section__icon-container data-quality-section__icon-container--red">
              <span className="data-quality-section__icon">🔒</span>
            </div>
            <h3 className="data-quality-section__item-title">Verified Sources</h3>
            <p className="data-quality-section__item-description">
              Data comes from verified employers and employees
            </p>
          </div>
          
          <div className="data-quality-section__item">
            <div className="data-quality-section__icon-container data-quality-section__icon-container--yellow">
              <span className="data-quality-section__icon">📈</span>
            </div>
            <h3 className="data-quality-section__item-title">Regular Updates</h3>
            <p className="data-quality-section__item-description">
              Information is updated regularly to reflect current market conditions
            </p>
          </div>
          
          <div className="data-quality-section__item">
            <div className="data-quality-section__icon-container data-quality-section__icon-container--green">
              <span className="data-quality-section__icon">🎯</span>
            </div>
            <h3 className="data-quality-section__item-title">Accurate Aggregation</h3>
            <p className="data-quality-section__item-description">
              Statistical methods ensure reliable averages and ranges
            </p>
          </div>
          
          <div className="data-quality-section__item">
            <div className="data-quality-section__icon-container data-quality-section__icon-container--primary">
              <span className="data-quality-section__icon">🌍</span>
            </div>
            <h3 className="data-quality-section__item-title">Global Coverage</h3>
            <p className="data-quality-section__item-description">
              Comprehensive data from multiple countries and regions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
