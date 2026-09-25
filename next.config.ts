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
  // The certificate PDF reads its fonts and images off disk at request time, which
  // the tracer can't see — ship them with that route (src/components/certificate-pdf.tsx).
  outputFileTracingIncludes: {
    "/certificate/*/pdf": [
      "./src/assets/fonts/**/*",
      "./public/logo.png",
      "./public/logo/logo_horizontal_with_text.png",
      "./public/son-signature.png",
    ],
  },
  experimental: {
    serverActions: {
      // The payment step posts a slip image through a server action. Default is
      // 1 MB; MAX_IMAGE_BYTES in src/lib/slip-types.ts is 4 MB, plus multipart overhead.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
