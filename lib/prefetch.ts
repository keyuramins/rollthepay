import { getDataset } from './data/parse';
import type { OccupationRecord } from './data/types';

// Prefetch cache to store precomputed data
const prefetchCache = new Map<string, any>();
const routePrefetchCache = new Map<string, Promise<any>>();

// Client-side bypass - prevent prefetching in browser
const isClientSide = typeof window !== 'undefined';

// Prefetch all possible routes and data
export async function prefetchAllRoutes(): Promise<void> {
  // Skip prefetching on client side to prevent Filebrowser calls
  if (isClientSide) {
    console.log('🚫 Prefetching skipped on client side - this is a server-side optimization');
    return;
  }

  try {
    console.log('🚀 Starting aggressive prefetch of all routes...');
    
    const dataset = await getDataset();
    const { all, byCountry } = dataset;
    
    // Prefetch country pages
    for (const [countrySlug, records] of byCountry) {
      await prefetchCountryPage(countrySlug, records);
    }
    
    // Prefetch state pages
    for (const [countrySlug, records] of byCountry) {
      const states = new Set(records.map(r => r.state).filter(Boolean));
      for (const state of states) {
        if (state) {
          await prefetchStatePage(countrySlug, state, records);
        }
      }
    }
    
    // Prefetch location pages
    for (const [countrySlug, records] of byCountry) {
      const stateGroups = new Map<string, OccupationRecord[]>();
      
      for (const record of records) {
        if (record.state) {
          if (!stateGroups.has(record.state)) {
            stateGroups.set(record.state, []);
          }
          stateGroups.get(record.state)!.push(record);
        }
      }
      
      for (const [state, stateRecords] of stateGroups) {
        const locations = new Set(stateRecords.map(r => r.location).filter(Boolean));
        for (const location of locations) {
          if (location) {
            await prefetchLocationPage(countrySlug, state, location, stateRecords);
          }
        }
      }
    }
    
    // Prefetch occupation pages
    for (const record of all) {
      await prefetchOccupationPage(record);
    }
    
    console.log('✅ Aggressive prefetch completed! All routes are now cached.');
  } catch (error) {
    console.error('❌ Prefetch failed:', error);
  }
}

// Prefetch country page data
async function prefetchCountryPage(countrySlug: string, records: OccupationRecord[]): Promise<void> {
  // Skip prefetching on client side
  if (isClientSide) return;
  
  const cacheKey = `country:${countrySlug}`;
  
  if (prefetchCache.has(cacheKey)) return;
  
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
  
  prefetchCache.set(cacheKey, {
    countryName,
    totalJobs,
    avgSalary,
    states,
    occupationItems,
    headerOccupations
  });
}

// Prefetch state page data
async function prefetchStatePage(countrySlug: string, state: string, records: OccupationRecord[]): Promise<void> {
  // Skip prefetching on client side
  if (isClientSide) return;
  
  const cacheKey = `state:${countrySlug}:${state}`;
  
  if (prefetchCache.has(cacheKey)) return;
  
  const stateRecords = records.filter(r => r.state === state);
  const stateKey = state.toLowerCase().replace(/\s+/g, '-');
  
  const stateData = {
    name: state,
    jobs: stateRecords.map(record => ({
      slug: record.slug_url,
      title: record.title,
      occupation: record.occupation,
      avgAnnualSalary: record.avgAnnualSalary,
      avgHourlySalary: record.avgHourlySalary
    }))
  };
  
  prefetchCache.set(cacheKey, stateData);
}

// Prefetch location page data
async function prefetchLocationPage(countrySlug: string, state: string, location: string, records: OccupationRecord[]): Promise<void> {
  // Skip prefetching on client side
  if (isClientSide) return;
  
  const cacheKey = `location:${countrySlug}:${state}:${location}`;
  
  if (prefetchCache.has(cacheKey)) return;
  
  const locationRecords = records.filter(r => r.location === location);
  const locationKey = location.toLowerCase().replace(/\s+/g, '-');
  
  const locationData = {
    name: location,
    jobs: locationRecords.map(record => ({
      slug: record.slug_url,
      title: record.title,
      occupation: record.occupation,
      avgAnnualSalary: record.avgAnnualSalary,
      avgHourlySalary: record.avgHourlySalary
    }))
  };
  
  prefetchCache.set(cacheKey, locationData);
}

// Prefetch occupation page data
async function prefetchOccupationPage(record: OccupationRecord): Promise<void> {
  // Skip prefetching on client side
  if (isClientSide) return;
  
  const cacheKey = `occupation:${record.country}:${record.state || 'none'}:${record.location || 'none'}:${record.slug_url}`;
  
  if (prefetchCache.has(cacheKey)) return;
  
  // Store the full record for instant access
  prefetchCache.set(cacheKey, record);
}

// Get prefetched data
export function getPrefetchedData<T>(key: string): T | null {
  return prefetchCache.get(key) || null;
}

// Prefetch specific route
export async function prefetchRoute(route: string): Promise<any> {
  // Skip prefetching on client side to prevent Filebrowser calls
  if (isClientSide) {
    console.log('🚫 Route prefetching skipped on client side - this is a server-side optimization');
    return null;
  }

  if (routePrefetchCache.has(route)) {
    return routePrefetchCache.get(route);
  }
  
  const promise = (async () => {
    try {
      // Parse route and prefetch appropriate data
      const segments = route.split('/').filter(Boolean);
      
      if (segments.length === 1) {
        // Country page
        const dataset = await getDataset();
        const records = dataset.byCountry.get(segments[0]) || [];
        await prefetchCountryPage(segments[0], records);
        return getPrefetchedData(`country:${segments[0]}`);
      } else if (segments.length === 2) {
        // State page or occupation page
        const dataset = await getDataset();
        const records = dataset.byCountry.get(segments[0]) || [];
        const stateRecords = records.filter(r => r.state && r.state.toLowerCase().replace(/\s+/g, '-') === segments[1]);
        
        if (stateRecords.length > 0) {
          // It's a state page
          await prefetchStatePage(segments[0], stateRecords[0].state!, records);
          return getPrefetchedData(`state:${segments[0]}:${stateRecords[0].state}`);
        } else {
          // It's an occupation page
          const occupationRecord = records.find(r => r.slug_url === segments[1]);
          if (occupationRecord) {
            await prefetchOccupationPage(occupationRecord);
            return getPrefetchedData(`occupation:${segments[0]}:none:none:${segments[1]}`);
          }
        }
      } else if (segments.length === 3) {
        // Location page or state-level occupation page
        const dataset = await getDataset();
        const records = dataset.byCountry.get(segments[0]) || [];
        const stateRecords = records.filter(r => r.state && r.state.toLowerCase().replace(/\s+/g, '-') === segments[1]);
        
        if (stateRecords.length > 0) {
          const locationRecords = stateRecords.filter(r => r.location && r.location.toLowerCase().replace(/\s+/g, '-') === segments[2]);
          
          if (locationRecords.length > 0) {
            // It's a location page
            await prefetchLocationPage(segments[0], locationRecords[0].state!, locationRecords[0].location!, records);
            return getPrefetchedData(`location:${segments[0]}:${locationRecords[0].state}:${locationRecords[0].location}`);
          } else {
            // It's a state-level occupation page
            const occupationRecord = stateRecords.find(r => r.slug_url === segments[2]);
            if (occupationRecord) {
              await prefetchOccupationPage(occupationRecord);
              return getPrefetchedData(`occupation:${segments[0]}:${occupationRecord.state}:none:${segments[2]}`);
            }
          }
        }
      } else if (segments.length === 4) {
        // Location-level occupation page
        const dataset = await getDataset();
        const records = dataset.byCountry.get(segments[0]) || [];
        const occupationRecord = records.find(r => 
          r.state && r.state.toLowerCase().replace(/\s+/g, '-') === segments[1] &&
          r.location && r.location.toLowerCase().replace(/\s+/g, '-') === segments[2] &&
          r.slug_url === segments[3]
        );
        
        if (occupationRecord) {
          await prefetchOccupationPage(occupationRecord);
          return getPrefetchedData(`occupation:${segments[0]}:${occupationRecord.state}:${occupationRecord.location}:${segments[3]}`);
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to prefetch route ${route}:`, error);
      return null;
    }
  })();
  
  routePrefetchCache.set(route, promise);
  return promise;
}

// Clear prefetch cache
export function clearPrefetchCache(): void {
  // Skip cache clearing on client side
  if (isClientSide) {
    console.log('🚫 Cache clearing skipped on client side');
    return;
  }
  
  prefetchCache.clear();
  routePrefetchCache.clear();
}

// Get cache stats
export function getPrefetchStats(): { cacheSize: number; routeCacheSize: number } {
  // Return empty stats on client side
  if (isClientSide) {
    console.log('🚫 Cache stats skipped on client side');
    return { cacheSize: 0, routeCacheSize: 0 };
  }
  
  return {
    cacheSize: prefetchCache.size,
    routeCacheSize: routePrefetchCache.size
  };
}
