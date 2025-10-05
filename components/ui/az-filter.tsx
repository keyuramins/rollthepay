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

  // Generate A-Z filters with availability check
  const generateFilters = () => {
    const filters = ["All"];
    
    // Check which letters have items starting with them
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const hasItems = items.some(item => 
        item.displayName.toUpperCase().startsWith(letter)
      );
      filters.push(letter);
    }
    
    return filters;
  };

  const filters = generateFilters();

  // Apply filter
  const applyFilter = (filter: string) => {
    setSelectedFilter(filter);
    
    if (filter === "All") {
      onFilteredItemsChange(items);
    } else {
      const filtered = items.filter(item => 
        item.displayName.toUpperCase().startsWith(filter)
      );
      onFilteredItemsChange(filtered);
    }
  };

  // Check if a filter has items
  const hasItemsForFilter = (filter: string) => {
    if (filter === "All") return true;
    return items.some(item => 
      item.displayName.toUpperCase().startsWith(filter)
    );
  };

  return (
    <div className="az-filter">
      {/* Mobile & Tablet: Wrapped grid layout */}
      <div className="az-filter__mobile">
        <div className="az-filter__mobile-grid">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;
            const hasItems = hasItemsForFilter(filter);
            const isDisabled = !hasItems;
            
            let buttonClass = "az-filter__button";
            if (isActive && hasItems) {
              buttonClass += " az-filter__button--active";
            } else if (hasItems) {
              buttonClass += " az-filter__button--inactive";
            } else {
              buttonClass += " az-filter__button--disabled";
            }
            
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
          })}
        </div>
      </div>

      {/* Desktop: Horizontal connected layout - no wrapping */}
      <div className="az-filter__desktop">
        <div className="az-filter__desktop-container">
          {filters.map((filter, index) => {
            const isFirst = index === 0;
            const isLast = index === filters.length - 1;
            const isActive = selectedFilter === filter;
            const hasItems = hasItemsForFilter(filter);
            const isDisabled = !hasItems;
            
            let buttonClass = "az-filter__button--desktop";
            if (isFirst) buttonClass += " az-filter__button--desktop-first";
            if (isLast) buttonClass += " az-filter__button--desktop-last";
            if (!isFirst) buttonClass += " az-filter__button--desktop-middle";
            
            if (isActive && hasItems) {
              buttonClass += " az-filter__button--active";
            } else if (hasItems) {
              buttonClass += " az-filter__button--inactive";
            } else {
              buttonClass += " az-filter__button--disabled";
            }
            
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
          })}
        </div>
      </div>
    </div>
  );
}
