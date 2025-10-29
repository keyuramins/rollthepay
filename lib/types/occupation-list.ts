// lib/types/occupation-list.ts
// Type definitions for occupation list items

export interface OccupationListItem {
  id: string;
  title: string; // Required - always present from data producers
  displayName: string; // Required - precomputed by data producers
  slug_url: string;
  location?: string;
  state?: string;
  avgAnnualSalary?: number;
  countrySlug: string;
  company_name?: string;
}

export interface OccupationListClientProps {
  items: OccupationListItem[];
  countrySlug: string;
  currentState?: string;
  currentLocation?: string;
}

export interface OccupationListItemsProps {
  paginatedItems: OccupationListItem[];
  totalItems: number;
  PAGE_SIZE: number;
  currentPage: number;
  totalPages: number;
  countrySlug: string;
  currentState?: string;
  currentLocation?: string;
}
