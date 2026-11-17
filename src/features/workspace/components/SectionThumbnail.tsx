"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface SectionThumbnailProps {
  type: string;
  variant?: string;
  hidden?: boolean;
  className?: string;
}

/**
 * High-craft visual miniature representation for each landing page section type.
 * Gives owners instant visual recognition of what each section looks like.
 */
export function SectionThumbnail({ type, variant, hidden = false, className }: SectionThumbnailProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex h-11 w-16 shrink-0 select-none items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-muted/40 shadow-2xs transition-all duration-200",
        hidden ? "opacity-45 grayscale" : "group-hover:border-primary/40 group-hover:shadow-xs",
        className
      )}
    >
      <svg
        viewBox="0 0 64 44"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderGraphic(type, variant)}
      </svg>
    </div>
  );
}

function renderGraphic(type: string, variant?: string) {
  switch (type) {
    case "intro":
      if (variant === "simple") {
        return (
          <>
            <rect width="64" height="44" rx="4" fill="#1c1917" />
            <circle cx="32" cy="18" r="9" stroke="#f59e0b" strokeWidth="1.5" fill="#f59e0b" fillOpacity="0.15" />
            <path d="M29 14 v8 M35 14 v8 M29 18 h6" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
            <rect x="20" y="31" width="24" height="3" rx="1.5" fill="#fef3c7" opacity="0.9" />
            <rect x="24" y="36" width="16" height="2" rx="1" fill="#78716c" opacity="0.8" />
          </>
        );
      }
      // Steaming cup (default)
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#1c1917" />
          <circle cx="32" cy="22" r="16" fill="#f59e0b" opacity="0.18" />
          {/* steam */}
          <path d="M27 18 Q 24 13 28 8" stroke="#fef3c7" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
          <path d="M32 17 Q 36 12 33 7" stroke="#fef3c7" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
          <path d="M37 18 Q 39 14 37 9" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* cup & saucer */}
          <path d="M24 22 h16 v5 a7 7 0 0 1 -7 7 h-2 a7 7 0 0 1 -7 -7 z" fill="#f59e0b" />
          <path d="M40 24 h2.5 a2.5 2.5 0 0 1 2.5 2.5 v1 a2.5 2.5 0 0 1 -2.5 2.5 h-2.5" stroke="#f59e0b" strokeWidth="1.4" fill="none" />
          <rect x="21" y="35" width="22" height="2.5" rx="1.25" fill="#fef3c7" opacity="0.75" />
        </>
      );

    case "announcement":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          {/* Top announcement banner */}
          <rect x="0" y="0" width="64" height="13" rx="4" fill="#ea580c" />
          {/* Megaphone icon */}
          <path d="M7 8 l3.5 -2.5 v5 z" fill="#ffffff" />
          <path d="M11 6.5 l3 -1.5 v5 l-3 -1.5" fill="#ffffff" opacity="0.85" />
          {/* Banner text dashes */}
          <rect x="18" y="5.5" width="22" height="2.5" rx="1" fill="#ffffff" />
          <rect x="43" y="5.5" width="14" height="2.5" rx="1" fill="#fed7aa" />
          {/* Page body preview */}
          <rect x="6" y="18" width="32" height="3" rx="1" fill="#cbd5e1" />
          <rect x="6" y="24" width="52" height="14" rx="2" fill="#e2e8f0" />
        </>
      );

    case "hero":
      if (variant === "split") {
        return (
          <>
            <rect width="64" height="44" rx="4" fill="#ffffff" />
            {/* Left text column */}
            <rect x="5" y="8" width="23" height="4" rx="1" fill="#0f172a" />
            <rect x="5" y="15" width="19" height="2.5" rx="1" fill="#64748b" />
            <rect x="5" y="20" width="14" height="2" rx="1" fill="#94a3b8" />
            <rect x="5" y="27" width="16" height="6" rx="3" fill="#ea580c" />
            {/* Right photo column */}
            <rect x="33" y="4" width="27" height="36" rx="3" fill="#fed7aa" stroke="#fb923c" strokeWidth="0.8" />
            <circle cx="46.5" cy="22" r="7.5" fill="#ea580c" opacity="0.4" />
            <circle cx="46.5" cy="22" r="4.5" fill="#ea580c" />
          </>
        );
      }
      if (variant === "banner") {
        return (
          <>
            <rect width="64" height="44" rx="4" fill="#f1f5f9" />
            <rect x="4" y="9" width="56" height="26" rx="3" fill="#1e293b" />
            <circle cx="48" cy="18" r="5" fill="#f59e0b" opacity="0.4" />
            <rect x="14" y="17" width="36" height="4" rx="1" fill="#ffffff" />
            <rect x="22" y="24" width="20" height="2.5" rx="1" fill="#94a3b8" />
          </>
        );
      }
      // Full screen hero (default)
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#0f172a" />
          <path d="M0 22 Q 22 16 42 26 T 64 20 V 44 H 0 Z" fill="#334155" opacity="0.75" />
          <circle cx="50" cy="11" r="7" fill="#f59e0b" opacity="0.35" />
          <rect x="6" y="10" width="36" height="4.5" rx="1" fill="#f8fafc" />
          <rect x="6" y="17" width="24" height="2.5" rx="1" fill="#cbd5e1" opacity="0.85" />
          <rect x="6" y="25" width="17" height="6.5" rx="3" fill="#ea580c" />
          <rect x="26" y="25" width="15" height="6.5" rx="3" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="0.8" />
        </>
      );

    case "marquee":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          <rect x="6" y="6" width="32" height="3" rx="1" fill="#cbd5e1" opacity="0.6" />
          <rect x="6" y="35" width="42" height="3" rx="1" fill="#cbd5e1" opacity="0.6" />
          {/* Ticker strip */}
          <rect x="0" y="14" width="64" height="16" fill="#0284c7" />
          <circle cx="9" cy="22" r="2" fill="#bae6fd" />
          <rect x="14" y="20.5" width="13" height="3" rx="1" fill="#ffffff" />
          <circle cx="31" cy="22" r="2" fill="#bae6fd" />
          <rect x="36" y="20.5" width="15" height="3" rx="1" fill="#ffffff" />
          <path d="M56 20.5 l3 1.5 l-3 1.5" stroke="#bae6fd" strokeWidth="1.3" fill="none" />
        </>
      );

    case "stats":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          {/* 4 stat cards */}
          <rect x="4" y="9" width="12" height="26" rx="2" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="0.6" />
          <text x="10" y="21" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">4.9</text>
          <rect x="6" y="26" width="8" height="2" rx="1" fill="#93c5fd" />

          <rect x="18" y="9" width="12" height="26" rx="2" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="0.6" />
          <text x="24" y="21" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="#15803d">12k</text>
          <rect x="20" y="26" width="8" height="2" rx="1" fill="#86efac" />

          <rect x="32" y="9" width="13" height="26" rx="2" fill="#fefce8" stroke="#fef08a" strokeWidth="0.6" />
          <text x="38.5" y="21" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#a16207">100%</text>
          <rect x="34.5" y="26" width="8" height="2" rx="1" fill="#fde047" />

          <rect x="47" y="9" width="13" height="26" rx="2" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="0.6" />
          <text x="53.5" y="21" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#7e22ce">15+</text>
          <rect x="49.5" y="26" width="8" height="2" rx="1" fill="#d8b4fe" />
        </>
      );

    case "story":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#fffbeb" />
          {/* Framed photo */}
          <rect x="5" y="6" width="23" height="32" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" />
          <circle cx="16.5" cy="18" r="5.5" fill="#b45309" opacity="0.3" />
          <path d="M8 33 q 8.5 -10 17 0" fill="#b45309" opacity="0.5" />
          {/* Story text */}
          <rect x="32" y="9" width="20" height="3.5" rx="1" fill="#92400e" />
          <rect x="32" y="16" width="26" height="2" rx="1" fill="#b45309" opacity="0.6" />
          <rect x="32" y="21" width="24" height="2" rx="1" fill="#b45309" opacity="0.6" />
          <rect x="32" y="26" width="21" height="2" rx="1" fill="#b45309" opacity="0.6" />
          <path d="M32 33 q 7 -2 14 1" stroke="#d97706" strokeWidth="1.2" fill="none" />
        </>
      );

    case "team":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          <rect x="22" y="5" width="20" height="2.5" rx="1" fill="#94a3b8" />
          {/* Avatar 1 */}
          <circle cx="14" cy="18" r="6.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
          <path d="M10 23.5 q 4 -4.5 8 0" fill="#ea580c" />
          <path d="M11 13.5 q 3 -3.5 6 0" fill="#ffffff" stroke="#ea580c" strokeWidth="0.6" />
          <rect x="8" y="28" width="12" height="2" rx="1" fill="#64748b" />
          <rect x="10" y="32" width="8" height="1.5" rx="0.75" fill="#94a3b8" />
          {/* Avatar 2 */}
          <circle cx="32" cy="17" r="7.5" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" />
          <path d="M27.5 23.5 q 4.5 -5.5 9 0" fill="#0284c7" />
          <path d="M28.5 12 q 3.5 -4.5 7 0" fill="#ffffff" stroke="#0284c7" strokeWidth="0.6" />
          <rect x="25" y="28" width="14" height="2" rx="1" fill="#0f172a" />
          <rect x="27" y="32" width="10" height="1.5" rx="0.75" fill="#64748b" />
          {/* Avatar 3 */}
          <circle cx="50" cy="18" r="6.5" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.8" />
          <path d="M46 23.5 q 4 -4.5 8 0" fill="#16a34a" />
          <rect x="44" y="28" width="12" height="2" rx="1" fill="#64748b" />
          <rect x="46" y="32" width="8" height="1.5" rx="0.75" fill="#94a3b8" />
        </>
      );

    case "signature-dishes":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#faf5ff" />
          {/* Dish card 1 */}
          <rect x="5" y="6" width="25" height="32" rx="3" fill="#ffffff" stroke="#d8b4fe" strokeWidth="0.8" />
          <circle cx="17.5" cy="16" r="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="17.5" cy="16" r="4" fill="#ea580c" />
          <rect x="9" y="26" width="17" height="2.5" rx="1" fill="#1e1b4b" />
          <rect x="12" y="30.5" width="11" height="3.5" rx="1.5" fill="#7e22ce" />
          {/* Dish card 2 */}
          <rect x="34" y="6" width="25" height="32" rx="3" fill="#ffffff" stroke="#d8b4fe" strokeWidth="0.8" />
          <circle cx="46.5" cy="16" r="7" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
          <circle cx="46.5" cy="16" r="4" fill="#16a34a" />
          <rect x="38" y="26" width="17" height="2.5" rx="1" fill="#1e1b4b" />
          <rect x="41" y="30.5" width="11" height="3.5" rx="1.5" fill="#7e22ce" />
        </>
      );

    case "popular-items":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          {/* Row 1 */}
          <rect x="4" y="4" width="56" height="10" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="6" y="6" width="6" height="6" rx="1" fill="#f97316" />
          <rect x="15" y="7" width="24" height="2" rx="1" fill="#0f172a" />
          <rect x="15" y="10" width="16" height="1.5" rx="0.75" fill="#94a3b8" />
          <rect x="46" y="7" width="11" height="4" rx="2" fill="#ea580c" />
          {/* Row 2 */}
          <rect x="4" y="17" width="56" height="10" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="6" y="19" width="6" height="6" rx="1" fill="#06b6d4" />
          <rect x="15" y="20" width="20" height="2" rx="1" fill="#0f172a" />
          <rect x="15" y="23" width="14" height="1.5" rx="0.75" fill="#94a3b8" />
          <rect x="46" y="20" width="11" height="4" rx="2" fill="#ea580c" />
          {/* Row 3 */}
          <rect x="4" y="30" width="56" height="10" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="6" y="32" width="6" height="6" rx="1" fill="#84cc16" />
          <rect x="15" y="33" width="22" height="2" rx="1" fill="#0f172a" />
          <rect x="15" y="36" width="12" height="1.5" rx="0.75" fill="#94a3b8" />
          <rect x="46" y="33" width="11" height="4" rx="2" fill="#ea580c" />
        </>
      );

    case "curated-list":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#fefce8" />
          <rect x="6" y="5" width="52" height="34" rx="3" fill="#ffffff" stroke="#facc15" strokeWidth="1" />
          <polygon points="46,5 54,5 54,14 50,11 46,14" fill="#eab308" />
          <rect x="11" y="9" width="22" height="3.5" rx="1" fill="#713f12" />
          <circle cx="14" cy="18" r="2" fill="#eab308" />
          <rect x="18" y="17" width="22" height="2" rx="1" fill="#334155" />
          <rect x="43" y="17" width="9" height="2" rx="1" fill="#ca8a04" />
          <circle cx="14" cy="27" r="2" fill="#eab308" />
          <rect x="18" y="26" width="19" height="2" rx="1" fill="#334155" />
          <rect x="43" y="26" width="9" height="2" rx="1" fill="#ca8a04" />
        </>
      );

    case "offers":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#fff1f2" />
          <rect x="5" y="6" width="54" height="32" rx="3" fill="#ffffff" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3 2" />
          <circle cx="5" cy="22" r="3.5" fill="#fff1f2" />
          <circle cx="59" cy="22" r="3.5" fill="#fff1f2" />
          <rect x="11" y="11" width="20" height="22" rx="3" fill="#e11d48" />
          <text x="21" y="24" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#ffffff">%</text>
          <rect x="35" y="13" width="17" height="3" rx="1" fill="#9f1239" />
          <rect x="35" y="19" width="19" height="2" rx="1" fill="#f43f5e" opacity="0.75" />
          <rect x="35" y="25" width="16" height="5" rx="2" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="0.6" />
        </>
      );

    case "events":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          {/* Calendar sheet */}
          <rect x="5" y="7" width="19" height="30" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
          <rect x="5" y="7" width="19" height="8.5" rx="2" fill="#dc2626" />
          <text x="14.5" y="13" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#ffffff">FRI</text>
          <text x="14.5" y="27" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">24</text>
          {/* Event description */}
          <rect x="28" y="10" width="29" height="3.5" rx="1" fill="#0f172a" />
          <rect x="28" y="16" width="22" height="2" rx="1" fill="#64748b" />
          <path d="M29 27 a3 3 0 1 0 3 3 v-7 h4 v3" stroke="#6366f1" strokeWidth="1.2" fill="none" />
          <rect x="39" y="25" width="18" height="5.5" rx="2.5" fill="#4f46e5" />
        </>
      );

    case "gallery":
      if (variant === "strip") {
        return (
          <>
            <rect width="64" height="44" rx="4" fill="#f1f5f9" />
            <rect x="4" y="8" width="16" height="28" rx="2" fill="#38bdf8" />
            <rect x="24" y="8" width="16" height="28" rx="2" fill="#fb923c" />
            <rect x="44" y="8" width="16" height="28" rx="2" fill="#4ade80" />
          </>
        );
      }
      // Grid (default)
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#0f172a" />
          <rect x="4" y="4" width="26" height="16" rx="2" fill="#f97316" opacity="0.85" />
          <rect x="34" y="4" width="26" height="16" rx="2" fill="#38bdf8" opacity="0.85" />
          <rect x="4" y="24" width="26" height="16" rx="2" fill="#a855f7" opacity="0.85" />
          <rect x="34" y="24" width="26" height="16" rx="2" fill="#22c55e" opacity="0.85" />
          <circle cx="17" cy="12" r="3" fill="#ffffff" opacity="0.75" />
          <circle cx="47" cy="12" r="3" fill="#ffffff" opacity="0.75" />
          <circle cx="17" cy="32" r="3" fill="#ffffff" opacity="0.75" />
          <circle cx="47" cy="32" r="3" fill="#ffffff" opacity="0.75" />
        </>
      );

    case "reviews":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          <rect x="5" y="6" width="54" height="32" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
          <text x="10" y="15" fontSize="7" fill="#eab308">★★★★★</text>
          <text x="10" y="26" fontSize="13" fill="#cbd5e1" fontFamily="serif">“</text>
          <rect x="18" y="19" width="37" height="2" rx="1" fill="#475569" />
          <rect x="18" y="23" width="27" height="2" rx="1" fill="#64748b" />
          <circle cx="14" cy="31" r="3" fill="#3b82f6" />
          <rect x="20" y="30" width="16" height="2" rx="1" fill="#94a3b8" />
        </>
      );

    case "awards":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#1c1917" />
          {/* Laurels */}
          <path d="M21 29 C 15 25 15 15 21 11" stroke="#eab308" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M43 29 C 49 25 49 15 43 11" stroke="#eab308" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <circle cx="17" cy="15" r="1.5" fill="#facc15" />
          <circle cx="16" cy="21" r="1.5" fill="#facc15" />
          <circle cx="47" cy="15" r="1.5" fill="#facc15" />
          <circle cx="48" cy="21" r="1.5" fill="#facc15" />
          {/* Trophy */}
          <path d="M27 13 h10 v6 a5 5 0 0 1 -10 0 z" fill="#facc15" />
          <rect x="31" y="23" width="2" height="4" fill="#eab308" />
          <rect x="28.5" y="27" width="7" height="2" rx="0.5" fill="#ca8a04" />
          {/* Banner */}
          <rect x="19" y="33" width="26" height="3" rx="1" fill="#eab308" />
        </>
      );

    case "visit":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#ecfdf5" />
          {/* Map roads */}
          <path d="M0 16 H 64 M0 30 H 64 M23 0 V 44 M43 0 V 44" stroke="#a7f3d0" strokeWidth="1.2" />
          {/* Pin */}
          <circle cx="33" cy="17" r="7" fill="#ef4444" opacity="0.25" />
          <path d="M33 11 a4 4 0 0 1 4 4 c0 3 -4 8 -4 8 s-4 -5 -4 -8 a4 4 0 0 1 4 -4 z" fill="#ef4444" />
          <circle cx="33" cy="15" r="1.5" fill="#ffffff" />
          {/* Floating hours block */}
          <rect x="5" y="27" width="24" height="12" rx="2" fill="#ffffff" stroke="#6ee7b7" strokeWidth="0.8" />
          <circle cx="10.5" cy="33" r="2.5" fill="#059669" />
          <rect x="15" y="31.5" width="11" height="1.5" rx="0.75" fill="#065f46" />
          <rect x="15" y="34.5" width="8" height="1.5" rx="0.75" fill="#10b981" />
        </>
      );

    case "amenities":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          {/* 4 tiles */}
          <rect x="5" y="5" width="24" height="15" rx="2" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="0.6" />
          <path d="M12 16 a5 5 0 0 1 10 0 M14 17 a2.5 2.5 0 0 1 6 0" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle cx="17" cy="18" r="0.8" fill="#2563eb" />

          <rect x="35" y="5" width="24" height="15" rx="2" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="0.6" />
          <text x="47" y="16.5" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#16a34a">P</text>

          <rect x="5" y="24" width="24" height="15" rx="2" fill="#fff7ed" stroke="#fed7aa" strokeWidth="0.6" />
          <path d="M14 27.5 v8 M13 27.5 h2 v3.5 h-2 z M20 27.5 v8 M19 27.5 v3 q1 1 2 0 v-3" stroke="#ea580c" strokeWidth="0.9" fill="none" />

          <rect x="35" y="24" width="24" height="15" rx="2" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="0.6" />
          <circle cx="47" cy="28" r="1.5" fill="#9333ea" />
          <path d="M47 30 v4 h3 M44.5 33 a3 3 0 1 0 3 3" stroke="#9333ea" strokeWidth="1" fill="none" />
        </>
      );

    case "faq":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          <rect x="5" y="5" width="54" height="18" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
          <circle cx="11" cy="11" r="2.5" fill="#6366f1" />
          <text x="11" y="13" fontSize="4.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">?</text>
          <rect x="16" y="10" width="30" height="2" rx="1" fill="#0f172a" />
          <path d="M52 10 l2 2 l2 -2" stroke="#64748b" strokeWidth="1" fill="none" />
          <rect x="16" y="15.5" width="38" height="2" rx="1" fill="#94a3b8" />
          <rect x="16" y="19" width="24" height="2" rx="1" fill="#cbd5e1" />

          <rect x="5" y="26" width="54" height="13" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
          <circle cx="11" cy="32.5" r="2.5" fill="#cbd5e1" />
          <text x="11" y="34.5" fontSize="4.5" fontWeight="bold" textAnchor="middle" fill="#475569">?</text>
          <rect x="16" y="31.5" width="28" height="2" rx="1" fill="#334155" />
          <path d="M52 31.5 l2 2 l2 -2" stroke="#64748b" strokeWidth="1" fill="none" />
        </>
      );

    case "divider":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#fafaf9" />
          <rect x="16" y="6" width="32" height="2" rx="1" fill="#e7e5e4" />
          <rect x="16" y="36" width="32" height="2" rx="1" fill="#e7e5e4" />
          <line x1="6" y1="22" x2="23" y2="22" stroke="#d97706" strokeWidth="1" strokeDasharray="2 1" />
          <polygon points="32,15 37,22 32,29 27,22" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
          <circle cx="32" cy="22" r="1.5" fill="#ffffff" />
          <circle cx="25" cy="22" r="1" fill="#d97706" />
          <circle cx="39" cy="22" r="1" fill="#d97706" />
          <line x1="41" y1="22" x2="58" y2="22" stroke="#d97706" strokeWidth="1" strokeDasharray="2 1" />
        </>
      );

    case "footer":
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#09090b" />
          <rect x="6" y="7" width="18" height="3" rx="1" fill="#ffffff" />
          <rect x="6" y="14" width="12" height="1.5" rx="0.75" fill="#a1a1aa" />
          <rect x="6" y="18" width="10" height="1.5" rx="0.75" fill="#71717a" />
          <rect x="6" y="22" width="14" height="1.5" rx="0.75" fill="#71717a" />

          <rect x="25" y="14" width="12" height="1.5" rx="0.75" fill="#a1a1aa" />
          <rect x="25" y="18" width="14" height="1.5" rx="0.75" fill="#71717a" />
          <rect x="25" y="22" width="9" height="1.5" rx="0.75" fill="#71717a" />

          <rect x="44" y="14" width="12" height="1.5" rx="0.75" fill="#a1a1aa" />
          <circle cx="46" cy="20" r="2" fill="#52525b" />
          <circle cx="52" cy="20" r="2" fill="#52525b" />
          <circle cx="58" cy="20" r="2" fill="#52525b" />

          <line x1="6" y1="29" x2="58" y2="29" stroke="#27272a" strokeWidth="0.8" />
          <rect x="18" y="34" width="28" height="1.5" rx="0.75" fill="#52525b" />
        </>
      );

    default:
      return (
        <>
          <rect width="64" height="44" rx="4" fill="#f8fafc" />
          <rect x="6" y="8" width="52" height="4" rx="1" fill="#cbd5e1" />
          <rect x="6" y="16" width="34" height="3" rx="1" fill="#e2e8f0" />
          <rect x="6" y="23" width="52" height="14" rx="2" fill="#f1f5f9" />
        </>
      );
  }
}
