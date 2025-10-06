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

    if (!mounted) {
        return (
            <section className={`occupation-list ${className}`}>
                <div className="occupation-list__container">
                    <div className="occupation-list__header">
                        <h2 className="occupation-list__title">{title}</h2>
                        <p className="occupation-list__description">{description}</p>
                    </div>
                    <div className="occupation-list__results">
                        {sortedItems.slice(0, PAGE_SIZE).map((item) => (
                            <div key={item.id} className="occupation-list__item">
                                <div className="occupation-list__item-content">
                                    <div className="occupation-list__item-info">
                                        <h3 className="occupation-list__item-title">{item.displayName}</h3>
                                        {item.location && (
                                            <div className="occupation-list__item-location">
                                                <MapPin className="occupation-list__item-location-icon" />
                                                <span>
                                                    {item.location}
                                                    {item.state && `, ${item.state}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="occupation-list__item-salary">
                                        {item.avgAnnualSalary && (
                                            <div className="occupation-list__item-salary-value">
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
        <section className={`occupation-list ${className}`}>
            <div className="occupation-list__container">
                <div className="occupation-list__header">
                    <div className="occupation-list__header-content">
                        <div className="occupation-list__header-text">
                            <h2 className="occupation-list__title">{title}</h2>
                            <p className="occupation-list__description">{description}</p>
                        </div>
                        
                        {/* Search bar - positioned beside title on larger screens */}
                        <div className="occupation-list__search-container">
                            <input
                                id="search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search jobs or states..."
                                className="occupation-list__search-input"
                            />
                        </div>
                    </div>
                </div>

                {/* A–Z filter - always below */}
                <div className="az-filter">
                    <AZFilter items={sortedItems} onFilteredItemsChange={setAzFilteredItems} />
                </div>

                {/* Results */}
                <div className="occupation-list__results">
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
                            key={item.id} href={href} className="occupation-list__item">
                                <div className="occupation-list__item-content">
                                    <div className="occupation-list__item-info">
                                        <h3 className="occupation-list__item-title">{item.displayName}</h3>
                                        {item.location && (
                                            <div className="occupation-list__item-location">
                                                <MapPin className="occupation-list__item-location-icon" />
                                                <span>
                                                    {item.location}
                                                    {item.state && `, ${item.state}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="occupation-list__item-salary">
                                        {item.avgAnnualSalary && (
                                            <div className="occupation-list__item-salary-value">
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
                <div className="occupation-list__pagination">
                    <div className="occupation-list__pagination-info">
                        {totalItems === 0 && (
                            <span>No results found.</span>
                        )}
                    </div>
                    {totalItems > PAGE_SIZE && (
                        <nav className="occupation-list__pagination-nav" aria-label="Pagination">
                            <button
                                className="occupation-list__pagination-button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPageSafe === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="ml-1">Prev</span>
                            </button>
                            <div className="occupation-list__pagination-pages">
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1;
                                    const isEdge = page === 1 || page === totalPages;
                                    const isNear = Math.abs(page - currentPageSafe) <= 1;
                                    if (!isEdge && !isNear) {
                                        if (page === 2 || page === totalPages - 1) {
                                            return <span key={page} className="occupation-list__pagination-ellipsis">…</span>;
                                        }
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`${page === currentPageSafe ? "occupation-list__pagination-page--active" : "occupation-list__pagination-page--inactive"} occupation-list__pagination-page`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                className="occupation-list__pagination-button"
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


