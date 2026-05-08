import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ptopw9wgmai2fvcu.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
