import type { NextConfig } from "next";

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['profile.line-scdn.net'], // ✅ เพิ่ม domain ของ LINE
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.line-apps.com', // รูปจาก liff.getProfile() จะมาจากที่นี่
      },
      {
        protocol: 'https',
        hostname: 'profile.line-scdn.net', // อีก host ที่ LINE ใช้
      },
    ],
  },
}
export default nextConfig;
