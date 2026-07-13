import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qr-official.line.me",
        pathname: "/gs/M_178uukqb_BW.png",
        search: "?oat_content=qr",
      },
    ],
  },
};

export default nextConfig;
