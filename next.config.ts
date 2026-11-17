import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Cho phép mở dev server qua 127.0.0.1 / IP LAN. Thiếu dòng này Next chặn dev
  // resources với origin khác "localhost" -> JS không hydrate, click không phản hồi.
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.*"],
}

export default nextConfig
