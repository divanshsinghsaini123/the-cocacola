import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sg.storage.bunnycdn.com",
      },
      {
        protocol: "https",
        hostname: "coco-cola-pullzone.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      }
    ]
  }
};

export default nextConfig;