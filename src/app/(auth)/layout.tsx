"use client";

import React from "react";
import Image from "@/components/ui/Image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { springDefault } from "@/lib/motion";
import { AUTH_PANEL_COPY } from "@/constants/auth.constants";

const PANEL_COPY = AUTH_PANEL_COPY;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const copy = PANEL_COPY[pathname ?? ""] ?? PANEL_COPY["/login"];

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springDefault}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          {children}
        </motion.div>
      </div>

      <div className="relative hidden w-0 flex-1 overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1600&auto=format&fit=crop"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <p className="text-body-medium">QRMenu</p>

          <div className="max-w-md">
            <h2 className="text-display text-balance">{copy.heading}</h2>
            <p className="mt-4 text-base leading-7 text-white/85">{copy.body}</p>
          </div>

          <p className="text-caption text-white/60">&copy; {new Date().getFullYear()} QRMenu</p>
        </div>
      </div>
    </div>
  );
}
