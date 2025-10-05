import { InstantLink } from "@/components/ui/enhanced-link";

interface StatesGridProps {
  states: string[];
  countrySlug: string;
  title: string;
  description: string;
  className?: string;
}

export function StatesGrid({ states, countrySlug, title, description, className = "" }: StatesGridProps) {
  return (
    <section className={`states-grid ${className}`}>
      <div className="states-grid__container">
        <div className="states-grid__header">
          <h2 className="states-grid__title">{title}</h2>
          <p className="states-grid__description">{description}</p>
        </div>

        {/* States Grid */}
        <div className="states-grid__grid">
          {states.map((state) => (
            <InstantLink
              key={state}
              href={`/${countrySlug}/${state.toLowerCase().replace(/\s+/g, "-")}`}
              className="states-grid__state-link"
            >
              <h3 className="states-grid__state-title">{state}</h3>
            </InstantLink>
          ))}
        </div>
      </div>
    </section>
  );
}
