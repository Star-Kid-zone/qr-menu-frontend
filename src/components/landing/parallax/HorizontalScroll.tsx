"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  /** Combined width of all children, in vw (e.g. 10 panels × 60vw wide = 600).
   * Deliberately explicit rather than measured at runtime — that keeps the
   * scroll-runway height deterministic on the server, with no post-hydration
   * layout jump while a ResizeObserver catches up. Must match what the
   * children actually render at. */
  contentWidthVw: number;
  /** How much extra vertical scroll runway to spend per vw of horizontal
   * travel — higher feels slower/more deliberate, lower feels snappier. */
  runwayMultiplier?: number;
}

/** Pins the section for the scroll distance it needs, translating its wide
 * content horizontally instead of vertically — the "scroll down to move
 * sideways" pattern used for feature/portfolio strips on agency sites. */
export function HorizontalScroll({ children, className, contentWidthVw, runwayMultiplier = 1.15 }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const travelVw = Math.max(0, contentWidthVw - 100);
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${travelVw}vw`]);

  if (shouldReduceMotion) {
    return (
      <div className="overflow-x-auto">
        <div className={cn("flex w-max", className)}>{children}</div>
      </div>
    );
  }

  const runwayVh = 100 + travelVw * runwayMultiplier;

  return (
    <div ref={ref} style={{ height: `${runwayVh}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className={cn("flex", className)}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
