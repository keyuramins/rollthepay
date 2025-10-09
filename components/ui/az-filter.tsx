"use client";

import { useState } from "react";

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

  const generateFilters = () => {
    const filters = ["All"];
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      filters.push(letter);
    }
    return filters;
  };

  const filters: string[] = loading
  ? Array.from({ length: 26 }, (_, i) => `skeleton-${i}`)
  : generateFilters();


  const applyFilter = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === "All") {
      onFilteredItemsChange(items);
    } else {
      const filtered = items.filter((item) =>
        item.displayName.toUpperCase().startsWith(filter)
      );
      onFilteredItemsChange(filtered);
    }
  };

  const hasItemsForFilter = (filter: string) => {
    if (filter === "All") return true;
    return items.some((item) =>
      item.displayName.toUpperCase().startsWith(filter)
    );
  };

  return (
    <div className="az-filter">
      {/* Mobile & Tablet */}
      <div className="az-filter__mobile">
        <div className="az-filter__mobile-grid">
          {filters.map((filter, index) =>
            loading ? (
              <div
                key={index}
                className="h-10 sm:h-11 rounded-lg bg-muted/30 animate-pulse"
              />
            ) : (
              (() => {
                const isActive = selectedFilter === filter;
                const hasItems = hasItemsForFilter(filter);
                const isDisabled = !hasItems;

                let buttonClass = "az-filter__button";
                if (isActive && hasItems)
                  buttonClass += " az-filter__button--active";
                else if (hasItems)
                  buttonClass += " az-filter__button--inactive";
                else buttonClass += " az-filter__button--disabled";

                return (
                  <button
                    key={filter}
                    onClick={() => hasItems && applyFilter(filter)}
                    disabled={isDisabled}
                    className={buttonClass}
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
      <div className="az-filter__desktop">
        <div className="az-filter__desktop-container">
          {filters.map((filter, index) =>
            loading ? (
              <div
                key={index}
                className="h-10 sm:h-11 w-10 rounded-lg bg-muted/30 animate-pulse"
              />
            ) : (
              (() => {
                const isFirst = index === 0;
                const isLast = index === filters.length - 1;
                const isActive = selectedFilter === filter;
                const hasItems = hasItemsForFilter(filter);
                const isDisabled = !hasItems;

                let buttonClass = "az-filter__button--desktop";
                if (isFirst) buttonClass += " az-filter__button--desktop-first";
                if (isLast) buttonClass += " az-filter__button--desktop-last";
                if (!isFirst)
                  buttonClass += " az-filter__button--desktop-middle";

                if (isActive && hasItems)
                  buttonClass += " az-filter__button--active";
                else if (hasItems)
                  buttonClass += " az-filter__button--inactive";
                else buttonClass += " az-filter__button--disabled";

                return (
                  <button
                    key={filter}
                    onClick={() => hasItems && applyFilter(filter)}
                    disabled={isDisabled}
                    className={buttonClass}
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
