"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, ChevronDown, X, Check, ArrowRight, Loader2 } from "lucide-react";
import { prefetchRoute } from "@/lib/prefetch";

interface Country {
  name: string;
  code: string;
  continent: string;
  slug: string;
}

const CONTINENTS = [
  { name: "Africa", code: "africa" },
  { name: "Asia", code: "asia" },
  { name: "Europe", code: "europe" },
  { name: "Middle East", code: "middle_east" },
  { name: "North America", code: "north_america" },
  { name: "Oceania", code: "oceania" },
  { name: "South America", code: "south_america" },
];

const COUNTRIES: Country[] = [
  { name: "Australia", code: "AU", continent: "oceania", slug: "australia" },
  { name: "India", code: "IN", continent: "asia", slug: "india" },
  { name: "United States", code: "US", continent: "north_america", slug: "united-states" },
  { name: "United Kingdom", code: "GB", continent: "europe", slug: "united-kingdom" },
  { name: "Canada", code: "CA", continent: "north_america", slug: "canada" },
  { name: "Germany", code: "DE", continent: "europe", slug: "germany" },
  { name: "France", code: "FR", continent: "europe", slug: "france" },
  { name: "Japan", code: "JP", continent: "asia", slug: "japan" },
  { name: "Brazil", code: "BR", continent: "south_america", slug: "brazil" },
  { name: "South Africa", code: "ZA", continent: "africa", slug: "south-africa" },
];

interface OccupationIndexItem {
  country: string; // lowercased
  title: string;
  slug: string; // slug_url
  state: string | null;
  location: string | null;
}

interface SearchableDropdownProps {
  placeholder?: string;
  variant?: "light" | "dark";
  className?: string;
  fullWidth?: boolean;
  centered?: boolean;
  allOccupations?: OccupationIndexItem[]; // provided on home for suggestions
}

export function SearchableDropdown({ 
  placeholder = "Search countries...", 
  variant = "light",
  className = "",
  fullWidth = false,
  centered = false,
  allOccupations = []
}: SearchableDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(COUNTRIES);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">("bottom");
  interface OccupationSuggestion extends OccupationIndexItem { display: string }
  const [occupationSuggestions, setOccupationSuggestions] = useState<OccupationSuggestion[]>([]);
  const [isOccupationDropdownOpen, setIsOccupationDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [isOccupationLoading, setIsOccupationLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const [chipWidth, setChipWidth] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Determine if we are on the homepage
  const isHome = useMemo(() => pathname === "/", [pathname]);

  // Enhanced prefetching for all country pages on mount
  useEffect(() => {
    console.log('🚀 Prefetching all country pages...');
    COUNTRIES.forEach(country => {
      prefetchRoute(`/${country.slug}`).catch(error => {
        console.log(`⚠️ Failed to prefetch ${country.slug}:`, error);
      });
    });
  }, []);

  // Enhanced prefetching for occupation pages when suggestions are available
  useEffect(() => {
    if (occupationSuggestions.length > 0 && selectedCountry) {
      console.log(`🚀 Prefetching ${occupationSuggestions.length} occupation pages for ${selectedCountry.name}...`);
      occupationSuggestions.slice(0, 10).forEach(suggestion => {
        let url = `/${selectedCountry.slug}`;
        
        if (suggestion.state) {
          const normalizedState = suggestion.state.toLowerCase().replace(/\s+/g, '-');
          url += `/${normalizedState}`;
          
          if (suggestion.location) {
            const normalizedLocation = suggestion.location.toLowerCase().replace(/\s+/g, '-');
            url += `/${normalizedLocation}`;
          }
        }
        
        url += `/${suggestion.slug}`;
        prefetchRoute(url).catch(error => {
          console.log(`⚠️ Failed to prefetch occupation ${suggestion.slug}:`, error);
        });
      });
    }
  }, [occupationSuggestions, selectedCountry]);

  // Prefetch state pages for selected country
  useEffect(() => {
    if (selectedCountry && allOccupations.length > 0) {
      const countryOccupations = allOccupations.filter(o => o.country === selectedCountry.slug);
      const states = new Set(countryOccupations.map(o => o.state).filter(Boolean));
      
      console.log(`🚀 Prefetching ${states.size} state pages for ${selectedCountry.name}...`);
      states.forEach(state => {
        if (state) {
          const normalizedState = state.toLowerCase().replace(/\s+/g, '-');
          const stateUrl = `/${selectedCountry.slug}/${normalizedState}`;
          prefetchRoute(stateUrl).catch(error => {
            console.log(`⚠️ Failed to prefetch state ${state}:`, error);
          });
        }
      });
    }
  }, [selectedCountry, allOccupations]);

  // Filter countries based on search query (when no country selected or not on home)
  useEffect(() => {
    // If a country is already selected on homepage, we're in occupation search mode.
    if (isHome && selectedCountry) return;

    if (searchQuery.trim() === "") {
      setFilteredCountries(COUNTRIES);
    } else {
      const term = searchQuery.toLowerCase();
      const filtered = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(term) ||
        country.continent.toLowerCase().includes(term)
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, isHome, selectedCountry]);

  // Build occupation suggestions when searching after a country is picked (home only)
  useEffect(() => {
    if (!(isHome && selectedCountry)) {
      if (occupationSuggestions.length !== 0) setOccupationSuggestions([]);
      if (isOccupationDropdownOpen) setIsOccupationDropdownOpen(false);
      return;
    }
    const term = searchQuery.trim().toLowerCase();
    
    // Only show occupation dropdown if user has typed at least 3 characters
    if (term.length < 3) {
      setOccupationSuggestions([]);
      setIsOccupationDropdownOpen(false);
      return;
    }
    
    const pool: OccupationSuggestion[] = allOccupations
      .filter(o => o.country === selectedCountry.slug)
      .map(o => ({ ...o, display: o.title.replace(/^Average\s+/i, "").trim() }))
      .sort((a, b) => a.display.localeCompare(b.display));

    const matches = pool.filter(o => o.display.toLowerCase().includes(term));
    setOccupationSuggestions(matches);
    setIsOccupationDropdownOpen(true);
  }, [searchQuery, isHome, selectedCountry, allOccupations, isOccupationDropdownOpen, occupationSuggestions.length]);

  // Initialize selected country from URL on non-home pages
  useEffect(() => {
    if (!isHome && !selectedCountry) {
      const seg = pathname.split('/').filter(Boolean)[0];
      if (seg) {
        const found = COUNTRIES.find(c => c.slug === seg.toLowerCase());
        if (found) setSelectedCountry(found);
      }
    }
  }, [isHome, pathname, selectedCountry]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsOccupationDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine dropdown position based on available space
  useEffect(() => {
    if (!isDropdownOpen || !inputRef.current) return;

    const updatePosition = () => {
      if (!inputRef.current) return;
      
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Need at least 300px for dropdown, otherwise show above
      setDropdownPosition(spaceBelow < 300 && spaceAbove > 300 ? "top" : "bottom");
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isDropdownOpen]);

  // Measure inline country tag width to pad input accordingly
  useEffect(() => {
    if (!chipRef.current) {
      setChipWidth(0);
      return;
    }
    setChipWidth(chipRef.current.offsetWidth);
  }, [selectedCountry]);

  const groupedCountries = CONTINENTS.map(continent => ({
    ...continent,
    countries: filteredCountries.filter(country => country.continent === continent.code)
  })).filter(group => group.countries.length > 0);

  // Always use light styling for better visibility
  const isLight = true;
  
  const inputBgClass = "bg-white";
  const inputTextClass = "text-gray-900 placeholder-gray-500";
  const inputBorderClass = "border-gray-300 focus:border-blue-500";
  const iconColor = "text-blue-600";
  const dropdownBgClass = "bg-white";

  const containerClasses = [
    'relative',
    fullWidth ? 'w-full' : 'w-auto',
    centered ? 'mx-auto' : '',
    className
  ].filter(Boolean).join(' ');

  function slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function handleEnter() {
    setIsLoading(true);
    //if (!isHome) return; // occupation search only on home
    if (!selectedCountry) return; // need a country first
    const query = searchQuery.trim();
    
    console.log('🚀 handleEnter: Starting navigation...');
    setIsOccupationLoading(true);
    
    // Add a minimum loading time to ensure spinner is visible
    // const startTime = Date.now();
    // const minLoadingTime = 500; // 500ms minimum loading time
    
    try {
      if (query.length === 0) {
        console.log('🚀 handleEnter: Navigating to country page');
        await router.push(`/${selectedCountry.slug}`);
      } else if (occupationSuggestions.length > 0) {
        // If there are occupation suggestions, go to the first result
        const firstResult = occupationSuggestions[0];
        console.log('🚀 handleEnter: Navigating to occupation page:', firstResult.display);
        
        // Build the URL according to our routing rules
        let url = `/${selectedCountry.slug}`;
        
        if (firstResult.state) {
          const normalizedState = firstResult.state.toLowerCase().replace(/\s+/g, '-');
          url += `/${normalizedState}`;
          
          if (firstResult.location) {
            const normalizedLocation = firstResult.location.toLowerCase().replace(/\s+/g, '-');
            url += `/${normalizedLocation}`;
          }
        }
        
        url += `/${firstResult.slug}`;
        await router.push(url);
      } else {
        // If no results found, go to the country page
        console.log('🚀 handleEnter: No results found, navigating to country page');
        await router.push(`/${selectedCountry.slug}`);
      }
    } finally {
      // Ensure minimum loading time for better UX
      // const elapsed = Date.now() - startTime;
      // const remaining = Math.max(0, minLoadingTime - elapsed);
      
      // console.log(`⏱️ handleEnter: Loading time - elapsed: ${elapsed}ms, remaining: ${remaining}ms`);
      
      // setTimeout(() => {
      //   console.log('✅ handleEnter: Clearing loading states');
      //   setIsLoading(false);
      //   setIsOccupationLoading(false);
      // }, remaining);
    }
  }

  async function handleCountrySelect(country: Country) {
    if (isHome) {
      setSelectedCountry(country);
      setIsDropdownOpen(false);
      setSearchQuery("");
      // Don't immediately open occupations dropdown - wait for user to type
      setOccupationSuggestions([]);
      setIsOccupationDropdownOpen(false);
      // Focus the input field after country selection
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    } else {
      setIsCountryLoading(true);
      
      // Add a minimum loading time to ensure spinner is visible
      const startTime = Date.now();
      const minLoadingTime = 300; // 300ms minimum loading time
      
      try {
        setIsDropdownOpen(false);
        await router.push(`/${country.slug}`);
      } finally {
        // Ensure minimum loading time for better UX
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadingTime - elapsed);
        
        setTimeout(() => {
          setIsCountryLoading(false);
        }, remaining);
      }
    }
  }

  async function handleOccupationSelect(suggestion: OccupationSuggestion) {
    setIsLoading(true);
    setIsOccupationLoading(true);
    
    // Add a minimum loading time to ensure spinner is visible
    const startTime = Date.now();
    const minLoadingTime = 500; // 500ms minimum loading time
    
    try {
      setIsDropdownOpen(false);
      setIsOccupationDropdownOpen(false);
      setSearchQuery("");
      
      // Build the URL according to our routing rules
      let url = `/${selectedCountry!.slug}`;
      
      if (suggestion.state) {
        const normalizedState = suggestion.state.toLowerCase().replace(/\s+/g, '-');
        url += `/${normalizedState}`;
        
        if (suggestion.location) {
          const normalizedLocation = suggestion.location.toLowerCase().replace(/\s+/g, '-');
          url += `/${normalizedLocation}`;
        }
      }
      
      url += `/${suggestion.slug}`;
      await router.push(url);
    } finally {
      // Ensure minimum loading time for better UX
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadingTime - elapsed);
      
      setTimeout(() => {
        setIsLoading(false);
        setIsOccupationLoading(false);
      }, remaining);
    }
  }

  const inputValue = useMemo(() => {
    if (!isHome && selectedCountry && searchQuery === "") {
      return selectedCountry.name; // show selected by default on non-home pages
    }
    return searchQuery;
  }, [isHome, selectedCountry, searchQuery]);

  return (
    <div ref={dropdownRef} className={containerClasses}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${iconColor} opacity-40`} />
        </div>
        {/* Inline tag area inside input */}
        {isHome && selectedCountry && (
          <div className="absolute inset-y-0 left-10 flex items-center">
            <span ref={chipRef} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
              {selectedCountry.name}
              <button
                aria-label="Remove selected country"
                className="ml-2 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCountry(null);
                  setSearchQuery("");
                  setIsDropdownOpen(false);
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
            isHome && selectedCountry
              ? `Search occupations in ${selectedCountry.name}...`
              : placeholder
          }
          value={inputValue}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (isHome && selectedCountry) {
              // Only open occupation dropdown if user has typed at least 3 characters
              if (searchQuery.trim().length >= 3) {
                setIsOccupationDropdownOpen(true);
              }
            } else {
              setIsDropdownOpen(true);
            }
            if (!isHome && selectedCountry && searchQuery === "") {
              setTimeout(() => {
                if (inputRef.current) {
                  const val = inputRef.current.value;
                  inputRef.current.setSelectionRange(0, val.length);
                }
              }, 0);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Only allow occupation search on home after picking a country
              if (isHome && selectedCountry) {
                e.preventDefault();
                handleEnter();
              }
            } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && isHome && selectedCountry) {
              setIsOccupationDropdownOpen(true);
            }
          }}
          className={`block ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} pr-10 py-3 border rounded-lg text-base leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-200 ${
            isLoading || isOccupationLoading 
              ? 'border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-700' 
              : `${inputBorderClass} ${inputBgClass} ${inputTextClass}`
          }`}
          style={{ 
            paddingLeft: (isHome && selectedCountry) ? 48 + chipWidth + 12 : 48,
            paddingRight: (isHome && selectedCountry) ? 80 : undefined
          }}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="mr-2"
            >
              <X className={`h-4 w-4 ${iconColor} hover:text-blue-700`} />
            </button>
          )}
          {isHome && selectedCountry && (
            <button
              type="button"
              onClick={() => {
                console.log('🔘 Button clicked! Loading states:', { isLoading, isOccupationLoading });
                handleEnter();
              }}
              disabled={isLoading || isOccupationLoading}
              aria-label="Go to results"
              title={
                searchQuery.trim().length === 0 
                  ? `Go to ${selectedCountry.name}` 
                  : occupationSuggestions.length > 0 
                    ? `Go to first result: ${occupationSuggestions[0].display}` 
                    : `Go to ${selectedCountry.name}`
              }
              className={`mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 ${
                isLoading || isOccupationLoading 
                  ? 'border-blue-400 text-blue-400 bg-blue-50 cursor-not-allowed' 
                  : 'border-blue-600 text-blue-600 bg-white hover:bg-blue-50 cursor-pointer'
              }`}
            >
              {isLoading || isOccupationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (isHome && selectedCountry) {
                setIsOccupationDropdownOpen(!isOccupationDropdownOpen);
              } else {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            <ChevronDown 
              className={`h-5 w-5 ${iconColor} ${(isHome && selectedCountry ? isOccupationDropdownOpen : isDropdownOpen) ? 'transform rotate-180' : ''} transition-transform duration-200`}
            />
          </button>
        </div>
      </div>

      {/* Inline tag moved inside the input above */}

      {isDropdownOpen && (!isHome || !selectedCountry) && (
        <div 
          className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} ${dropdownBgClass} rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border border-gray-200`}
        >
          <div className="py-1 max-h-[300px] overflow-y-auto">
            {groupedCountries.length > 0 ? (
              groupedCountries.map((continent) => (
                <div key={continent.code}>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
                    {continent.name}
                  </div>
                  {continent.countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      disabled={isCountryLoading}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{country.name}</span>
                      {isCountryLoading && selectedCountry?.code === country.code ? (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      ) : selectedCountry?.code === country.code ? (
                        <Check className="h-4 w-4 text-blue-600" />
                      ) : null}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No countries found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Occupation suggestions dropdown (home after country selection) */}
      {isHome && selectedCountry && isOccupationDropdownOpen && (
        <div 
          className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} ${dropdownBgClass} rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border border-gray-200`} 
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="py-1 max-h-[300px] overflow-y-auto">
            {occupationSuggestions.map(s => (
              <button
                key={`${s.slug}-${s.state ?? 'na'}`}
                onClick={() => handleOccupationSelect(s)}
                disabled={isLoading || isOccupationLoading}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span>{s.display}</span>
                {(isLoading || isOccupationLoading) && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}