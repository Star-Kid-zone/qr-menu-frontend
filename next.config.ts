import type { NextConfig } from "next";
import path from "path";

// ---------------------------------------------------------------------------
// Security headers
// ---------------------------------------------------------------------------
const isProd = process.env.NODE_ENV === "production";

/** Origin of the backend API, so the CSP lets the browser call it directly. */
function apiOrigin(): string | null {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    return base && /^https?:\/\//.test(base) ? new URL(base).origin : null;
  } catch {
    return null;
  }
}

const connectSrc = ["'self'", apiOrigin(), ...(isProd ? [] : ["http://localhost:*", "http://127.0.0.1:*", "ws://localhost:*"])]
  .filter(Boolean)
  .join(" ");

// Report-only on purpose: the browser logs violations to the console without
// blocking anything. Review those, tighten, then rename this header to
// `Content-Security-Policy` to enforce. `'unsafe-inline'` for scripts is needed
// until nonces are wired in (Next injects inline bootstrap scripts).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https: http://localhost:* http://127.0.0.1:*",
  "media-src 'self' blob: https:",
  `connect-src ${connectSrc}`,
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera stays available to this origin (QR/photo capture); everything else off.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  // HSTS only over HTTPS in production; no includeSubDomains/preload so a
  // non-HTTPS tenant or internal subdomain can't be locked out.
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=15552000" }] : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Multiple lockfiles exist above this directory (a parent package-lock.json
  // plus this project's own pnpm-lock.yaml), which makes Next.js/Turbopack
  // misinfer the workspace root. Pin it explicitly to avoid that.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      // Production image host: an S3 bucket. Bucket name/region are
      // per-environment, so restrict to the AWS S3 domain shape rather than
      // a single hardcoded bucket (see updatedbackend/src/services/s3.service.ts,
      // which builds URLs as `https://<bucket>.s3.<region>.amazonaws.com/...`).
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      // updatedbackend/src/db/seed.ts uses Unsplash stock photo URLs for
      // demo/sample business logos and banners — the real upload flow never
      // produces Unsplash URLs, this is only for seeded demo data.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // updatedbackend/src/db/laravelSeedConstants.ts uses TheMealDB stock
      // photos for seeded demo menu items — same rationale as Unsplash above.
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
      },
      // Optional CDN/custom asset host, if one is fronting the bucket.
      ...(process.env.NEXT_PUBLIC_ASSETS_HOST
        ? [
            {
              protocol: 'https' as const,
              hostname: process.env.NEXT_PUBLIC_ASSETS_HOST,
            },
          ]
        : []),
      // Local-disk upload fallback used in development (see
      // updatedbackend/src/services/s3.service.ts) is served straight off the
      // backend origin, so allow the dev API host over plain http.
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  // No rewrites() proxy: the browser calls the backend directly via
  // NEXT_PUBLIC_API_BASE_URL (see src/config/app.constants.ts), and
  // server-side data fetching calls it directly via API_PROXY_TARGET
  // (SERVER_API_BASE_URL). Routing API traffic through the Next.js server
  // would add an unnecessary hop and, on request-billed hosts (e.g. Amplify
  // SSR compute), bill every API call as frontend compute.
};

export default nextConfig;
