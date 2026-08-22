"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const PANELS = [
  {
    index: "( 01 )",
    title: "Plated for the scroll",
    src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    index: "( 02 )",
    title: "Every dish, its own moment",
    src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1600&auto=format&fit=crop",
  },
  {
    index: "( 03 )",
    title: "Built for the whole table",
    src: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=1600&auto=format&fit=crop",
  },
] as const;

function GalleryPanel({ panel }: { panel: (typeof PANELS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Reveal zoom: the image is scaled up while off-screen and eases down to
  // 1x as it crosses the viewport centre — the "cinematic settle" pattern.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className="relative h-[70vh] min-h-[420px] overflow-hidden bg-[#0d0906]">
      <motion.div className="absolute inset-0" style={shouldReduceMotion ? undefined : { scale, y }}>
        <Image src={panel.src} alt={panel.title} fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0906]/90 via-[#0d0906]/10 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 text-white xs:px-8 sm:px-12 sm:pb-14">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{panel.index}</span>
        <h3 className="mt-2 max-w-lg font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {panel.title}
        </h3>
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <section id="work" className="relative space-y-1 bg-[#0d0906]">
      {PANELS.map((panel) => (
        <GalleryPanel key={panel.index} panel={panel} />
      ))}
    </section>
  );
}
