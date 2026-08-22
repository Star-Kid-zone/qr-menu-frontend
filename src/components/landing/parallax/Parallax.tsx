"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  /** Travel multiplier as the element crosses the viewport. 0 = static. Negative
   * values drift opposite to scroll (recedes into the background); positive
   * values overshoot it (foreground/float feel). -1..1 is a strong, obvious
   * effect; go past that for a dramatic one. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

// Base travel distance a speed of 1 covers as the element crosses the full
// viewport. Needs to be a few hundred px, not a few dozen, or the motion
// reads as jitter instead of parallax.
const BASE_TRAVEL_PX = 480;

/** Idiomatic React replacement for Locomotive Scroll's `data-scroll-speed` —
 * moves its children based on scroll progress through the viewport, no DOM
 * restructuring or scroll-hijacking required. Pairs with SmoothScrollProvider. */
export function Parallax({ children, speed = 0.3, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = BASE_TRAVEL_PX * speed;
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}
