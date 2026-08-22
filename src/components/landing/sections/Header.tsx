"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { routes } from "@/config/routes";

const NAV_LINKS = [
  { href: "#index", label: "Index" },
  { href: "#work", label: "Work" },
  { href: "#waitlist", label: "Waitlist" },
];

export function Header() {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 140], ["hsla(20, 22%, 9%, 0)", "hsla(20, 22%, 9%, 0.85)"]);
  const borderColor = useTransform(scrollY, [0, 140], ["hsla(20, 18%, 20%, 0)", "hsla(20, 18%, 20%, 1)"]);

  return (
    <motion.header
      style={{ backgroundColor: background, borderBottomColor: borderColor }}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b px-5 py-6 text-foreground backdrop-blur-md xs:px-8 sm:px-12"
    >
      <Link href="/" data-cursor-hover className="font-display text-sm font-bold uppercase tracking-[0.2em]">
        QRMenu<span className="text-primary">.</span>
      </Link>

      <nav className="hidden items-center gap-10 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:flex">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} data-cursor-hover className="transition-colors hover:text-foreground">
            {link.label}
          </a>
        ))}
      </nav>

      <Link
        href={routes.public.login}
        data-cursor-hover
        className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
      >
        Admin login →
      </Link>
    </motion.header>
  );
}
