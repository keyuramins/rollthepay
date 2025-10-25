// components/home/StatsSectionWrapper.tsx
import { StatsSection } from "./stats-section";

export function StatsSectionWrapper({ countries, totalSalaries }: { countries: number; totalSalaries: number }) {

  // Skeleton while loading
  if (!countries || !totalSalaries) {
    return (
      <section role="region" aria-labelledby="stats-heading" className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 id="stats-heading" className="text-3xl sm:text-4xl font-bold text-foreground animate-pulse">
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

  return (
    <StatsSection totalSalaries={totalSalaries} countries={countries} />
  );
}
