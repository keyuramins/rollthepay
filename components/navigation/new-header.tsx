"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Search, ArrowRight, Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// Define continents and their countries based on available data
const continents = [
  {
    name: "Africa",
    code: "africa",
    countries: [
      { name: "South Africa", slug: "south-africa" },
      { name: "Nigeria", slug: "nigeria" },
      { name: "Kenya", slug: "kenya" },
      { name: "Egypt", slug: "egypt" },
      { name: "Morocco", slug: "morocco" },
      { name: "Ghana", slug: "ghana" },
      { name: "Ethiopia", slug: "ethiopia" },
      { name: "Tanzania", slug: "tanzania" },
      { name: "Uganda", slug: "uganda" },
      { name: "Algeria", slug: "algeria" }
    ]
  },
  {
    name: "Asia",
    code: "asia",
    countries: [
      { name: "India", slug: "india" },
      { name: "China", slug: "china" },
      { name: "Japan", slug: "japan" },
      { name: "South Korea", slug: "south-korea" },
      { name: "Singapore", slug: "singapore" },
      { name: "Turkey", slug: "turkey" },
      { name: "Thailand", slug: "thailand" },
      { name: "Vietnam", slug: "vietnam" },
      { name: "Malaysia", slug: "malaysia" },
      { name: "Indonesia", slug: "indonesia" }
    ]
  },
  {
    name: "Europe",
    code: "europe",
    countries: [
      { name: "United Kingdom", slug: "united-kingdom" },
      { name: "Germany", slug: "germany" },
      { name: "France", slug: "france" },
      { name: "Italy", slug: "italy" },
      { name: "Spain", slug: "spain" },
      { name: "Netherlands", slug: "netherlands" },
      { name: "Switzerland", slug: "switzerland" },
      { name: "Sweden", slug: "sweden" },
      { name: "Norway", slug: "norway" },
      { name: "Denmark", slug: "denmark" }
    ]
  },
  {
    name: "Middle East",
    code: "middle_east",
    countries: [
      { name: "United Arab Emirates", slug: "united-arab-emirates" },
      { name: "Saudi Arabia", slug: "saudi-arabia" },
      { name: "Israel", slug: "israel" },
      { name: "Qatar", slug: "qatar" },
      { name: "Kuwait", slug: "kuwait" },
      { name: "Bahrain", slug: "bahrain" },
      { name: "Oman", slug: "oman" },
      { name: "Jordan", slug: "jordan" },
      { name: "Lebanon", slug: "lebanon" }
    ]
  },
  {
    name: "North America",
    code: "north_america",
    countries: [
      { name: "United States", slug: "united-states" },
      { name: "Canada", slug: "canada" },
      { name: "Mexico", slug: "mexico" },
      { name: "Costa Rica", slug: "costa-rica" },
      { name: "Panama", slug: "panama" },
      { name: "Guatemala", slug: "guatemala" },
      { name: "Honduras", slug: "honduras" },
      { name: "El Salvador", slug: "el-salvador" },
      { name: "Nicaragua", slug: "nicaragua" },
      { name: "Belize", slug: "belize" }
    ]
  },
  {
    name: "Oceania",
    code: "oceania",
    countries: [
      { name: "Australia", slug: "australia" },
      { name: "New Zealand", slug: "new-zealand" },
      { name: "Fiji", slug: "fiji" },
      { name: "Papua New Guinea", slug: "papua-new-guinea" },
      { name: "Solomon Islands", slug: "solomon-islands" },
      { name: "Vanuatu", slug: "vanuatu" },
      { name: "Samoa", slug: "samoa" },
      { name: "Tonga", slug: "tonga" },
      { name: "Micronesia", slug: "micronesia" },
      { name: "Palau", slug: "palau" }
    ]
  },
  {
    name: "South America",
    code: "south_america",
    countries: [
      { name: "Brazil", slug: "brazil" },
      { name: "Argentina", slug: "argentina" },
      { name: "Chile", slug: "chile" },
      { name: "Colombia", slug: "colombia" },
      { name: "Peru", slug: "peru" },
      { name: "Venezuela", slug: "venezuela" },
      { name: "Ecuador", slug: "ecuador" },
      { name: "Bolivia", slug: "bolivia" },
      { name: "Paraguay", slug: "paraguay" },
      { name: "Uruguay", slug: "uruguay" }
    ]
  }
];

// Header-specific occupation searchable dropdown component
type HeaderOccupation = {
  country: string;
  title: string;
  slug: string;
  state: string | null;
  location: string | null;
  averageSalary?: number | null;
  currencyCode?: string | null;
};

function HeaderSearchableDropdown({ allOccupations = [] as Array<HeaderOccupation> }: { allOccupations?: Array<HeaderOccupation> }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [isOccupationDropdownOpen, setIsOccupationDropdownOpen] = useState(false);
  const [occupationSuggestions, setOccupationSuggestions] = useState<Array<HeaderOccupation & { display: string }>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const [chipWidth, setChipWidth] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const virtualListRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Get country from URL if available
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const countrySlug = segments[0];
      const found = COUNTRIES.find(c => c.slug === countrySlug);
      if (found) {
        setSelectedCountry(found);
      }
    }
  }, [pathname]);

  const COUNTRIES = [
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

  const CONTINENTS = [
    { name: "Africa", code: "africa" },
    { name: "Asia", code: "asia" },
    { name: "Europe", code: "europe" },
    { name: "Middle East", code: "middle_east" },
    { name: "North America", code: "north_america" },
    { name: "Oceania", code: "oceania" },
    { name: "South America", code: "south_america" },
  ];

  // Filter countries based on search query
  useEffect(() => {
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
  }, [searchQuery]);

  // Build occupation suggestions when searching after a country is picked
  useEffect(() => {
    if (!selectedCountry) {
      if (occupationSuggestions.length !== 0) setOccupationSuggestions([]);
      if (isOccupationDropdownOpen) setIsOccupationDropdownOpen(false);
      return;
    }
    
    const term = debouncedQuery.trim().toLowerCase();
    
    // Only show occupation dropdown if user has typed at least 2 characters
    if (term.length < 2) {
      setOccupationSuggestions([]);
      setIsOccupationDropdownOpen(false);
      return;
    }
    
    // Fuzzy + strict ranking mirroring components/ui/searchable-dropdown.tsx
    const pool = allOccupations
      .filter(o => o.country.toLowerCase() === selectedCountry.slug)
      .map(o => ({ ...o, display: (o.title || "").replace(/^Average\s+/i, "").trim() }))
      .sort((a, b) => a.display.localeCompare(b.display));

    const normalize = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
    const singularize = (s: string) => s.endsWith('s') ? s.slice(0, -1) : s;
    const generateVariants = (token: string): string[] => {
      const base = singularize(token);
      const v = new Set<string>([token, base]);
      v.add(base + 's'); v.add(base + 'er'); v.add(base + 'ers'); v.add(base + 'or'); v.add(base + 'ors'); v.add(base + 'ing'); v.add(base + 'al'); v.add(base + 'als');
      if (!base.endsWith('ion')) v.add(base + 'ion');
      if (!base.endsWith('ions')) v.add(base + 'ions');
      if (base.length > 4) v.add(base.slice(0, Math.max(4, Math.floor(base.length * 0.6))));
      return Array.from(v);
    };

    const queryNorm = normalize(term);
    const queryTokens = queryNorm.split(' ').filter(Boolean).map(singularize);
    const queryVariants = queryTokens.map(generateVariants);

    function isSubsequence(q: string, t: string) {
      let i = 0, j = 0;
      while (i < q.length && j < t.length) { if (q[i] === t[j]) i++; j++; }
      return i === q.length;
    }

    function scoreMatch(title: string): number {
      const tNorm = normalize(title);
      const tTokens = tNorm.split(' ').filter(Boolean).map(singularize);
      const tJoined = tTokens.join(' ');
      if (tJoined === queryTokens.join(' ')) return 1000;
      let score = 0;
      if (tJoined.startsWith(queryTokens.join(' '))) score += 800;
      const allPrefix = queryTokens.every((qt, i) => {
        const variants = queryVariants[i] || [qt];
        return tTokens.some(tt => variants.some(v => tt.startsWith(v)));
      });
      if (allPrefix) score += 700;
      let orderIdx = -1, orderMatches = 0;
      for (let i = 0; i < queryTokens.length; i++) {
        const qt = queryTokens[i];
        const variants = queryVariants[i] || [qt];
        const idx = tTokens.findIndex(tt => variants.some(v => tt.startsWith(v) || tt === v));
        if (idx >= 0) { if (idx > orderIdx) orderMatches++; orderIdx = idx; score += 40; }
      }
      if (orderMatches >= 2) score += 60;
      if (tJoined.includes(queryTokens.join(' '))) score += 300;
      for (let i = 0; i < queryTokens.length; i++) {
        const qt = queryTokens[i];
        const variants = queryVariants[i] || [qt];
        if (variants.some(v => isSubsequence(v, tJoined))) score += 30;
      }
      score += Math.max(0, 50 - Math.max(0, tJoined.indexOf(queryTokens[0] || '')));
      score += Math.max(0, 80 - tJoined.length);
      return score;
    }

    const ranked = pool
      .map(o => ({ item: o, score: scoreMatch(o.display) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const seen = new Set<string>();
    const deduped: Array<HeaderOccupation & { display: string }> = [];
    for (const r of ranked) {
      const key = `${r.item.slug}|${r.item.state ?? ''}|${r.item.location ?? ''}`;
      if (!seen.has(key)) { seen.add(key); deduped.push(r.item); }
    }

    setOccupationSuggestions(deduped);
    setIsOccupationDropdownOpen(true);
  }, [debouncedQuery, selectedCountry, isOccupationDropdownOpen, occupationSuggestions.length, allOccupations]);

  // Debounce input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(id);
  }, [searchQuery]);

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

  function handleEnter() {
    if (!selectedCountry) return; // need a country first
    const query = searchQuery.trim();
    
    if (query.length === 0) {
      router.push(`/${selectedCountry.slug}`);
      return;
    }
    
    // If there are occupation suggestions, go to the first result
    if (occupationSuggestions.length > 0) {
      const firstResult = occupationSuggestions[0];
      
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
      router.push(url);
      return;
    }
    
    // If no results found, go to the country page
    router.push(`/${selectedCountry.slug}`);
  }

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        {/* Inline tag area inside input */}
        {selectedCountry && (
          <div className="absolute inset-y-0 left-10 flex items-center">
            <span ref={chipRef} className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
              {selectedCountry.name}
              {isHome && (
                <button
                  aria-label="Remove selected country"
                  className="ml-2 hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCountry(null);
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                    setIsOccupationDropdownOpen(false);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={
            selectedCountry
              ? `Search occupations in ${selectedCountry.name}...`
              : "Search countries..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (selectedCountry) {
              if (searchQuery.trim().length >= 3) {
                setIsOccupationDropdownOpen(true);
              }
            } else {
              if (isHome) setIsDropdownOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleEnter();
            } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && selectedCountry) {
              setIsOccupationDropdownOpen(true);
            }
          }}
          className="block w-full pr-20 py-2 border-input border rounded-md text-sm text-foreground placeholder-muted-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          style={{ 
            paddingLeft: selectedCountry ? 48 + chipWidth + 12 : 48
          }}
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          {selectedCountry && (
            <button
              type="button"
              onClick={() => {
                handleEnter();
              }}
              aria-label="Go to results"
              title={
                searchQuery.trim().length === 0 
                  ? `Go to ${selectedCountry.name}` 
                  : occupationSuggestions.length > 0 
                    ? `Go to first result: ${occupationSuggestions[0].display}` 
                    : `Go to ${selectedCountry.name}`
              }
              className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md border-primary border text-primary bg-background hover:bg-primary/5 cursor-pointer"
            >
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (selectedCountry) {
                setIsOccupationDropdownOpen(!isOccupationDropdownOpen);
              } else {
                if (isHome) setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            <ChevronDown 
              className={`h-4 w-4 text-muted-foreground ${(selectedCountry ? isOccupationDropdownOpen : isDropdownOpen) ? 'transform rotate-180' : ''} transition-transform duration-200`}
            />
          </button>
        </div>
      </div>

      {/* Country dropdown (home only) */}
      {isHome && isDropdownOpen && !selectedCountry && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-background rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border">
          <div className="py-1 max-h-[300px] overflow-y-auto">
            {groupedCountries.length > 0 ? (
              groupedCountries.map((continent) => (
                <div key={continent.code}>
                  <div className="px-4 py-2 text-sm font-semibold text-foreground bg-muted border-b">
                    {continent.name}
                  </div>
                  {continent.countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsDropdownOpen(false);
                        setSearchQuery("");
                        setOccupationSuggestions([]);
                        setIsOccupationDropdownOpen(false);
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }, 0);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors duration-150 flex items-center justify-between"
                    >
                      <span>{country.name}</span>
                      {selectedCountry?.code === country.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-muted-foreground">
                No countries found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Occupation suggestions dropdown */}
      {selectedCountry && isOccupationDropdownOpen && (
        <div 
          className="absolute top-full mt-1 left-0 right-0 bg-background rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border" 
          onMouseDown={(e) => e.preventDefault()}
        >
          <div
            ref={virtualListRef}
            className="py-1 max-h-[300px] overflow-y-auto"
            onScroll={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              setScrollTop(el.scrollTop);
            }}
          >
            {(() => {
              const itemHeight = 56;
              const viewportHeight = 300;
              const overscan = 6;
              const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
              const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
              const endIndex = Math.min(occupationSuggestions.length, startIndex + visibleCount);
              const totalHeight = occupationSuggestions.length * itemHeight;
              const offsetY = startIndex * itemHeight;
              const slice = occupationSuggestions.slice(startIndex, endIndex);

              const formatCurrency = (amount?: number | null, currencyCode?: string | null) => {
                if (typeof amount !== 'number' || !isFinite(amount)) return null;
                const countrySlug = selectedCountry?.slug;
                const defaultLocale = countrySlug === 'australia' ? 'en-AU' : countrySlug === 'india' ? 'en-IN' : undefined;
                const code = currencyCode || (countrySlug === 'australia' ? 'AUD' : countrySlug === 'india' ? 'INR' : undefined);
                try {
                  if (code) return new Intl.NumberFormat(defaultLocale, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(amount);
                  return new Intl.NumberFormat(defaultLocale, { maximumFractionDigits: 0 }).format(amount);
                } catch {
                  return `${code ?? ''} ${Math.round(amount)}`.trim();
                }
              };

              return (
                <div style={{ height: totalHeight }}>
                  <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {slice.map(s => {
                      const subtitleParts: string[] = [];
                      if (s.state) subtitleParts.push(s.state);
                      if (s.location) subtitleParts.push(s.location);
                      const region = subtitleParts.join(' • ');
                      const salary = formatCurrency(s.averageSalary ?? null, s.currencyCode ?? null);
                      return (
                        <button
                          key={`${s.slug}-${s.state ?? 'na'}-${s.location ?? 'na'}`}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsOccupationDropdownOpen(false);
                            setSearchQuery("");
                            let url = `/${selectedCountry.slug}`;
                            if (s.state) {
                              const normalizedState = s.state.toLowerCase().replace(/\s+/g, '-');
                              url += `/${normalizedState}`;
                              if (s.location) {
                                const normalizedLocation = s.location.toLowerCase().replace(/\s+/g, '-');
                                url += `/${normalizedLocation}`;
                              }
                            }
                            url += `/${s.slug}`;
                            router.push(url);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors duration-150"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{s.display}</div>
                              {(region || salary) && (
                                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                  {region}
                                  {region && salary ? ' • ' : ''}
                                  {salary}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export function NewHeader({ allOccupations = [] as Array<{ country: string; title: string; slug: string; state: string | null; location: string | null; }> }: { allOccupations?: Array<{ country: string; title: string; slug: string; state: string | null; location: string | null; }> }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (continentCode: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredContinent(continentCode);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredContinent(null);
    }, 300);
  };

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Left Side */}
          <div className="flex items-center pr-4">
            <Logo />
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 flex justify-center px-4 lg:px-8">
            <div className="w-full max-w-3xl">
              <HeaderSearchableDropdown allOccupations={allOccupations} />
            </div>
          </div>

          {/* Continent Dropdowns - Right Side */}
          <div className="hidden md:flex space-x-2 pl-4">
            {continents.map((continent) => (
              <div
                key={continent.code}
                className="relative"
                onMouseEnter={() => handleMouseEnter(continent.code)}
                onMouseLeave={handleMouseLeave}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground text-sm px-3 py-2"
                >
                  <span>{continent.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {/* Dropdown Content */}
                {hoveredContinent === continent.code && (
                  <div 
                    className="absolute top-full right-0 mt-1 w-64 bg-background rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border"
                    onMouseEnter={() => handleMouseEnter(continent.code)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-semibold text-foreground bg-muted border-b">
                        {continent.name}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {continent.countries.map((country) => (
                          <a
                            key={country.slug}
                            href={`/${country.slug}`}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors duration-150"
                          >
                            {country.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden pl-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
            {/* Mobile search */}
            <div className="p-4">
              <HeaderSearchableDropdown allOccupations={allOccupations} />
            </div>
            
            {/* Mobile continent navigation */}
            <div className="p-4 space-y-2">
              {continents.map((continent, idx) => (
                <div key={continent.code} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-foreground bg-muted rounded-md">
                    {continent.name}
                  </div>
                  {continent.countries.map((country) => (
                    <a
                      key={country.slug}
                      href={`/${country.slug}`}
                      className="block px-6 py-2 text-sm text-foreground hover:text-foreground hover:bg-muted rounded-md"
                    >
                      {country.name}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
