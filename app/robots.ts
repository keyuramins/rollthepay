import type { MetadataRoute } from "next";

export const revalidate = 31536000; // 1 year

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: ["/sitemap.xml"],
  };
}


