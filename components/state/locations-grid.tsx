import Link from "next/link";
import { getAllLocations } from "@/lib/db/queries";

interface LocationsGridProps {
  country: string;
  state: string;
  title: string;
  description: string;
  className?: string;
}

export async function LocationsGrid({ 
  country, 
  state, 
  title, 
  description, 
  className = "" 
}: LocationsGridProps) {
  // Get locations for this state using database query
  const locations = await getAllLocations(country, state);
  
  if (locations.length === 0) return null;

  return (
    <section 
      className={`py-16 ${className}`} 
      aria-labelledby="locations-grid-heading" 
      role="region"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header id="locations-grid-heading" className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-lg sm:text-base text-muted-foreground">{description}</p>
        </header>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {locations.map((location) => (
            <li key={location}>
              <Link
                href={`/${country}/${state.toLowerCase().replace(/\s+/g, "-")}/${location.toLowerCase().replace(/\s+/g, "-")}`}
                title={`Explore salaries in ${location}, ${state}`}
                aria-label={`Explore salaries in ${location}, ${state}`}
                className="block bg-card rounded-lg border p-6 hover:shadow-md transition-all hover:border-primary/50 hover:scale-105 text-center shadow-sm"
              >
                <h3 className="text-lg font-semibold text-foreground">{location}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
