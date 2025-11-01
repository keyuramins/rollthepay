"use client";

import Link from "next/link";
import { useMemo } from "react";

interface AZFilterServerProps {
  basePath: string;
  currentLetter?: string;
  searchQuery?: string;
  availableLetters?: string[];
}

export function AZFilterServer({ basePath, currentLetter, searchQuery, availableLetters }: AZFilterServerProps) {
  const letters = useMemo(() => ["All", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))], []);
  const availableSet = useMemo(() => {
    return new Set((availableLetters ?? []).map(letter => letter.toLowerCase()));
  }, [availableLetters]);

  const buildHref = (letter: string) => {
    const params = new URLSearchParams();
    // If selecting "All", clear letter filter
    if (letter !== "All") {
      params.set('letter', letter.toLowerCase());
    }
    // Preserve search query if present
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    // Always reset to page 1 when changing letter filter -> hit paginated route
    const queryString = params.toString();
    const path = letter === "All" && !searchQuery ? basePath : `${basePath}/page/1`;
    return queryString ? `${path}?${queryString}` : path;
  };

  const isActive = (letter: string) => {
    if (letter === "All") {
      return !currentLetter;
    }
    return currentLetter?.toLowerCase() === letter.toLowerCase();
  };

  const hasResults = (letter: string) => {
    if (letter === "All") {
      return true;
    }
    if (!availableLetters || availableSet.size === 0) {
      return true;
    }
    return availableSet.has(letter.toLowerCase());
  };

  return (
    <div className="mt-4" role="region" aria-label="Alphabetical filter">
      {/* Mobile & Tablet */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-6 gap-4 sm:grid-cols-10 md:grid-cols-14">
          {letters.map((letter: string) => {
            const active = isActive(letter);
            const href = buildHref(letter);
            const disabled = !hasResults(letter);

            return (
              disabled ? (
                <span
                  key={letter}
                  className="px-1.5 sm:px-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg border border-input text-center min-h-[40px] sm:min-h-[44px] flex items-center justify-center bg-muted text-muted-foreground cursor-not-allowed opacity-40"
                  aria-disabled="true"
                >
                  {letter}
                </span>
              ) : (
                <Link
                  key={letter}
                  href={href}
                  className={`px-1.5 sm:px-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 rounded-lg border border-input text-center min-h-[40px] sm:min-h-[44px] flex items-center justify-center ${
                    active
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-card text-foreground hover:bg-muted hover:text-foreground cursor-pointer hover:shadow-sm active:bg-muted"
                  }`}
                  aria-pressed={active}
                  aria-label={`Filter by ${letter}`}
                >
                  {letter}
                </Link>
              )
            );
          })}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex justify-center">
        <div className="inline-flex rounded-lg overflow-hidden border border-input shadow-sm flex-shrink-0" role="group" aria-label="Alphabetical filter">
          {letters.map((letter: string, index: number) => {
            const active = isActive(letter);
            const href = buildHref(letter);
            const isFirst = index === 0;
            const isLast = index === letters.length - 1;
            const disabled = !hasResults(letter);

            return (
              disabled ? (
                <span
                  key={letter}
                  className={`px-2.5 py-2 text-sm font-medium transition-all duration-200 min-w-[36px] text-center ${
                    isFirst ? "rounded-l-lg" : ""
                  } ${isLast ? "rounded-r-lg" : ""} ${
                    !isFirst ? "border-l border-input" : ""
                  } bg-muted text-muted-foreground cursor-not-allowed opacity-40`}
                  aria-disabled="true"
                >
                  {letter}
                </span>
              ) : (
                <Link
                  key={letter}
                  href={href}
                  className={`px-2.5 py-2 text-sm font-medium transition-all duration-200 min-w-[36px] text-center ${
                    isFirst ? "rounded-l-lg" : ""
                  } ${isLast ? "rounded-r-lg" : ""} ${
                    !isFirst ? "border-l border-input" : ""
                  } ${
                    active
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-card text-foreground hover:bg-muted hover:text-foreground cursor-pointer hover:shadow-sm active:bg-muted"
                  }`}
                  aria-pressed={active}
                  aria-label={`Filter by ${letter}`}
                >
                  {letter}
                </Link>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}
