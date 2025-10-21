import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build-specific configuration that skips sitemap generation
  trailingSlash: false,
  
  // Override sitemap generation
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap-static.xml', // Use static sitemap instead
      },
    ];
  },
};

export default nextConfig;
