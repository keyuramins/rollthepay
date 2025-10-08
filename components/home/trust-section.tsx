import { Shield, CheckCircle, Award, Lock } from "lucide-react";

export function TrustSection() {
  return (
    <section className="trust-section">
      <div className="trust-section__container">
        <div className="trust-section__header">
          <h2 className="trust-section__title">
            Why Professionals Trust RollThePay
          </h2>
          <p className="trust-section__description">
            We're committed to providing the most accurate and up-to-date salary information 
            to help you make informed career decisions.
          </p>
        </div>
        
        <div className="trust-section__grid">
          <div className="trust-section__item">
            <div className="trust-section__icon">
              <Shield className="trust-section__icon-svg" />
            </div>
            <h3 className="trust-section__item-title">Data Integrity</h3>
            <p className="trust-section__item-description">
              All salary data is verified through multiple sources and regularly updated 
              to ensure accuracy and reliability.
            </p>
          </div>
          
          <div className="trust-section__item">
            <div className="trust-section__icon">
              <CheckCircle className="trust-section__icon-svg" />
            </div>
            <h3 className="trust-section__item-title">Transparent Process</h3>
            <p className="trust-section__item-description">
              Our methodology is open and transparent. We show you exactly how we collect, 
              verify, and present salary information.
            </p>
          </div>
          
          <div className="trust-section__item">
            <div className="trust-section__icon">
              <Award className="trust-section__icon-svg" />
            </div>
            <h3 className="trust-section__item-title">Industry Recognition</h3>
            <p className="trust-section__item-description">
              Trusted by HR professionals, recruiters, and job seekers worldwide for 
              reliable compensation insights and market intelligence.
            </p>
          </div>
          
          <div className="trust-section__item">
            <div className="trust-section__icon">
              <Lock className="trust-section__icon-svg" />
            </div>
            <h3 className="trust-section__item-title">Privacy Protected</h3>
            <p className="trust-section__item-description">
              Your privacy is our priority. All data is anonymized and aggregated to protect 
              individual confidentiality while providing valuable insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
