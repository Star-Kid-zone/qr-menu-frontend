"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteLook } from "./types";

/**
 * What CSS variables can't carry: icon style, ornament set, business type
 * (words, icon vocabulary, item fields), the active occasion and the motion
 * level. Provided once at the page root; read by sections, icons and motion.
 */
const SiteLookContext = createContext<SiteLook | null>(null);

export function SiteLookProvider({ look, children }: { look: SiteLook; children: ReactNode }) {
  return <SiteLookContext.Provider value={look}>{children}</SiteLookContext.Provider>;
}

/** The resolved look; throws outside a provider so a missing provider is caught in development. */
export function useSiteLook(): SiteLook {
  const look = useContext(SiteLookContext);
  if (!look) throw new Error("useSiteLook must be used inside <SiteLookProvider>.");
  return look;
}

/** Same as useSiteLook, but null outside a provider (for parts shared with pages not yet on the system). */
export function useOptionalSiteLook(): SiteLook | null {
  return useContext(SiteLookContext);
}
