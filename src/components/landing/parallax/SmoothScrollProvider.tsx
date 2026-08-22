"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * Drives buttery momentum scrolling for everything under it. Scoped to the
 * marketing landing page only (not the admin app) — Lenis intercepts native
 * scroll, which is unnecessary overhead/risk on data-dense admin screens.
 *
 * Framer Motion's `useScroll` reads the native scroll position, which Lenis
 * smooths in place, so scroll-linked parallax (see `Parallax.tsx`) stays in
 * sync automatically with no extra wiring.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
