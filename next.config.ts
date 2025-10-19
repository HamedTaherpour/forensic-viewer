import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Allow local images without optimization
  },
};

export default nextConfig;
