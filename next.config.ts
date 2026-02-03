import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External images if needed for auth providers
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  // instrumentation.ts is loaded by default in Next.js 16+
};

export default nextConfig;
