"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";

interface StackCardProps {
  children: ReactNode;
  index: number;
  total: number;
  className?: string;
}

/** Sticky-stacking cards — each card pins via `position: sticky` at the same
 * `top` offset, so as you scroll, each new card slides up and settles over
 * the previous one, which (via scroll-linked scale/opacity) recedes slightly
 * to sell the "cards stacking on a table" illusion. The extra height on the
 * outer wrapper (beyond the card's own height) is what gives each card room
 * to actually dwell in its stuck position before the next one arrives —
 * without it, `position: sticky` has nothing to scroll through. */
export function StackCard({ children, index, total, className }: StackCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, isLast ? 1 : 0.55]);

  return (
    <div ref={ref} className="relative" style={{ minHeight: "150vh" }}>
      <motion.div
        style={shouldReduceMotion ? { top: 96 } : { top: 96, scale, opacity }}
        className={cn("sticky flex h-[80vh] max-h-[720px] min-h-[480px] items-center", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
