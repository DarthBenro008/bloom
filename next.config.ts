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
};

export default nextConfig;
