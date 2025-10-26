import { Suspense } from "react";
import { OccupationListClient, OccupationListSearchBar } from "@/components/ui/occupation-list-client";

export function OccupationList({
  items,
  title,
  description,
  className = "",
  currentState,
  currentLocation,
  countrySlug,
}: any) {
  return (
    <section className={`py-16 ${className}`} aria-labelledby="occupation-list-heading" role="region">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h2
              id="occupation-list-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
            >
              {title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {description}
            </p>
          </div>

          {/* ✅ Search bar on right side, inside same row */}
          <div className="w-full lg:w-80">
            <Suspense fallback={null}>
              <OccupationListSearchBar />
            </Suspense>
          </div>
        </div>

        <OccupationListClient
          items={items}
          countrySlug={countrySlug}
          currentState={currentState}
          currentLocation={currentLocation}
        />
      </div>
    </section>
  );
}
