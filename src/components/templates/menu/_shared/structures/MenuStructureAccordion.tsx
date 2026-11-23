"use client";

import { useState } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { Menu } from "@/types";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

const panelId = (cat: string) => `acc-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "other"}`;
const mix = (a: string, pct: number, b = "transparent") => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

function DishRow({ item, p, t }: { item: Menu; p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  const unavailable = item.availability === false;
  return (
    <button
      type="button"
      onClick={() => p.openItem(item)}
      style={{ color: t.textPrimary, opacity: unavailable ? 0.6 : 1 }}
      className="flex w-full min-w-0 items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[color-mix(in_srgb,currentColor_5%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="size-16 shrink-0 rounded-lg" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0 text-[15px] font-semibold leading-snug [overflow-wrap:anywhere]">{item.item}</span>
          <span style={{ color: t.accent }} className="shrink-0 text-[15px] font-semibold tabular-nums">
            {p.currencySymbol}
            {item.price}
          </span>
        </span>
        {item.description ? (
          <span style={{ color: t.textSecondary }} className="mt-0.5 truncate text-[13px]">
            {item.description}
          </span>
        ) : null}
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5 empty:hidden">
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
 * Accordion: built for long menus on phones. Each section folds away, and its
 * header previews a few dishes so guests know what is inside before opening.
 */
export default function MenuStructureAccordion({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const [openCats, setOpenCats] = useState<Set<string>>(() => new Set(p.grouped[0] ? [p.grouped[0][0]] : []));

  const filtersActive = p.popularOnly || Boolean(p.activeType) || Boolean(p.activeDietaryTag) || Boolean(p.searchQuery.trim());
  // While searching or filtering, every matching section is shown open.
  const isOpen = (cat: string) => filtersActive || openCats.has(cat);
  const allOpen = p.grouped.length > 0 && p.grouped.every(([cat]) => isOpen(cat));

  const toggle = (cat: string) =>
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });

  const clearAll = () => {
    p.setPopularOnly(false);
    p.setActiveType(null);
    p.setActiveDietaryTag(null);
    p.setSearchQuery("");
  };

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="border-b">
        <div className="mx-auto max-w-4xl px-4 pb-5 pt-6 sm:px-6">
          <p.LinkComponent
            to={p.landingHref}
            style={{ color: t.textSecondary }}
            className="text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ← Back to {p.businessName}
          </p.LinkComponent>
          <h1 className="mt-1 text-3xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-4xl">{p.businessName}</h1>
          {p.phone ? (
            <p style={{ color: t.textSecondary }} className="mt-1 text-sm">
              Questions about a dish? Call{" "}
              <a href={`tel:${p.phone}`} style={{ color: t.accent }} className="underline-offset-4 hover:underline">
                {p.phone}
              </a>
            </p>
          ) : null}
          {p.showSearch && (
            <label className="relative mt-4 block">
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
          <div className="mt-3 flex flex-wrap items-center gap-2">
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

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
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
          <>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p style={{ color: t.textSecondary }} className="text-sm">
                {p.grouped.length} {p.grouped.length === 1 ? "section" : "sections"}
              </p>
              {!filtersActive && p.grouped.length > 1 && (
                <button
                  type="button"
                  onClick={() => setOpenCats(allOpen ? new Set() : new Set(p.grouped.map(([c]) => c)))}
                  style={{ color: t.accent }}
                  className="rounded text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {allOpen ? "Collapse all" : "Expand all"}
                </button>
              )}
            </div>
            <div className="space-y-3">
              {p.grouped.map(([cat, items]) => {
                const open = isOpen(cat);
                const thumbs = items.filter((i) => i.image_url).slice(0, 4);
                return (
                  <section key={cat} style={{ background: t.surface, borderColor: open ? mix(t.accent, 35, t.border) : t.border }} className={`overflow-hidden border transition-colors ${t.cardStyle}`}>
                    <h2>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId(cat)}
                        onClick={() => toggle(cat)}
                        disabled={filtersActive}
                        className="flex w-full min-w-0 items-center gap-3 px-4 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:cursor-default sm:px-5"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-lg font-semibold [overflow-wrap:anywhere]">{cat}</span>
                          <span style={{ color: t.textSecondary }} className="block text-sm">
                            {items.length} {items.length === 1 ? "dish" : "dishes"}
                          </span>
                        </span>
                        {thumbs.length > 0 && (
                          <span aria-hidden className={`hidden shrink-0 -space-x-2 xs:flex transition-opacity motion-safe:duration-200 ${open ? "opacity-0" : "opacity-100"}`}>
                            {thumbs.map((i) => (
                              <MenuItemImage
                                key={i.id}
                                item={i}
                                primary={t.accent}
                                secondary={t.textSecondary}
                                className="size-9 rounded-full ring-2 ring-black/5"
                              />
                            ))}
                          </span>
                        )}
                        <svg
                          aria-hidden
                          viewBox="0 0 20 20"
                          style={{ color: t.textSecondary }}
                          className={`size-5 shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${open ? "rotate-180" : ""}`}
                        >
                          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </h2>
                    <div
                      id={panelId(cat)}
                      role="region"
                      aria-label={cat}
                      hidden={!open}
                      className="grid motion-safe:animate-[acc-in_200ms_ease-out]"
                    >
                      <ul style={{ borderColor: t.border }} className="grid gap-x-4 gap-y-1 border-t p-2 sm:p-3 md:grid-cols-2">
                        {items.map((item) => (
                          <li key={item.id} className="min-w-0">
                            <DishRow item={item} p={p} t={t} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>
      <style>{`@keyframes acc-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
