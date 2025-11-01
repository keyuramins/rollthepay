"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchFormProps {
  basePath: string;
  currentQuery?: string;
  letterFilter?: string;
}

export function SearchForm({ basePath, currentQuery = "", letterFilter }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    // Preserve letter filter if present
    if (letterFilter) {
      params.set('letter', letterFilter);
    }
    // Reset to page 1 when searching -> hit paginated route
    const queryString = params.toString();
    const path = query.trim() === "" && !letterFilter ? basePath : `${basePath}/page/1`;
    router.push(queryString ? `${path}?${queryString}` : path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery("");
      // Navigate to base path without query
      const params = new URLSearchParams();
      if (letterFilter) {
        params.set('letter', letterFilter);
      }
      const queryString = params.toString();
      const path = letterFilter ? `${basePath}/page/1` : basePath;
      router.push(queryString ? `${path}?${queryString}` : path);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full xl:w-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search occupations by name..."
        className="w-full mx-auto my-4 xl:my-0 xl:mt-4 lg:w-80 rounded-lg border border-input px-3 py-2 text-sm shadow-sm focus:border-green-100 focus:ring-primary bg-white h-[36px] lg:h-[40px]"
      />
    </form>
  );
}
