import NextImage, { type ImageProps } from 'next/image';
import { isOptimizableImageSrc } from '@/config/imageHosts';

/**
 * Drop-in replacement for `next/image`. Use it everywhere instead of importing
 * `next/image` directly.
 *
 * Image URLs come from the database (uploads, gallery, banners, seeded data),
 * so a URL can point at a host that is not in `images.remotePatterns`. Plain
 * `next/image` throws on such a URL and breaks the page. This wrapper serves
 * those images unoptimized (the browser loads them directly) and keeps
 * optimization for allow-listed hosts and local paths.
 */
export default function Image({ unoptimized, ...props }: ImageProps) {
  const src = typeof props.src === 'string' ? props.src : null;
  const bypass = unoptimized || (src !== null && !isOptimizableImageSrc(src));
  return <NextImage {...props} unoptimized={bypass} />;
}
