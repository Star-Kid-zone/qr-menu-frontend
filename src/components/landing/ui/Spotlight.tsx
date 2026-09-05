"use client";

import React, { useEffect, useRef } from "react";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({
  className = "",
  fill = "rgba(99, 102, 241, 0.15)",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ${className}`}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "30%",
        } as React.CSSProperties
      }
    >
      {/* Dynamic Cursor Light */}
      <div
        className="absolute -inset-px opacity-70 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x) var(--mouse-y), ${fill}, transparent 80%)`,
        }}
      />
      {/* Ambient static lighting orbs */}
      <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />
      <div className="absolute top-1/3 -right-20 h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[140px]" />
      <div className="absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-[120px]" />
    </div>
  );
}
