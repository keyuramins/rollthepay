// components/country/states-grid.tsx
import Link from "next/link";

interface StatesGridProps {
  states: string[];
  countrySlug: string;
  title: string;
  description: string;
}

export function StatesGrid({ states, countrySlug, title, description }: StatesGridProps) {
  return (
    <section 
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" 
      aria-labelledby="states-grid-heading"
      role="region"
    >
      <header id="states-grid-heading" className="mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </header>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {states.map((state) => {
          const slug = state.toLowerCase().replace(/\s+/g, "-");
          return (
            <li key={state}>
              <Link
                href={`/${countrySlug}/${slug}`}
                title={`Learn more about ${state} salaries and jobs`}
                className="block bg-card rounded-lg border p-4 sm:p-6 hover:shadow-md transition-shadow hover:border-green-100 text-center shadow-sm text-sm sm:text-base font-medium text-foreground"
              >
                {state}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
