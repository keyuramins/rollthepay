import { OccupationListItems } from "./occupation-list-items";
import { Pagination } from "./pagination";
import { SearchForm } from "./search-form";
import { AZFilterServer } from "./az-filter-server";
import type { OccupationListItem } from "@/lib/types/occupation-list";

interface OccupationListClientProps {
  items: OccupationListItem[];
  countrySlug: string;
  currentState?: string;
  currentLocation?: string;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  searchQuery?: string;
  letterFilter?: string;
  basePath?: string;
  hasNextPage?: boolean;
}

const PAGE_SIZE = 50;

/* ⚙️ Presentational client component - no filtering/pagination logic */
export function OccupationListClient({
  items,
  countrySlug,
  currentState,
  currentLocation,
  currentPage = 1,
  totalPages = 1,
  totalItems = items.length,
  searchQuery,
  letterFilter,
  basePath,
  hasNextPage,
}: OccupationListClientProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex flex-col items-center gap-4 xl:flex-row xl:justify-between xl:items-center">
        <AZFilterServer 
          basePath={basePath || `/${countrySlug}${currentState ? `/${currentState}` : ''}${currentLocation ? `/${currentLocation}` : ''}`}
          currentLetter={letterFilter}
          searchQuery={searchQuery}
        />
        <SearchForm 
          basePath={basePath || `/${countrySlug}${currentState ? `/${currentState}` : ''}${currentLocation ? `/${currentLocation}` : ''}`}
          currentQuery={searchQuery}
          letterFilter={letterFilter}
        />
      </div>
      
      {/* List + Pagination */}
      <OccupationListItems
        paginatedItems={items}
        totalItems={totalItems}
        PAGE_SIZE={PAGE_SIZE}
        currentPage={currentPage}
        totalPages={totalPages}
        countrySlug={countrySlug}
        currentState={currentState}
        currentLocation={currentLocation}
      />

      {(typeof hasNextPage === 'boolean' || totalPages > 1) && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath || `/${countrySlug}${currentState ? `/${currentState}` : ''}${currentLocation ? `/${currentLocation}` : ''}`}
          searchQuery={searchQuery}
          letterFilter={letterFilter}
          className="mt-6"
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
}