/**
 * Shared framer-motion presets.
 *
 * Mirrors the CSS easing/duration tokens in `src/app/globals.css`
 * (--ease-out, --ease-in-out, --duration-fast/base/slow) so JS-driven
 * animation and CSS transitions feel like one system.
 *
 * Usage:
 *   import { springDefault, springMomentum, fadeInUp, EASE_OUT } from '@/lib/motion';
 *   <motion.div {...fadeInUp} />
 *   <motion.div animate={{ y: 0 }} transition={springDefault} />
 */
import type { Transition, Variants } from 'framer-motion';

/** Cubic-bezier equivalents of the CSS tokens, for non-spring transitions. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Critically damped — the default for anything that just appears, moves,
 * or resizes on its own (no gesture preceded it). No overshoot. */
export const springDefault: Transition = {
  type: 'spring',
  duration: 0.4,
  bounce: 0,
};

/** Duration-based fallback for opacity/color-only transitions where a
 * spring is unnecessary overhead. */
export const easeOutTransition: Transition = {
  duration: 0.2,
  ease: EASE_OUT,
};

/** Standard fade + rise, for cards, list items, panel content. Pair with
 * `viewport={{ once: true }}` for on-scroll reveals. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springDefault },
};

/** Standard fade, for overlays/scrims and anything that shouldn't move. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easeOutTransition },
};

/** Stagger helper for list/grid children — keep the per-item delay short
 * (30-80ms) so the cascade reads as fast, not slow. */
export const staggerContainer = (staggerChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren },
  },
});
