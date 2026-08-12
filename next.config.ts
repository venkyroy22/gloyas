import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.streamlet.in',
      },
      {
        protocol: 'https',
        hostname: 'cdn.streamletedge.com',
      },
    ],
  },
};

export default nextConfig;
