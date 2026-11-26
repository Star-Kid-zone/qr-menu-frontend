"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Turns the mouse position anywhere on the page into a gentle 3D tilt.
 * Touch is ignored (phones get the flat card strip instead), and when
 * `enabled` is false the scene rests flat.
 */
export function usePointerTilt(maxDegrees: number, enabled: boolean): { rotateX: MotionValue<number>; rotateY: MotionValue<number> } {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 20, mass: 0.7 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-maxDegrees, maxDegrees]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [maxDegrees * 0.7, -maxDegrees * 0.7]), spring);

  useEffect(() => {
    px.set(0);
    py.set(0);
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, px, py]);

  return { rotateX, rotateY };
}
