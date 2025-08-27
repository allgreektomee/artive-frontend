import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 프로덕션 빌드 시 ESLint 에러 무시
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
