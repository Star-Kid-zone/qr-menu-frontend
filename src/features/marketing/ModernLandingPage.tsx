"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuArrowRight,
  LuSparkles,
  LuCheck,
  LuShieldCheck,
  LuZap,
  LuUtensils,
  LuExternalLink,
  LuChevronRight,
  LuPhone,
  LuGlobe,
  LuHeartHandshake,
} from "react-icons/lu";
import { routes } from "@/config/routes";
import { Navbar } from "./components/Navbar";
import { Spotlight } from "./components/Spotlight";
import { Interactive3DDevice } from "./components/Interactive3DDevice";
import { BentoGrid } from "./components/BentoGrid";
import { RoiCalculator } from "./components/RoiCalculator";
import { TestimonialMarquee } from "./components/TestimonialMarquee";
import { FaqSection } from "./components/FaqSection";

export function ModernLandingPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 selection:text-white overflow-x-hidden font-sans">
      {/* Dynamic Cursor Spotlight & Ambient Backing */}
      <Spotlight fill="rgba(99, 102, 241, 0.18)" />

      {/* Sticky Top Navbar */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 sm:pt-40 pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Pitch & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left z-10">
            {/* Pill Announcement */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-xl shadow-inner shadow-indigo-500/20"
            >
              <LuSparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Next-Gen QR Operating System</span>
              <span className="hidden sm:inline-block text-indigo-400">•</span>
              <span className="hidden sm:inline-block text-zinc-300">Live 3D Interactive Menu</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif leading-[1.05]"
            >
              The table is <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-300 bg-clip-text text-transparent">
                just the beginning.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Replace outdated paper menus and sluggish card terminals with one unified guest experience: dynamic digital menus, instant contactless table payments, and verified 5-star Google reviews.
            </motion.p>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href={routes.public.register}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Register Your Restaurant</span>
                <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#simulator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-7 py-4 text-sm font-semibold text-zinc-300 backdrop-blur-xl transition-all hover:bg-zinc-800 hover:text-white hover:border-white/20"
              >
                <span>Try Interactive Demo</span>
                <LuChevronRight className="h-4 w-4 text-zinc-500" />
              </a>
            </motion.div>

            {/* Micro Feature Bullets */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-zinc-400"
            >
              <span className="flex items-center gap-1.5">
                <LuCheck className="h-4 w-4 text-emerald-400" /> Zero app downloads
              </span>
              <span className="flex items-center gap-1.5">
                <LuZap className="h-4 w-4 text-amber-400" /> 1-Click live dish 86&apos;ing
              </span>
              <span className="flex items-center gap-1.5">
                <LuShieldCheck className="h-4 w-4 text-cyan-400" /> Direct bank payout
              </span>
            </motion.div>
          </div>

          {/* Right Column: 3D Live Interactive Phone Simulator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center z-20"
          >
            <Interactive3DDevice />
          </motion.div>
        </div>
      </section>

      {/* ================= STATS & TRUST STRIP ================= */}
      <section className="relative border-y border-white/10 bg-zinc-900/40 py-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1,850+</p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
              Dining Venues Live
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">+32%</p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
              Faster Table Turns
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">100%</p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
              Hardware-Free Setup
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">4.9 ★</p>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
              Google Review Rating
            </p>
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID FEATURES ================= */}
      <BentoGrid />

      {/* ================= INTERACTIVE SIMULATOR DEEP DIVE ================= */}
      <section id="simulator" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[3rem] border border-white/10 bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-zinc-950 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
                <LuSparkles className="h-3.5 w-3.5" />
                <span>Zero Installation Required</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
                Designed to run like native software on any device.
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed">
                Whether your guests are on an iPhone, Android, or tablet, the QRMenu guest engine loads instantly with fluid transitions, instant category search, dietary filters, and direct Apple Pay / Google Pay.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-zinc-900/60 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <LuZap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sub-Second Scan Speed</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Lightweight PWA architecture opens your menu immediately, even in basement wine cellars with weak reception.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-zinc-900/60 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <LuGlobe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Custom Subdomain & SEO Web Portal</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Every restaurant gets an automated public site (`your-bistro.qrmenu.com`) indexed by Google Search and Google Maps.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href={routes.public.register}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                >
                  <span>Claim Your Restaurant Link</span>
                  <LuArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={routes.public.login}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition"
                >
                  Already registered? Sign in →
                </Link>
              </div>
            </div>

            {/* Right Interactive Simulator Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <Interactive3DDevice />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROI CALCULATOR ================= */}
      <div id="calculator">
        <RoiCalculator />
      </div>

      {/* ================= TESTIMONIAL MARQUEE ================= */}
      <TestimonialMarquee />

      {/* ================= FAQ SECTION ================= */}
      <FaqSection />

      {/* ================= GRAND FINALE CTA ================= */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-zinc-950 p-10 sm:p-16 lg:p-20 text-center shadow-2xl backdrop-blur-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-1.5 text-xs font-bold text-indigo-300 uppercase tracking-widest">
              Join 1,850+ Modern Restaurants
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-serif tracking-tight leading-tight">
              Ready to elevate every dining table in your restaurant?
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Start your free 14-day trial today. Set up your menu in under 5 minutes, print your first table standees, and see how easy dining can be.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={routes.public.register}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-9 py-4 text-sm font-bold text-zinc-950 shadow-2xl transition-all duration-200 hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={routes.public.login}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-zinc-900/80 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:border-white/30"
              >
                <span>Sign In to Dashboard</span>
              </Link>
            </div>

            <p className="text-xs text-zinc-400 pt-2 font-medium">
              No credit card required • Instant setup in 5 minutes • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ================= ENTERPRISE FOOTER ================= */}
      <footer className="border-t border-white/10 bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-mono font-bold text-sm">
                QR
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                qrmenu<span className="text-indigo-400">.</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The full-stack digital menu, smart table QR, and contactless payment engine built for modern restaurants.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (v2.4)</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-white uppercase tracking-wider">Product</p>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#features" className="hover:text-white transition">Smart QR Studio</a></li>
              <li><a href="#features" className="hover:text-white transition">Theme Engine (10+ Styles)</a></li>
              <li><a href="#features" className="hover:text-white transition">Zero-Wait Tap-to-Pay</a></li>
              <li><a href="#features" className="hover:text-white transition">Google Review Booster</a></li>
              <li><a href="#features" className="hover:text-white transition">Live Scan Telemetry</a></li>
            </ul>
          </div>

          {/* Col 3: Management */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-white uppercase tracking-wider">Portals</p>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href={routes.public.login} className="hover:text-white transition">Admin Panel</Link></li>
              <li><Link href={routes.public.register} className="hover:text-white transition">Restaurant Registration</Link></li>
              <li><Link href={routes.superadmin.home} className="hover:text-white transition">Superadmin Control</Link></li>
              <li><a href="#calculator" className="hover:text-white transition">ROI Estimator</a></li>
            </ul>
          </div>

          {/* Col 4: Platform Guarantee */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-white uppercase tracking-wider">Guaranteed</p>
            <p className="text-zinc-400 leading-relaxed">
              High-availability multi-tenant cloud with sub-second page loads across North America, Europe, and Asia-Pacific.
            </p>
            <div className="pt-2">
              <Link
                href={routes.public.register}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                <span>Launch your digital menu now</span>
                <LuArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} QRMenu Operating System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/" className="hover:text-zinc-400 transition">Terms of Service</Link>
            <Link href="/" className="hover:text-zinc-400 transition">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
