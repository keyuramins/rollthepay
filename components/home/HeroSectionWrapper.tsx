"use client";

import { useEffect, useState } from "react";
import { SearchableDropdown } from "@/components/navigation/searchable-dropdown";
import { Users, Globe, Shield } from "lucide-react";
import { getDataset } from "@/lib/data/parse";

export function HeroSectionWrapper() {
  const [occupations, setOccupations] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

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

        // small delay for fade-in
        setTimeout(() => setLoaded(true), 50);
      } catch (err) {
        console.error("Failed to fetch occupations:", err);
      }
    }

    fetchOccupations();
  }, []);

  const trustItems = [
    { icon: Shield, label: "Trusted Data" },
    { icon: Globe, label: "Global Coverage" },
    { icon: Users, label: "Real Salaries" },
  ];

  const stats = [
    { number: "1M+", label: "Salary Records" },
    { number: "100+", label: "Countries" },
    { number: "100%", label: "Free Access" },
  ];

  // Skeleton placeholder while loading
  if (!loaded) {
    return (
      <section className="relative bg-primary min-h-[70vh] sm:h-[80vh] flex items-center py-16 sm:py-20 overflow-hidden animate-pulse">
        <div className="relative z-10 w-full max-w-6xl text-center px-4 sm:px-6 lg:px-8 mx-auto">
          <ul className="flex flex-wrap justify-center gap-6 mb-8">
            {trustItems.map(({ label }) => (
              <li key={label} className="h-4 w-20 bg-background/30 rounded mx-1" />
            ))}
          </ul>
          <h1 className="h-10 w-64 mx-auto my-4 bg-background/30 rounded"></h1>
          <p className="h-4 w-80 mx-auto my-2 bg-background/20 rounded"></p>
          <div className="h-10 w-full max-w-2xl mx-auto my-4 bg-background/10 rounded"></div>
          <ul className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8">
            {stats.map(({ label }, idx) => (
              <li key={idx} className="h-6 w-16 bg-background/20 rounded mx-2"></li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-primary min-h-[70vh] sm:h-[80vh] flex items-center py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary before:via-secondary before:to-primary before:opacity-50 before:brightness-20 before:backdrop-blur-xl" />
      <div
        className={`relative z-10 w-full max-w-6xl text-center px-4 sm:px-6 lg:px-8 mx-auto transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <ul className="flex flex-wrap justify-center gap-6 mb-8">
          {trustItems.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-background/80 text-sm font-medium">
              <Icon className="w-4 h-4 text-background/80" />
              {label}
            </li>
          ))}
        </ul>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-background mt-4 mb-1">
          Discover What Jobs Really Pay
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-background max-w-3xl mx-auto leading-relaxed mb-12">
          Get accurate, up-to-date salary data from thousands of employers.
          <span className="text-secondary"> Worldwide.</span>
        </p>

        <div className="max-w-2xl mx-auto space-y-4 mb-12">
          <p className="text-background/80 text-sm font-medium text-center">
            Select a country, then search by job title or a location
          </p>
          <SearchableDropdown
            variant="light"
            placeholder="Select a country..."
            fullWidth={true}
            centered={true}
            className="transform transition-all duration-300 hover:scale-[1.05] shadow-2xl"
            allOccupations={occupations}
          />
          <p className="text-center text-background/80 text-sm">
            <span>Find your worth, negotiate better, and make informed career decisions.</span>
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-6 sm:gap-8 text-background">
          {stats.map(({ number, label }) => (
            <li key={label} className="text-center flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{number}</span>
              <span className="text-sm sm:text-base opacity-80">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
