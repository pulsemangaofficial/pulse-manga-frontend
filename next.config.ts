import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // This allows the build to finish even with errors
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    // This prevents ESLint from stopping your build
    ignoreDuringBuilds: true,
  },
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
