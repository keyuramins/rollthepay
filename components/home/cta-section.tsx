import { Button } from "@/components/ui/button";
import { ArrowRight, Search, TrendingUp, Users } from "lucide-react";

export function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-section__container">
        <div className="cta-section__content">
          <h2 className="cta-section__title">
            Ready to Discover Your Market Value?
          </h2>
          <p className="cta-section__description">
            Join millions of professionals who use our platform to research salaries, 
            negotiate better offers, and advance their careers. Start your salary research today.
          </p>
          
          <div className="cta-section__buttons">
            <Button size="lg" variant="secondary" className="cta-section__button">
              <Search className="w-5 h-5 mr-2" />
              Search Salaries Now
            </Button>
            <Button size="lg" variant="secondary" className="cta-section__button cta-section__button--outline">
              <TrendingUp className="w-5 h-5 mr-2" />
              Explore Trends
            </Button>
          </div>
          
          <div className="cta-section__features">
            <div className="cta-section__feature">
              <Users className="cta-section__feature-icon" />
              <span>Free forever</span>
            </div>
            <div className="cta-section__feature">
              <ArrowRight className="cta-section__feature-icon" />
              <span>No registration required</span>
            </div>
            <div className="cta-section__feature">
              <Search className="cta-section__feature-icon" />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
