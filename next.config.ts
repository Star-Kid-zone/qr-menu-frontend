import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
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
