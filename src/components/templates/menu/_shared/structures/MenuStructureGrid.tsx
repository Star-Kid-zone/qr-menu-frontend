"use client";

import type { CSSProperties } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { Menu } from "@/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/*
 * Building blocks shared by the photo-led layouts (Grid and Masonry). They live
 * here because the layout contract test loads every MenuStructure*.tsx file as
 * a layout, so a separate helper file next to them would break it.
 */

export const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Same source check as MenuItemImage: true when the dish has a photo. */
export function hasPhoto(item: Menu): boolean {
  const first = item.images && item.images.length > 0 ? item.images[0] : null;
  const firstUrl = first ? (typeof first === "string" ? first : first?.url) : null;
  return Boolean(item.image_url || item.imageUrl || item.image || firstUrl);
}

export const priceLabel = (p: PublicMenuTemplateProps, item: Menu) => `${p.currencySymbol}${item.price}`;

/** No-photo placeholder: the dish's initial on a fine hatch of the accent colour. */
export function Monogram({ name, t, className = "" }: { name: string; t: MenuStructureTheme; className?: string }) {
  const letter = (name.trim()[0] || "•").toUpperCase();
  const style: CSSProperties = {
    background: `repeating-linear-gradient(135deg, ${mix(t.accent, t.sectionBg, 7)} 0 9px, ${mix(t.accent, t.sectionBg, 13)} 9px 10px)`,
    color: mix(t.accent, t.sectionBg, 75),
  };
  return (
    <div aria-hidden="true" style={style} className={`flex items-center justify-center ${className}`}>
      <span style={{ borderColor: mix(t.accent, "transparent", 35) }} className="flex size-16 items-center justify-center rounded-full border text-3xl font-semibold">
        {letter}
      </span>
    </div>
  );
}

export function StarIcon({ className = "size-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="currentColor">
      <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6z" />
    </svg>
  );
}

function SearchBox({ p, t, className = "" }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; className?: string }) {
  if (!p.showSearch) return null;
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">Search the menu</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2" style={{ color: t.textSecondary }} fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="9" r="6" />
        <path d="M14 14l4 4" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={p.searchQuery}
        onChange={(e) => p.setSearchQuery(e.target.value)}
        placeholder="Search dishes"
        style={{ background: mix(t.textPrimary, t.surface, 5), borderColor: t.border, color: t.textPrimary, outlineColor: t.accent }}
        className="h-11 w-full rounded-full border pl-11 pr-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-1"
      />
    </label>
  );
}

const resetFilters = (p: PublicMenuTemplateProps) => {
  p.setActiveCategory(null);
  p.setActiveType(null);
  p.setPopularOnly(false);
  p.setActiveDietaryTag(null);
};

/** One horizontal, scrollable chip row (all, popular, categories); never wraps into a wall. */
function ChipRow({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  if (!p.hasPopular && p.filterCategories.length === 0) return null;
  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType || !!p.activeDietaryTag;
  const chip = (active: boolean): CSSProperties =>
    active
      ? { background: t.textPrimary, color: t.surface, borderColor: t.textPrimary, outlineColor: t.accent }
      : { background: "transparent", color: t.textPrimary, borderColor: t.border, outlineColor: t.accent };
  const base = "shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";
  const all = !p.activeCategory && !p.popularOnly;
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0">
      <button type="button" onClick={() => { p.setActiveCategory(null); p.setPopularOnly(false); }} style={chip(all)} className={base} aria-pressed={all}>
        All
      </button>
      {p.hasPopular && (
        <button type="button" onClick={() => p.setPopularOnly(!p.popularOnly)} style={chip(p.popularOnly)} className={`${base} inline-flex items-center gap-1.5`} aria-pressed={p.popularOnly}>
          <StarIcon /> Popular
        </button>
      )}
      {p.filterCategories.map((cat) => (
        <button key={cat} type="button" onClick={() => p.setActiveCategory(p.activeCategory === cat ? null : cat)} style={chip(p.activeCategory === cat)} className={base} aria-pressed={p.activeCategory === cat}>
          {cat}
        </button>
      ))}
      {filtersActive && (
        <button type="button" onClick={() => resetFilters(p)} style={{ color: t.textSecondary, outlineColor: t.accent }} className="shrink-0 px-2 text-[13px] underline underline-offset-4 focus-visible:outline-2">
          Clear filters
        </button>
      )}
    </div>
  );
}

/** Sticky header for the photo-led layouts: way back, name, phone, search, filters. */
export function PhotoMenuHeader({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  return (
    <header style={{ background: mix(t.surface, "transparent", 94), borderColor: t.border }} className="sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 pb-3 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="min-w-0 max-w-full">
            <p.LinkComponent to={p.landingHref} style={{ color: t.textSecondary }} className="text-[13px] underline-offset-4 hover:underline">
              ← Back to venue
            </p.LinkComponent>
            <h1 style={{ color: t.textPrimary }} className="mt-0.5 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
              {p.businessName}
            </h1>
            {p.phone && (
              <a href={`tel:${p.phone}`} style={{ color: t.textSecondary }} className="text-[13px] underline-offset-4 hover:underline">
                {p.phone}
              </a>
            )}
          </div>
          <SearchBox p={p} t={t} className="w-full sm:w-80" />
        </div>
        <div className="mt-3 space-y-2">
          <ChipRow p={p} t={t} />
          <DietaryFilterPills p={p} t={t} />
        </div>
      </div>
    </header>
  );
}

/** Empty result state with a direct way back to every dish. */
export function EmptyResults({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  return (
    <div className="mx-auto max-w-sm py-24 text-center">
      <p style={{ color: t.textPrimary }} className="text-lg font-semibold">No dishes match</p>
      <p style={{ color: t.textSecondary }} className="mt-1 text-sm">Try another word or remove a filter.</p>
      <button
        type="button"
        onClick={() => { p.setSearchQuery(""); resetFilters(p); }}
        style={{ background: t.accent, color: t.accentText, outlineColor: t.accent }}
        className="mt-5 rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Show all dishes
      </button>
    </div>
  );
}

function GridCard({ p, t, item }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; item: Menu }) {
  const unavailable = item.availability === false;
  return (
    <button
      type="button"
      onClick={() => p.openItem(item)}
      style={{ background: t.sectionBg, borderColor: t.border, outlineColor: t.accent }}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border text-left focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-shadow motion-safe:hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className={`absolute inset-0 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105 ${unavailable ? "grayscale" : ""}`}>
          {hasPhoto(item) ? (
            <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-full w-full object-cover" />
          ) : (
            <Monogram name={item.item} t={t} className="h-full w-full" />
          )}
        </div>
        <span style={{ background: t.sectionBg, color: t.textPrimary }} className="absolute bottom-2 right-2 rounded-full px-2.5 py-1 text-[13px] font-semibold tabular-nums shadow-sm">
          {priceLabel(p, item)}
        </span>
        {item.popular && (
          <span style={{ background: t.accent, color: t.accentText }} className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
            <StarIcon className="size-2.5" /> Popular
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h3 style={{ color: t.textPrimary }} className="text-[15px] font-semibold leading-snug">
          {item.item}
        </h3>
        {unavailable && <p style={{ color: t.textSecondary }} className="text-xs font-medium">Not available today</p>}
        {item.description && (
          <p style={{ color: t.textSecondary }} className="line-clamp-2 text-[13px] leading-relaxed">
            {item.description}
          </p>
        )}
        <DietaryBadges item={item} className="mt-auto pt-1" />
      </div>
    </button>
  );
}

/** Grid: a photo-first catalogue — category sections of 4:3 photo cards with the price on the photo. */
export default function MenuStructureGrid({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh overflow-x-clip pb-32">
      <PhotoMenuHeader p={p} t={t} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {p.grouped.length === 0 ? (
          <EmptyResults p={p} t={t} />
        ) : (
          <div className="space-y-10 sm:space-y-14">
            {p.grouped.map(([category, items]) => (
              <section key={category}>
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 style={{ color: t.textPrimary }} className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {category}
                  </h2>
                  <span style={{ color: t.textSecondary }} className="shrink-0 text-[13px]">
                    {items.length} {items.length === 1 ? "dish" : "dishes"}
                  </span>
                  <span aria-hidden="true" style={{ background: t.border }} className="h-px flex-1 self-center" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
                  {items.map((item) => (
                    <GridCard key={item.id} p={p} t={t} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
