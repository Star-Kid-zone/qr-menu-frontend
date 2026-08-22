"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { PiChartLineUpBold, PiPaletteBold, PiQrCodeBold, PiStarFourBold } from "react-icons/pi";
import { springDefault } from "@/lib/motion";

const PANEL_COPY: Record<string, { eyebrow: string; heading: string; body: string }> = {
  "/login": {
    eyebrow: "Welcome back",
    heading: "Your menu, your dashboard, right where you left it.",
    body: "Sign in to update dishes, check today's traffic, or ship a new promo before the lunch rush.",
  },
  "/register": {
    eyebrow: "Get started",
    heading: "A digital menu your guests will actually enjoy.",
    body: "Set up your first menu, pick a theme, and get a QR code ready to print — all in one sitting.",
  },
  "/forgot-password": {
    eyebrow: "Account recovery",
    heading: "Back in, in a couple of minutes.",
    body: "We'll send a verification code to get you back into your dashboard securely.",
  },
};

const HIGHLIGHTS = [
  { icon: PiPaletteBold, label: "113 visual themes" },
  { icon: PiQrCodeBold, label: "Custom QR styling" },
  { icon: PiChartLineUpBold, label: "Built-in analytics" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const copy = PANEL_COPY[pathname ?? ""] ?? PANEL_COPY["/login"];

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springDefault}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          {children}
        </motion.div>
      </div>

      <div className="relative hidden w-0 flex-1 overflow-hidden lg:block">
        {/* Photo backdrop with a slow, continuous "Ken Burns" drift — the
            equivalent of scroll parallax on a page that doesn't scroll. */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={prefersReducedMotion ? undefined : { scale: 1.18 }}
          transition={prefersReducedMotion ? undefined : { duration: 24, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1600&auto=format&fit=crop"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(160deg,hsl(var(--primary)/0.92),hsl(var(--primary)/0.75)_45%,hsl(222_47%_10%/0.9))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-foreground)/0.1),transparent_45%)]" />

        {/* Idle-floating decorative blobs, matching the marketing/admin brand language. */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-10 h-72 w-72 animate-blob-slow rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-10 bottom-0 h-80 w-80 animate-blob rounded-full bg-black/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springDefault, delay: 0.1 }}
            className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15">
              <PiQrCodeBold size={16} />
            </span>
            QRMenu
          </motion.div>

          <motion.div
            key={pathname}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springDefault}
            className="max-w-md"
          >
            <p className="flex items-center gap-2 text-caption font-bold uppercase tracking-[0.24em] text-primary-foreground/70">
              <PiStarFourBold size={14} />
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-primary-foreground">{copy.heading}</h2>
            <p className="mt-4 text-base leading-7 text-primary-foreground/80">{copy.body}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {HIGHLIGHTS.map((h) => (
                <span
                  key={h.label}
                  className="flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-caption font-semibold text-primary-foreground backdrop-blur-sm"
                >
                  <h.icon size={13} />
                  {h.label}
                </span>
              ))}
            </div>
          </motion.div>

          <p className="text-caption text-primary-foreground/50">&copy; {new Date().getFullYear()} QRMenu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
