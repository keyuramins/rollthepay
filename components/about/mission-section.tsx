export function AboutMissionSection() {
  return (
    <section className="mission-section">
      <div className="mission-section__container">
        <div className="mission-section__grid">
          <div className="mission-section__content">
            <h2 className="mission-section__title">
              Our Mission
            </h2>
            <p className="mission-section__description">
              RollThePay was created with a simple yet powerful goal: to provide accurate salary information 
              that helps people make informed career decisions. We believe that transparency in compensation 
              leads to better career outcomes and a more equitable workplace.
            </p>
            <p className="mission-section__description--last">
              By compiling data from thousands of employers and employees worldwide, we're building the most 
              comprehensive salary database available, organized by country, state, and job title.
            </p>
          </div>
          <div className="mission-section__highlight">
            <div className="mission-section__highlight-content">
              <div className="mission-section__highlight-icon">🎯</div>
              <h3 className="mission-section__highlight-title">Transparency First</h3>
              <p className="mission-section__highlight-description">
                We believe everyone deserves access to accurate salary information to make informed career decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
