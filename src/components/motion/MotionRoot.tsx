"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes `m.*` components animate. The animation engine (~15 KB) is a separate chunk fetched after
 * the page is interactive; until it arrives, `m` components render their initial/resting styles.
 * Safe to nest and to use anywhere (the engine is fetched once).
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <LazyMotion features={() => import("./domAnimation").then((mod) => mod.default)}>{children}</LazyMotion>;
}
