"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "./button";

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
  onFilteredItemsChange: (items: OccupationItem[]) => void;
  className?: string;
}

export function AZFilter({ items, onFilteredItemsChange, className = "" }: AZFilterProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>("all");

  // Generate all alphabet letters
  const allLetters = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
  }, []);

  // Get available letters from items
  const availableLetters = useMemo(() => {
    const uniqueLetters = new Set<string>();
    items.forEach(item => {
      const firstLetter = item.displayName.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        uniqueLetters.add(firstLetter);
      }
    });
    return uniqueLetters;
  }, [items]);

  // Filter items based on selected letter
  const filteredItems = useMemo(() => {
    if (selectedLetter === "all") {
      return items;
    }
    return items.filter(item => 
      item.displayName.charAt(0).toUpperCase() === selectedLetter
    );
  }, [items, selectedLetter]);

  // Update parent component when filtered items change
  useEffect(() => {
    onFilteredItemsChange(filteredItems);
  }, [filteredItems, onFilteredItemsChange]);

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedLetter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedLetter("all")}
          className="min-w-[40px]"
        >
          All
        </Button>
        {allLetters.map((letter) => {
          const isAvailable = availableLetters.has(letter);
          const isSelected = selectedLetter === letter;
          
          return (
            <Button
              key={letter}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => isAvailable && setSelectedLetter(letter)}
              disabled={!isAvailable}
              className={`min-w-[40px] ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {letter}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
