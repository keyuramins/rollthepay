import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-section__container">
        <h2 className="cta-section__title">
          Discover What A Job Pays Before You Apply
        </h2>
        <p className="cta-section__description">
          We are excited about making this kind of data available for anyone curious about salaries in certain countries. Our mission is to increase transparency by adding more new jobs each day.
        </p>
        <Button size="lg" variant="secondary" className="cta-section__button">
          Start Exploring Salaries
        </Button>
      </div>
    </section>
  );
}
