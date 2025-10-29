"use client";

import { useState, useMemo, useEffect } from "react";
import { OccupationListItems } from "./occupation-list-items";
import { Pagination } from "./pagination";
import { SearchWithinOccupationList } from "./search-within-occupation-list";
import { AZFilter } from "../occupation/az-filter";
import type { OccupationListItem, OccupationListClientProps } from "@/lib/types/occupation-list";

/* 🔍 Search bar isolated so it can render inside server layout */
export function OccupationListSearchBar({
  onQueryChange,
}: {
  onQueryChange?: (q: string) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <SearchWithinOccupationList
      setSearchQuery={(q) => {
        setQuery(q);
        onQueryChange?.(q);
      }}
    />
  );
}

/* ⚙️ Main client component for filtering + pagination */
export function OccupationListClient({
  items,
  countrySlug,
  currentState,
  currentLocation,
}: OccupationListClientProps) {
  // Use precomputed displayName from producers - no redundant computation needed
  const preparedItems = useMemo(
    () =>
      items.map((item: OccupationListItem) => ({
        ...item,
        id: item.slug_url, // Ensure id is set for consistency
      })),
    [items]
  );
    // () =>
    //   items.map((item: any) => ({
    //     ...item,
    //     id: item.slug_url,
    //     displayName: `${item?.title} Salary ${item?.company_name ? item?.company_name : ''} ${(item?.location || item?.state || item?.country) ? " in " +  item?.location || item?.state || item?.country : '' }`
    //   })),
    // [items]

  const [filteredItems, setFilteredItems] = useState(preparedItems);
  useEffect(() => {
    setFilteredItems(preparedItems);
  }, [preparedItems]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  const visibleItems = useMemo(() => {
    return filteredItems.filter((item: OccupationListItem) =>
      item.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }, [filteredItems, query]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = visibleItems.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex flex-col items-center gap-4 xl:flex-row xl:justify-between xl:items-center">
      <AZFilter items={preparedItems} onFilteredItemsChange={setFilteredItems} />
      <SearchWithinOccupationList setSearchQuery={setQuery} />
      </div>
      {/* List + Pagination */}
      <OccupationListItems
        paginatedItems={paginatedItems}
        totalItems={visibleItems.length}
        PAGE_SIZE={PAGE_SIZE}
        currentPage={currentPage}
        totalPages={Math.ceil(visibleItems.length / PAGE_SIZE)}
        countrySlug={countrySlug}
        currentState={currentState}
        currentLocation={currentLocation}
      />

      {visibleItems.length > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(visibleItems.length / PAGE_SIZE)}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      )}
    </div>
  );
}
