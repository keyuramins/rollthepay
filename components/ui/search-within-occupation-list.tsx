"use client";

import { useState } from "react";

export function SearchWithinOccupationList({ setSearchQuery }: { setSearchQuery: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery("");
      setSearchQuery("");
    }
  };

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setSearchQuery(e.target.value);
      }}
      onKeyDown={handleKeyDown}
      placeholder="Search occupations by name..."
      className="w-full mx-auto my-4 xl:my-0 xl:mt-4 lg:w-80 rounded-lg border border-input px-3 py-2 text-sm shadow-sm focus:border-green-100 focus:ring-primary bg-white h-[36px] lg:h-[40px]"
    />
  );
}
