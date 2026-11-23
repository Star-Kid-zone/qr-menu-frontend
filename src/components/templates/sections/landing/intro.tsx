"use client";

import Image from "@/components/ui/Image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ThemedLottie } from "../art/ThemedLottie";
import { STEAM_ANIMATION } from "../art/lottie/steam";
import type { LandingSectionProps } from "../types";

/** How long the opening screen stays before fading out by itself. */
export const INTRO_DURATION_MS = 2200;

const seenKey = (slug: string) => `qr-intro-seen:${slug}`;

function hasSeen(slug: string): boolean {
  try {
    return window.sessionStorage.getItem(seenKey(slug)) === "1";
  } catch {
    return false; // storage blocked: still show it (it's short and skippable)
  }
}

function markSeen(slug: string) {
  try {
    window.sessionStorage.setItem(seenKey(slug), "1");
  } catch {
    /* storage blocked — nothing to remember */
  }
}

const subscribeNoop = () => () => {};

/**
 * Whether to show the intro, decided once per page load per site. Marking it
 * "seen" (so a reload in the same visit skips it) must not flip the answer
 * for the screen that is already showing.
 */
const decisions = new Map<string, boolean>();
function shouldShowSnapshot(slug: string): boolean {
  if (!decisions.has(slug)) decisions.set(slug, !hasSeen(slug));
  return decisions.get(slug)!;
}

/** Test helper: forget per-page-load decisions. */
export function resetIntroDecisions() {
  decisions.clear();
}

/** Static version of the steam animation (reduced motion, and while the player loads). */
function SteamStill() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 50 c4-4 -4-12 0-16 s4-8 0-12" opacity={0.6} />
        <path d="M60 46 c4-4 -4-12 0-16 s4-8 0-12" />
        <path d="M74 50 c4-4 -4-12 0-16 s4-8 0-12" opacity={0.6} />
        <path d="M30 68 H90 M34 68 C34 84 46 94 60 94 C74 94 86 84 86 68" strokeWidth={4} />
      </g>
    </svg>
  );
}

function IntroContent({ ctx: { c, t }, section }: LandingSectionProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {section.variant !== "simple" ? (
        <div className="h-28 w-28" style={{ color: t.accent }}>
          <ThemedLottie animation={STEAM_ANIMATION as unknown as Record<string, unknown>} color={t.accent} fallback={<SteamStill />} className="h-full w-full" />
        </div>
      ) : null}
      {c.logoUrl ? (
        <div className="relative h-16 w-16">
          <Image src={c.logoUrl} alt="" fill className="rounded-full object-cover" />
        </div>
      ) : null}
      <p style={{ color: t.textPrimary, fontFamily: t.fontFamily }} className={`text-3xl font-bold ${t.headingClass ?? ""}`}>
        {c.businessName}
      </p>
    </div>
  );
}

/**
 * Opening screen: a short welcome (logo, name, a themed animation) shown once
 * per visit, over the page, for ~2 s; guests can skip it. Never server-rendered,
 * so the page underneath is always there for search engines and slow devices.
 * In the admin preview it renders inline so it can't cover the editor.
 * Variants: "steam" (default, animated cup) or "simple" (logo and name only).
 */
export function IntroSection(props: LandingSectionProps) {
  const { ctx } = props;
  const slug = ctx.p.routeSlug ?? ctx.c.businessName;
  const isPreview = Boolean(ctx.p.isPreview);

  // Server and first paint: hidden. In the browser: shown unless already seen this visit.
  const shouldShow = useSyncExternalStore(subscribeNoop, () => !isPreview && shouldShowSnapshot(slug), () => false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    markSeen(slug);
    const timer = window.setTimeout(() => setDismissed(true), INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [shouldShow, slug]);

  if (isPreview) {
    // A slim, clearly-labelled strip: the real opening screen is a full-screen overlay for guests,
    // so drawing it full-size here looked like a duplicate header at the top of the page.
    const animated = props.section.variant !== "simple";
    return (
      <div
        data-intro-preview
        style={{ background: ctx.t.bg, borderColor: ctx.t.border, color: ctx.t.textSecondary }}
        className="flex items-center gap-3 border-b border-dashed px-4 py-2"
      >
        {animated ? (
          <span className="h-7 w-7 shrink-0" style={{ color: ctx.t.accent }}>
            <SteamStill />
          </span>
        ) : null}
        <span className="text-[10px] uppercase leading-snug tracking-widest">
          Opening screen · guests see {animated ? "an animated welcome" : "your logo and name"} for 2 seconds when they arrive
        </span>
      </div>
    );
  }

  if (!shouldShow || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label={`Welcome to ${ctx.c.businessName}`}
      style={{ background: ctx.t.bg }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
    >
      <IntroContent {...props} />
      <button
        type="button"
        onClick={() => setDismissed(true)}
        style={{ color: ctx.t.textSecondary, borderColor: ctx.t.border }}
        className="absolute bottom-8 right-6 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
      >
        Skip
      </button>
    </div>
  );
}
