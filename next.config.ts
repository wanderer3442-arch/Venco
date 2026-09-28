import type { NextConfig } from "next";

// NOTE: security headers ship as <meta> tags in src/app/layout.tsx because
// `output: 'export'` cannot serve HTTP response headers.

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
