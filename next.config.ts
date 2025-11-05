import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;
