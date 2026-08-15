import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access during dev (Next.js 16 blocks cross-origin dev assets by default).
  // Update the IP if your network address changes, or use http://localhost:3001 instead.
  allowedDevOrigins: ["192.168.3.96", "127.0.0.1"],
};

export default nextConfig;
