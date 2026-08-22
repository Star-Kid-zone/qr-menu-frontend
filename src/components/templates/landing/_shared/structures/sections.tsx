"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import type { RichContent } from "../defaults";
import type { ThemeConfig } from "../BaseTemplate";
import { FadeIn, StaggerGroup, StaggerItem, Marquee } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { HiTicket, HiSparkles, HiX } from "react-icons/hi";
import { LotteryGame, hasPlayedLotteryToday } from "./LotteryGame";

/**
 * Shared, non-negotiable sections every landing "structure" must include
 * somewhere on the page (announcement, banner, decorative
 * marquee, feature-status badges, amenities, popular menu, offers, full
 * contact block, lottery, footer). Each structure still owns its
 * OWN distinctive treatment of hero / story / signature dishes / gallery /
 * testimonials / stats / hours / FAQ — these helpers only guarantee the rest
 * of the content model is never silently dropped.
 */

type Ctx = { c: RichContent; t: ThemeConfig; p: LandingTemplateProps };

export function AnnouncementBar({ c, t }: Pick<Ctx, "c" | "t">) {
  if (!c.announcement) return null;
  return (
    <div style={{ background: t.border, color: t.textPrimary }} className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest">
      {c.announcement}
    </div>
  );
}

export function BannerImage({ c }: Pick<Ctx, "c">) {
  if (!c.bannerUrl) return null;
  return (
    <div className="relative h-28 w-full overflow-hidden sm:h-40">
      <Image src={c.bannerUrl} alt={`${c.businessName} banner`} fill sizes="100vw" className="object-cover" />
    </div>
  );
}

export function DecorativeMarquee({ c, t }: Pick<Ctx, "c" | "t">) {
  return (
    <div style={{ background: t.accent, color: t.accentText }} className="py-2.5">
      <Marquee speed={28}>
        {[...Array(8)].map((_, i) => (
          <span key={i} className="mx-8 text-xs font-bold uppercase tracking-widest">
            ✦ {t.marqueeText ?? c.businessName}{c.slogan ? ` ✦ ${c.slogan}` : ""}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export function FeatureBadges({ c, p, t }: Ctx) {
  const badges = [
    c.cta.menuBtn && c.terms.catalogLabel,
    c.cta.payBtn && "Pay Online",
    c.cta.reviewBtn && "Reviews",
    c.offers.length > 0 && "Offers",
    p.lotteryEnabled && "Lucky Draw",
  ].filter(Boolean) as string[];
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-5 py-4 sm:px-10">
      {badges.map((b) => (
        <span key={b} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider">
          {b}
        </span>
      ))}
    </div>
  );
}

export function AmenitiesRow({ c, t }: Pick<Ctx, "c" | "t">) {
  if (c.amenities.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2 px-5 py-6 sm:px-10">
      {c.amenities.map((a) => (
        <span key={a} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-3.5 py-1.5 text-xs font-semibold">
          {a}
        </span>
      ))}
    </div>
  );
}

export function PopularMenuSection({ c, t, p }: Ctx) {
  if (c.popularItems.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="px-5 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.4em]">{c.terms.popularSectionLabel}</p>
          <h2 style={{ color: t.textPrimary }} className="mb-8 text-center text-2xl font-bold">{c.terms.popularSectionSubhead}</h2>
        </FadeIn>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.popularItems.slice(0, 8).map((item, i) => (
            <StaggerItem key={`${item.name}-${i}`}>
              <div style={{ background: t.surface, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                <div className="relative h-28 overflow-hidden">
                  {item.image ? <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 style={{ color: t.textPrimary }} className="truncate text-sm font-bold">{item.name}</h3>
                    {item.price && <span style={{ color: t.accent }} className="shrink-0 text-xs font-bold">{item.price}</span>}
                  </div>
                  {item.description && <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-xs">{item.description}</p>}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
        {c.cta.menuBtn && (
          <div className="mt-6 text-center">
            <p.LinkComponent to={p.menuHref} style={{ color: t.accent }} className="text-xs font-bold uppercase tracking-wider hover:underline" onClick={() => p.track("click", "menu_button", {})}>
              {c.terms.ctaLabel} →
            </p.LinkComponent>
          </div>
        )}
      </div>
    </section>
  );
}

export function OffersSection({ c, t }: Pick<Ctx, "c" | "t">) {
  if (c.offers.length === 0) return null;
  return (
    <section style={{ background: t.sectionBg ?? t.surface, borderColor: t.border }} className="border-y px-5 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.4em]">Current Offers</p>
          <h2 style={{ color: t.textPrimary }} className="mb-8 text-center text-2xl font-bold">Something Special</h2>
        </FadeIn>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.offers.map((o: any, i: number) => (
            <StaggerItem key={i}>
              <div style={{ background: t.bg, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                {o.image_url ? (
                  <div className="relative h-32 w-full">
                    <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="400px" className="object-cover" />
                  </div>
                ) : <ImagePlaceholder aspect="wide" className="text-current" />}
                <div className="p-5">
                  {o.title && <h3 style={{ color: t.textPrimary }} className="font-bold">{o.title}</h3>}
                  {o.description && <p style={{ color: t.textSecondary }} className="mt-2 text-sm">{o.description}</p>}
                  {(o.offer_value || o.badge_text) && (
                    <span style={{ background: t.accent, color: t.accentText }} className="mt-3 inline-block rounded-full px-4 py-1 text-xs font-bold">
                      {o.badge_text || `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} OFF`}
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function ContactSection({ c, t, p }: Ctx) {
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;
  if (c.hours.length === 0 && !hasContact) return null;
  return (
    <section style={{ background: t.sectionBg ?? t.surface, borderColor: t.border }} className="border-y px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-14">
        {c.hours.length > 0 && (
          <FadeIn>
            <p style={{ color: t.accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.4em]">Opening Hours</p>
            <h2 style={{ color: t.textPrimary }} className="mb-6 text-2xl font-bold">When We're Open</h2>
            <div className="space-y-2">
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between border-b pb-2 text-sm" style={{ borderColor: t.border }}>
                  <span style={{ color: t.textPrimary }} className="font-medium">{h.day}</span>
                  <span style={{ color: t.textSecondary }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
        {hasContact && (
          <FadeIn delay={0.15}>
            <div className="mt-10 lg:mt-0">
              <p style={{ color: t.accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.4em]">Find Us</p>
              <h2 style={{ color: t.textPrimary }} className="mb-6 text-2xl font-bold">Come Say Hello</h2>
              <div className="space-y-4">
                {c.address && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">Address</p>
                    <p style={{ color: t.textSecondary }} className="text-sm">{c.address}</p>
                    {c.locationUrl && (
                      <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="mt-1 inline-block text-xs font-bold uppercase tracking-wider hover:underline">Get Directions →</a>
                    )}
                  </div>
                )}
                {c.phone && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">Phone</p>
                    <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">{c.phone}</a>
                  </div>
                )}
                {c.email && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">Email</p>
                    <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">{c.email}</a>
                  </div>
                )}
                {c.whatsapp && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">WhatsApp</p>
                    <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">{c.whatsapp}</a>
                  </div>
                )}
                {c.social.length > 0 && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-2 text-xs font-bold uppercase tracking-wider">Follow Us</p>
                    <div className="flex flex-wrap gap-3">
                      {c.social.map((s) => (
                        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider hover:opacity-80">
                          <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                          {getSocialPlatformLabel(s.platform, s.name)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {c.cta.payBtn && c.cta.paymentLink && (
                  <button onClick={p.onPay} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-7 py-2.5 text-sm font-bold uppercase tracking-wider">Pay Online</button>
                )}
                {c.cta.reviewBtn && c.cta.reviewLink && (
                  <button onClick={p.onReview} style={{ borderColor: t.accent, color: t.accent }} className="rounded-full border-2 px-7 py-2.5 text-sm font-bold uppercase tracking-wider">Write a Review</button>
                )}
              </div>
              {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
                <div className="mt-6">
                  <p style={{ color: t.accent }} className="mb-2 text-xs font-bold uppercase tracking-wider">Scan to Pay</p>
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" width={144} height={144} style={{ borderColor: t.border, background: t.bg }} className="h-36 w-36 rounded-lg border object-contain p-2" />
                </div>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/**
 * Lucky Draw is presented as a modal rather than an inline page section: it
 * opens automatically on load (if enabled and this browser hasn't played
 * today), and closing it leaves behind a floating button so the guest can
 * still get back to it. Once played, the button just reflects that state
 * instead of re-opening an empty "come back tomorrow" dialog.
 */
export function LotterySection({ c, p, t }: Ctx) {
  const workspaceId = (p.data.settings as any)?.id ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [playedToday, setPlayedToday] = useState(false);

  useEffect(() => {
    if (!p.lotteryEnabled || !workspaceId) return;
    const played = hasPlayedLotteryToday(workspaceId);
    setPlayedToday(played);
    if (!played) setIsOpen(true);
  }, [p.lotteryEnabled, workspaceId]);

  if (!p.lotteryEnabled || !workspaceId) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ background: t.accent, color: t.accentText }}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-lg"
          >
            <HiTicket className="size-5 shrink-0" />
            {playedToday ? "Already played today" : "Lucky Draw"}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{ background: t.sectionBg ?? t.surface, borderColor: t.accent }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border-2 p-8 text-center sm:p-10"
            >
              <div className="absolute -right-10 -top-10 opacity-10"><HiTicket className="size-40 rotate-12" style={{ color: t.accent }} /></div>
              <div className="absolute -bottom-10 -left-10 opacity-10"><HiSparkles className="size-40 -rotate-12" style={{ color: t.accent }} /></div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Lucky Draw"
                style={{ color: t.textSecondary }}
                className="absolute right-4 top-4 z-10 rounded-full p-2 transition-opacity hover:opacity-70"
              >
                <HiX className="size-5" />
              </button>

              <div className="relative">
                <div style={{ background: t.accent, color: t.accentText }} className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl">
                  <HiTicket className="size-7" />
                </div>
                <h2 style={{ color: t.textPrimary }} className="text-2xl font-bold sm:text-3xl">Lucky Draw & Rewards</h2>
                <p style={{ color: t.textSecondary }} className="mx-auto mt-4 max-w-xl leading-relaxed">
                  We love rewarding our guests. Spin for a chance to win real prizes from {c.businessName}.
                </p>
                <div className="mt-8">
                  <LotteryGame
                    workspaceId={workspaceId}
                    rewards={c.lotteryRewards}
                    accent={t.accent}
                    accentText={t.accentText}
                    textPrimary={t.textPrimary}
                    textSecondary={t.textSecondary}
                    border={t.border}
                    surface={t.bg}
                    onPlayed={() => setPlayedToday(true)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function FooterSection({ c, t, p }: Ctx) {
  return (
    <footer style={{ background: t.footerBg ?? t.bg, borderColor: t.border }} className="border-t px-5 py-10 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p style={{ color: t.textPrimary }} className="text-lg font-bold">{c.businessName}</p>
          {c.slogan && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{c.slogan}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
          {c.cta.menuBtn && (
            <p.LinkComponent to={p.menuHref} style={{ color: t.accent }} className="font-bold uppercase tracking-wider hover:underline" onClick={() => p.track("click", "footer_menu", {})}>{c.terms.catalogLabel}</p.LinkComponent>
          )}
          {c.phone && <a href={`tel:${c.phone}`} style={{ color: t.textSecondary }} className="hover:underline">{c.phone}</a>}
          {c.websiteHref && (
            <a href={c.websiteHref} target="_blank" rel="noopener noreferrer" style={{ color: t.textSecondary }} className="hover:underline">Website</a>
          )}
        </div>
      </div>
      <p style={{ color: t.textSecondary }} className="mt-6 text-center text-[10px] uppercase tracking-widest opacity-50">
        © {new Date().getFullYear()} {c.businessName}
      </p>
    </footer>
  );
}
