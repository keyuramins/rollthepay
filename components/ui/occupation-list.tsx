"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AZFilter } from "./az-filter";
import { Pagination } from "./pagination";
import { MapPin } from "lucide-react";
import { OccupationListSkeleton } from "./occupation-list-skeleton";

// Helper function to normalize slugs for URLs (handles special characters)
function normalizeSlugForURL(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
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
    currentState?: string; // Context when rendering on a state page
    currentLocation?: string; // Context when rendering on a location page
    states?: string[]; // List of states for determining state items on country page
}

export function OccupationList({ items, title, description, className = "", currentState, currentLocation, states }: OccupationListProps) {
    const [azFilteredItems, setAzFilteredItems] = useState<OccupationItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const PAGE_SIZE = 50;
    // Prepare items for filtering (strip leading "Average ")
    const preparedItems = useMemo(() => items.map(item => ({
        ...item,
        id: item.slug_url,
        displayName: item.originalName.replace(/^Average\s+/i, "").trim(),
    })), [items]);

    // Sort items by display name
    const sortedItems = useMemo(() => {
        return [...preparedItems].sort((a, b) => a.displayName.localeCompare(b.displayName));
    }, [preparedItems]);

    // Initialize A–Z filtered items
    useEffect(() => {
        setAzFilteredItems(sortedItems);
    }, [sortedItems]);

    // Apply search on top of A–Z filtered items
    const searchFilteredItems = useMemo(() => {
        if (!searchQuery) return azFilteredItems;
        const q = searchQuery.trim().toLowerCase();
        return azFilteredItems.filter((item) =>
            item.displayName.toLowerCase().includes(q) ||
            item.originalName.toLowerCase().includes(q) ||
            (item.location ? item.location.toLowerCase().includes(q) : false) ||
            (item.state ? item.state.toLowerCase().includes(q) : false)
        );
    }, [azFilteredItems, searchQuery]);

    // Pagination calculations
    const totalItems = searchFilteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPageSafe = Math.min(currentPage, totalPages);
    const startIndex = (currentPageSafe - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
    const paginatedItems = useMemo(() => searchFilteredItems.slice(startIndex, endIndex), [searchFilteredItems, startIndex, endIndex]);

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, azFilteredItems]);
    if (!mounted) {
        return (
            <OccupationListSkeleton
                title={title}
                description={description}
            />
        );
    }
    return (
        <section className={`py-16 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
                        <p className="text-muted-foreground">{description}</p>
                    </div> 
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jobs or states..."
                        aria-label="Search jobs or states..."
                        className="w-full lg:w-80 rounded-lg border border-input px-3 py-2 shadow-sm focus:border-green-100 focus:ring-primary bg-white"
                    />
                </div>

                <div className="mb-8">
                    <AZFilter items={sortedItems} onFilteredItemsChange={setAzFilteredItems} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {paginatedItems.map((item) => {
                        let href: string;
                        const normalizedSlug = normalizeSlugForURL(item.slug_url);
                        
                        if (currentLocation && currentState) {
                            // We're on a location page: /[country]/[state]/[location]/[slug]
                            href = `/${item.countrySlug}/${currentState}/${currentLocation}/${normalizedSlug}`;
                        } else if (currentState) {
                            // We're on a state page: check if item has location
                            if (item.location) {
                                // Item has location: /[country]/[state]/[location]/[slug]
                                href = `/${item.countrySlug}/${currentState}/${item.location.toLowerCase().replace(/\s+/g, "-")}/${normalizedSlug}`;
                            } else {
                                // Item has no location: /[country]/[state]/[slug]
                                href = `/${item.countrySlug}/${currentState}/${normalizedSlug}`;
                            }
                        } else if (item.state && item.location) {
                            // Item has both state and location: /[country]/[state]/[location]/[slug]
                            href = `/${item.countrySlug}/${item.state.toLowerCase().replace(/\s+/g, "-")}/${item.location.toLowerCase().replace(/\s+/g, "-")}/${normalizedSlug}`;
                        } else if (item.state) {
                            // Item has only state: /[country]/[state]/[slug]
                            href = `/${item.countrySlug}/${item.state.toLowerCase().replace(/\s+/g, "-")}/${normalizedSlug}`;
                        } else {
                            // Country-level item: /[country]/[slug]
                            href = `/${item.countrySlug}/${normalizedSlug}`;
                        }

                        return (

                            <Link key={item.id} href={href} prefetch className="block bg-white rounded-lg border border-input py-2 px-6 hover:shadow-md transition-shadow hover:border-green-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.displayName}</h3>
                                    {item.location && (
                                        <div className="flex items-center text-muted-foreground mt-1">
                                        <MapPin className="w-4 h-4 text-primary mr-2" />
                                        <span>
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
                        )
                    })}
                </div>
                
                {/* Footer: pagination only */}
                {totalItems > PAGE_SIZE && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-6"
                    />
                )}
            </div>
        </section>
    );
}


