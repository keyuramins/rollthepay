"use client";

import { useState } from "react";

export function SearchWithinOccupationList({ setSearchQuery }: { setSearchQuery: (query: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setSearchQuery(e.target.value);
      }}
      placeholder="Search occupations..."
      className="w-full lg:w-80 rounded-lg border border-input px-3 py-2 shadow-sm focus:border-green-100 focus:ring-primary bg-white"
    />
  );
}
