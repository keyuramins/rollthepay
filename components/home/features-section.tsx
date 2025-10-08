import { Search, Shield, Globe, TrendingUp, Users, BarChart3 } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-section__container">
        <div className="features-section__header">
          <h2 className="features-section__title">
            Everything You Need to Research Salaries
          </h2>
          <p className="features-section__description">
            Our comprehensive platform provides all the tools and data you need to make informed career decisions. 
            From detailed salary breakdowns to market insights, we've got you covered.
          </p>
        </div>

        <div className="features-section__grid">
          <div className="features-section__item">
            <div className="features-section__icon-container">
              <Search className="features-section__icon" />
            </div>
            <h3 className="features-section__item-title">Smart Search</h3>
            <p className="features-section__item-description">
              Find exact salary data by job title, location, experience level, and company size. 
              Our intelligent search delivers precise results in seconds.
            </p>
          </div>

          <div className="features-section__item">
            <div className="features-section__icon-container">
              <Shield className="features-section__icon" />
            </div>
            <h3 className="features-section__item-title">Verified Data</h3>
            <p className="features-section__item-description">
              All salary information is verified and sourced directly from employees and employers. 
              No estimates, no guesswork—just real, accurate data.
            </p>
          </div>

          <div className="features-section__item">
            <div className="features-section__icon-container">
              <Globe className="features-section__icon" />
            </div>
            <h3 className="features-section__item-title">Global Insights</h3>
            <p className="features-section__item-description">
              Compare salaries across countries, states, and cities. 
              Understand how location impacts compensation in your field.
            </p>
          </div>

          <div className="features-section__item">
            <div className="features-section__icon-container">
              <TrendingUp className="features-section__icon" />
            </div>
            <h3 className="features-section__item-title">Market Trends</h3>
            <p className="features-section__item-description">
              Track salary growth, demand patterns, and career progression paths. 
              Stay ahead of market changes with our trend analysis.
            </p>
          </div>

          <div className="features-section__item">
            <div className="features-section__icon-container">
              <BarChart3 className="features-section__icon" />
            </div>
            <h3 className="features-section__item-title">Detailed Analytics</h3>
            <p className="features-section__item-description">
              Get comprehensive salary breakdowns including base pay, bonuses, benefits, 
              and total compensation packages.
            </p>
          </div>

          <div className="features-section__item">
            <div className="features-section__icon-container">
              <Users className="features-section__icon" />
            </div>
            <h3 className="features-section__item-title">Community Driven</h3>
            <p className="features-section__item-description">
              Join millions of professionals sharing salary insights. 
              Contribute to transparency and help others in their career journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
