"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True when the visitor asked for reduced motion. A few lines of matchMedia instead of
 * framer-motion's `useReducedMotion`, so guest pages that only need this don't load framer-motion.
 * Always false on the server and during hydration.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
