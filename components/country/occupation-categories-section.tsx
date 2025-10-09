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
    <section className="occupation-categories-section">
      <div className="occupation-categories-section__container">
        <div className="occupation-categories-section__header">
          <h2 className="occupation-categories-section__title">
            Explore Jobs by Category
          </h2>
          <p className="occupation-categories-section__description">
            Browse salary information organized by job categories and specializations.
          </p>
        </div>
        
        <div className="occupation-categories-section__grid">
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
