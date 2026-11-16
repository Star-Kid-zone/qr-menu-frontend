import type { OccasionEntry } from '../types';

/**
 * Reads `site_document.occasion` defensively (stored JSON). The occasion is
 * on while it is present and off when the owner removes it; there are no
 * dates. Anything malformed reads as off.
 */
export function parseOccasion(raw: unknown): OccasionEntry | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || !o.id) return null;
  if (o.intensity !== 'subtle' && o.intensity !== 'full') return null;
  return {
    id: o.id,
    intensity: o.intensity,
    ...(typeof o.banner === 'string' && o.banner.trim() ? { banner: o.banner.trim() } : {}),
  };
}
