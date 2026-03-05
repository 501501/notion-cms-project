import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Notion 이미지 및 외부 이미지 도메인 허용
  images: {
    remotePatterns: [
      {
        // Notion 업로드 파일 (AWS S3)
        protocol: "https",
        hostname: "prod-files-secure.s3.us-east-1.amazonaws.com",
      },
      {
        // Notion 공개 파일
        protocol: "https",
        hostname: "*.notion.so",
      },
      {
        // Notion 이미지 최적화 CDN
        protocol: "https",
        hostname: "www.notion.so",
      },
    ],
  },

  // 실험적 기능: React 19 컴파일러 (선택)
  // experimental: {
  //   reactCompiler: true,
  // },
};

export default nextConfig;
