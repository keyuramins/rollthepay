// components/ui/pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  const currentPageSafe = Math.min(currentPage, totalPages);

  return (
    <nav
      className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-end ${className}`}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPageSafe - 1))}
        disabled={currentPageSafe === 1}
        className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black hover:bg-green-100 disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-1">Prev</span>
      </button>

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

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`inline-flex items-center rounded-md border border-input px-3 py-2 text-sm ${
                page === currentPageSafe
                  ? "bg-primary text-white"
                  : "bg-white text-black hover:bg-green-100"
              }`}
              aria-current={page === currentPageSafe ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPageSafe + 1))}
        disabled={currentPageSafe === totalPages}
        className="inline-flex items-center rounded-md border border-input bg-white px-3 py-2 text-sm text-black hover:bg-green-100 disabled:opacity-50"
        aria-label="Next page"
      >
        <span className="mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
