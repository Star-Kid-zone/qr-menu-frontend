"use client";

import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the pointer's furthest extent from center. */
  strength?: number;
}

/** A genuine 3D tilt — the element rotates around its own X/Y axis toward the
 * pointer, with CSS perspective on the parent giving real depth (not just a
 * 2D scale/shadow trick). Resets with a spring on pointer leave. All hooks
 * are called unconditionally (the reduced-motion bailout only affects what's
 * rendered, never how many hooks run) to stay rules-of-hooks safe. */
export function TiltCard({ children, className, strength = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { damping: 18, stiffness: 220 });
  const springRotateY = useSpring(rotateY, { damping: 18, stiffness: 220 });
  const glareX = useTransform(springRotateY, [-strength, strength], ["0%", "100%"]);
  const glareY = useTransform(springRotateX, [-strength, strength], ["100%", "0%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.5), transparent 60%)`;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * strength * 2);
    rotateX.set(-py * strength * 2);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const wrapperStyle: CSSProperties = { perspective: 1000 };

  return (
    <div style={wrapperStyle} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 mix-blend-overlay"
          style={{ background: glareBackground }}
        />
      </motion.div>
    </div>
  );
}
