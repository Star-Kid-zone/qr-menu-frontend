"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { Menu } from "@/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/* ── Pieces shared with the Tabs layout (kept here: every MenuStructure*.tsx is treated as a layout) ── */

export const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Open a dish from a click or Enter/Space. */
export function dishActivation(p: PublicMenuTemplateProps, item: Menu) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": `${item.item}, ${p.currencySymbol}${item.price}`,
    onClick: () => p.openItem(item),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        p.openItem(item);
      }
    },
  };
}

/** Back link, restaurant name, phone (+ optional extra controls). */
export function MenuHeaderTop({ p, t, children }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="min-w-0 flex-1">
        <p.LinkComponent
          to={p.landingHref}
          style={{ color: t.textSecondary }}
          className="inline-flex items-center gap-1 rounded text-xs hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Back to venue
        </p.LinkComponent>
        <h1 style={{ color: t.textPrimary }} className="mt-0.5 truncate text-xl font-semibold leading-tight sm:text-2xl">
          {p.businessName}
        </h1>
      </div>
      {p.phone ? (
        <a
          href={`tel:${p.phone}`}
          style={{ color: t.textPrimary, borderColor: t.border }}
          className="shrink-0 rounded-full border px-3 py-1.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Call {p.phone}
        </a>
      ) : null}
      {children}
    </div>
  );
}

export function MenuSearch({ p, t, className = "" }: { p: PublicMenuTemplateProps; t: MenuStructureTheme; className?: string }) {
  if (!p.showSearch) return null;
  return (
    <label
      style={{ background: mix(t.textPrimary, t.surface, 5), borderColor: t.border, color: t.textSecondary }}
      className={`flex min-w-0 items-center gap-2 rounded-xl border px-3.5 focus-within:outline-2 focus-within:outline-offset-1 ${className}`}
    >
      <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 3.5 3.5" strokeLinecap="round" />
      </svg>
      <span className="sr-only">Search the menu</span>
      <input
        type="search"
        value={p.searchQuery}
        onChange={(e) => p.setSearchQuery(e.target.value)}
        placeholder="Search dishes"
        style={{ color: t.textPrimary }}
        className="w-full min-w-0 bg-transparent py-2.5 text-sm outline-none"
      />
    </label>
  );
}

export function PopularMark({ t }: { t: MenuStructureTheme }) {
  return (
    <span
      style={{ background: mix(t.accent, t.surface, 14), color: t.accent }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
    >
      <svg viewBox="0 0 12 12" className="size-3" fill="currentColor" aria-hidden="true">
        <path d="M6 .8 7.6 4l3.5.5-2.5 2.4.6 3.5L6 8.8 2.8 10.4l.6-3.5L.9 4.5 4.4 4z" />
      </svg>
      Popular
    </span>
  );
}

export function UnavailableMark({ t }: { t: MenuStructureTheme }) {
  return (
    <span style={{ borderColor: t.border, color: t.textSecondary }} className="inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[11px]">
      Not available today
    </span>
  );
}

export function clearAll(p: PublicMenuTemplateProps) {
  p.setSearchQuery("");
  p.setActiveCategory(null);
  p.setActiveType(null);
  p.setPopularOnly(false);
  p.setActiveDietaryTag(null);
}

export function EmptyResults({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  return (
    <div style={{ color: t.textSecondary }} className="mx-auto max-w-sm py-24 text-center">
      <p style={{ color: t.textPrimary }} className="text-lg font-semibold">No dishes match</p>
      <p className="mt-1 text-sm">Try another word, or clear the filters to see the whole menu.</p>
      <button
        type="button"
        onClick={() => clearAll(p)}
        style={{ background: t.accent, color: t.accentText }}
        className="mt-5 rounded-full px-5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Show the whole menu
      </button>
    </div>
  );
}

const slug = (s: string) => `cat-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/**
 * The sticky category chips. It owns the scroll-spy state (which section is on screen), so reading
 * down the menu re-renders these few buttons only, not every dish in the list.
 */
function CategoryChipBar({
  p,
  t,
  cats,
  filtersActive,
}: {
  p: PublicMenuTemplateProps;
  t: MenuStructureTheme;
  cats: string[];
  filtersActive: boolean;
}) {
  const [current, setCurrent] = useState<string | null>(null);
  const chipBar = useRef<HTMLDivElement>(null);
  const catsKey = cats.join("|");

  // Scroll-spy: the section nearest the top of the viewport lights up its chip.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = catsKey.split("|").map((c) => document.getElementById(slug(c))).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setCurrent((hit.target as HTMLElement).dataset.cat ?? null);
      },
      { rootMargin: "-160px 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => {
      io.disconnect();
    };
  }, [catsKey]);

  // Keep the lit chip in view inside the chip bar.
  useEffect(() => {
    if (!current) return;
    const chip = chipBar.current?.querySelector<HTMLElement>(`[data-chip="${CSS.escape(current)}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [current]);

  const jump = (cat: string) => {
    setCurrent(cat);
    document.getElementById(slug(cat))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chip = (on: boolean) =>
    on
      ? { background: t.textPrimary, color: t.surface, borderColor: t.textPrimary }
      : { background: "transparent", color: t.textSecondary, borderColor: t.border };
  const chipCls = "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <>
            <div
              ref={chipBar}
              className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5"
              style={{ maskImage: "linear-gradient(to right, transparent 0, #000 8px, #000 calc(100% - 24px), transparent)" }}
            >
              {p.hasPopular ? (
                <button type="button" aria-pressed={p.popularOnly} onClick={() => p.setPopularOnly(!p.popularOnly)} style={chip(p.popularOnly)} className={chipCls}>
                  Popular only
                </button>
              ) : null}
              {(p.filterCategories.length > 1 ? p.filterCategories : cats).map((cat) => {
                const inView = cats.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    data-chip={cat}
                    aria-current={current === cat ? "true" : undefined}
                    disabled={!inView}
                    onClick={() => jump(cat)}
                    style={{ ...chip(current === cat), opacity: inView ? 1 : 0.4 }}
                    className={chipCls}
                  >
                    {cat}
                  </button>
                );
              })}
              {filtersActive ? (
                <button type="button" onClick={() => clearAll(p)} style={{ color: t.accent }} className="shrink-0 whitespace-nowrap px-2 text-[13px] font-medium underline underline-offset-4 focus-visible:outline-2">
                  Clear filters
                </button>
              ) : null}
            </div>
    </>
  );
}

/** List: the whole menu in one scroll, like a printed card. A sticky chip bar
 * follows the section you're reading and jumps to any other. */
export default function MenuStructureList({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType || !!p.activeDietaryTag || !!p.searchQuery;
  const cats = p.grouped.map(([cat]) => cat);
  const [showTop, setShowTop] = useState(false);

  // Only toggles at the threshold, so scrolling does not re-render the list.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh overflow-x-clip pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="border-b px-4 pb-4 pt-5 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <MenuHeaderTop p={p} t={t} />
          <MenuSearch p={p} t={t} />
        </div>
      </header>

      <nav
        aria-label="Menu sections"
        style={{ background: mix(t.surface, "transparent", 92), borderColor: t.border }}
        className="sticky top-0 z-20 border-b backdrop-blur-md"
      >
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-2.5 sm:px-6">
          <CategoryChipBar p={p} t={t} cats={cats} filtersActive={filtersActive} />
          <DietaryFilterPills p={p} t={t} />
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        {p.grouped.length === 0 ? (
          <EmptyResults p={p} t={t} />
        ) : (
          p.grouped.map(([cat, items]) => (
            <section key={cat} id={slug(cat)} data-cat={cat} aria-labelledby={`${slug(cat)}-h`} className="scroll-mt-32 pb-10 pt-4">
              <div style={{ borderColor: t.textPrimary }} className="mb-2 flex items-baseline justify-between gap-3 border-b-2 pb-2">
                <h2 id={`${slug(cat)}-h`} style={{ color: t.textPrimary }} className="min-w-0 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {cat}
                </h2>
                <span style={{ color: t.textSecondary }} className="shrink-0 text-sm tabular-nums">
                  {items.length} {items.length === 1 ? "dish" : "dishes"}
                </span>
              </div>
              <ul className="grid gap-x-12 lg:grid-cols-2">
                {items.map((item) => {
                  const off = !item.availability;
                  return (
                    <li key={item.id} style={{ borderColor: t.border }} className="min-w-0 border-b last:border-b-0 lg:[&:nth-last-child(2):nth-child(odd)]:border-b-0">
                      <div
                        {...dishActivation(p, item)}
                        style={{ opacity: off ? 0.55 : 1 }}
                        className="group -mx-2 flex min-w-0 cursor-pointer gap-4 rounded-xl px-2 py-4 focus-visible:outline-2 focus-visible:outline-offset-0"
                      >
                        <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="size-[4.5rem] shrink-0 rounded-lg object-cover sm:size-20" />
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-baseline gap-2">
                            <h3 style={{ color: t.textPrimary }} className="min-w-0 break-words font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
                              {item.item}
                            </h3>
                            <span aria-hidden="true" style={{ borderColor: t.border }} className="min-w-4 flex-1 translate-y-[-3px] border-b-2 border-dotted" />
                            <span style={{ color: t.accent }} className="shrink-0 font-semibold tabular-nums">
                              {p.currencySymbol}{item.price}
                            </span>
                          </div>
                          {item.description ? (
                            <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-sm leading-relaxed">{item.description}</p>
                          ) : null}
                          {item.popular || off || item.dietaryTags?.length || item.spiceLevel || item.priceOptions?.length || Object.keys(item.attributes ?? {}).length ? (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {item.popular ? <PopularMark t={t} /> : null}
                              {off ? <UnavailableMark t={t} /> : null}
                              <DietaryBadges item={item} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </main>

      {showTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ background: t.surface, color: t.textPrimary, borderColor: t.border }}
          className="fixed bottom-24 right-4 z-30 rounded-full border px-4 py-2 text-sm font-medium shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:animate-fade-in-up"
        >
          Back to top
        </button>
      ) : null}

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
