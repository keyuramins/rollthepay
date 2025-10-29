// components/navigation/searchable-dropdown.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { continents, CONTINENTS } from "@/app/constants/continents";
import { encodeSlugForURL, slugify } from "@/lib/format/slug";

interface Country {
  name: string;
  code: string;
  continent: string;
  slug: string;
}

// Using imported CONTINENTS from constants

// Flatten all countries from continents data
const COUNTRIES: Country[] = continents.flatMap(continent => 
  continent.countries.map(country => ({
    name: country.name,
    code: country.code,
    continent: country.continent,
    slug: country.slug
  }))
);

interface OccupationIndexItem {
  country: string; // lowercased
  title: string;
  slug: string;
  state: string | null;
  location: string | null;
  averageSalary?: number | null;
  currencyCode?: string | null;
}

interface SearchableDropdownProps {
  placeholder?: string;
  variant?: "light" | "dark";
  className?: string;
  fullWidth?: boolean;
  centered?: boolean;
  headerMode?: boolean; // new prop for header mode
}

export function SearchableDropdown({ 
  placeholder = "Search countries...", 
  variant = "light",
  className = "",
  fullWidth = false,
  centered = false,
  headerMode = false
}: SearchableDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(COUNTRIES);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">("bottom");
  const [occupationSuggestions, setOccupationSuggestions] = useState<OccupationIndexItem[]>([]);
  const [isOccupationDropdownOpen, setIsOccupationDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOccupationLoading, setIsOccupationLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [userRemovedCountry, setUserRemovedCountry] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const virtualListRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const arrowButtonRef = useRef<HTMLButtonElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [chipWidth, setChipWidth] = useState(0);
  
  const router = useRouter();
  const pathname = usePathname();

  // Determine if we are on the homepage
  const isHome = useMemo(() => pathname === "/", [pathname]);
  
  // In header mode, we're effectively in "home mode" for occupation search
  const isInSearchMode = useMemo(() => isHome || headerMode, [isHome, headerMode]);

  // Prefetching functionality removed - PostgreSQL queries are fast enough

  // Debounce user input to avoid recalculating on every keystroke
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Fetch occupations from API
  async function fetchOccupations(countrySlug: string, query: string) {
    if (!countrySlug || query.trim().length < 2) return [];
    
    try {
      const url = `/api/admin/occupations/search?country=${countrySlug}&q=${encodeURIComponent(query)}`;
      
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`Failed to fetch occupations: ${res.status}`);
  
      const data: { occupations: OccupationIndexItem[] } = await res.json();
      return data.occupations; // ✅ use the array inside the object
    } catch (err) {
      return [];
    }
  }
  
  // Handle occupation suggestions
  useEffect(() => {

    if (!(isInSearchMode && selectedCountry)) {
      setOccupationSuggestions([]);
      setIsOccupationDropdownOpen(false);
      return;
    }

    const term = debouncedQuery.trim();
    if (term.length < 2) {
      setOccupationSuggestions([]);
      setIsOccupationDropdownOpen(false);
      return;
    }

    setIsOccupationLoading(true);
    fetchOccupations(selectedCountry.slug, term)
      .then(results => {
        const formatted = results.map(r => ({ ...r, title: r.title.trim() }));
        setOccupationSuggestions(formatted);
        setIsOccupationDropdownOpen(formatted.length > 0);
        
      })
      .finally(() => setIsOccupationLoading(false));
  }, [debouncedQuery, selectedCountry, isInSearchMode]);

  // Filter countries
  useEffect(() => {
    if (isInSearchMode && selectedCountry) return;
    if (!searchQuery.trim()) {
      setFilteredCountries(COUNTRIES);
    } else {
      const term = searchQuery.toLowerCase();
      const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(term) || c.continent.toLowerCase().includes(term));
      setFilteredCountries(filtered);
    }
  }, [searchQuery, isInSearchMode, selectedCountry]);

  // Initialize selected country from URL
  useEffect(() => {
    if ((!isHome || headerMode) && !selectedCountry && !userRemovedCountry) {
      const seg = pathname.split('/').filter(Boolean)[0];
      if (seg) {
        const found = COUNTRIES.find(c => c.slug === seg.toLowerCase());
        if (found) setSelectedCountry(found);
      }
    }
  }, [pathname, selectedCountry, userRemovedCountry, isHome, headerMode]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsOccupationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown position
  useEffect(() => {
    if (!isDropdownOpen || !inputRef.current) return;
    const updatePosition = () => {
      const rect = inputRef.current!.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownPosition(spaceBelow < 300 && spaceAbove > 300 ? "top" : "bottom");
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isDropdownOpen]);

  // Chip width
  useEffect(() => {
    setChipWidth(chipRef.current?.offsetWidth ?? 0);
  }, [selectedCountry]);


  // Aggressive focus management - keep input focused at all times
  useEffect(() => {
    if (isInputFocused && inputRef.current) {
      const interval = setInterval(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 10); // Check every 10ms
      
      return () => clearInterval(interval);
    }
  }, [isInputFocused]);

  // Handle enter key
  async function handleEnter() {
    if (!selectedCountry) return;
    setIsLoading(true);
    setIsOccupationLoading(true);
    const query = searchQuery.trim();

    try {
      if (!query || occupationSuggestions.length === 0) {
        await router.push(`/${selectedCountry.slug}`);
      } else {
        const firstResult = occupationSuggestions[0];
        let url = `/${selectedCountry.slug}`;
        if (firstResult.state) {
          url += `/${slugify(firstResult.state)}`;
          if (firstResult.location) url += `/${slugify(firstResult.location)}`;
        }
        url += `/${encodeSlugForURL(firstResult.slug)}`;
        await router.push(url);
      }
    } finally {
      setIsLoading(false);
      setIsOccupationLoading(false);
    }
  }

  // Handle country select
  async function handleCountrySelect(country: Country) {
    if (isInSearchMode) {
      setSelectedCountry(country);
      setUserRemovedCountry(false);
      setIsDropdownOpen(false);
      setSearchQuery("");
      setOccupationSuggestions([]);
      setIsOccupationDropdownOpen(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setIsDropdownOpen(false);
      setIsLoading(true);
      await router.push(`/${country.slug}`);
      setIsLoading(false);
    }
  }

  // Handle occupation select
  async function handleOccupationSelect(occupation: OccupationIndexItem) {
    if (!selectedCountry) return;
    setIsLoading(true);
    setIsOccupationLoading(true);

    let url = `/${selectedCountry.slug}`;
    if (occupation.state) {
      url += `/${slugify(occupation.state)}`;
    }
    url += `/${encodeSlugForURL(occupation.slug)}`;
    setIsDropdownOpen(false);
    setIsOccupationDropdownOpen(false);
    setSearchQuery("");
    await router.push(url);

    setIsLoading(false);
    setIsOccupationLoading(false);
  }

  const inputValue = useMemo(() => {
    if (!isInSearchMode && selectedCountry && !searchQuery) return selectedCountry.name;
    return searchQuery;
  }, [isInSearchMode, selectedCountry, searchQuery]);

  const groupedCountries = CONTINENTS.map(continent => ({
    ...continent,
    countries: filteredCountries.filter(c => c.continent === continent.code)
  })).filter(g => g.countries.length > 0);

  const containerClasses = ['relative', fullWidth ? 'w-full' : 'w-auto', centered ? 'mx-auto' : '', className].filter(Boolean).join(' ');

  return (
    <div ref={dropdownRef} className={containerClasses}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-primary opacity-40" />
        </div>

        {isInSearchMode && selectedCountry && (
          <div className="absolute inset-y-0 left-12 flex items-center z-10">
            <span ref={chipRef} className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-primary text-sm">
              {selectedCountry.name}
              <button
                aria-label="Remove selected country"
                className="ml-2 hover:text-primary"
                onClick={e => {
                  e.preventDefault();
                  setSelectedCountry(null);
                  setUserRemovedCountry(true);
                  setSearchQuery("");
                  setIsDropdownOpen(true);
                  setIsOccupationDropdownOpen(false);
                  setOccupationSuggestions([]);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder={
            isInSearchMode && selectedCountry
              ? `Search occupations in ${selectedCountry.name}...`
              : isInSearchMode && userRemovedCountry
              ? "Select a country..."
              : placeholder
          }
          value={inputValue}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => {
            setIsInputFocused(true);
            if (isInSearchMode && selectedCountry && searchQuery.trim().length >= 2) {
              setIsOccupationDropdownOpen(true);
            } else {
              setIsDropdownOpen(true);
            }
          }}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (!relatedTarget || !dropdownRef.current?.contains(relatedTarget)) {
              setIsInputFocused(false);
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && isInSearchMode && selectedCountry) {
              e.preventDefault();
              handleEnter();
            } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && isInSearchMode && selectedCountry) {
              setIsOccupationDropdownOpen(true);
            }
          }}
          disabled={isLoading || isOccupationLoading}
          className={`block ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} pr-10 py-3 border rounded-lg bg-background text-black leading-5 focus:outline-none shadow-md transition-all duration-200 border-input placeholder-muted-foreground disabled:cursor-not-allowed`}
          style={{ paddingLeft: (isInSearchMode && selectedCountry) ? 48 + chipWidth + 16 : 48 }}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              aria-label="Clear search query"
              className="mr-2"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            >
              <X className="h-4 w-4 text-primary hover:text-primary" />
            </button>
          )}
          {isInSearchMode && selectedCountry && (
            <button
              aria-label="Search occupations"
              ref={arrowButtonRef}
              type="button"
              onClick={handleEnter}
              disabled={isLoading || isOccupationLoading || isDropdownOpen || isOccupationDropdownOpen}
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary text-primary bg-background hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading || isOccupationLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {isDropdownOpen && (!isInSearchMode || !selectedCountry) && (
        <div className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full'} left-0 ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} bg-background rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border`}>
          <div className="py-1 max-h-[300px] overflow-y-auto">
            {groupedCountries.length > 0 ? groupedCountries.map(continent => (
              <div key={continent.code}>
                <div className="px-4 py-2 text-sm font-semibold text-foreground bg-muted border-b">{continent.name}</div>
                {continent.countries.map(country => (
                  <button
                    type="button"
                    aria-label={`Select ${country.name}`}
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors duration-150 cursor-pointer"
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            )) : (
              <div className="px-4 py-6 text-center text-muted-foreground">No countries found matching "{searchQuery}"</div>
            )}
          </div>
        </div>
      )}

      {isInSearchMode && selectedCountry && isOccupationDropdownOpen && (
        <div className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full'} left-0 ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} bg-background rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border`}>
          <div ref={virtualListRef} className="py-1 max-h-[300px] overflow-y-auto" onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
            {occupationSuggestions.map(s => {
              const region = [s.state, s.location].filter(Boolean).join(' • ');
              return (
                <button
                  type="button"
                  aria-label={`Select ${s.title}`}
                  key={`${s.slug}-${s.state ?? 'na'}-${s.location ?? 'na'}`}
                  onClick={() => handleOccupationSelect(s)}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors duration-150 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{s.title}</div>
                      {region && <div className="text-xs text-muted-foreground mt-0.5 truncate">{region}</div>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}