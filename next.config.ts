import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp', 'image/svg+xml'],
  },
};

export default nextConfig;
