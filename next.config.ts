import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build optimizations
  compress: true,
  
  // Compression and optimization
  experimental: {
    // Enable package optimization for better tree shaking
    optimizePackageImports: ['@/components', '@/lib'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  // Asset optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for compression and caching (production only)
  async headers() {
    // Only enable headers in production environment
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*\\.(?:js|css|png|jpg|jpeg|gif|svg|webp|avif|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Disable eslint during builds for speed
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable type checking during builds for speed
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable production source maps for smaller bundles
  productionBrowserSourceMaps: false,

  // Optimize for production
  poweredByHeader: false,

  // Enable modern JavaScript features
  reactStrictMode: true,

  // Optimize for static generation
  trailingSlash: false,
};

export default nextConfig;
