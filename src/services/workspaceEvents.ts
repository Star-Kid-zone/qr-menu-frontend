/**
 * Tiny change signal for the workspace record: services announce a change, the cached
 * `useWorkspace()` data (hooks/useWorkspace.ts) drops its copy and refetches. Kept separate from
 * workspace.service.ts so the hook and the service don't import each other.
 */
import type { ChangeListener as Listener } from "@/types/shared/common.types";

const listeners = new Set<Listener>();
const sessionListeners = new Set<Listener>();

export function onWorkspaceChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function workspaceChanged(): void {
  listeners.forEach((listener) => listener());
}

/**
 * The signed-in identity changed without a page reload (support-mode impersonation start/exit,
 * logout): every per-session cache (workspace, sidebar identity) must drop its copy so the next
 * tenant never sees the previous one's data.
 */
export function onSessionChanged(listener: Listener): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function sessionChanged(): void {
  sessionListeners.forEach((listener) => listener());
  workspaceChanged();
}
