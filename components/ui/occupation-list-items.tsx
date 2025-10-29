// components/ui/occupation-list-items.tsx
import Link from "next/link";
import { MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/format/currency";
import { encodeSlugForURL } from "@/lib/format/slug";
import type { OccupationListItemsProps } from "@/lib/types/occupation-list";

export function OccupationListItems({
  paginatedItems,
  countrySlug,
  currentState,
  currentLocation,
}: OccupationListItemsProps) {
  return (
    <ul className="grid grid-cols-1 gap-4" role="list">
      {paginatedItems.map((item) => {
        const normalizedSlug = encodeSlugForURL(item.slug_url);
        let href = `/${item.countrySlug}/${normalizedSlug}`;
        
        if (currentState) {
          href = `/${item.countrySlug}/${currentState}/${normalizedSlug}`;
        } else if (item.state) {
          href = `/${item.countrySlug}/${item.state.toLowerCase().replace(/\s+/g, "-")}/${normalizedSlug}`;
        }

        return (
          <li key={href} role="listitem">
            <Link
              href={href}
              className="block bg-white rounded-lg border border-input py-3 px-4 sm:py-2 sm:px-6 hover:shadow-md transition-shadow hover:border-green-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                    {item.displayName}
                  </h3>
                  {item.location && (
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4 text-primary mr-2" />
                      <span className="text-xs sm:text-sm">
                        {item.location}{item.state && `, ${item.state}`}
                      </span>
                    </div>
                  )}
                </div>
                {item.avgAnnualSalary && (
                  <div className="mt-2 sm:mt-0 sm:ml-6 text-right metric-value">
                    {formatCurrency(item.avgAnnualSalary, countrySlug || item.countrySlug)}
                  </div>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
