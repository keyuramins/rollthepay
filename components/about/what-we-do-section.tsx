export function WhatWeDoSection() {
  return (
    <section className="about-section">
      <div className="about-section__container">
        <div className="about-section__header">
          <h2 className="about-section__title">
            What We Do
          </h2>
          <p className="about-section__description">
            We collect, organize, and present salary data in an easy-to-understand format, 
            helping you navigate the complex world of compensation.
          </p>
        </div>
        
        <div className="about-section__grid">
          <div className="about-section__item">
            <div className="about-section__icon-container">
              <span className="about-section__icon">📊</span>
            </div>
            <h3 className="about-section__item-title">Data Collection</h3>
            <p className="about-section__item-description">
              We gather salary information from thousands of employers and employees across different industries and locations.
            </p>
          </div>
          
          <div className="about-section__item">
            <div className="about-section__icon-container about-section__icon-container--green">
              <span className="about-section__icon">🔍</span>
            </div>
            <h3 className="about-section__item-title">Data Analysis</h3>
            <p className="about-section__item-description">
              Our team analyzes and validates the data to ensure accuracy and provide meaningful insights.
            </p>
          </div>
          
          <div className="about-section__item">
            <div className="about-section__icon-container about-section__icon-container--purple">
              <span className="about-section__icon">🌐</span>
            </div>
            <h3 className="about-section__item-title">Global Access</h3>
            <p className="about-section__item-description">
              We make this information freely available through our easy-to-use website, accessible to anyone, anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
