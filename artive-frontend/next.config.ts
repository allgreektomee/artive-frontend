import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // ... 기존 설정
    ],
  },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:8080/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
