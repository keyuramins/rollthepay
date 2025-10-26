"use client";

import { useMemo, useState } from "react";

interface OccupationItem {
  id: string;
  displayName: string;
  originalName: string;
  slug_url: string;
  location?: string;
  state?: string;
  avgAnnualSalary?: number;
  countrySlug: string;
}

interface AZFilterProps {
  items: OccupationItem[];
  onFilteredItemsChange: (filteredItems: OccupationItem[]) => void;
}

export function AZFilter({ items, onFilteredItemsChange }: AZFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const loading = !items || items.length === 0;

  const filters = useMemo(() => {
    if (!items || items.length === 0)
      return Array.from({ length: 27 }, (_, i) => `skeleton-${i}`);
    return ["All", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
  }, [items]);  
    
  const applyFilter = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === "All") {
      onFilteredItemsChange(items);
    } else {
      onFilteredItemsChange(
        items.filter((item) => item.displayName.toUpperCase().startsWith(filter))
      );
    }
  };

  const hasItemsForFilter = (filter: string) => filter === "All" || items.some((item) => item.displayName.toUpperCase().startsWith(filter));

  return (
    <div className="mb-6" role="region" aria-label="Alphabetical filter">
      {/* Mobile & Tablet */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 sm:gap-2 px-1 sm:px-2">
          {filters.map((filter: string, index: number) =>
            loading ? (
              <div
                key={index}
                className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg border border-input text-center h-[40px] sm:h-[44px] flex items-center justify-center bg-muted text-muted-foreground cursor-not-allowed opacity-25 animate-pulse"
                aria-hidden="true"
              />
            ) : (
              (() => {
                const isActive = selectedFilter === filter;
                const hasItems = hasItemsForFilter(filter);
                const isDisabled = !hasItems;

                let buttonClass =
                  "px-1.5 sm:px-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg border border-input text-center min-h-[40px] sm:min-h-[44px] flex items-center justify-center";
                if (isActive && hasItems) buttonClass += " bg-primary text-white border-primary shadow-sm";
                else if (hasItems)
                  buttonClass += " bg-card text-foreground hover:bg-muted hover:text-foreground cursor-pointer hover:shadow-sm active:bg-muted";
                else buttonClass += " bg-muted text-muted-foreground cursor-not-allowed opacity-25";

                return (
                  <button
                    key={filter}
                    onClick={() => hasItems && applyFilter(filter)}
                    disabled={isDisabled}
                    className={buttonClass}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${filter}`}
                  >
                    {filter}
                  </button>
                );
              })()
            )
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex justify-center">
        <div className="inline-flex rounded-lg overflow-hidden border border-input shadow-sm flex-shrink-0" role="group" aria-label="Alphabetical filter">
          {filters.map((filter: string, index: number) =>
            loading ? (
              <div
                key={index}
                className="px-2.5 py-2 text-sm font-medium transition-all duration-200 min-w-[36px] h-[36px] text-center bg-muted text-muted-foreground cursor-not-allowed opacity-25 animate-pulse flex items-center justify-center"
                aria-hidden="true"
              />
            ) : (
              (() => {
                const isFirst = index === 0;
                const isLast = index === filters.length - 1;
                const isActive = selectedFilter === filter;
                const hasItems = hasItemsForFilter(filter);
                const isDisabled = !hasItems;

                let buttonClass = "px-2.5 py-2 text-sm font-medium transition-all duration-200 min-w-[36px] text-center";
                if (isFirst) buttonClass += " rounded-l-lg";
                if (isLast) buttonClass += " rounded-r-lg";
                if (!isFirst) buttonClass += " border-l border-input";

                if (isActive && hasItems) buttonClass += " bg-primary text-white border-primary shadow-sm";
                else if (hasItems)
                  buttonClass += " bg-card text-foreground hover:bg-muted hover:text-foreground cursor-pointer hover:shadow-sm active:bg-muted";
                else buttonClass += " bg-muted text-muted-foreground cursor-not-allowed opacity-25";

                return (
                  <button
                    key={filter}
                    onClick={() => hasItems && applyFilter(filter)}
                    disabled={isDisabled}
                    className={buttonClass}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${filter}`}
                  >
                    {filter}
                  </button>
                );
              })()
            )
          )}
        </div>
      </div>
    </div>
  );
}
