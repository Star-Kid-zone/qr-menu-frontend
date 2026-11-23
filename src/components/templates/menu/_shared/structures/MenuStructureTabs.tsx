"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";
import { EmptyResults, MenuHeaderTop, MenuSearch, PopularMark, UnavailableMark, clearAll, dishActivation, mix } from "./MenuStructureList";

/** Tabs: app-like. One category at a time, chosen from a sticky segmented bar
 * whose highlight slides to the chosen tab. */
export default function MenuStructureTabs({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  const activeCat = p.activeCategory ?? p.allCategories[0] ?? null;
  const visibleGroup = p.grouped.find(([cat]) => cat === activeCat) ?? p.grouped[0];
  const filtersActive = p.popularOnly || !!p.activeType || !!p.activeDietaryTag || !!p.searchQuery;

  const bar = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);

  // Slide the highlight under the active tab and keep that tab fully in view.
  useEffect(() => {
    const el = bar.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || !pill.current) return;
    pill.current.style.width = `${el.offsetWidth}px`;
    pill.current.style.transform = `translateX(${el.offsetLeft}px)`;
    pill.current.style.opacity = "1";
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeCat, p.allCategories.length]);

  const select = (cat: string, focus = false) => {
    p.setActiveCategory(cat);
    if (focus) bar.current?.querySelector<HTMLElement>(`[data-tab="${CSS.escape(cat)}"]`)?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const n = p.allCategories.length;
    const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    select(p.allCategories[to], true);
  };

  const items = visibleGroup?.[1] ?? [];

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh overflow-x-clip pb-32">
      <header style={{ background: mix(t.surface, "transparent", 94), borderColor: t.border }} className="sticky top-0 z-20 border-b backdrop-blur-md">
        <div className="mx-auto max-w-6xl space-y-3 px-4 pt-4 sm:px-6">
          <MenuHeaderTop p={p} t={t} />
          <MenuSearch p={p} t={t} />

          <div
            className="no-scrollbar -mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
            style={{ maskImage: "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 32px), transparent)" }}
          >
            <div
              ref={bar}
              role="tablist"
              aria-label="Menu categories"
              style={{ background: mix(t.textPrimary, t.surface, 6) }}
              className="relative inline-flex min-w-max gap-0.5 rounded-full p-1"
            >
              <span
                ref={pill}
                aria-hidden="true"
                style={{ background: t.surface, boxShadow: `0 1px 3px ${mix(t.textPrimary, "transparent", 18)}`, opacity: 0, width: 0 }}
                className="absolute inset-y-1 left-0 rounded-full motion-safe:transition-[transform,width] motion-safe:duration-300 motion-safe:ease-out"
              />
              {p.allCategories.map((cat, i) => {
                const on = cat === activeCat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    data-tab={cat}
                    id={`tab-${i}`}
                    aria-selected={on}
                    aria-controls="tab-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(cat)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    style={{ color: on ? t.textPrimary : t.textSecondary }}
                    className="relative z-10 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1"
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main
        id="tab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${Math.max(0, p.allCategories.indexOf(activeCat ?? ""))}`}
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <h2 style={{ color: t.textPrimary }} className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
              {visibleGroup?.[0] ?? activeCat}
            </h2>
            <p style={{ color: t.textSecondary }} className="mt-1 text-sm">
              {items.length} {items.length === 1 ? "dish" : "dishes"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {p.hasPopular ? (
              <button
                type="button"
                aria-pressed={p.popularOnly}
                onClick={() => p.setPopularOnly(!p.popularOnly)}
                style={p.popularOnly ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { color: t.textSecondary, borderColor: t.border }}
                className="rounded-full border px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Popular only
              </button>
            ) : null}
            {filtersActive ? (
              <button type="button" onClick={() => clearAll(p)} style={{ color: t.accent }} className="px-1 text-[13px] font-medium underline underline-offset-4 focus-visible:outline-2">
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
        <div className="mb-6">
          <DietaryFilterPills p={p} t={t} />
        </div>

        {!visibleGroup || items.length === 0 ? (
          <EmptyResults p={p} t={t} />
        ) : (
          <ul key={visibleGroup[0]} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, idx) => {
              const off = !item.availability;
              return (
                <li key={item.id} className="min-w-0">
                  <div
                    {...dishActivation(p, item)}
                    style={{
                      background: t.surface,
                      borderColor: t.border,
                      opacity: off ? 0.55 : 1,
                      animationDelay: `${Math.min(idx, 8) * 35}ms`,
                    }}
                    className={`group flex h-full min-w-0 cursor-pointer gap-3 border p-3 sm:gap-4 sm:p-4 ${t.cardStyle} motion-safe:animate-fade-in-up motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2`}
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 style={{ color: t.textPrimary }} className="line-clamp-2 break-words font-semibold leading-snug">
                        {item.item}
                      </h3>
                      {item.description ? (
                        <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-sm leading-relaxed">{item.description}</p>
                      ) : null}
                      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                        <span style={{ color: t.accent }} className="mr-1 font-semibold tabular-nums">
                          {p.currencySymbol}{item.price}
                        </span>
                        {item.popular ? <PopularMark t={t} /> : null}
                        {off ? <UnavailableMark t={t} /> : null}
                        <DietaryBadges item={item} />
                      </div>
                    </div>
                    <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="size-24 shrink-0 self-start rounded-lg object-cover sm:size-28" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
