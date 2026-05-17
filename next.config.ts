import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "tmtwkz0h9i.ufs.sh" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
