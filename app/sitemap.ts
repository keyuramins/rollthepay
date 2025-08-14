import type { MetadataRoute } from "next";

export const revalidate = 31536000; // 1 year

export default function sitemap(): MetadataRoute.Sitemap {
  const base = ""; // relative
  
  // Static routes only - dynamic routes will be generated on-demand with ISR
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    },
    {
      url: `${base}/countries`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  return staticRoutes;
}


