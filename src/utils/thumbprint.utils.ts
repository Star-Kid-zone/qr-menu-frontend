let cachedDeviceFingerprint: string | null = null;
let pending: Promise<string | null> | null = null;

/** Runs `work` when the browser is idle (or soon after, where requestIdleCallback is missing). */
function whenIdle<T>(work: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = () => work().then(resolve, reject);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 1500);
    }
  });
}

/**
 * Best-effort device fingerprint. Stable across localStorage/cookie clears in
 * normal browsing, but browsers actively randomize the underlying signals in
 * private/incognito mode (Safari ITP, Firefox, Brave) — treat this as a
 * secondary signal, not a guaranteed identifier. Callers should fall back to
 * the visitor_id (see analytics.service.ts) when this is unavailable.
 *
 * The fingerprinting library (canvas/audio/WebGL probes) is loaded on demand and run when the
 * browser is idle, so it never weighs on the guest page's first load or first interaction.
 */
export function getDeviceFingerprint(): Promise<string | null> {
  if (cachedDeviceFingerprint) return Promise.resolve(cachedDeviceFingerprint);
  pending ??= whenIdle(async () => {
    const { Thumbmark } = await import('@thumbmarkjs/thumbmarkjs');
    const result = await new Thumbmark().get();
    cachedDeviceFingerprint = result?.thumbmark || null;
    return cachedDeviceFingerprint;
  }).catch(() => {
    pending = null;
    return null;
  });
  return pending;
}
