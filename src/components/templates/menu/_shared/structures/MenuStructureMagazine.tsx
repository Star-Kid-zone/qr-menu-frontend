"use client";

import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { Menu } from "@/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

const hasPhoto = (it: Menu) => Boolean(it.image_url || it.imageUrl || it.image || (it.images && it.images.length > 0));
const mix = (a: string, pct: number, b = "transparent") => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Click + Enter/Space opens the dish; a real focus target for keyboard users. */
function Dish({ p, item, className, style, children }: { p: PublicMenuTemplateProps; item: Menu; className?: string; style?: CSSProperties; children: ReactNode }) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      p.openItem(item);
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${item.item}, ${p.currencySymbol}${item.price}`}
      onClick={() => p.openItem(item)}
      onKeyDown={onKey}
      className={`cursor-pointer rounded-sm outline-offset-4 focus-visible:outline-2 ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

function Price({ p, t, item }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; item: Menu }) {
  return (
    <span style={{ color: t.accent }} className="shrink-0 text-[0.95rem] font-semibold tabular-nums">
      {p.currencySymbol}
      {item.price}
    </span>
  );
}

/** A printed-menu line: name …… price, description in italic, badges. */
function DishLine({ p, t, item }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; item: Menu }) {
  return (
    <Dish p={p} item={item} className="group block py-3" style={{ outlineColor: t.accent }}>
      <div className="flex items-baseline gap-2">
        <h4 style={{ color: t.textPrimary }} className="min-w-0 text-[1.05rem] font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
          {item.item}
        </h4>
        <span aria-hidden className="min-w-4 flex-1 translate-y-[-0.3em] border-b border-dotted" style={{ borderColor: mix(t.textSecondary, 45) }} />
        <Price p={p} t={t} item={item} />
      </div>
      {item.description ? (
        <p style={{ color: t.textSecondary }} className="mt-1 text-sm italic leading-relaxed">
          {item.description}
        </p>
      ) : null}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        {item.popular ? (
          <span style={{ color: t.accent }} className="text-xs font-semibold italic">
            House favourite
          </span>
        ) : null}
        {!item.availability ? (
          <span style={{ color: t.textSecondary }} className="text-xs italic">
            Not available today
          </span>
        ) : null}
        <DietaryBadges item={item} />
      </div>
    </Dish>
  );
}

/** An image-led feature inside a section: photo with the dish set beneath it. */
function DishFeature({ p, t, item }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; item: Menu }) {
  return (
    <Dish p={p} item={item} className="group block break-inside-avoid pb-4 pt-2" style={{ outlineColor: t.accent }}>
      <figure>
        <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="aspect-[4/3] w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.02]" />
        <figcaption className="mt-3">
          <div className="flex items-baseline justify-between gap-3">
            <h4 style={{ color: t.textPrimary }} className="min-w-0 text-lg font-semibold leading-snug">
              {item.item}
            </h4>
            <Price p={p} t={t} item={item} />
          </div>
          {item.description ? (
            <p style={{ color: t.textSecondary }} className="mt-1 text-sm italic leading-relaxed">
              {item.description}
            </p>
          ) : null}
          <DietaryBadges item={item} className="mt-1.5" />
        </figcaption>
      </figure>
    </Dish>
  );
}

/**
 * Magazine Menu — a printed food-magazine spread: a masthead, a "Chef's pick"
 * feature for the first house favourite, then each category as an editorial
 * section with a fine rule, set in 1–3 text columns with dotted price leaders
 * and an occasional photo feature. A slim sticky contents bar jumps between sections.
 */
export default function MenuStructureMagazine({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType || !!p.activeDietaryTag || !!p.searchQuery;

  const allItems = p.grouped.flatMap(([, items]) => items);
  const pick = allItems.find((it) => it.popular && hasPhoto(it)) ?? allItems.find(hasPhoto);
  const today = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date());

  const clear = () => {
    p.setActiveCategory(null);
    p.setActiveType(null);
    p.setPopularOnly(false);
    p.setActiveDietaryTag(null);
    p.setSearchQuery("");
  };

  const slug = (cat: string) => `mag-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh overflow-x-hidden pb-32">
      {/* ── Masthead ── */}
      <header className="px-5 pb-6 pt-8 sm:px-10 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <div style={{ color: t.textSecondary, borderColor: t.textPrimary }} className="flex items-center justify-between gap-4 border-b pb-2 text-xs">
            <p.LinkComponent to={p.landingHref} style={{ color: t.textSecondary }} className="underline-offset-4 hover:underline">
              ← Back to {p.businessName}
            </p.LinkComponent>
            <span className="hidden italic sm:inline">The menu · {today}</span>
            {p.phone ? (
              <a href={`tel:${p.phone}`} style={{ color: t.textSecondary }} className="underline-offset-4 hover:underline">
                {p.phone}
              </a>
            ) : (
              <span />
            )}
          </div>
          <h1 style={{ color: t.textPrimary }} className="mt-6 text-center text-[clamp(2.6rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-tight">
            {p.businessName}
          </h1>
          <p style={{ color: t.textSecondary }} className="mt-3 text-center text-lg italic">
            The Menu
          </p>
          <div aria-hidden className="mx-auto mt-5 h-[3px] w-full border-y" style={{ borderColor: t.textPrimary }} />
        </div>
      </header>

      {/* ── Slim sticky contents + search ── */}
      <nav aria-label="Menu sections" style={{ background: mix(t.bg, 92), borderColor: t.border }} className="sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:px-10 lg:flex-row lg:items-center">
          <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1">
            {p.allCategories.map((cat, i) => (
              <a
                key={cat}
                href={`#${slug(cat)}`}
                style={{ color: t.textPrimary }}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,currentColor_8%,transparent)] focus-visible:outline-2"
              >
                <span style={{ color: t.accent }} className="mr-1.5 text-xs tabular-nums">
                  {i + 1}
                </span>
                {cat}
              </a>
            ))}
          </div>
          {p.showSearch && (
            <input
              type="search"
              value={p.searchQuery}
              onChange={(e) => p.setSearchQuery(e.target.value)}
              placeholder="Search the menu"
              aria-label="Search the menu"
              style={{ background: t.surface, borderColor: t.border, color: t.textPrimary }}
              className="w-full rounded-full border px-4 py-2 text-sm outline-none focus-visible:ring-2 lg:w-64"
            />
          )}
        </div>
        {(p.hasPopular || p.allDietaryTags.length > 0 || filtersActive) && (
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-5 pb-3 sm:px-10">
            {p.hasPopular && (
              <button
                type="button"
                aria-pressed={p.popularOnly}
                onClick={() => p.setPopularOnly(!p.popularOnly)}
                style={p.popularOnly ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { borderColor: t.border, color: t.textPrimary }}
                className="rounded-full border px-3 py-1 text-xs italic focus-visible:outline-2"
              >
                House favourites
              </button>
            )}
            <DietaryFilterPills p={p} t={t} />
            {filtersActive && (
              <button type="button" onClick={clear} style={{ color: t.accent }} className="text-xs underline underline-offset-4">
                Clear filters
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-6xl px-5 sm:px-10">
        {/* ── Chef's pick feature ── */}
        {pick && !filtersActive ? (
          <section aria-labelledby="mag-pick" className="grid gap-8 border-b py-12 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-12 lg:py-16" style={{ borderColor: t.border }}>
            <Dish p={p} item={pick} className="group block" style={{ outlineColor: t.accent }}>
              <MenuItemImage item={pick} primary={t.accent} secondary={t.textSecondary} className="aspect-[4/3] w-full transition-transform duration-700 motion-safe:group-hover:scale-[1.015] md:aspect-[5/4]" />
            </Dish>
            <div>
              <p style={{ color: t.accent }} className="text-sm italic">
                Chef&apos;s pick
              </p>
              <h2 id="mag-pick" style={{ color: t.textPrimary }} className="mt-2 text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02]">
                {pick.item}
              </h2>
              {pick.description ? (
                <blockquote style={{ color: t.textSecondary, borderColor: t.accent }} className="mt-5 border-l-2 pl-5 text-xl italic leading-relaxed">
                  {pick.description}
                </blockquote>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span style={{ color: t.textPrimary }} className="text-2xl font-semibold tabular-nums">
                  {p.currencySymbol}
                  {pick.price}
                </span>
                <button
                  type="button"
                  onClick={() => p.openItem(pick)}
                  style={{ borderColor: t.textPrimary, color: t.textPrimary }}
                  className="rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,currentColor_8%,transparent)] focus-visible:outline-2"
                >
                  See the dish
                </button>
              </div>
              <DietaryBadges item={pick} className="mt-4" />
            </div>
          </section>
        ) : null}

        {p.grouped.length === 0 ? (
          <div className="py-24 text-center">
            <p style={{ color: t.textPrimary }} className="text-2xl italic">
              Nothing on the menu matches that.
            </p>
            <button type="button" onClick={clear} style={{ color: t.accent }} className="mt-3 text-sm underline underline-offset-4">
              Clear the search and filters
            </button>
          </div>
        ) : (
          p.grouped.map(([cat, items], idx) => {
            // One photo feature per section (the first dish with a photo), the rest as printed lines.
            const feature = items.length > 2 ? items.find(hasPhoto) : undefined;
            const lines = items.filter((it) => it !== feature);
            return (
              <section key={cat} id={slug(cat)} aria-labelledby={`${slug(cat)}-h`} className="scroll-mt-32 py-12 lg:py-16">
                <div className="flex items-end gap-4 border-b pb-3" style={{ borderColor: t.textPrimary }}>
                  <span style={{ color: t.accent }} className="text-4xl font-light leading-none tabular-nums sm:text-5xl">
                    {idx + 1}
                  </span>
                  <h2 id={`${slug(cat)}-h`} style={{ color: t.textPrimary }} className="min-w-0 flex-1 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-none">
                    {cat}
                  </h2>
                  <span style={{ color: t.textSecondary }} className="shrink-0 pb-1 text-sm italic">
                    {items.length} {items.length === 1 ? "dish" : "dishes"}
                  </span>
                </div>
                <div className={`mt-6 grid gap-x-12 ${feature ? "lg:grid-cols-[1fr_2fr]" : ""}`}>
                  {feature ? <DishFeature p={p} t={t} item={feature} /> : null}
                  <div className={`gap-x-10 ${feature ? "md:columns-2" : "md:columns-2 xl:columns-3"}`}>
                    {lines.map((item) => (
                      <div key={item.id} className="break-inside-avoid border-b" style={{ borderColor: mix(t.border, 70) }}>
                        <DishLine p={p} t={t} item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })
        )}

        <p style={{ color: t.textSecondary, borderColor: t.textPrimary }} className="border-t py-8 text-center text-sm italic">
          Ask us about allergies and dietary needs — we&apos;re happy to help.
        </p>
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
