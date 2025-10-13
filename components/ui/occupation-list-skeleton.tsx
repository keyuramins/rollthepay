import { AZFilter } from "../occupation/az-filter";

export function OccupationListSkeleton({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section
      className={`py-16 ${className}`}
      aria-labelledby="occupation-list-skeleton-heading"
      role="region"
      aria-busy="true"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h2
              id="occupation-list-skeleton-heading"
              className="text-3xl font-bold text-foreground mb-2"
            >
              {title}
            </h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="w-full lg:w-80">
            <div className="w-full rounded-lg border border-input px-3 py-2 bg-white">
              <div className="h-5 w-1/2 bg-green-100 animate-pulse rounded" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <AZFilter items={[]} onFilteredItemsChange={() => {}} />
        </div>

        <ul className="grid grid-cols-1 gap-4" role="list">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} role="listitem" aria-hidden="true" className="block bg-white rounded-lg border border-input py-2 px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 w-64 bg-green-100 animate-pulse rounded mb-2" />
                  <div className="flex items-center text-muted-foreground mt-1 gap-2">
                    <div className="h-4 w-4 bg-green-100 animate-pulse rounded" />
                    <div className="h-4 w-40 bg-green-100 animate-pulse rounded" />
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-6 text-right">
                  <div className="h-5 w-24 bg-green-100 animate-pulse rounded ml-auto" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
