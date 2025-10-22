// lib/data/optimized-parse.ts
import { findOccupationSalaryByPath } from './parse';
import { getCountryData as dbGetCountryData, getAllStates, getAllLocations, getStateData as dbGetStateData, getLocationData as dbGetLocationData, searchOccupations } from '../db/queries';
import type { OccupationRecord } from './types';

// Optimized data access with PostgreSQL queries
export class OptimizedDataAccess {
  private static instance: OptimizedDataAccess;

  private constructor() {}

  static getInstance(): OptimizedDataAccess {
    if (!OptimizedDataAccess.instance) {
      OptimizedDataAccess.instance = new OptimizedDataAccess();
    }
    return OptimizedDataAccess.instance;
  }

  // Legacy getDataset method removed - using PostgreSQL queries instead
  
  // Get country data using PostgreSQL queries
  async getCountryData(countrySlug: string): Promise<{
    countryName: string;
    totalJobs: number;
    avgSalary: number;
    states: string[];
    occupationItems: any[];
    headerOccupations: any[];
  } | null> {
    // Use direct database query
    const countryData = await dbGetCountryData(countrySlug);
    
    if (!countryData) {
      return null;
    }

    // Get states for this country
    const states = await getAllStates(countrySlug);
    
    // Use occupations already computed by getCountryData() for this country
    const occupationItems = countryData.occupationItems || [];
    const headerOccupations = countryData.headerOccupations || [];

    return {
      countryName: countryData.countryName,
      totalJobs: countryData.totalJobs,
      avgSalary: countryData.avgSalary,
      states,
      occupationItems,
      headerOccupations
    };
  }

  // Get state data using PostgreSQL queries
  async getStateData(countrySlug: string, state: string): Promise<{
    name: string;
    jobs: Array<{
      slug: string;
      title: string | null;
      occupation: string | null;
      avgAnnualSalary: number | null;
      avgHourlySalary: number | null;
    }>;
  } | null> {
    // Use direct database query
    const stateData = await dbGetStateData(countrySlug, state);
    
    if (!stateData) return null;
    
    // Transform the data to include occupation field
    return {
      name: stateData.name,
      jobs: stateData.jobs.map((job: any) => ({
        ...job,
        occupation: job.title // Use title as occupation since that's what it represents
      }))
    };
  }

  // Get location data using PostgreSQL queries
  async getLocationData(countrySlug: string, state: string, location: string): Promise<{
    name: string;
    jobs: Array<{
      slug: string;
      title: string | null;
      occupation: string | null;
      avgAnnualSalary: number | null;
      avgHourlySalary: number | null;
    }>;
  } | null> {
    // Use direct database query
    const locationData = await dbGetLocationData(countrySlug, state, location);
    
    if (!locationData) return null;
    
    // Transform the data to include occupation field
    return {
      name: locationData.name,
      jobs: locationData.jobs.map((job: any) => ({
        ...job,
        occupation: job.title // Use title as occupation since that's what it represents
      }))
    };
  }

  // Find record by path using PostgreSQL queries
  async findOccupationSalaryByPath(params: { country: string; state?: string; location?: string; slug: string }): Promise<OccupationRecord | null> {
    // Use direct database query
    return await findOccupationSalaryByPath(params);
  }

  // Prefetch route data (DISABLED - using PostgreSQL instead)
  async prefetchRoute(route: string): Promise<any> {
    // DISABLED: PostgreSQL queries are fast enough, no need for prefetching
    return null;
  }

  // Get all states for a country using PostgreSQL queries
  async getAllStates(countrySlug: string): Promise<string[]> {
    // Use direct database query
    return await getAllStates(countrySlug);
  }

  // Get all locations for a state using PostgreSQL queries
  async getAllLocations(countrySlug: string, state: string): Promise<string[]> {
    // Use direct database query
    return await getAllLocations(countrySlug, state);
  }

  // Get occupation suggestions for search using PostgreSQL queries
  async getOccupationSuggestions(countrySlug: string, query: string, limit: number = 10): Promise<OccupationRecord[]> {
    // Use direct database query
    return await searchOccupations(query, countrySlug, limit);
  }

  // Clear all caches (no longer needed with PostgreSQL)
  clearCache(): void {
    // No-op: PostgreSQL handles caching internally
  }
}

// Export singleton instance
export const optimizedDataAccess = OptimizedDataAccess.getInstance();
