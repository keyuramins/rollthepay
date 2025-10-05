import Link from "next/link";

export function AboutCTASection() {
  return (
    <section className="about-cta-section">
      <div className="about-cta-section__container">
        <h2 className="about-cta-section__title">
          Ready to Explore Salary Data?
        </h2>
        <p className="about-cta-section__description">
          Start your journey to better compensation insights today. 
          Explore our comprehensive salary database and make informed career decisions.
        </p>
        <div className="about-cta-section__buttons">
          
          <Link href="/" className="about-cta-section__button">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
