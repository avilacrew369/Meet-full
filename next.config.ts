import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  // Hostnames (no scheme/port) allowed to request dev-only assets; LAN IP for phone testing.
  allowedDevOrigins: ["192.168.0.142"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "cxakp33csa.ufs.sh"
      }
    ]
  

  },
  experimental: {
    agentFeedback: true,
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
