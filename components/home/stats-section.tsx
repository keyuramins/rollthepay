interface StatsSectionProps {
  totalSalaries: number;
  countries: number;
}

export function StatsSection({ totalSalaries, countries }: StatsSectionProps) {
  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary">{totalSalaries.toLocaleString()}+</div>
            <div className="mt-2 text-base sm:text-lg text-muted-foreground">Published Salaries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary">{countries}</div>
            <div className="mt-2 text-base sm:text-lg text-muted-foreground">Countries Covered</div>
          </div>
          <div className="text-center sm:col-span-2 lg:col-span-1">
            <div className="text-3xl sm:text-4xl font-bold text-primary">100%</div>
            <div className="mt-2 text-base sm:text-lg text-muted-foreground">Data Transparency</div>
          </div>
        </div>
      </div>
    </section>
  );
}
