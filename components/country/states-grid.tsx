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
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {states.map((state) => (
            <InstantLink
              key={state}
              href={`/${countrySlug}/${state.toLowerCase().replace(/\s+/g, "-")}`}
              className="block bg-card rounded-lg border p-6 hover:shadow-md transition-all hover:border-primary/50 hover:scale-105 text-center shadow-sm"
            >
              <h3 className="text-lg font-semibold text-foreground">{state}</h3>
            </InstantLink>
          ))}
        </div>
      </div>
    </section>
  );
}
