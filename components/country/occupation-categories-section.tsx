import { OccupationCategoryCard } from "./occupation-category-card";

interface OccupationCategoriesSectionProps {
  occupationGroups: Array<{
    occupation: string;
    records: Array<{
      slug_url: string;
      title: string;
      location?: string;
      state?: string;
      avgAnnualSalary?: number;
    }>;
    avgSalary: number;
  }>;
  countrySlug: string;
}

export function OccupationCategoriesSection({ 
  occupationGroups, 
  countrySlug 
}: OccupationCategoriesSectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Jobs by Category
          </h2>
          <p className="text-lg text-gray-600">
            Browse salary information organized by job categories and specializations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {occupationGroups.map(({ occupation, records, avgSalary }) => (
            <OccupationCategoryCard
              key={occupation}
              occupation={occupation}
              records={records}
              countrySlug={countrySlug}
              avgSalary={avgSalary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
