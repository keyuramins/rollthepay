import { Target, Users, Globe } from "lucide-react";

export function MissionSection() {
  return (
    <section className="home-mission-section">
      <div className="home-mission-section__container">
        <div className="home-mission-section__header">
          <h2 className="home-mission-section__title">
            Empowering Career Decisions Through Transparency
          </h2>
          <p className="home-mission-section__description">
            We believe everyone deserves access to accurate salary information to make informed career decisions. 
            Our mission is to break down barriers and create a more transparent job market.
          </p>
        </div>
        
        <div className="home-mission-section__grid">
          <div className="home-mission-section__column">
            <div className="home-mission-section__icon">
              <Target className="home-mission-section__icon-svg" />
            </div>
            <h3 className="home-mission-section__column-title">
              Know Your Worth
            </h3>
            <p className="home-mission-section__column-description">
              Stop guessing what you should earn. Get precise salary data for your role, 
              experience level, and location. Make confident decisions about your career and compensation.
            </p>
          </div>
          
          <div className="home-mission-section__column">
            <div className="home-mission-section__icon">
              <Users className="home-mission-section__icon-svg" />
            </div>
            <h3 className="home-mission-section__column-title">
              Community Driven
            </h3>
            <p className="home-mission-section__column-description">
              Join millions of professionals sharing real salary data. Together, we're building 
              a more transparent job market where everyone has access to the information they need to succeed.
            </p>
          </div>
          
          <div className="home-mission-section__column">
            <div className="home-mission-section__icon">
              <Globe className="home-mission-section__icon-svg" />
            </div>
            <h3 className="home-mission-section__column-title">
              Global Perspective
            </h3>
            <p className="home-mission-section__column-description">
              Compare salaries across countries and understand how location impacts compensation. 
              Whether you're planning a move or exploring remote opportunities, we've got the data you need.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
