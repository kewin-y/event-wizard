import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wry-seal-923.convex.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
