"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/** A signature touch of agency-style sites (Dogstudio, Locomotive, etc.) — a
 * circular cursor that trails the pointer and swells over interactive
 * elements. Desktop/mouse only: gated behind a real-pointer media query so it
 * never shows (or steals the tap target) on touch devices. */
export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 28, stiffness: 320, mass: 0.4 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 320, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Deferred a frame so this setState runs from an async callback rather than
    // synchronously in the effect body (window.matchMedia is safe here either
    // way — effects only run client-side — this is purely to satisfy the
    // set-state-in-effect lint rule the same way the rest of this codebase does).
    const raf = requestAnimationFrame(() => setEnabled(window.matchMedia("(pointer: fine)").matches));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!enabled || shouldReduceMotion) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      setVisible(true);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor-hover]"));
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled, shouldReduceMotion, cursorX, cursorY]);

  if (!enabled || shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-white"
        animate={{ width: hovering ? 72 : 40, height: hovering ? 72 : 40 }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
      />
    </motion.div>
  );
}
