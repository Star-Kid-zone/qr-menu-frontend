import { Thumbmark } from '@thumbmarkjs/thumbmarkjs';

let cachedDeviceFingerprint: string | null = null;

/**
 * Best-effort device fingerprint. Stable across localStorage/cookie clears in
 * normal browsing, but browsers actively randomize the underlying signals in
 * private/incognito mode (Safari ITP, Firefox, Brave) — treat this as a
 * secondary signal, not a guaranteed identifier. Callers should fall back to
 * the visitor_id (see analytics.service.ts) when this is unavailable.
 */
export async function getDeviceFingerprint() {
  if (cachedDeviceFingerprint) return cachedDeviceFingerprint;

  const tm = new Thumbmark();
  const result = await tm.get();

  cachedDeviceFingerprint = result?.thumbmark || null;

  return cachedDeviceFingerprint;
}
