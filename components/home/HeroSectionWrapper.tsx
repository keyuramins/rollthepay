"use client";

import { useEffect, useState } from "react";
import { SearchableDropdown } from "@/components/navigation/searchable-dropdown";
import { getDataset } from "@/lib/data/parse";

export function HeroSectionWrapper() {
  const [occupations, setOccupations] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchOccupations() {
      try {
        const { all } = await getDataset();
        const mapped = all.map(rec => ({
          country: rec.country.toLowerCase(),
          title: rec.title,
          slug: rec.slug_url,
          state: rec.state || null,
          location: rec.location || null,
        }));
        setOccupations(mapped);
      } catch (err) {
        console.error("Failed to fetch occupations:", err);
      }
    }

    fetchOccupations();
  }, []);

  return (
    <section className="relative bg-primary min-h-[70vh] sm:h-[80vh] flex items-center py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary before:via-secondary before:to-primary before:opacity-50 before:brightness-20 before:backdrop-blur-xl" />
      <div className="relative z-10 w-full max-w-6xl text-center px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Trust Indicators */}
        <ul className="flex flex-wrap justify-center gap-6 mb-8">
          <li className="flex items-center gap-2 text-white text-sm font-medium">
            {/* Shield icon */} Trusted Data
          </li>
          <li className="flex items-center gap-2 text-white text-sm font-medium">
            {/* Globe icon */} Global Coverage
          </li>
          <li className="flex items-center gap-2 text-white text-sm font-medium">
            {/* Users icon */} Real Salaries
          </li>
        </ul>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-background mt-4 mb-1">
          Discover What Jobs Really Pay
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-background max-w-3xl mx-auto leading-relaxed mb-12">
          Get accurate, up-to-date salary data from thousands of employers.<span className="text-secondary"> Worldwide.</span>
        </p>

        {/* Only the Search Dropdown is client-side skeleton */}
        <div className="max-w-2xl mx-auto space-y-4 mb-12">
          <p className="text-white text-sm font-medium text-center">
            Select a country, then search by job title or a location
          </p>
          <div className={`relative ${!occupations ? "pointer-events-none opacity-60" : ""}`}>
            <SearchableDropdown
                variant="light"
                placeholder="Select a country..."
                fullWidth
                centered
                allOccupations={occupations || []}
                className="transform transition-all duration-300 hover:scale-[1.05] shadow-2xl"
            />
            </div>
          <p className="text-center text-white text-sm">
            <span>Find your worth, negotiate better, and make informed career decisions.</span>
          </p>
        </div>

        {/* Quick Stats (static for FCP) */}
        <ul className="flex flex-wrap justify-center gap-6 sm:gap-8 text-background">
          <li className="text-center flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">1M+</span>
            <span className="text-sm sm:text-base opacity-80">Salary Records</span>
          </li>
          <li className="text-center flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">100+</span>
            <span className="text-sm sm:text-base opacity-80">Countries</span>
          </li>
          <li className="text-center flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">100%</span>
            <span className="text-sm sm:text-base opacity-80">Free Access</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
