import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.birbot.tech", // Add GCORE_CDN_HOSTNAME to your .env
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "jellyfish-app-4r55c.ondigitalocean.app"
      },
      {
        protocol: "https",
        hostname: "active-nurture-c4d476a309.media.strapiapp.com"
      },
      {
        protocol: "https",
        hostname: "strapicloud9-k6ghp.ondigitalocean.app"
      }
    ]
  }
};

export default nextConfig;