"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AZFilter } from "./az-filter";
import { Pagination } from "./pagination";
import { MapPin } from "lucide-react";
import { OccupationListSkeleton } from "./occupation-list-skeleton";

function normalizeSlugForURL(slug: string): string {
  return slug.replace(/#/g, '-sharp').replace(/\+/g, '-plus');
}

interface OccupationItem {
  id: string;
  displayName: string;
  originalName: string;
  slug_url: string;
  location?: string;
  state?: string;
  avgAnnualSalary?: number;
  countrySlug: string;
}

interface OccupationListProps {
  items: OccupationItem[];
  title: string;
  description: string;
  className?: string;
  currentState?: string;
  currentLocation?: string;
  states?: string[];
}

export function OccupationList({
  items,
  title,
  description,
  className = "",
  currentState,
  currentLocation,
  states,
}: OccupationListProps) {
  const [azFilteredItems, setAzFilteredItems] = useState<OccupationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const PAGE_SIZE = 50;

  const preparedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        id: item.slug_url,
        displayName: item.originalName.replace(/^Average\s+/i, "").trim(),
      })),
    [items]
  );

  const sortedItems = useMemo(
    () => [...preparedItems].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [preparedItems]
  );

  useEffect(() => {
    setAzFilteredItems(sortedItems);
  }, [sortedItems]);

  const searchFilteredItems = useMemo(() => {
    if (!searchQuery) return azFilteredItems;
    const q = searchQuery.trim().toLowerCase();
    return azFilteredItems.filter(
      (item) =>
        item.displayName.toLowerCase().includes(q) ||
        item.originalName.toLowerCase().includes(q) ||
        (item.location ? item.location.toLowerCase().includes(q) : false) ||
        (item.state ? item.state.toLowerCase().includes(q) : false)
    );
  }, [azFilteredItems, searchQuery]);

  const totalItems = searchFilteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);

  const paginatedItems = useMemo(
    () => searchFilteredItems.slice(startIndex, endIndex),
    [searchFilteredItems, startIndex, endIndex]
  );

  useEffect(() => setCurrentPage(1), [searchQuery, azFilteredItems]);

  if (!mounted) {
    return <OccupationListSkeleton title={title} description={description} />;
  }

  return (
    <section className={`py-16 ${className}`} aria-labelledby="occupation-list-heading" role="region">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h2 id="occupation-list-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search occupations or states..."
            aria-label="Search occupations or states"
            className="w-full lg:w-80 rounded-lg border border-input px-3 py-2 shadow-sm focus:border-green-100 focus:ring-primary bg-white"
          />
        </div>

        <div className="mb-8">
          <AZFilter items={sortedItems} onFilteredItemsChange={setAzFilteredItems} />
        </div>

        <ul className="grid grid-cols-1 gap-4" role="list">
          {paginatedItems.map((item) => {
            let href: string;
            const normalizedSlug = normalizeSlugForURL(item.slug_url);

            if (currentLocation && currentState) {
              href = `/${item.countrySlug}/${currentState}/${currentLocation}/${normalizedSlug}`;
            } else if (currentState) {
              href = item.location
                ? `/${item.countrySlug}/${currentState}/${item.location.toLowerCase().replace(/\s+/g, "-")}/${normalizedSlug}`
                : `/${item.countrySlug}/${currentState}/${normalizedSlug}`;
            } else if (item.state && item.location) {
              href = `/${item.countrySlug}/${item.state.toLowerCase().replace(/\s+/g, "-")}/${item.location.toLowerCase().replace(/\s+/g, "-")}/${normalizedSlug}`;
            } else if (item.state) {
              href = `/${item.countrySlug}/${item.state.toLowerCase().replace(/\s+/g, "-")}/${normalizedSlug}`;
            } else {
              href = `/${item.countrySlug}/${normalizedSlug}`;
            }

            return (
              <li key={item.id} role="listitem">
                <Link
                  href={href}
                  prefetch
                  className="block bg-white rounded-lg border border-input py-3 px-4 sm:py-2 sm:px-6 hover:shadow-md transition-shadow hover:border-green-100"
                  aria-label={`View details for ${item.displayName}${item.location ? ` in ${item.location}${item.state ? `, ${item.state}` : ""}` : ""}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">{item.displayName}</h3>
                      {item.location && (
                        <div className="flex items-center text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4 text-primary mr-2" />
                          <span className="text-xs sm:text-sm">
                            {item.location}
                            {item.state && `, ${item.state}`}
                          </span>
                        </div>
                      )}
                    </div>
                    {item.avgAnnualSalary && (
                      <div className="mt-2 sm:mt-0 sm:ml-6 text-right metric-value">
                        ${item.avgAnnualSalary.toLocaleString()}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {totalItems > PAGE_SIZE && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-6" />
        )}
      </div>
    </section>
  );
}
