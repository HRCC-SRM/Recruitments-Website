import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Fast Refresh to prevent infinite loops
  reactStrictMode: false,
  
  // Disable hot reloading
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: false,
        ignored: /node_modules/,
      };
    }
    return config;
  },
  
  // Disable Fast Refresh
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
