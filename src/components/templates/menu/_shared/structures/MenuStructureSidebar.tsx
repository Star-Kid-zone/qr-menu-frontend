"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { Menu } from "@/types";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** DOM id for a category section (stable, URL-safe). */
const sectionId = (cat: string) => `menu-cat-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "other"}`;

const mix = (a: string, pct: number, b = "transparent") => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

function DishCard({ item, p, t }: { item: Menu; p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  const unavailable = item.availability === false;
  return (
    <button
      type="button"
      onClick={() => p.openItem(item)}
      style={{ background: t.surface, borderColor: t.border, color: t.textPrimary, opacity: unavailable ? 0.6 : 1 }}
      className={`group flex h-full w-full min-w-0 gap-4 border p-3 text-left transition-colors duration-150 hover:border-current focus-visible:outline-2 focus-visible:outline-offset-2 ${t.cardStyle}`}
    >
      <MenuItemImage
        item={item}
        primary={t.accent}
        secondary={t.textSecondary}
        className="h-24 w-24 shrink-0 rounded-[inherit] sm:h-28 sm:w-28"
      />
      <span className="flex min-w-0 flex-1 flex-col py-0.5">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0 text-[15px] font-semibold leading-snug [overflow-wrap:anywhere]">{item.item}</span>
          <span style={{ color: t.accent }} className="shrink-0 text-[15px] font-semibold tabular-nums">
            {p.currencySymbol}
            {item.price}
          </span>
        </span>
        {item.description ? (
          <span style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-[13px] leading-relaxed">
            {item.description}
          </span>
        ) : null}
        <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {item.popular ? (
            <span style={{ background: mix(t.accent, 14), color: t.accent }} className="rounded-full px-2 py-0.5 text-[11px] font-semibold">
              Guest favourite
            </span>
          ) : null}
          {unavailable ? (
            <span style={{ background: mix(t.textSecondary, 14), color: t.textSecondary }} className="rounded-full px-2 py-0.5 text-[11px] font-semibold">
              Sold out today
            </span>
          ) : null}
          <DietaryBadges item={item} />
        </span>
      </span>
    </button>
  );
}

/**
 * Sidebar: a restaurant-website menu. On laptops a sticky rail lists every
 * category with its dish count and tracks where you are as you scroll; on
 * phones it becomes a sticky chip bar. All categories are on one scrolling
 * page, so guests can browse or jump.
 */
export default function MenuStructureSidebar({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const [activeCat, setActiveCat] = useState<string | null>(p.grouped[0]?.[0] ?? null);
  const chipBar = useRef<HTMLDivElement>(null);

  const filtersActive = p.popularOnly || Boolean(p.activeType) || Boolean(p.activeDietaryTag) || Boolean(p.searchQuery.trim());
  const favourites = useMemo(
    () => (filtersActive ? [] : p.grouped.flatMap(([, items]) => items.filter((i) => i.popular)).slice(0, 4)),
    [p.grouped, filtersActive],
  );
  const total = p.grouped.reduce((n, [, items]) => n + items.length, 0);

  // Scroll-spy: the category whose heading most recently crossed the top third of the screen.
  useEffect(() => {
    const els = p.grouped.map(([cat]) => document.getElementById(sectionId(cat))).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveCat(visible[0].target.getAttribute("data-cat"));
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [p.grouped]);

  // Keep the active chip in view on phones.
  useEffect(() => {
    if (!activeCat || !chipBar.current) return;
    const chip = chipBar.current.querySelector<HTMLElement>(`[data-chip="${CSS.escape(activeCat)}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeCat]);

  const jump = (cat: string) => {
    setActiveCat(cat);
    document.getElementById(sectionId(cat))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearAll = () => {
    p.setPopularOnly(false);
    p.setActiveType(null);
    p.setActiveDietaryTag(null);
    p.setSearchQuery("");
  };

  const navItem = (cat: string, count: number) => {
    const on = activeCat === cat;
    return (
      <li key={cat}>
        <a
          href={`#${sectionId(cat)}`}
          aria-current={on ? "location" : undefined}
          onClick={(e) => {
            e.preventDefault();
            jump(cat);
          }}
          style={{ color: on ? t.textPrimary : t.textSecondary, background: on ? mix(t.accent, 10) : "transparent" }}
          className="relative flex items-center justify-between gap-3 rounded-lg py-2 pl-4 pr-3 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span aria-hidden style={{ background: on ? t.accent : "transparent" }} className="absolute inset-y-1.5 left-0 w-[3px] rounded-full" />
          <span className={`min-w-0 truncate ${on ? "font-semibold" : ""}`}>{cat}</span>
          <span className="shrink-0 text-xs tabular-nums opacity-70">{count}</span>
        </a>
      </li>
    );
  };

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="border-b">
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <p.LinkComponent
                to={p.landingHref}
                style={{ color: t.textSecondary }}
                className="text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                ← Back to {p.businessName}
              </p.LinkComponent>
              <h1 className="mt-1 text-3xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-4xl">{p.businessName}</h1>
              <p style={{ color: t.textSecondary }} className="mt-1 text-sm">
                {total} dishes across {p.grouped.length} {p.grouped.length === 1 ? "section" : "sections"}
                {p.phone ? (
                  <>
                    {" "}
                    · <a href={`tel:${p.phone}`} style={{ color: t.accent }} className="underline-offset-4 hover:underline">{p.phone}</a>
                  </>
                ) : null}
              </p>
            </div>
            {p.showSearch && (
              <label className="relative w-full sm:w-80">
                <span className="sr-only">Search the menu</span>
                <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2" style={{ color: t.textSecondary }}>
                  <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={p.searchQuery}
                  onChange={(e) => p.setSearchQuery(e.target.value)}
                  placeholder="Search dishes"
                  style={{ background: t.bg, borderColor: t.border, color: t.textPrimary }}
                  className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none focus-visible:ring-2"
                />
              </label>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {p.hasPopular && (
              <button
                type="button"
                aria-pressed={p.popularOnly}
                onClick={() => p.setPopularOnly(!p.popularOnly)}
                style={p.popularOnly ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { borderColor: t.border, color: t.textSecondary }}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Guest favourites
              </button>
            )}
            <DietaryFilterPills p={p} t={t} />
            {filtersActive && (
              <button type="button" onClick={clearAll} style={{ color: t.accent }} className="text-xs font-semibold underline underline-offset-4">
                Clear filters
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Phones and tablets: a sticky chip bar instead of the rail. */}
      {p.grouped.length > 1 && (
        <nav aria-label="Menu sections" style={{ background: t.surface, borderColor: t.border }} className="sticky top-0 z-30 border-b lg:hidden">
          <div ref={chipBar} className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
            {p.grouped.map(([cat]) => {
              const on = activeCat === cat;
              return (
                <a
                  key={cat}
                  data-chip={cat}
                  href={`#${sectionId(cat)}`}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    jump(cat);
                  }}
                  style={on ? { background: t.textPrimary, color: t.bg, borderColor: t.textPrimary } : { borderColor: t.border, color: t.textSecondary }}
                  className="shrink-0 rounded-full border px-3.5 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {cat}
                </a>
              );
            })}
          </div>
        </nav>
      )}

      <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6 lg:px-8">
        <nav aria-label="Menu sections" className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-6 py-8">
            <p style={{ color: t.textSecondary }} className="mb-3 px-4 text-sm font-semibold">
              On the menu
            </p>
            <ul className="space-y-0.5">{p.grouped.map(([cat, items]) => navItem(cat, items.length))}</ul>
          </div>
        </nav>

        <main className="min-w-0 flex-1 py-8">
          {favourites.length > 0 && (
            <section aria-labelledby="favourites-heading" style={{ background: mix(t.accent, 7), borderColor: mix(t.accent, 25) }} className={`mb-10 border p-4 sm:p-5 ${t.cardStyle}`}>
              <h2 id="favourites-heading" className="text-lg font-semibold">
                Guest favourites
              </h2>
              <p style={{ color: t.textSecondary }} className="text-sm">
                What people order most here.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {favourites.map((item) => (
                  <li key={item.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => p.openItem(item)}
                      style={{ background: t.surface, borderColor: t.border }}
                      className={`flex w-full min-w-0 items-center gap-3 border p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${t.cardStyle}`}
                    >
                      <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="size-12 shrink-0 rounded-[inherit]" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{item.item}</span>
                        <span style={{ color: t.accent }} className="text-sm tabular-nums">
                          {p.currencySymbol}
                          {item.price}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.grouped.length === 0 ? (
            <div style={{ color: t.textSecondary }} className="py-24 text-center">
              <p className="text-lg" style={{ color: t.textPrimary }}>
                No dishes match that.
              </p>
              <p className="mt-1 text-sm">Try another word, or clear the filters to see the whole menu.</p>
              {filtersActive && (
                <button type="button" onClick={clearAll} style={{ background: t.accent, color: t.accentText }} className="mt-5 rounded-full px-5 py-2 text-sm font-semibold">
                  Show the whole menu
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {p.grouped.map(([cat, items]) => (
                <section key={cat} id={sectionId(cat)} data-cat={cat} aria-labelledby={`${sectionId(cat)}-h`} className="scroll-mt-20 lg:scroll-mt-8">
                  <div style={{ borderColor: t.border }} className="mb-5 flex items-baseline justify-between gap-4 border-b pb-3">
                    <h2 id={`${sectionId(cat)}-h`} className="text-2xl font-semibold [overflow-wrap:anywhere]">
                      {cat}
                    </h2>
                    <span style={{ color: t.textSecondary }} className="shrink-0 text-sm tabular-nums">
                      {items.length} {items.length === 1 ? "dish" : "dishes"}
                    </span>
                  </div>
                  <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {items.map((item) => (
                      <li key={item.id} className="min-w-0">
                        <DishCard item={item} p={p} t={t} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
