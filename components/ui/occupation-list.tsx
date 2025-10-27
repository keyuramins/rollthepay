import { OccupationListClient } from "@/components/ui/occupation-list-client";

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
    <section className={`py-8 ${className}`} aria-labelledby="occupation-list-heading" role="region">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
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
