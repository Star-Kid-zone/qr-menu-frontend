import type { ReactNode } from "react";
import {
  PiCalendarBlank,
  PiCheckCircleFill,
  PiFacebookLogo,
  PiInstagramLogo,
  PiLinkedinLogo,
  PiLockSimple,
  PiMapPinBold,
  PiStarFill,
  PiXLogo,
} from "react-icons/pi";
import Image from "@/components/ui/Image";
import { QrPattern } from "@/features/marketing";
import { TENANT_ROOT_DOMAIN } from "@/config/app.constants";
import { AUTH_SAMPLE_RESTAURANT as SAMPLE } from "@/constants/auth.constants";
import { cn } from "@/utils/cn";

/*
 * The cards floating in the sign-in scene. Each one is a real part of the
 * product (guest website, scheduled social post, Google review with reply,
 * printed QR table card). Decorative: the whole scene is aria-hidden.
 * Colours come from the marketing tokens (.mkt) so the scene matches the
 * landing page.
 */

/** The restaurant's own website, at <address>.feastowl.com. */
/** `tagline` is left out when the card shows the owner's own (typed) name. */
export function WebsiteCard({ name, address, tagline, className }: { name: string; address: ReactNode; tagline?: string; className?: string }) {
  return (
    <div className={cn("w-[19rem] overflow-hidden rounded-xl bg-white text-[color:var(--m-ink)]", "shadow-[0_30px_60px_-28px_rgb(20_8_30/0.7)]", className)}>
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: "var(--m-line)" }}>
        <span className="flex gap-1" aria-hidden>
          <span className="size-2 rounded-full bg-[#f0a8a0]" />
          <span className="size-2 rounded-full bg-[#f5d38a]" />
          <span className="size-2 rounded-full bg-[#9fd5b0]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1 rounded-full bg-[color:var(--m-chalk)] px-2.5 py-1 text-[0.625rem] text-[color:var(--m-mute)]">
          <PiLockSimple className="size-2.5 shrink-0" aria-hidden />
          <span className="truncate">{address}</span>
        </span>
      </div>
      <div className="relative h-24">
        <Image src={SAMPLE.heroImage} alt="" fill sizes="19rem" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <p className="absolute bottom-2 left-3 right-3 truncate font-serif text-lg font-semibold text-white">{name}</p>
      </div>
      <div className="space-y-2 p-3 text-[0.6875rem]">
        <p className="text-[color:var(--m-mute)]">
          {tagline ? `${tagline} · ` : null}<span className="font-semibold text-[color:var(--m-leaf)]">Open now</span>, until 11 pm
        </p>
        <div className="flex gap-1.5">
          <span className="rounded-full px-3 py-1 font-semibold text-white" style={{ background: "var(--m-brand)" }}>View menu</span>
          <span className="flex items-center gap-1 rounded-full border px-3 py-1 font-semibold" style={{ borderColor: "var(--m-line)" }}>
            <PiMapPinBold className="size-3" aria-hidden />
            Directions
          </span>
        </div>
      </div>
    </div>
  );
}

/** One post, scheduled to four networks at once. */
export function SocialCard({ className }: { className?: string }) {
  return (
    <div className={cn("w-[14rem] overflow-hidden rounded-xl bg-white text-[color:var(--m-ink)]", "shadow-[0_30px_60px_-28px_rgb(20_8_30/0.7)]", className)}>
      <div className="flex items-center justify-between px-3 py-2 text-[0.625rem] font-semibold">
        <span className="flex items-center gap-1 text-[color:var(--m-brand)]">
          <PiCalendarBlank className="size-3" aria-hidden />
          Scheduled · Sat 11:00 am
        </span>
      </div>
      <div className="relative h-20">
        <Image src={SAMPLE.dishImage} alt="" fill sizes="14rem" className="object-cover" />
      </div>
      <p className="px-3 pt-2 text-[0.6875rem] leading-snug">{SAMPLE.postCaption}</p>
      <div className="flex items-center gap-2 px-3 pb-3 pt-2 text-[color:var(--m-mute)]">
        <PiInstagramLogo className="size-4" aria-hidden />
        <PiFacebookLogo className="size-4" aria-hidden />
        <PiXLogo className="size-4" aria-hidden />
        <PiLinkedinLogo className="size-4" aria-hidden />
        <span className="ml-auto text-[0.625rem] font-semibold">4 networks</span>
      </div>
    </div>
  );
}

/** A new Google review with the reply already sent. */
export function ReviewCard({ className }: { className?: string }) {
  return (
    <div className={cn("w-[15rem] rounded-xl bg-white p-3 text-[color:var(--m-ink)]", "shadow-[0_30px_60px_-28px_rgb(20_8_30/0.7)]", className)}>
      <div className="flex items-center justify-between">
        <span className="flex gap-0.5" style={{ color: "var(--m-saffron)" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <PiStarFill key={i} className="size-3.5" aria-hidden />
          ))}
        </span>
        <span className="text-[0.625rem] font-semibold text-[color:var(--m-mute)]">Google review</span>
      </div>
      <p className="mt-2 text-[0.6875rem] leading-snug">“{SAMPLE.review}”</p>
      <div className="mt-2 flex items-center justify-between text-[0.625rem]">
        <span className="font-semibold">{SAMPLE.reviewer}</span>
        <span className="flex items-center gap-1 rounded-full bg-[#e3f3ea] px-2 py-0.5 font-semibold text-[#1f6b45]">
          <PiCheckCircleFill className="size-3" aria-hidden />
          Reply sent
        </span>
      </div>
    </div>
  );
}

/** The printed card on the table. */
export function TableCard({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn("mkt-tablecard w-[9.5rem] p-4 text-center", className)}>
      <p className="truncate text-[0.625rem] font-semibold tracking-tight">{name}</p>
      <QrPattern className="mx-auto my-2.5 w-full" ink="var(--m-ink)" />
      <p className="mkt-h3 text-sm">Scan for our menu</p>
      <p className="mt-0.5 text-[0.5625rem]" style={{ color: "var(--m-mute)" }}>Table 7</p>
    </div>
  );
}

/** Small white pill with an icon, like the marketing hero's live chips. */
export function StatChip({ icon, tone, children }: { icon: ReactNode; tone: "saffron" | "leaf" | "mute"; children: ReactNode }) {
  const toneStyle =
    tone === "saffron" ? { background: "#fdf0d2", color: "#7a5100" } : tone === "leaf" ? { background: "#e3f3ea", color: "#1f6b45" } : { background: "#ece9f1", color: "var(--m-mute)" };
  return (
    <div className="mkt-chip">
      <span className="flex size-5 items-center justify-center rounded-full" style={toneStyle}>
        {icon}
      </span>
      {children}
    </div>
  );
}

/** "annapoorna.feastowl.com", or a live preview with a muted placeholder for the random part. */
export function SiteAddress({ base, suffix }: { base: string; suffix?: string }) {
  return (
    <>
      {base}
      {suffix ? <span className="opacity-60">-{suffix}</span> : null}.{TENANT_ROOT_DOMAIN}
    </>
  );
}
