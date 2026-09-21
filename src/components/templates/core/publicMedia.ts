import type { GalleryItem } from './types';

/**
 * Resolve gallery `image_url` / `image_path` to an absolute URL for `<img src>`.
 * Works with full URLs, root-relative `/storage/...`, and bare paths from legacy data.
 */
export function resolvePublicImageUrl(item: Pick<GalleryItem, 'image_url' | 'image_path'>): string | null {
  const raw = (item.image_url?.trim() || item.image_path?.trim()) ?? '';
  if (!raw) return null;
  // Already-complete URLs (including local blob:/data: previews used while a
  // file is still being uploaded) — pass through unchanged.
  if (/^(https?|blob|data):/i.test(raw)) return raw;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  if (!origin) return raw.startsWith('/') ? raw : `/${raw}`;
  if (raw.startsWith('/')) return `${origin}${raw}`;
  return `${origin}/${raw.replace(/^\//, '')}`;
}

export function mapGalleryWithResolvedUrls(items: GalleryItem[]): GalleryItem[] {
  return items.map((g) => {
    const url = resolvePublicImageUrl(g);
    return url ? { ...g, image_url: url } : { ...g };
  });
}
