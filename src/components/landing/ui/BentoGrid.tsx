"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LuPalette,
  LuQrCode,
  LuStar,
  LuCreditCard,
  LuSparkles,
  LuArrowUpRight,
  LuCheck,
  LuShare2,
  LuTrendingUp,
  LuClock,
  LuSmartphone,
  LuLayers,
} from "react-icons/lu";
import { Tilt3DCard } from "./Tilt3DCard";

const THEME_PREVIEWS = [
  {
    id: "swiss",
    name: "Swiss Minimal",
    tagline: "Stark grid, typography-first clarity",
    bg: "bg-white text-zinc-950",
    accent: "bg-zinc-950 text-white",
  },
  {
    id: "magazine",
    name: "Editorial Luxe",
    tagline: "High-contrast editorial photography",
    bg: "bg-amber-950/20 text-amber-100 border border-amber-500/20",
    accent: "bg-amber-500 text-zinc-950",
  },
  {
    id: "midnight",
    name: "Midnight Bistro",
    tagline: "Sleek obsidian with emerald neon",
    bg: "bg-zinc-900 text-emerald-300 border border-emerald-500/30",
    accent: "bg-emerald-500 text-zinc-950",
  },
];

export function BentoGrid() {
  const [activeTheme, setActiveTheme] = useState(THEME_PREVIEWS[0]);
  const [selectedEyeShape, setSelectedEyeShape] = useState<"rounded" | "square" | "dots">("rounded");
  const [copiedReview, setCopiedReview] = useState(false);

  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-4 backdrop-blur-md">
          <LuSparkles className="h-3.5 w-3.5" />
          <span>Full Restaurant Operating System</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif">
          Crafted for restaurants that refuse to settle.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          From the first scan on the table to the final payment and 5-star Google review, every feature is engineered to boost revenue, speed up turns, and wow diners.
        </p>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* BENTO ITEM 1: MULTI-THEME RESTAURANT WEBSITES (Span 2 cols on lg) */}
        <div className="md:col-span-2 lg:col-span-2">
          <Tilt3DCard className="h-full">
            <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 shadow-xl">
              {/* Subtle top glow */}
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <LuPalette className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-zinc-800/80 px-3 py-1 text-xs font-medium text-zinc-400 border border-white/5">
                    10+ Engine Themes
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Instant Public Site & Custom Themes
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Turn your menu into an SEO-ready branded portal on your own subdomain or custom domain. Switch layouts in 1 click without touching a single line of code.
                </p>
              </div>

              {/* Interactive Theme Selector Preview */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  {THEME_PREVIEWS.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setActiveTheme(th)}
                      className={`flex-1 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all ${
                        activeTheme.id === th.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {th.name}
                    </button>
                  ))}
                </div>

                {/* Theme Mockup Card */}
                <motion.div
                  key={activeTheme.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl p-4 transition-all ${activeTheme.bg}`}
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-2 opacity-80 border-current">
                    <span className="font-bold text-xs uppercase tracking-wider">Le Botaniste</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${activeTheme.accent}`}>
                      Reserve
                    </span>
                  </div>
                  <p className="text-xs font-serif italic mb-2 font-medium">“Farm-to-table tasting notes”</p>
                  <div className="space-y-1 text-[11px] opacity-90">
                    <div className="flex justify-between">
                      <span>Wood-Grilled Artichoke</span>
                      <span className="font-mono">$18</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wild Morel Pappardelle</span>
                      <span className="font-mono">$32</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* BENTO ITEM 2: DYNAMIC SMART QR CODE STUDIO */}
        <div className="md:col-span-1 lg:col-span-2">
          <Tilt3DCard className="h-full">
            <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 shadow-xl">
              <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <LuQrCode className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-400">
                    Print Ready
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Smart Table QR & Standee Studio
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Generate high-DPI vector QR codes with your restaurant logo, custom eye patterns, and table number mapping. Export printable table tents in seconds.
                </p>
              </div>

              {/* Interactive QR Pattern Preview */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-xl bg-white p-2 shadow-md">
                  <svg viewBox="0 0 80 80" className="h-full w-full fill-zinc-950">
                    {selectedEyeShape === "rounded" ? (
                      <>
                        <rect x="4" y="4" width="22" height="22" rx="6" />
                        <rect x="7" y="7" width="16" height="16" rx="4" fill="white" />
                        <rect x="10" y="10" width="10" height="10" rx="3" />
                        <rect x="54" y="4" width="22" height="22" rx="6" />
                        <rect x="57" y="7" width="16" height="16" rx="4" fill="white" />
                        <rect x="60" y="10" width="10" height="10" rx="3" />
                        <rect x="4" y="54" width="22" height="22" rx="6" />
                        <rect x="7" y="57" width="16" height="16" rx="4" fill="white" />
                        <rect x="10" y="60" width="10" height="10" rx="3" />
                      </>
                    ) : selectedEyeShape === "square" ? (
                      <>
                        <rect x="4" y="4" width="22" height="22" />
                        <rect x="7" y="7" width="16" height="16" fill="white" />
                        <rect x="10" y="10" width="10" height="10" />
                        <rect x="54" y="4" width="22" height="22" />
                        <rect x="57" y="7" width="16" height="16" fill="white" />
                        <rect x="60" y="10" width="10" height="10" />
                        <rect x="4" y="54" width="22" height="22" />
                        <rect x="7" y="57" width="16" height="16" fill="white" />
                        <rect x="10" y="60" width="10" height="10" />
                      </>
                    ) : (
                      <>
                        <circle cx="15" cy="15" r="11" />
                        <circle cx="15" cy="15" r="8" fill="white" />
                        <circle cx="15" cy="15" r="5" />
                        <circle cx="65" cy="15" r="11" />
                        <circle cx="65" cy="15" r="8" fill="white" />
                        <circle cx="65" cy="15" r="5" />
                        <circle cx="15" cy="65" r="11" />
                        <circle cx="15" cy="65" r="8" fill="white" />
                        <circle cx="15" cy="65" r="5" />
                      </>
                    )}
                    {/* Center matrix */}
                    <rect x="30" y="6" width="6" height="6" rx="1" />
                    <rect x="42" y="6" width="6" height="6" rx="1" />
                    <rect x="30" y="18" width="6" height="6" rx="1" />
                    <rect x="42" y="20" width="6" height="6" rx="1" />
                    <rect x="30" y="32" width="8" height="8" rx="1" />
                    <rect x="42" y="32" width="6" height="6" rx="1" />
                    <rect x="56" y="32" width="6" height="6" rx="1" />
                    <rect x="68" y="32" width="6" height="6" rx="1" />
                    <rect x="30" y="44" width="6" height="6" rx="1" />
                    <rect x="42" y="44" width="10" height="6" rx="1" />
                    <rect x="56" y="44" width="6" height="6" rx="1" />
                    <rect x="68" y="44" width="6" height="6" rx="1" />
                    <rect x="30" y="58" width="6" height="6" rx="1" />
                    <rect x="42" y="58" width="6" height="6" rx="1" />
                    <rect x="56" y="58" width="6" height="6" rx="1" />
                    <rect x="68" y="58" width="6" height="6" rx="1" />
                  </svg>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <p className="font-semibold text-zinc-300">Style Eye Marker</p>
                  <div className="flex gap-2">
                    {(["rounded", "square", "dots"] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedEyeShape(style)}
                        className={`capitalize px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                          selectedEyeShape === style
                            ? "bg-purple-600 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-400">PDF, SVG & High-Res PNG Standees</p>
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* BENTO ITEM 3: 5-STAR GOOGLE REVIEW ENGINE */}
        <div className="md:col-span-1 lg:col-span-1">
          <Tilt3DCard className="h-full">
            <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 shadow-xl">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                  <LuStar className="h-6 w-6 fill-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Google Review Booster</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Catch unhappy diners privately before they leave, and route ecstatic guests straight to Google.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <LuStar key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +48 Reviews/mo
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 italic">
                  “The best dining experience we&apos;ve had this year. QR was effortless!”
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-zinc-950">
                    G
                  </span>
                  <span className="text-[10px] text-zinc-400">Verified Google Review</span>
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* BENTO ITEM 4: CONTACTLESS ZERO-WAIT PAYMENTS */}
        <div className="md:col-span-1 lg:col-span-1">
          <Tilt3DCard className="h-full">
            <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 shadow-xl">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  <LuCreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Instant Table Pay</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Eliminate the 15-minute wait for the bill. Guests tap, tip their server, and head out.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Table Turnover</span>
                  <span className="font-bold text-emerald-400">+32% Faster</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full w-[82%] rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] text-zinc-400">Zero card terminal hardware required</p>
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* BENTO ITEM 5: REAL-TIME DINING & SCAN ANALYTICS */}
        <div className="md:col-span-1 lg:col-span-1">
          <Tilt3DCard className="h-full">
            <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 shadow-xl">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
                  <LuTrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Guest Telemetry</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Know which dishes guests search for, which photos trigger orders, and when rush begins.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Top Searched Tag</span>
                  <span className="font-bold text-cyan-400">“Gluten-Free”</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Scan-to-Order</span>
                  <span className="font-bold text-emerald-400">74.2%</span>
                </div>
                <p className="text-[10px] text-zinc-400">Track returning guests automatically</p>
              </div>
            </div>
          </Tilt3DCard>
        </div>

        {/* BENTO ITEM 6: SOCIAL MEDIA & WEEKLY POSTER STUDIO */}
        <div className="md:col-span-1 lg:col-span-1">
          <Tilt3DCard className="h-full">
            <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-rose-500/40 shadow-xl">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
                  <LuShare2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Marketing Studio</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Auto-generate weekly Instagram stories, happy hour specials, and seasonal promotional flyers.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-3.5 space-y-2">
                <div className="rounded-lg bg-rose-950/30 border border-rose-500/30 p-2 text-center">
                  <span className="text-[10px] font-bold uppercase text-rose-300">
                    🔥 Friday Date Night Special
                  </span>
                  <p className="text-[11px] font-serif text-white mt-0.5">2 Courses + Cocktails · $65</p>
                </div>
                <p className="text-[10px] text-center text-zinc-400">1-click download for Instagram</p>
              </div>
            </div>
          </Tilt3DCard>
        </div>
      </div>
    </section>
  );
}
