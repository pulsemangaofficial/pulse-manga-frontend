import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // For Google Auth avatars
      },
    ],
  },
};

export default nextConfig;
