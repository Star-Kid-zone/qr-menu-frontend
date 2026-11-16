"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import type { DotLottie } from "@lottiefiles/dotlottie-react";
import { parseHex } from "@/utils/contrast";

// The player needs browser APIs (canvas + WASM), so it never renders on the server.
/**
 * The player's WebAssembly engine, served from our own origin. By default the
 * library downloads it from cdn.jsdelivr.net, which the site's CSP (connect-src)
 * blocks — the animation then silently never draws. Versioned file name: keep in
 * step with the installed @lottiefiles/dotlottie-web (a test checks this).
 */
export const DOTLOTTIE_WASM_URL = "/vendor/dotlottie/dotlottie-player-0.82.1.wasm";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((m) => {
      m.setWasmUrl(DOTLOTTIE_WASM_URL);
      return m.DotLottieReact;
    }),
  { ssr: false },
);

/** "#RRGGBB" → the [r, g, b, a] (0–1) a Lottie colour slot takes; null when not a hex colour. */
export function toSlotColor(hex: string): [number, number, number, number] | null {
  const rgb = parseHex(hex);
  return rgb ? [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1] : null;
}

export interface ThemedLottieProps {
  /** Lottie JSON with an `accent` colour slot. */
  animation: Record<string, unknown>;
  /** Theme colour for the `accent` slot (#RRGGBB). */
  color: string;
  /** Shown instead of the animation for guests who ask for reduced motion, and while the player loads. */
  fallback: ReactNode;
  className?: string;
  /**
   * Stop drawing while scrolled off screen (saves battery on long pages).
   * Leave off inside the admin preview iframe, where the player can't see
   * its own visibility correctly and would never start.
   */
  freezeOffscreen?: boolean;
  /** Play once and hold the last frame (e.g. a drawing that completes). Default: loop. */
  loop?: boolean;
}

/**
 * A decorative Lottie animation recoloured to the site's theme via its
 * `accent` slot — one animation file works with every palette. Respects
 * prefers-reduced-motion (renders the static fallback instead).
 */
export function ThemedLottie({ animation, color, fallback, className, freezeOffscreen = false, loop = true }: ThemedLottieProps) {
  const reduced = useReducedMotion();
  const player = useRef<DotLottie | null>(null);
  const loaded = useRef(false);
  // Read through a ref so the one-time "load" listener always applies the latest colour.
  const colorRef = useRef(color);

  // Recolour when the theme colour changes after load (e.g. live preview in the editor).
  useEffect(() => {
    colorRef.current = color;
    const slot = toSlotColor(color);
    if (player.current && loaded.current && slot) player.current.setColorSlot("accent", slot);
  }, [color]);

  if (reduced) return <>{fallback}</>;

  return (
    <div aria-hidden="true" className={className}>
      <DotLottieReact
        data={animation}
        autoplay
        loop={loop}
        // The admin preview renders into an iframe while the player's IntersectionObserver lives in
        // the parent window, so it would wrongly see the canvas as off-screen and never draw.
        // The animation is tiny and only shown briefly, so always rendering costs little.
        renderConfig={{ freezeOnOffscreen: freezeOffscreen, autoResize: true }}
        dotLottieRefCallback={(dl) => {
          player.current = dl;
          if (!dl) return;
          dl.addEventListener("loadError", (e) => {
            console.error("[ThemedLottie] animation failed to load", e);
          });
          dl.addEventListener("load", () => {
            loaded.current = true;
            const slot = toSlotColor(colorRef.current);
            if (slot) dl.setColorSlot("accent", slot);
          });
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
