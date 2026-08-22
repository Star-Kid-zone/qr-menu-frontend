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
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;

    if (!target) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'API_PROXY_TARGET is not set. Refusing to fall back to a localhost API target in a production build — set API_PROXY_TARGET to the backend origin (e.g. https://api.example.com).',
        );
      }
      console.warn(
        '[next.config] API_PROXY_TARGET is not set — falling back to http://127.0.0.1:7000 for local development only.',
      );
    }

    const destinationOrigin = target || 'http://127.0.0.1:7000';

    return [
      {
        source: '/api/:path*',
        destination: `${destinationOrigin.replace(/\/+$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
