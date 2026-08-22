"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PiArrowDownRightBold } from "react-icons/pi";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Cinematic "settle" — the backdrop starts slightly oversized and zoomed in,
  // then eases out and down as the hero scrolls past. This plus the huge type
  // is the single most recognizable agency-site hero pattern.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.4]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-[#0d0906] text-white">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={shouldReduceMotion ? undefined : { scale: imageScale, y: imageY }}
      >
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0906] via-[#0d0906]/60 to-[#0d0906]/20" />
      <div className="pointer-events-none absolute inset-0 bg-grain mix-blend-overlay opacity-40" />

      <motion.div
        style={shouldReduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex w-full flex-col gap-10 px-5 pb-16 xs:px-8 sm:px-12 sm:pb-24"
      >
        <div className="flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          <span className="h-px w-8 bg-white/40" />
          Restaurant tech, reimagined
        </div>

        <h1 className="max-w-6xl font-display text-[13vw] font-bold uppercase leading-[0.86] tracking-tighter xs:text-[11vw] sm:text-[8.5vw]">
          Menus that
          <br />
          make guests
          <br />
          <span className="text-primary">stay longer.</span>
        </h1>

        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            QRMenu turns one scan into a digital menu, a marketing studio, and a
            guest-loyalty engine — built for restaurants who want more from every table.
          </p>
          <a
            href="#waitlist"
            data-cursor-hover
            className={buttonVariants({ size: "lg", className: "group gap-3 bg-white text-[#0d0906] hover:bg-white/90" })}
          >
            Join the waitlist
            <PiArrowDownRightBold size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
