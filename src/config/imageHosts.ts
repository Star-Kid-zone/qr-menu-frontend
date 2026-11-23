/**
 * Remote image hosts the Next.js optimizer (`/_next/image`) may fetch from.
 *
 * Shared by `next.config.ts` (`images.remotePatterns`) and the `Image` wrapper
 * in `@/components/ui/Image`, so the two never drift. Pure module: no imports,
 * because `next.config.ts` loads it outside the app bundle.
 */
const assetsHost = process.env.NEXT_PUBLIC_ASSETS_HOST;

export const IMAGE_REMOTE_PATTERNS = [
  // Production image host: an S3 bucket. Bucket name/region are
  // per-environment, so restrict to the AWS S3 domain shape rather than a
  // single hardcoded bucket (the backend builds
  // `https://<bucket>.s3.<region>.amazonaws.com/...`).
  { protocol: 'https', hostname: '*.s3.*.amazonaws.com' },
  // Seeded demo data only (Unsplash banners/logos, TheMealDB dishes); the real
  // upload flow never produces these URLs.
  { protocol: 'https', hostname: 'images.unsplash.com' },
  { protocol: 'https', hostname: 'www.themealdb.com' },
  // Optional CDN/custom asset host, if one is fronting the bucket.
  ...(assetsHost ? [{ protocol: 'https' as const, hostname: assetsHost }] : []),
  // Local-disk upload fallback in development is served straight off the
  // backend origin over plain http.
  { protocol: 'http', hostname: 'localhost' },
  { protocol: 'http', hostname: '127.0.0.1' },
] as const satisfies ReadonlyArray<{ protocol: 'http' | 'https'; hostname: string }>;

/** `*` matches one DNS label, `**` any number of labels (Next's semantics). */
function hostnameMatches(pattern: string, hostname: string): boolean {
  const p = pattern.split('.');
  const h = hostname.split('.');
  const match = (i: number, j: number): boolean => {
    if (i === p.length) return j === h.length;
    if (p[i] === '**') return j <= h.length && (match(i + 1, j) || (j < h.length && match(i, j + 1)));
    if (j === h.length) return false;
    return (p[i] === '*' || p[i] === h[j]) && match(i + 1, j + 1);
  };
  return match(0, 0);
}

/**
 * Whether `next/image` can run `src` through the optimizer. Relative paths and
 * allow-listed remote hosts can; anything else (blob:/data: previews, or a URL
 * on a host outside the list) must be rendered with `unoptimized`, otherwise
 * `next/image` throws "hostname is not configured" and the page breaks.
 */
export function isOptimizableImageSrc(src: string): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  const protocol = url.protocol.replace(/:$/, '');
  return IMAGE_REMOTE_PATTERNS.some(
    (p) => p.protocol === protocol && hostnameMatches(p.hostname, url.hostname),
  );
}
