"use client";

import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { routes } from "@/config/routes";
import { cn } from "@/utils/cn";
import { FeastOwlLogo } from "@/components/brand";

const NAV = [
  { href: "#guests", label: "For guests" },
  { href: "#dashboard", label: "For your team" },
  { href: "#looks", label: "Looks" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "Questions" },
];

/** Transparent over the plum hero, switches to a chalk bar once the hero scrolls away. */
export function SiteHeader({ brand }: { brand: string }) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 48));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-300",
        solid ? "bg-[color:var(--m-chalk)]/90 text-[color:var(--m-ink)] shadow-[0_1px_0_var(--m-line)] backdrop-blur-md" : "text-[color:var(--m-on-plum)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={`${brand} home`} className="flex items-center">
          <FeastOwlLogo tone={solid ? "light" : "dark"} className="text-[1.375rem]" markClassName="size-9" />
        </Link>
        <nav aria-label="Page sections" className="hidden items-center gap-7 text-sm font-medium md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="mkt-link">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={routes.public.login} className={cn("mkt-btn mkt-btn-sm", solid ? "mkt-btn-ghost" : "mkt-btn-ghost-dark")}>
            Sign in
          </Link>
          <Link href={routes.public.register} className={cn("mkt-btn mkt-btn-sm hidden sm:inline-flex", solid ? "mkt-btn-brand" : "mkt-btn-saffron")}>
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}
