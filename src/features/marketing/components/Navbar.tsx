"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { LuArrowRight, LuMenu, LuX, LuSparkles } from "react-icons/lu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
            <span className="font-mono font-black text-base">QR</span>
          </div>
          <span className="font-serif text-2xl font-black tracking-tight text-white">
            qrmenu<span className="text-indigo-400">.</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ml-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live v2.4
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#simulator" className="hover:text-white transition-colors">
            Live Simulator
          </a>
          <a href="#calculator" className="hover:text-white transition-colors">
            ROI Calculator
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA Links */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href={routes.public.login}
            className="px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href={routes.public.register}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Free</span>
            <LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <LuX className="h-5 w-5" /> : <LuMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-zinc-300">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#simulator"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-white transition"
            >
              Live Simulator
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-white transition"
            >
              ROI Calculator
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-white transition"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              href={routes.public.login}
              className="w-full text-center py-2.5 text-xs font-bold text-zinc-300 rounded-xl bg-zinc-900"
            >
              Sign in
            </Link>
            <Link
              href={routes.public.register}
              className="w-full text-center py-2.5 text-xs font-bold text-white rounded-xl bg-indigo-600 shadow-md"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
