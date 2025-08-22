import { getDataset, findRecordByPath, getStateData, getLocationData } from './parse';
import { getPrefetchedData, prefetchRoute } from '../prefetch';
import type { DatasetIndex, OccupationRecord } from './types';

// Optimized data access with prefetch cache
export class OptimizedDataAccess {
  private static instance: OptimizedDataAccess;
  private datasetCache: DatasetIndex | null = null;
  private lastDatasetFetch = 0;
  private readonly CACHE_DURATION = 31536000 * 1000; // 1 year

  private constructor() {}

  static getInstance(): OptimizedDataAccess {
    if (!OptimizedDataAccess.instance) {
      OptimizedDataAccess.instance = new OptimizedDataAccess();
    }
    return OptimizedDataAccess.instance;
  }

  // Get dataset with aggressive caching
  async getDataset(): Promise<DatasetIndex> {
    const now = Date.now();
    
    // Return cached dataset if still valid
    if (this.datasetCache && (now - this.lastDatasetFetch) < this.CACHE_DURATION) {
      return this.datasetCache;
    }

    // Fetch and cache dataset
    this.datasetCache = await getDataset();
    this.lastDatasetFetch = now;
    
    return this.datasetCache;
  }

  // Get country data with prefetch optimization
  async getCountryData(countrySlug: string): Promise<{
    countryName: string;
    totalJobs: number;
    avgSalary: number;
    states: string[];
    occupationItems: any[];
    headerOccupations: any[];
  } | null> {
    const cacheKey = `country:${countrySlug}`;
    
    // Try prefetch cache first
    const prefetched = getPrefetchedData(cacheKey);
    if (prefetched) {
      return prefetched;
    }

    // Fallback to regular fetch and cache
    const dataset = await this.getDataset();
    const records = dataset.byCountry.get(countrySlug) || [];
    
    if (records.length === 0) return null;

    const countryName = countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1);
    const totalJobs = records.length;
    const avgSalary = records.reduce((sum, rec) => sum + (rec.avgAnnualSalary || 0), 0) / totalJobs;
    const states = Array.from(new Set(records.map(rec => rec.state).filter(Boolean)));
    
    const occupationItems = records.map(record => ({
      id: record.slug_url,
      displayName: record.title || record.h1Title || "Unknown Occupation",
      originalName: record.title || record.h1Title || "Unknown Occupation",
      slug_url: record.slug_url,
      location: record.location || undefined,
      state: record.state || undefined,
      avgAnnualSalary: record.avgAnnualSalary || undefined,
      countrySlug: countrySlug
    }));

    const headerOccupations = records.map(rec => ({
      country: rec.country.toLowerCase(),
      title: rec.title || rec.h1Title || "",
      slug: rec.slug_url,
      state: rec.state ? rec.state : null,
      location: rec.location ? rec.location : null,
    }));

    const result = {
      countryName,
      totalJobs,
      avgSalary,
      states,
      occupationItems,
      headerOccupations
    };

    // Cache for future use
    return result;
  }

  // Get state data with prefetch optimization
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
    const cacheKey = `state:${countrySlug}:${state}`;
    
    // Try prefetch cache first
    const prefetched = getPrefetchedData(cacheKey);
    if (prefetched) {
      return prefetched;
    }

    // Fallback to regular fetch
    const stateGroups = await getStateData(countrySlug);
    const stateKey = state.toLowerCase().replace(/\s+/g, '-');
    return stateGroups.get(stateKey) || null;
  }

  // Get location data with prefetch optimization
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
    const cacheKey = `location:${countrySlug}:${state}:${location}`;
    
    // Try prefetch cache first
    const prefetched = getPrefetchedData(cacheKey);
    if (prefetched) {
      return prefetched;
    }

    // Fallback to regular fetch
    const locationGroups = await getLocationData(countrySlug, state);
    const locationKey = location.toLowerCase().replace(/\s+/g, '-');
    return locationGroups.get(locationKey) || null;
  }

  // Find record by path with prefetch optimization
  async findRecordByPath(params: { country: string; state?: string; location?: string; slug: string }): Promise<OccupationRecord | null> {
    const { country, state, location, slug } = params;
    
    // Build cache key
    const cacheKey = `occupation:${country}:${state || 'none'}:${location || 'none'}:${slug}`;
    
    // Try prefetch cache first
    const prefetched = getPrefetchedData(cacheKey);
    if (prefetched) {
      return prefetched;
    }

    // Fallback to regular fetch
    return await findRecordByPath(params);
  }

  // Prefetch route data
  async prefetchRoute(route: string): Promise<any> {
    return await prefetchRoute(route);
  }

  // Get all states for a country with optimization
  async getAllStates(countrySlug: string): Promise<string[]> {
    const dataset = await this.getDataset();
    const records = dataset.byCountry.get(countrySlug) || [];
    return Array.from(new Set(records.map(rec => rec.state).filter(Boolean)));
  }

  // Get all locations for a state with optimization
  async getAllLocations(countrySlug: string, state: string): Promise<string[]> {
    const dataset = await this.getDataset();
    const records = dataset.byCountry.get(countrySlug) || [];
    const stateRecords = records.filter(rec => rec.state === state);
    return Array.from(new Set(stateRecords.map(rec => rec.location).filter(Boolean)));
  }

  // Get occupation suggestions for search
  async getOccupationSuggestions(countrySlug: string, query: string, limit: number = 10): Promise<OccupationRecord[]> {
    const dataset = await this.getDataset();
    const records = dataset.byCountry.get(countrySlug) || [];
    
    if (!query.trim()) return records.slice(0, limit);
    
    const queryLower = query.toLowerCase();
    return records
      .filter(rec => 
        (rec.title && rec.title.toLowerCase().includes(queryLower)) ||
        (rec.occupation && rec.occupation.toLowerCase().includes(queryLower))
      )
      .slice(0, limit);
  }

  // Clear all caches
  clearCache(): void {
    this.datasetCache = null;
    this.lastDatasetFetch = 0;
  }
}

// Export singleton instance
export const optimizedDataAccess = OptimizedDataAccess.getInstance();
