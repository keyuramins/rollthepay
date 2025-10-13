"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Check, ArrowRight, Loader2 } from "lucide-react";
import { prefetchRoute } from "@/lib/prefetch";
import { continents, CONTINENTS } from "@/app/constants/continents";
import { formatCurrency } from "@/lib/format/currency";
import { gsap } from "gsap";

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
  slug: string; // slug_url
  state: string | null;
  location: string | null;
  // Optional fields for richer dropdown context (if available from caller)
  averageSalary?: number | null;
  currencyCode?: string | null; // e.g., 'AUD', 'INR'
}

interface SearchableDropdownProps {
  placeholder?: string;
  variant?: "light" | "dark";
  className?: string;
  fullWidth?: boolean;
  centered?: boolean;
  allOccupations?: OccupationIndexItem[]; // provided on home for suggestions
  headerMode?: boolean; // new prop for header mode
}

export function SearchableDropdown({ 
  placeholder = "Search countries...", 
  variant = "light",
  className = "",
  fullWidth = false,
  centered = false,
  allOccupations = [],
  headerMode = false
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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const virtualListRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const arrowButtonRef = useRef<HTMLButtonElement>(null);
  const [chipWidth, setChipWidth] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [userRemovedCountry, setUserRemovedCountry] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  // Determine if we are on the homepage
  const isHome = useMemo(() => pathname === "/", [pathname]);
  
  // In header mode, we're effectively in "home mode" for occupation search
  const isInSearchMode = useMemo(() => isHome || headerMode, [isHome, headerMode]);

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

  // Filter countries based on search query (when no country selected or not in search mode)
  useEffect(() => {
    // If a country is already selected in search mode, we're in occupation search mode.
    if (isInSearchMode && selectedCountry) return;

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
  }, [searchQuery, isInSearchMode, selectedCountry]);

  // Build occupation suggestions when searching after a country is picked (search mode)
  useEffect(() => {
    if (!(isInSearchMode && selectedCountry)) {
      if (occupationSuggestions.length !== 0) setOccupationSuggestions([]);
      if (isOccupationDropdownOpen) setIsOccupationDropdownOpen(false);
      return;
    }
    const term = debouncedQuery.trim().toLowerCase();
    
    // Only show occupation dropdown if user has typed at least 3 characters
    if (term.length < 2) {
      setOccupationSuggestions([]);
      setIsOccupationDropdownOpen(false);
      return;
    }
    
    // Fuzzy + strict ranking
    const pool: OccupationSuggestion[] = allOccupations
      .filter(o => o.country === selectedCountry.slug)
      .map(o => ({ ...o, display: o.title.replace(/^Average\s+/i, "").trim() }))
      .sort((a, b) => a.display.localeCompare(b.display));

    const normalize = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
    const singularize = (s: string) => s.endsWith('s') ? s.slice(0, -1) : s;
    const generateVariants = (token: string): string[] => {
      const base = singularize(token);
      const v = new Set<string>([token, base]);
      // common forms
      v.add(base + 's');
      v.add(base + 'er');
      v.add(base + 'ers');
      v.add(base + 'or');
      v.add(base + 'ors');
      v.add(base + 'ing');
      v.add(base + 'al');
      v.add(base + 'als');
      if (!base.endsWith('ion')) v.add(base + 'ion');
      if (!base.endsWith('ions')) v.add(base + 'ions');
      // short prefix variant to support partial typing like "applica"
      if (base.length > 4) v.add(base.slice(0, Math.max(4, Math.floor(base.length * 0.6))));
      return Array.from(v);
    };

    const queryNorm = normalize(term);
    const queryTokens = queryNorm.split(' ').filter(Boolean).map(singularize);
    const queryVariants = queryTokens.map(generateVariants);

    function isSubsequence(q: string, t: string) {
      let i = 0, j = 0; // q in t
      while (i < q.length && j < t.length) {
        if (q[i] === t[j]) i++;
        j++;
      }
      return i === q.length;
    }

    function scoreMatch(queryTokens: string[], title: string): number {
      const tNorm = normalize(title);
      const tTokens = tNorm.split(' ').filter(Boolean).map(singularize);
      const tJoined = tTokens.join(' ');

      // Exact equal
      if (tJoined === queryTokens.join(' ')) return 1000;
      let score = 0;

      // Starts with full query
      if (tJoined.startsWith(queryTokens.join(' '))) score += 800;

      // All tokens prefix some title tokens (e.g., "application te" -> "applications tester")
      const allPrefix = queryTokens.every((qt, i) => {
        const variants = queryVariants[i] || [qt];
        return tTokens.some(tt => variants.some(v => tt.startsWith(v)));
      });
      if (allPrefix) score += 700;

      // Word-start matches and order bonus
      let orderIdx = -1;
      let orderMatches = 0;
      for (let i = 0; i < queryTokens.length; i++) {
        const qt = queryTokens[i];
        const variants = queryVariants[i] || [qt];
        const idx = tTokens.findIndex(tt => variants.some(v => tt.startsWith(v) || tt === v));
        if (idx >= 0) {
          if (idx > orderIdx) orderMatches++;
          orderIdx = idx;
          score += 40; // per-token prefix bonus
        }
      }
      if (orderMatches >= 2) score += 60; // sequential order bonus

      // Substring includes
      if (tJoined.includes(queryTokens.join(' '))) score += 300;

      // Fuzzy subsequence for each token
      for (let i = 0; i < queryTokens.length; i++) {
        const qt = queryTokens[i];
        const variants = queryVariants[i] || [qt];
        if (variants.some(v => isSubsequence(v, tJoined))) score += 30;
      }

      // Shorter titles with earlier matches rank a bit higher
      score += Math.max(0, 50 - Math.max(0, tJoined.indexOf(queryTokens[0] || '')));
      score += Math.max(0, 80 - tJoined.length);

      return score;
    }

    // Rank, then deduplicate by slug/state/location; keep all matches (scrollable list)
    const ranked = pool
      .map(o => ({ item: o, score: scoreMatch(queryTokens, o.display) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const seen = new Set<string>();
    const deduped: OccupationSuggestion[] = [];
    for (const r of ranked) {
      const key = `${r.item.slug}|${r.item.state ?? ''}|${r.item.location ?? ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(r.item);
      }
    }

    setOccupationSuggestions(deduped);
    setIsOccupationDropdownOpen(true);
  }, [debouncedQuery, isInSearchMode, selectedCountry, allOccupations, isOccupationDropdownOpen, occupationSuggestions.length]);

  // Debounce user input to avoid recalculating on every keystroke
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Reset userRemovedCountry flag when pathname changes (user navigated to different page)
  useEffect(() => {
    setUserRemovedCountry(false);
  }, [pathname]);

  // Initialize selected country from URL on non-home pages or in header mode
  useEffect(() => {
    if ((!isHome || headerMode) && !userRemovedCountry) {
      const seg = pathname.split('/').filter(Boolean)[0];
      if (seg) {
        const found = COUNTRIES.find(c => c.slug === seg.toLowerCase());
        if (found && (!selectedCountry || selectedCountry.slug !== found.slug)) {
          setSelectedCountry(found);
        }
      } else if (selectedCountry) {
        // If we're on home page or no country segment, clear the selected country
        setSelectedCountry(null);
      }
    } else if (isHome && !headerMode && selectedCountry) {
      // Clear selected country when on home page (unless in header mode)
      setSelectedCountry(null);
    }
  }, [isHome, headerMode, pathname, selectedCountry, userRemovedCountry]);

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

  // Animate elements when country is selected
  useEffect(() => {
    if (isInSearchMode && selectedCountry && chipRef.current && arrowButtonRef.current) {
      // Create animation timeline
      const tl = gsap.timeline();
      
      // Set initial states
      gsap.set(arrowButtonRef.current, { 
        scale: 1, 
        opacity: 0,
        x: 0
      });
      
      // Hide the original placeholder by temporarily removing it
      const originalPlaceholder = inputRef.current?.getAttribute('placeholder');
      if (inputRef.current) {
        inputRef.current.setAttribute('placeholder', '');
      }
      
      // Create animated placeholder text
      const placeholderText = `Search occupations in ${selectedCountry.name}...`;
      const placeholderElement = document.createElement('div');
      placeholderElement.textContent = placeholderText;
      placeholderElement.style.position = 'absolute';
      
      // Calculate precise position using getBoundingClientRect
      const chipRect = chipRef.current.getBoundingClientRect();
      const inputRect = inputRef.current!.getBoundingClientRect();
      const leftOffset = chipRect.right - inputRect.left + 8; // 8px spacing
      placeholderElement.style.left = `${leftOffset}px`;
      
      placeholderElement.style.top = '50%';
      placeholderElement.style.transform = 'translateY(-50%)';
      placeholderElement.style.fontSize = '16px';
      placeholderElement.style.color = 'oklch(0 0 0)';
      placeholderElement.style.pointerEvents = 'none';
      placeholderElement.style.zIndex = '1';
      placeholderElement.style.whiteSpace = 'nowrap';
      
      // Insert placeholder element
      if (inputRef.current && inputRef.current.parentElement) {
        inputRef.current.parentElement.appendChild(placeholderElement);
      }
      
      // Split text into characters
      const chars = placeholderText.split('');
      placeholderElement.innerHTML = chars.map(char => 
        `<span style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
      
      const charElements = placeholderElement.querySelectorAll('span');
      
      // Set initial state for characters
      gsap.set(charElements, {
        y: 20,
        opacity: 0,
        scale: 1.5
      });
      
      // Animate characters in
      tl.to(charElements, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: "back.out(1.7)"
      })
        
      // Clean up placeholder element and restore original placeholder
      .to({}, {
        duration: 0,
        onComplete: () => {
          if (placeholderElement.parentElement) {
            placeholderElement.parentElement.removeChild(placeholderElement);
          }
          // Restore the original placeholder
          if (inputRef.current && originalPlaceholder) {
            inputRef.current.setAttribute('placeholder', originalPlaceholder);
          }
        }
      })
      // Arrow appears instantly
      .to(arrowButtonRef.current, {
        opacity: 1,
        duration: 0.1,
      })
      // Fast horizontal shake/nudge animation
      .to(arrowButtonRef.current, {
        x: 10,
        duration: 0.2,
        ease: "bounce.inOut",
        yoyo: true,
        repeat: 10
      }, "<");
    }
  }, [isInSearchMode, selectedCountry]);

  const groupedCountries = CONTINENTS.map(continent => ({
    ...continent,
    countries: filteredCountries.filter(country => country.continent === continent.code)
  })).filter(group => group.countries.length > 0);

  // Always use light styling for better visibility
  const isLight = true;
  
  const inputBgClass = "bg-background";
  const inputTextClass = "text-foreground placeholder-muted-foreground";
  const inputBorderClass = "border-input focus:border-primary focus:ring-2 focus:ring-primary/20";
  const iconColor = "text-primary";
  const dropdownBgClass = "bg-background";

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
    //if (!isInSearchMode) return; // occupation search only in search mode
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
    if (isInSearchMode) {
      setSelectedCountry(country);
      setUserRemovedCountry(false); // Reset the flag when user selects a country
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
    if (!isInSearchMode && selectedCountry && searchQuery === "") {
      return selectedCountry.name; // show selected by default on non-search mode pages
    }
    return searchQuery;
  }, [isInSearchMode, selectedCountry, searchQuery]);

  return (
    <div ref={dropdownRef} className={containerClasses}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${iconColor} opacity-40`} />
        </div>
        {/* Inline tag area inside input */}
        {isInSearchMode && selectedCountry && (
          <div className="absolute inset-y-0 left-12 flex items-center z-10">
            <span ref={chipRef} className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-primary text-sm">
              {selectedCountry.name}
              <button
                aria-label="Remove selected country"
                className="ml-2 hover:text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCountry(null);
                  setUserRemovedCountry(true);
                  setSearchQuery("");
                  setIsDropdownOpen(true); // Show country dropdown immediately
                  setIsOccupationDropdownOpen(false);
                  setOccupationSuggestions([]);
                  // Focus the input field after country removal
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 0);
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
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (isInSearchMode && selectedCountry) {
              // Only open occupation dropdown if user has typed at least 3 characters
              if (searchQuery.trim().length >= 3) {
                setIsOccupationDropdownOpen(true);
              }
            } else {
              setIsDropdownOpen(true);
            }
            if (!isInSearchMode && selectedCountry && searchQuery === "") {
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
              // Only allow occupation search in search mode after picking a country
              if (isInSearchMode && selectedCountry) {
                e.preventDefault();
                handleEnter();
              }
            } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && isInSearchMode && selectedCountry) {
              setIsOccupationDropdownOpen(true);
            }
          }}
          disabled={isLoading || isOccupationLoading}
          className={`block ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} pr-10 py-3 border rounded-lg text-black leading-5 focus:outline-none shadow-md transition-all duration-200 ${inputBorderClass} ${inputBgClass} ${inputTextClass} disabled:cursor-not-allowed`}
          style={{ 
            paddingLeft: (isInSearchMode && selectedCountry) ? 48 + chipWidth + 16 : 48,
            paddingRight: (isInSearchMode && selectedCountry) ? 80 : undefined
          }}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="mr-2"
            >
              <X className={`h-4 w-4 ${iconColor} hover:text-primary`} />
            </button>
          )}
          {isInSearchMode && selectedCountry && (
            <button
              ref={arrowButtonRef}
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
              className={
                `mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 border-primary text-primary bg-background hover:bg-primary/5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`
              }
            >
              {isLoading || isOccupationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Inline tag moved inside the input above */}

      {isDropdownOpen && (!isInSearchMode || !selectedCountry) && (
        <div 
          className={`absolute ${dropdownPosition === 'top' ? 'bottom-full' : 'top-full'} left-0 ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} ${dropdownBgClass} rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border`}
        >
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
                      onClick={() => handleCountrySelect(country)}
                      disabled={isCountryLoading}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors duration-150 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{country.name}</span>
                      {isCountryLoading && selectedCountry?.code === country.code ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : selectedCountry?.code === country.code ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : null}
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

      {/* Occupation suggestions dropdown (search mode after country selection) */}
      {isInSearchMode && selectedCountry && isOccupationDropdownOpen && (
        <div 
          className={`absolute ${dropdownPosition === 'top' ? 'bottom-full' : 'top-full'} left-0 ${fullWidth ? 'w-full' : 'w-full sm:w-80 lg:w-96'} ${dropdownBgClass} rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border`} 
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
              const itemHeight = 56; // px per row (approx)
              const viewportHeight = 300; // matches max-h
              const overscan = 6;
              const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
              const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
              const endIndex = Math.min(occupationSuggestions.length, startIndex + visibleCount);
              const totalHeight = occupationSuggestions.length * itemHeight;
              const offsetY = startIndex * itemHeight;
              const slice = occupationSuggestions.slice(startIndex, endIndex);

              return (
                <div style={{ height: totalHeight }}>
                  <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {slice.map(s => {
              const subtitleParts: string[] = [];
              if (s.state) subtitleParts.push(s.state);
              if (s.location) subtitleParts.push(s.location);
              const region = subtitleParts.join(' • ');
              const formatSalary = (amount?: number | null, currencyCode?: string | null) => {
                if (typeof amount !== 'number' || !isFinite(amount)) return null;
                const countrySlug = selectedCountry?.slug;
                if (!countrySlug) return null;
                
                // Use the imported formatCurrency function
                return formatCurrency(amount, countrySlug);
              };
              const salary = formatSalary(s.averageSalary ?? null, s.currencyCode ?? null);
              return (
                <button
                  key={`${s.slug}-${s.state ?? 'na'}-${s.location ?? 'na'}`}
                  onClick={() => handleOccupationSelect(s)}
                  disabled={isLoading || isOccupationLoading}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {(isLoading || isOccupationLoading) && (
                      <Loader2 className="h-4 w-4 mt-1 shrink-0 animate-spin text-primary" />
                    )}
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