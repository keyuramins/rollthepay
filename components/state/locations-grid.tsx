import Link from "next/link";
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
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {locations.map((location) => (
            <Link
              key={location}
              href={`/${country}/${state.toLowerCase().replace(/\s+/g, "-")}/${location.toLowerCase().replace(/\s+/g, "-")}`}
              className="block bg-white rounded-lg border border-gray-300 p-6 hover:shadow-md transition-all hover:border-blue-300 hover:scale-105 text-center shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">{location}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
