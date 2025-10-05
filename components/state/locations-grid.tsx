import { InstantLink } from "@/components/ui/enhanced-link";
import { getDataset } from "@/lib/data/parse";

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
  // Get locations from the dataset
  const { all } = await getDataset();
  const locations = Array.from(new Set(
    all
      .filter(rec => rec.country.toLowerCase() === country.toLowerCase() && rec.state === state)
      .map(rec => rec.location)
      .filter(Boolean)
  )) as string[];
  
  if (locations.length === 0) {
    return null; // Don't render if no locations
  }
  
  return (
    <section className={`locations-grid ${className}`}>
      <div className="locations-grid__container">
        <div className="locations-grid__header">
          <h2 className="locations-grid__title">{title}</h2>
          <p className="locations-grid__description">{description}</p>
        </div>

        {/* Locations Grid */}
        <div className="locations-grid__grid">
          {locations.map((location) => (
            <InstantLink
              key={location}
              href={`/${country}/${state.toLowerCase().replace(/\s+/g, "-")}/${location.toLowerCase().replace(/\s+/g, "-")}`}
              className="locations-grid__location-link"
            >
              <h3 className="locations-grid__location-title">{location}</h3>
            </InstantLink>
          ))}
        </div>
      </div>
    </section>
  );
}
