"use client";

import { useEffect, useState } from "react";
import { StatsSection } from "./stats-section";

import { getDataset, extractDatasetStats } from "@/lib/data/parse";

export function StatsSectionWrapper() {
  const [stats, setStats] = useState<{ totalSalaries: number; countries: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const dataset = await getDataset();
        const { totalRecords, uniqueCountries } = extractDatasetStats(dataset.all);
        setStats({ totalSalaries: totalRecords, countries: uniqueCountries });

        // small delay to allow fade-in effect
        setTimeout(() => setLoaded(true), 50);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }

    fetchStats();
  }, []);

  // Skeleton while loading
  if (!stats) {
    return (
      <section className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground animate-pulse">
            Trusted by Job Seekers Worldwide
          </h2>
          <p className="max-w-2xl mx-auto animate-pulse">
            Our comprehensive salary database helps millions make informed career decisions
          </p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-between text-center p-6 rounded-xl border border-border bg-card animate-pulse"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full mb-4" />
              <div className="h-6 w-16 bg-primary/20 rounded mb-1" />
              <div className="h-4 w-24 bg-primary/20 rounded mb-1" />
              <div className="h-3 w-28 bg-primary/10 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fade-in real stats
  return (
    <div className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
      <StatsSection totalSalaries={stats.totalSalaries} countries={stats.countries} />
    </div>
  );
}
