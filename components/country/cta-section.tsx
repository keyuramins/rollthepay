// components/country/cta-section.tsx
import Link from "next/link";

export function CountryCTASection() {
  return (
    <section 
      className="bg-green-100 py-16" 
      aria-labelledby="cta-heading"
      role="region"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          id="cta-heading" 
          className="text-3xl font-bold text-primary mb-6"
        >
          Ready to Explore More Salary Data?
        </h2>
        <p className="text-xl text-primary mb-8 max-w-3xl mx-auto">
          Discover salary information for specific jobs, compare compensation across regions, 
          and get the insights you need to advance your career.
        </p>
        <Link 
          href={`/`} 
          className="inline-flex items-center justify-center text-base bg-secondary text-primary px-8 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card transition-colors min-h-[44px] min-w-[44px] cursor-pointer" 
          aria-label="Back to Home"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
