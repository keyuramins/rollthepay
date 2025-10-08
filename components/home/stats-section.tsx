import { TrendingUp, Globe, Shield, Users, DollarSign, Building2 } from "lucide-react";

interface StatsSectionProps {
  totalSalaries: number;
  countries: number;
}

export function StatsSection({ totalSalaries, countries }: StatsSectionProps) {
  return (
    <section className="stats-section">
      <div className="stats-section__container">
        <div className="stats-section__header">
          <h2 className="stats-section__title">Trusted by Job Seekers Worldwide</h2>
          <p className="stats-section__description">
            Our comprehensive salary database helps millions make informed career decisions
          </p>
        </div>
        
        <div className="stats-section__grid">
          <div className="stats-section__item stats-section__item--featured">
            <div className="stats-section__icon">
              <DollarSign className="stats-section__icon-svg" />
            </div>
            <div className="stats-section__value">{totalSalaries.toLocaleString()}+</div>
            <div className="stats-section__label">Salary Records</div>
            <div className="stats-section__description">Real compensation data from verified sources</div>
          </div>
          
          <div className="stats-section__item">
            <div className="stats-section__icon">
              <Globe className="stats-section__icon-svg" />
            </div>
            <div className="stats-section__value">{countries}+</div>
            <div className="stats-section__label">Countries</div>
            <div className="stats-section__description">Global salary insights across markets</div>
          </div>
          
          <div className="stats-section__item">
            <div className="stats-section__icon">
              <Building2 className="stats-section__icon-svg" />
            </div>
            <div className="stats-section__value">10K+</div>
            <div className="stats-section__label">Companies</div>
            <div className="stats-section__description">From startups to Fortune 500</div>
          </div>
          
          <div className="stats-section__item">
            <div className="stats-section__icon">
              <Users className="stats-section__icon-svg" />
            </div>
            <div className="stats-section__value">1M+</div>
            <div className="stats-section__label">Job Seekers</div>
            <div className="stats-section__description">Trust our data for career decisions</div>
          </div>
          
          <div className="stats-section__item">
            <div className="stats-section__icon">
              <Shield className="stats-section__icon-svg" />
            </div>
            <div className="stats-section__value">100%</div>
            <div className="stats-section__label">Free Access</div>
            <div className="stats-section__description">No paywalls, no hidden fees</div>
          </div>
          
          <div className="stats-section__item">
            <div className="stats-section__icon">
              <TrendingUp className="stats-section__icon-svg" />
            </div>
            <div className="stats-section__value">Regular</div>
            <div className="stats-section__label">Updates</div>
            <div className="stats-section__description">Fresh data added continuously</div>
          </div>
        </div>
      </div>
    </section>
  );
}
