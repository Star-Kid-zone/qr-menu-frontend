"use client";

import { useEffect, useState } from "react";
import type { PublicMenuPayload } from "@/types/public-site";
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
const slug = (cat: string) => `story-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

function Meta({ t, item }: { t: MenuStructureTheme; item: Menu }) {
  if (!item.popular && item.availability) return null;
  return (
    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm italic">
      {item.popular ? <span style={{ color: t.accent }}>A house favourite</span> : null}
      {!item.availability ? <span style={{ color: t.textSecondary }}>Not available today</span> : null}
    </p>
  );
}

/** A dish row: photo and text alternate sides; dishes without a photo are set as type alone. */
function DishRow({ p, t, item, flip }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; item: Menu; flip: boolean }) {
  const photo = hasPhoto(item);
  const price = (
    <span style={{ color: t.accent }} className="text-lg font-semibold tabular-nums">
      {p.currencySymbol}
      {item.price}
    </span>
  );
  return (
    <button
      type="button"
      onClick={() => p.openItem(item)}
      style={{ outlineColor: t.accent, opacity: item.availability ? 1 : 0.6 }}
      className={`group block w-full rounded-sm text-left outline-offset-8 focus-visible:outline-2 ${
        photo ? "grid items-center gap-6 md:grid-cols-2 md:gap-14" : ""
      }`}
    >
      {photo ? (
        <div className={`overflow-hidden rounded-sm ${flip ? "md:order-2" : ""}`}>
          <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="aspect-[4/3] w-full transition-transform duration-700 motion-safe:group-hover:scale-[1.03]" />
        </div>
      ) : null}
      <div className={photo ? "" : "mx-auto max-w-2xl text-center"}>
        <h3 style={{ color: t.textPrimary }} className={`font-semibold leading-tight ${photo ? "text-[clamp(1.5rem,3vw,2.1rem)]" : "text-[clamp(1.3rem,2.5vw,1.7rem)]"}`}>
          {item.item}
        </h3>
        {item.description ? (
          <p style={{ color: t.textSecondary }} className={`mt-3 max-w-[60ch] text-base leading-relaxed ${photo ? "" : "mx-auto"}`}>
            {item.description}
          </p>
        ) : null}
        <div className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 ${photo ? "" : "justify-center"}`}>
          {price}
          <DietaryBadges item={item} />
        </div>
        <Meta t={t} item={item} />
      </div>
    </button>
  );
}

/**
 * Story Menu — the menu read as a narrative. Each category is a chapter that
 * opens on a full-width photo banner, followed by calm alternating
 * photo/text rows. A sticky chapter bar tracks progress down the page.
 */
export default function MenuStructureStory({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);
  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType || !!p.activeDietaryTag || !!p.searchQuery;
  const cats = p.grouped.map(([c]) => c);
  const catKey = cats.join("|");

  useEffect(() => {
    const names = catKey ? catKey.split("|") : [];
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      let now: string | null = null;
      for (const c of names) {
        const el = document.getElementById(slug(c));
        if (el && el.getBoundingClientRect().top < 140) now = c;
      }
      setCurrent(now);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [catKey]);

  const clear = () => {
    p.setActiveCategory(null);
    p.setActiveType(null);
    p.setPopularOnly(false);
    p.setActiveDietaryTag(null);
    p.setSearchQuery("");
  };

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh overflow-x-hidden pb-32">
      <header className="px-5 pb-12 pt-10 text-center sm:px-10 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <div style={{ color: t.textSecondary }} className="flex items-center justify-between gap-4 text-sm">
            <p.LinkComponent to={p.landingHref} style={{ color: t.textSecondary }} className="underline-offset-4 hover:underline">
              ← Back to {p.businessName}
            </p.LinkComponent>
            {p.phone ? (
              <a href={`tel:${p.phone}`} style={{ color: t.textSecondary }} className="underline-offset-4 hover:underline">
                {p.phone}
              </a>
            ) : null}
          </div>
          <h1 style={{ color: t.textPrimary }} className="mt-12 break-words text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
            {p.businessName}
          </h1>
          <p style={{ color: t.textSecondary }} className="mx-auto mt-5 max-w-md text-lg italic leading-relaxed">
            Our menu, told in {cats.length || "a few"} {cats.length === 1 ? "chapter" : "chapters"}. Tap any dish to read more.
          </p>
          {p.showSearch && (
            <input
              type="search"
              value={p.searchQuery}
              onChange={(e) => p.setSearchQuery(e.target.value)}
              placeholder="Search the menu"
              aria-label="Search the menu"
              style={{ background: t.surface, borderColor: t.border, color: t.textPrimary }}
              className="mx-auto mt-8 block w-full max-w-sm rounded-full border px-5 py-2.5 text-sm outline-none focus-visible:ring-2"
            />
          )}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {p.hasPopular && (
              <button
                type="button"
                aria-pressed={p.popularOnly}
                onClick={() => p.setPopularOnly(!p.popularOnly)}
                style={p.popularOnly ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { borderColor: t.border, color: t.textPrimary }}
                className="rounded-full border px-3 py-1 text-xs focus-visible:outline-2"
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
        </div>
      </header>

      {/* Sticky chapter bar with reading progress */}
      <nav aria-label="Menu chapters" style={{ background: mix(t.bg, 92), borderColor: t.border }} className="sticky top-0 z-20 border-y backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2 sm:px-8">
          {p.allCategories.map((cat) => {
            const on = current === cat;
            return (
              <a
                key={cat}
                href={`#${slug(cat)}`}
                aria-current={on ? "true" : undefined}
                style={{ color: on ? t.textPrimary : t.textSecondary, background: on ? mix(t.accent, 12) : undefined }}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-2"
              >
                {cat}
              </a>
            );
          })}
        </div>
        <div aria-hidden className="h-[2px] w-full" style={{ background: mix(t.border, 60) }}>
          <div className="h-full origin-left" style={{ background: t.accent, transform: `scaleX(${progress})` }} />
        </div>
      </nav>

      <main>
        {p.grouped.length === 0 ? (
          <div className="px-5 py-24 text-center">
            <p style={{ color: t.textPrimary }} className="text-2xl italic">
              No dishes match that search.
            </p>
            <button type="button" onClick={clear} style={{ color: t.accent }} className="mt-3 text-sm underline underline-offset-4">
              Clear the search and filters
            </button>
          </div>
        ) : (
          p.grouped.map(([cat, items], idx) => {
            const banner = items.find(hasPhoto);
            let photoIdx = 0;
            return (
              <section key={cat} id={slug(cat)} aria-labelledby={`${slug(cat)}-h`} className="scroll-mt-16">
                {/* Chapter opener */}
                <div className="relative mt-4 overflow-hidden" style={{ background: mix(t.accent, 14, t.bg) }}>
                  {banner ? (
                    <MenuItemImage item={banner} primary={t.accent} secondary={t.textSecondary} className="h-[clamp(14rem,42vw,26rem)] w-full" />
                  ) : (
                    <div className="h-[clamp(10rem,24vw,14rem)] w-full" />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ background: banner ? "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 55%, transparent)" : undefined }}
                  />
                  <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-5 pb-7 sm:px-10 sm:pb-10">
                    <p style={{ color: banner ? "rgba(255,255,255,0.85)" : t.textSecondary }} className="text-base italic">
                      Chapter {idx + 1}
                    </p>
                    <h2 id={`${slug(cat)}-h`} style={{ color: banner ? "#fff" : t.textPrimary }} className="mt-1 break-words text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-none">
                      {cat}
                    </h2>
                    <p style={{ color: banner ? "rgba(255,255,255,0.85)" : t.textSecondary }} className="mt-2 text-sm">
                      {items.length} {items.length === 1 ? "dish" : "dishes"}
                    </p>
                  </div>
                </div>

                <div className="mx-auto max-w-5xl space-y-16 px-5 py-14 sm:px-10 md:space-y-24 md:py-20">
                  {items.map((item) => {
                    const flip = hasPhoto(item) ? photoIdx++ % 2 === 1 : false;
                    return <DishRow key={item.id} p={p} t={t} item={item} flip={flip} />;
                  })}
                </div>
              </section>
            );
          })
        )}

        <p style={{ color: t.textSecondary }} className="mx-auto max-w-md px-5 py-10 text-center text-sm italic">
          Tell us about any allergies or dietary needs and we&apos;ll guide you.
        </p>
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
