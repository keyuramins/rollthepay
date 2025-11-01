// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllCountries, getAllStates, getAllLocations, searchOccupations } from "@/lib/db/queries";
import { slugify } from "@/lib/format/slug";

// Next.js 16: Route segment configuration for sitemap
export const routeSegmentConfig = { revalidate: 86400 }; // 1 day for sitemap

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

  // Skip dynamic sitemap generation during build
  if (process.env.SKIP_SITEMAP_GENERATION === 'true') {
    console.log('⚠️ Skipping dynamic sitemap generation (SKIP_SITEMAP_GENERATION=true)');
    return staticRoutes;
  }

  // Dynamic routes from database
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Check if we're in build mode and database is not available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      console.log('⚠️ Skipping dynamic sitemap generation during build (no database connection)');
      return staticRoutes;
    }
    
    // Get all countries from database
    const dbCountries = await getAllCountries();
    
    // Add country pages
    for (const countrySlug of dbCountries) {
      // Add country page
      dynamicRoutes.push({
        url: `${base}/${countrySlug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
      
      // Get states for this country
      const states = await getAllStates(countrySlug);
      
      // Add state pages
      for (const state of states) {
        const stateSlug = slugify(state);
        
        dynamicRoutes.push({
          url: `${base}/${countrySlug}/${stateSlug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
        
        // Get locations for this state
        const locations = await getAllLocations(countrySlug, state);
        
        // Add location pages
        for (const location of locations) {
          const locationSlug = slugify(location);
          
          dynamicRoutes.push({
            url: `${base}/${countrySlug}/${stateSlug}/${locationSlug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
      
      // Get occupation pages for this country (search for occupations)
      const occupations = await searchOccupations('', countrySlug, 1000); // Get up to 1000 occupations per country
      
      for (const occupation of occupations) {
        let occupationUrl = `${base}/${countrySlug}`;
        
        // Build URL based on geographic hierarchy
        if (occupation.state) {
          const stateSlug = slugify(occupation.state);
          occupationUrl += `/${stateSlug}`;
          
          if (occupation.location) {
            const locationSlug = slugify(occupation.location);
            occupationUrl += `/${locationSlug}`;
          }
        }
        
        occupationUrl += `/${occupation.slug_url}`;
        
        dynamicRoutes.push({
          url: occupationUrl,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    // Continue with static routes only if dynamic generation fails
  }

  return [...staticRoutes, ...dynamicRoutes];
}