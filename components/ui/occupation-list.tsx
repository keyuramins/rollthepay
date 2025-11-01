import { OccupationListClient } from "@/components/ui/occupation-list-client";

interface OccupationListProps {
  items: any[];
  title: string;
  description: string;
  className?: string;
  currentState?: string;
  currentLocation?: string;
  countrySlug: string;
  currentPage?: number; // deprecated in cursor mode
  totalPages?: number;  // deprecated in cursor mode
  totalItems?: number;  // deprecated in cursor mode
  searchQuery?: string;
  letterFilter?: string;
  basePath?: string;
  hasNextPage?: boolean;
}

export function OccupationList({
  items,
  title,
  description,
  className = "",
  currentState,
  currentLocation,
  countrySlug,
  currentPage = 1,
  totalPages = 1,
  totalItems = items.length,
  searchQuery,
  letterFilter,
  basePath,
  hasNextPage,
}: OccupationListProps) {
  return (
    <section className={`py-8 ${className}`} aria-labelledby="occupation-list-heading" role="region">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
          <h2
            id="occupation-list-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
          >
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>

        <OccupationListClient
          items={items}
          countrySlug={countrySlug}
          currentState={currentState}
          currentLocation={currentLocation}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          searchQuery={searchQuery}
          letterFilter={letterFilter}
          basePath={basePath}
          hasNextPage={hasNextPage}
        />
      </div>
    </section>
  );
}
