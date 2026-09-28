import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevent clickjacking — disallow embedding in iframes
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Prevent MIME-type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Control referrer information leakage
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Enforce HTTPS for 2 years (preload-ready)
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Restrict access to browser features
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    // Content Security Policy
    // Allows:
    //   - Scripts: self only (Next.js inline scripts use nonces in production; unsafe-inline kept for dev compat)
    //   - Styles: self + unsafe-inline (needed by Tailwind/Next.js)
    //   - Images: self + data URIs (for base64 food photos) + blob: (for generated content)
    //   - Fonts: self + Google Fonts
      //   - Connect: self + Gemini API (direct dev key) + Cloudflare Worker AI proxy
    //   - Frames: none
    //   - Objects: none
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed by Next.js dev mode; remove in strict prod
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://generativelanguage.googleapis.com https://*.workers.dev https://formspree.io",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    // Opt out of Google's FLoC / Topics API
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
