"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchQuery?: string;
  letterFilter?: string;
  className?: string;
  hasNextPage?: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  basePath,
  searchQuery,
  letterFilter,
  className = "",
  hasNextPage,
}: PaginationProps) {
  const currentPageSafe = Math.min(currentPage, totalPages);

  const buildPageUrl = (page: number): string => {
    // Page 1 uses base path, others use /page/[n]
    const path = page === 1 ? basePath : `${basePath}/page/${page}`;
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    if (letterFilter) {
      params.set('letter', letterFilter);
    }
    
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const prevPage = Math.max(1, currentPageSafe - 1);
  const nextPage = Math.min(totalPages, currentPageSafe + 1);
  const isKeysetMode = typeof hasNextPage === 'boolean';

  // Keyset mode (unknown total pages) - show simple prev/next controls
  if (isKeysetMode) {
    const prevHref = currentPageSafe > 1 ? buildPageUrl(prevPage) : undefined;
    const nextHref = hasNextPage ? buildPageUrl(currentPageSafe + 1) : undefined;

    return (
      <nav
        className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-end ${className}`}
        aria-label="Pagination"
      >
        {prevHref ? (
          <Link
            href={prevHref as string}
            className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black hover:bg-green-100"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1">Prev</span>
          </Link>
        ) : (
          <span
            className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black opacity-50 cursor-not-allowed"
            aria-disabled="true"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1">Prev</span>
          </span>
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black hover:bg-green-100"
            aria-label="Next page"
          >
            <span className="mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black opacity-50 cursor-not-allowed"
            aria-disabled="true"
            aria-label="Next page"
          >
            <span className="mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </nav>
    );
  }

  return (
    <nav
      className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-end ${className}`}
      aria-label="Pagination"
    >
      {currentPageSafe > 1 ? (
        <Link
          href={buildPageUrl(prevPage)}
          className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black hover:bg-green-100"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Prev</span>
        </Link>
      ) : (
        <span
          className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black opacity-50 cursor-not-allowed"
          aria-disabled="true"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Prev</span>
        </span>
      )}

      <div className="hidden md:flex items-center gap-1" role="list">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isEdge = page === 1 || page === totalPages;
          const isNear = Math.abs(page - currentPageSafe) <= 1;

          if (!isEdge && !isNear) {
            return page === 2 || page === totalPages - 1 ? (
              <span key={page} className="px-2" aria-hidden="true">…</span>
            ) : null;
          }

          const isActive = page === currentPageSafe;

          return (
            <Link
              key={page}
              href={buildPageUrl(page)}
              className={`inline-flex items-center rounded-md border border-input px-3 py-2 text-sm ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white text-black hover:bg-green-100"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPageSafe < totalPages ? (
        <Link
          href={buildPageUrl(nextPage)}
          className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black hover:bg-green-100"
          aria-label="Next page"
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black opacity-50 cursor-not-allowed"
          aria-disabled="true"
          aria-label="Next page"
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}