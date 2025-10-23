// lib/data/parse.ts
import type { DatasetIndex, OccupationRecord, LightweightDatasetIndex } from "./types";
import {
  getCountryData as dbGetCountryData,
  findOccupationSalaryByPath as dbfindOccupationSalaryByPath,
  getStateData as dbGetStateData,
  getLocationData as dbGetLocationData,
  getAllCountries as dbGetAllCountries,
  getHomepageStats as dbGetHomepageStats
} from "../db/queries";

// Lightweight cache for country list only (not full dataset)
let cachedCountries: string[] | null = null;
let lastCountryCacheTime = 0;
const COUNTRY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// New lightweight function that returns proper structure
export async function getLightweightDataset(): Promise<LightweightDatasetIndex> {
  try {
    // Use cached countries if available
    let countries: string[];
    if (cachedCountries && Date.now() - lastCountryCacheTime < COUNTRY_CACHE_DURATION) {
      countries = cachedCountries;
    } else {
      countries = await dbGetAllCountries();
      cachedCountries = countries;
      lastCountryCacheTime = Date.now();
    }

    // Get total record count (lightweight query)
    const stats = await dbGetHomepageStats();

    const lightweightIndex: LightweightDatasetIndex = { 
      countries,
      totalRecords: stats.totalRecords,
      totalCountries: stats.uniqueCountries
    };
    return lightweightIndex;
  } catch (error) {
    throw new Error(`PostgreSQL data access failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure PostgreSQL is accessible and contains data.`);
  }
}

// Legacy function for backward compatibility (returns empty arrays)
// DEPRECATED: This function returns empty arrays to prevent memory issues
// Use getLightweightDataset() or specific query functions instead
export async function getDataset(): Promise<DatasetIndex> {
  const requestUrl = typeof window !== 'undefined' ? window.location.href : 'server-side';
  const timestamp = new Date().toISOString();

  // Production warning - throw error to prevent silent failures
  if (process.env.NODE_ENV === 'production') {
    const error = new Error(
      'DEPRECATED: getDataset() is disabled in production. Use getLightweightDataset() or specific query functions instead. ' +
      `Called from: ${requestUrl} at ${timestamp}`
    );
    throw error;
  }


  try {
    // Use cached countries if available
    let countries: string[];
    if (cachedCountries && Date.now() - lastCountryCacheTime < COUNTRY_CACHE_DURATION) {
      countries = cachedCountries;
    } else {
      countries = await dbGetAllCountries();
      cachedCountries = countries;
      lastCountryCacheTime = Date.now();
    }
    
    // Create a lightweight index structure with empty arrays
    const byCountry = new Map<string, OccupationRecord[]>();
    for (const country of countries) {
      byCountry.set(country.toLowerCase(), []); // Empty array - will be populated on demand
    }

    const lightweightIndex: DatasetIndex = { 
      all: [], // Empty - will be populated on demand
      byCountry 
    };
    return lightweightIndex;
  } catch (error) {
    throw new Error(`PostgreSQL data access failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure PostgreSQL is accessible and contains data.`);
  }
}

export async function findOccupationSalaryByPath(params: { country: string; state?: string; location?: string; slug: string }): Promise<OccupationRecord | null> {
  try {
    const record = await dbfindOccupationSalaryByPath(params);
    return record;
  } catch (error) {
    throw error;
  }
}

// Helper function to group records by state
export async function getStateData(country: string) {
  try {
    const stateGroups = new Map<string, { 
      name: string; 
      jobs: Array<{
        slug: string;
        title: string | null;
        occ_name: string | null;
        avgAnnualSalary: number | null;
        avgHourlySalary: number | null;
      }>;
    }>();
    
    // Get all states for this country
    const { getAllStates } = await import('../db/queries');
    const states = await getAllStates(country);
    
    // Parallelize state data fetching for better performance
    const stateDataPromises = states.map(async (state) => {
      const stateData = await dbGetStateData(country, state);
      return { state, stateData };
    });
    
    const stateDataResults = await Promise.all(stateDataPromises);
    
    // Process results
    for (const { state, stateData } of stateDataResults) {
      if (stateData) {
        const stateKey = state.toLowerCase().replace(/\s+/g, '-');
        stateGroups.set(stateKey, {
          name: stateData.name,
          jobs: stateData.jobs
        });
      }
    }
    
    return stateGroups;
  } catch (error) {
    console.error('Failed to get state data:', error);
    throw error; // Re-throw to fail fast
  }
}

// Helper function to group records by location within a state
export async function getLocationData(country: string, state: string) {
  try {
    const locationGroups = new Map<string, { 
      name: string; 
      jobs: Array<{
        slug: string;
        title: string | null;
        occ_name: string | null;
        avgAnnualSalary: number | null;
        avgHourlySalary: number | null;
      }>;
    }>();
    
    // Get all locations for this state
    const { getAllLocations } = await import('../db/queries');
    const locations = await getAllLocations(country, state);
    
    // Parallelize location data fetching for better performance
    const locationDataPromises = locations.map(async (location) => {
      const locationData = await dbGetLocationData(country, state, location);
      return { location, locationData };
    });
    
    const locationDataResults = await Promise.all(locationDataPromises);
    
    // Process results
    for (const { location, locationData } of locationDataResults) {
      if (locationData) {
        const locationKey = location.toLowerCase().replace(/\s+/g, '-');
        locationGroups.set(locationKey, {
          name: locationData.name,
          jobs: locationData.jobs
        });
      }
    }
    
    return locationGroups;
  } catch (error) {
    throw error;
  }
}

// Clear cache (useful for testing or manual cache invalidation)
export function clearCache() {
  cachedCountries = null;
  lastCountryCacheTime = 0; // Reset cache time
}

// Also export safe extraction utilities
export * from "./safe-extractors";

