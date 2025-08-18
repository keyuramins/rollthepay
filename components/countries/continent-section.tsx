import { CountryCard } from "./country-card";

interface ContinentSectionProps {
  continent: {
    name: string;
    code: string;
    description: string;
    countries: Array<{
      name: string;
      slug: string;
      count: number;
      avgSalary: number;
    }>;
  };
}

export function ContinentSection({ continent }: ContinentSectionProps) {
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{continent.name}</h2>
        <p className="text-lg text-gray-600">{continent.description}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {continent.countries.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </div>
      
      {continent.countries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <p className="text-gray-500">No salary data available for this region yet.</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon for updates!</p>
        </div>
      )}
    </div>
  );
}
