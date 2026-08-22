/**
 * Plain external store (no React Context) tracking how many API requests are
 * currently in flight, app-wide. It lives outside React because the thing
 * driving it — axios interceptors in api.service.ts — isn't a component and
 * has no provider tree to read from. Components subscribe via the
 * useGlobalLoading hook (useSyncExternalStore), which is exactly what that
 * API is for: syncing React to state that lives outside it.
 */

type Listener = () => void;

let pendingCount = 0;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

/** Call when an API request is sent. */
export function startGlobalLoading() {
  pendingCount += 1;
  emitChange();
}

/** Call when an API request settles (success or error). */
export function endGlobalLoading() {
  pendingCount = Math.max(0, pendingCount - 1);
  emitChange();
}

export function subscribeGlobalLoading(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGlobalLoadingSnapshot() {
  return pendingCount > 0;
}

export function getGlobalLoadingServerSnapshot() {
  return false;
}
