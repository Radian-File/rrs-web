import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const isMidtransProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
const midtransConnectSource = isMidtransProduction ? "https://app.midtrans.com https://api.midtrans.com" : "https://app.sandbox.midtrans.com https://api.sandbox.midtrans.com";
const midtransFrameSource = isMidtransProduction ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${midtransConnectSource}`,
  `frame-src ${midtransFrameSource}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
