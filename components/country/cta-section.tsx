import Link from "next/link";

export function CountryCTASection() {
  return (
    <section className="country-cta-section">
      <div className="country-cta-section__container">
        <h2 className="country-cta-section__title">
          Ready to Explore More Salary Data?
        </h2>
        <p className="country-cta-section__description">
          Discover salary information for specific jobs, compare compensation across regions, 
          and get the insights you need to advance your career.
        </p>
        <div className="country-cta-section__buttons">

          <Link href="/" prefetch={true}>
            <button className="country-cta-section__button">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
