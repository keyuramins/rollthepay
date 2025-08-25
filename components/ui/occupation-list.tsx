"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AZFilter } from "./az-filter";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

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
    const [mounted, setMounted] = useState(false);
    const [azFilteredItems, setAzFilteredItems] = useState<OccupationItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const PAGE_SIZE = 100;

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

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

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

    // Skeleton render while mounting to prevent hydration issues
    if (!mounted) {
        return (
            <section className={`py-16 ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                        <p className="text-lg text-gray-600">{description}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {sortedItems.slice(0, PAGE_SIZE).map((item) => (
                            <div key={item.id} className="bg-white rounded-lg border border-blue-200 py-2 px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.displayName}</h3>
                                        {item.location && (
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 text-pink-500 mr-2" />
                                                <span>
                                                    {item.location}
                                                    {item.state && `, ${item.state}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {item.avgAnnualSalary && (
                                            <div className="text-lg font-semibold text-gray-900">
                                                ${item.avgAnnualSalary.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`py-16 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                            <p className="text-lg text-gray-600">{description}</p>
                        </div>
                        
                        {/* Search bar - positioned beside title on larger screens */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <input
                                id="search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search jobs or states..."
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* A–Z filter - always below */}
                <div className="mb-6">
                    <AZFilter items={sortedItems} onFilteredItemsChange={setAzFilteredItems} />
                </div>








                {/* Results */}
                <div className="grid grid-cols-1 gap-4">
                    {paginatedItems.map((item) => {
                        // Compute route based on current page context
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
                            <Link
                            prefetch={true}
                            key={item.id} href={href} className="block bg-white rounded-lg border border-blue-200 py-2 px-6 hover:shadow-md transition-shadow hover:border-blue-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.displayName}</h3>
                                        {item.location && (
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 text-pink-500 mr-2" />
                                                <span>
                                                    {item.location}
                                                    {item.state && `, ${item.state}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {item.avgAnnualSalary && (
                                            <div className="text-lg font-semibold text-gray-900">
                                                ${item.avgAnnualSalary.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer: pagination only */}
                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                    <div className="text-sm text-gray-600">
                        {totalItems === 0 && (
                            <span>No results found.</span>
                        )}
                    </div>
                    {totalItems > PAGE_SIZE && (
                        <nav className="flex items-center gap-2" aria-label="Pagination">
                            <button
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPageSafe === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="ml-1">Prev</span>
                            </button>
                            <div className="hidden md:flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1;
                                    const isEdge = page === 1 || page === totalPages;
                                    const isNear = Math.abs(page - currentPageSafe) <= 1;
                                    if (!isEdge && !isNear) {
                                        if (page === 2 || page === totalPages - 1) {
                                            return <span key={page} className="px-2">…</span>;
                                        }
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`${page === currentPageSafe ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"} inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPageSafe === totalPages}
                            >
                                <span className="mr-1">Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </section>
    );
}


