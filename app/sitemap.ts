import type { MetadataRoute } from "next";
import { continents } from "@/app/constants/continents";
import { getDataset } from "@/lib/data/filebrowser-parse";

export const revalidate = 31536000; // 1 year

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://rollthepay.com";
  const now = new Date();
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms-of-use`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes from CSV data
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Get all countries from continents data
    const allCountries = continents.flatMap(continent => continent.countries);
    
    // Get dataset to find available countries and their data
    const { byCountry } = await getDataset();
    
    // Add country pages
    for (const country of allCountries) {
      const countrySlug = country.slug;
      const countryRecords = byCountry.get(countrySlug) || [];
      
      if (countryRecords.length > 0) {
        // Add country page
        dynamicRoutes.push({
          url: `${base}/${countrySlug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.9,
        });
        
        // Group records by state
        const stateGroups = new Map<string, typeof countryRecords>();
        for (const record of countryRecords) {
          if (record.state) {
            const stateKey = record.state.toLowerCase().replace(/\s+/g, '-');
            if (!stateGroups.has(stateKey)) {
              stateGroups.set(stateKey, []);
            }
            stateGroups.get(stateKey)!.push(record);
          }
        }
        
        // Add state pages
        for (const [stateSlug, stateRecords] of stateGroups) {
          dynamicRoutes.push({
            url: `${base}/${countrySlug}/${stateSlug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          });
          
          // Group state records by location
          const locationGroups = new Map<string, typeof stateRecords>();
          for (const record of stateRecords) {
            if (record.location) {
              const locationKey = record.location.toLowerCase().replace(/\s+/g, '-');
              if (!locationGroups.has(locationKey)) {
                locationGroups.set(locationKey, []);
              }
              locationGroups.get(locationKey)!.push(record);
            }
          }
          
          // Add location pages
          for (const [locationSlug, locationRecords] of locationGroups) {
            dynamicRoutes.push({
              url: `${base}/${countrySlug}/${stateSlug}/${locationSlug}`,
              lastModified: now,
              changeFrequency: "weekly",
              priority: 0.7,
            });
            
            // Add occupation pages for this location
            for (const record of locationRecords) {
              dynamicRoutes.push({
                url: `${base}/${countrySlug}/${stateSlug}/${locationSlug}/${record.slug_url}`,
                lastModified: now,
                changeFrequency: "monthly",
                priority: 0.6,
              });
            }
          }
          
          // Add occupation pages for state (without location)
          const stateOnlyRecords = stateRecords.filter(record => !record.location);
          for (const record of stateOnlyRecords) {
            dynamicRoutes.push({
              url: `${base}/${countrySlug}/${stateSlug}/${record.slug_url}`,
              lastModified: now,
              changeFrequency: "monthly",
              priority: 0.6,
            });
          }
        }
        
        // Add occupation pages for country (without state)
        const countryOnlyRecords = countryRecords.filter(record => !record.state);
        for (const record of countryOnlyRecords) {
          dynamicRoutes.push({
            url: `${base}/${countrySlug}/${record.slug_url}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    // Continue with static routes only if dynamic generation fails
  }

  return [...staticRoutes, ...dynamicRoutes];
}