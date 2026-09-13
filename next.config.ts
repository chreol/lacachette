import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/api/media/**" },
    ],
  },
};

export default nextConfig;
