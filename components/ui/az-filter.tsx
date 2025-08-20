"use client";

import { useEffect, useState } from "react";

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
    <div className="mb-6">
      {/* Mobile & Tablet: Wrapped grid layout */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 px-1 sm:px-2">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;
            const hasItems = hasItemsForFilter(filter);
            const isDisabled = !hasItems;
            
            return (
              <button
                key={filter}
                onClick={() => hasItems && applyFilter(filter)}
                disabled={isDisabled}
                className={`
                  px-1.5 sm:px-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 
                  rounded-lg border border-gray-300 text-center min-h-[40px] sm:min-h-[44px] flex items-center justify-center
                  ${isActive && hasItems 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : hasItems 
                      ? 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer hover:shadow-sm active:bg-gray-100' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                  ${isDisabled ? 'opacity-25' : ''}
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Horizontal connected layout - no wrapping */}
      <div className="hidden lg:flex justify-center">
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-300 shadow-sm flex-shrink-0">
          {filters.map((filter, index) => {
            const isFirst = index === 0;
            const isLast = index === filters.length - 1;
            const isActive = selectedFilter === filter;
            const hasItems = hasItemsForFilter(filter);
            const isDisabled = !hasItems;
            
            return (
              <button
                key={filter}
                onClick={() => hasItems && applyFilter(filter)}
                disabled={isDisabled}
                className={`
                  px-2.5 py-2 text-sm font-medium transition-all duration-200 min-w-[36px] text-center
                  ${isFirst ? 'rounded-l-lg' : ''}
                  ${isLast ? 'rounded-r-lg' : ''}
                  ${!isFirst ? 'border-l border-gray-300' : ''}
                  ${isActive && hasItems 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : hasItems 
                      ? 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer hover:shadow-sm' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                  ${isDisabled ? 'opacity-25' : ''}
                `}
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
