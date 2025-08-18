import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable eslint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable type checking
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
