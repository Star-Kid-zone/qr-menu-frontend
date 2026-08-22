"use client";

import Image from "next/image";
import { StackCard } from "../parallax/StackCard";
import { Reveal } from "../parallax/Reveal";
import { AnalyticsVisual, PosterVisual } from "./FeatureVisuals";

const CARDS = [
  {
    eyebrow: "Digital menus",
    title: "Every dish, styled your way",
    description:
      "Pick from 10 page layouts — grid, magazine, story, bento, and more — and pair any of them with any of 113 visual themes, so your menu looks like your restaurant, not a template. Each dish can carry up to 5 photos, a description, and its own dietary tag (you define the tags — Veg, Non-Veg, Spicy, whatever fits your menu). Set a time-of-day window so your breakfast items disappear at lunch automatically, and mark a dish unavailable the moment you 86 it — guests never see something you can't actually serve.",
    stats: [
      { value: "10", label: "Layouts" },
      { value: "113", label: "Themes" },
      { value: "5", label: "Photos / dish" },
    ],
    visual: { type: "image" as const, src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop" },
  },
  {
    eyebrow: "Site customization",
    title: "Your restaurant's home on the web",
    description:
      "Every business gets a full public site, not just a menu link — its own 10 layouts and 113 themes, a testimonials section, an FAQ block, and a dismissible announcement banner for one-off news. Behind the scenes, QRMenu writes your page's SEO meta tags, Open Graph previews, and Schema.org structured data automatically — including your opening hours and a price range Google computes from your actual menu prices. That's real rich-snippet eligibility, generated for you with zero SEO knowledge required.",
    stats: [
      { value: "10", label: "Layouts" },
      { value: "113", label: "Themes" },
      { value: "1", label: "Free branded subdomain" },
    ],
    visual: { type: "image" as const, src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop" },
  },
  {
    eyebrow: "Marketing studio",
    title: "Design posters without a designer",
    description:
      "A drag-and-drop canvas built into your dashboard, loaded with 14 templates across 6 categories — daily specials, discounts, grand openings, happy hour, seasonal promos. Swap in your own text, colors, and pricing, then export a print-ready PNG at double resolution in a couple of minutes. No Canva subscription, no waiting on a freelancer for a weekend flash sale.",
    stats: [
      { value: "14", label: "Templates" },
      { value: "6", label: "Categories" },
      { value: "2×", label: "Export resolution" },
    ],
    visual: { type: "custom" as const },
  },
  {
    eyebrow: "Analytics",
    title: "Know what's actually working",
    description:
      "Every scan, click, and search gets logged anonymously — no login required from guests, no personal data collected. See total visits, what guests click on (menu, pay, reviews), which dishes get the most attention, and — the genuinely useful part — the searches that came up empty, so you know exactly what people wanted but couldn't find on your menu. Every visitor record is exportable to CSV whenever you need the raw numbers.",
    stats: [
      { value: "100%", label: "Guest-anonymous" },
      { value: "CSV", label: "Exportable" },
      { value: "24/7", label: "Live tracking" },
    ],
    visual: { type: "custom" as const },
  },
] as const;

export function Flagship() {
  return (
    <section className="relative bg-[#0d0906] px-5 pt-24 text-white xs:px-8 sm:px-12 sm:pt-32">
      <Reveal className="mx-auto mb-4 max-w-2xl text-center">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/40">The essentials</span>
        <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Four things, done right
        </h2>
      </Reveal>

      <div className="mx-auto max-w-6xl">
        {CARDS.map((card, i) => (
          <StackCard key={card.title} index={i} total={CARDS.length} className="w-full">
            <div className="grid w-full grid-cols-1 items-center gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#15100c] p-6 shadow-2xl sm:grid-cols-2 sm:gap-12 sm:p-12">
              <div>
                <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">{card.eyebrow}</span>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">{card.description}</p>
                <div className="mt-8 flex flex-wrap gap-8">
                  {card.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                {card.visual.type === "image" ? (
                  <Image src={card.visual.src} alt="" fill sizes="(max-width: 640px) 90vw, 40vw" className="object-cover" />
                ) : card.eyebrow === "Marketing studio" ? (
                  <PosterVisual />
                ) : (
                  <AnalyticsVisual />
                )}
              </div>
            </div>
          </StackCard>
        ))}
      </div>
    </section>
  );
}
