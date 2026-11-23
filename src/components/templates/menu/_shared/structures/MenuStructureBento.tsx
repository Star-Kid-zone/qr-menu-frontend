"use client";

import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { Menu } from "@/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Bento: a tile grid. A large photo tile leads each category, smaller tiles
 * fill around it; dishes without photos become typographic tiles. */

type AnyImg = { image_url?: string | null; imageUrl?: string | null; image?: string | null; images?: unknown };
const hasPhoto = (m: Menu) => {
  const x = m as unknown as AnyImg;
  return !!(x.image_url || x.imageUrl || x.image || (Array.isArray(x.images) && x.images.length));
};

function Tile({ item, t, currency, big, onOpen }: { item: Menu; t: MenuStructureTheme; currency: string; big: boolean; onOpen: () => void }) {
  const soldOut = !item.availability;
  const photo = hasPhoto(item);
  const ring = { outlineColor: t.accent, borderColor: t.border };
  const price = (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
      style={soldOut ? { background: t.surface, color: t.textSecondary } : { background: t.accent, color: t.accentText }}
    >
      {soldOut ? "Sold out" : `${currency}${item.price}`}
    </span>
  );

  if (photo) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`group relative isolate min-w-0 overflow-hidden rounded-2xl border text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${big ? "col-span-2 row-span-2" : ""}`}
        style={ring}
      >
        <MenuItemImage
          item={item}
          primary={t.accent}
          secondary={t.surface}
          className={`absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.04] ${soldOut ? "grayscale" : ""}`}
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {item.popular ? (
          <span className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: t.accent, color: t.accentText }}>
            Popular
          </span>
        ) : null}
        <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 sm:p-4">
          <span className={`line-clamp-2 font-semibold leading-tight text-white ${big ? "text-xl sm:text-2xl" : "text-sm sm:text-base"}`}>{item.item}</span>
          {big && item.description ? <span className="line-clamp-2 text-sm text-white/80">{item.description}</span> : null}
          <span className="flex flex-wrap items-center gap-1.5">
            {price}
            <DietaryBadges item={item} />
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative flex min-w-0 flex-col justify-between gap-2 overflow-hidden rounded-2xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-4 ${big ? "col-span-2 row-span-2" : ""}`}
      style={{
        ...ring,
        background: `linear-gradient(150deg, color-mix(in srgb, ${t.accent} 14%, ${t.surface}), ${t.surface} 70%)`,
      }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-6 select-none text-[5.5rem] font-bold leading-none opacity-[0.08]" style={{ color: t.accent }}>
        {item.item.trim().charAt(0)}
      </span>
      <span className="relative min-w-0">
        {item.popular ? (
          <span className="mb-1 block text-[11px] font-semibold" style={{ color: t.accent }}>
            Popular
          </span>
        ) : null}
        <span className={`line-clamp-3 break-words font-semibold leading-tight ${soldOut ? "opacity-60" : ""} ${big ? "text-xl" : "text-sm sm:text-base"}`} style={{ color: t.textPrimary }}>
          {item.item}
        </span>
        {item.description ? (
          <span className={`mt-1 text-xs ${big ? "line-clamp-4 sm:text-sm" : "line-clamp-2"}`} style={{ color: t.textSecondary }}>
            {item.description}
          </span>
        ) : null}
      </span>
      <span className="relative flex flex-wrap items-center gap-1.5">
        {price}
        <DietaryBadges item={item} />
      </span>
    </button>
  );
}

const GRID = "grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[170px] md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6";

export default function MenuStructureBento({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType || !!p.activeDietaryTag || !!p.searchQuery;
  const popular = filtersActive ? [] : p.grouped.flatMap(([, items]) => items).filter((m) => m.popular).slice(0, 5);

  const clear = () => {
    p.setActiveCategory(null);
    p.setActiveType(null);
    p.setPopularOnly(false);
    p.setActiveDietaryTag(null);
    p.setSearchQuery("");
  };

  const chip = (active: boolean) =>
    active ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { background: t.surface, color: t.textPrimary, borderColor: t.border, outlineColor: t.accent };

  const bigIndex = (items: Menu[]) => Math.max(0, items.findIndex(hasPhoto));

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-dvh overflow-x-clip pb-36">
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ background: `color-mix(in srgb, ${t.surface} 86%, transparent)`, borderColor: t.border }}
      >
        <div className="mx-auto max-w-7xl px-4 pb-3 pt-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold sm:text-2xl">{p.businessName}</h1>
              <div className="flex flex-wrap gap-x-3 text-xs" style={{ color: t.textSecondary }}>
                <p.LinkComponent to={p.landingHref} style={{ color: t.textSecondary }} className="underline-offset-4 hover:underline">
                  Back to {p.businessName}
                </p.LinkComponent>
                {p.phone ? (
                  <a href={`tel:${p.phone}`} className="tabular-nums hover:underline">
                    {p.phone}
                  </a>
                ) : null}
              </div>
            </div>
            {p.showSearch ? (
              <label className="relative w-full sm:w-72">
                <span className="sr-only">Search the menu</span>
                <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke={t.textSecondary} strokeWidth={2} strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  value={p.searchQuery}
                  onChange={(e) => p.setSearchQuery(e.target.value)}
                  placeholder="Search dishes"
                  className="w-full rounded-full border py-2 pl-9 pr-4 text-sm outline-none focus-visible:ring-2"
                  style={{ background: t.bg, borderColor: t.border, color: t.textPrimary, ["--tw-ring-color" as string]: t.accent }}
                />
              </label>
            ) : null}
          </div>
          <nav aria-label="Categories" className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6">
            <div className="flex w-max gap-2">
              <button type="button" aria-pressed={!p.activeCategory} onClick={() => p.setActiveCategory(null)} className="rounded-full border px-3.5 py-1.5 text-sm font-medium focus-visible:outline-2" style={chip(!p.activeCategory)}>
                Everything
              </button>
              {p.filterCategories.map((c) => (
                <button key={c} type="button" aria-pressed={p.activeCategory === c} onClick={() => p.setActiveCategory(p.activeCategory === c ? null : c)} className="whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium focus-visible:outline-2" style={chip(p.activeCategory === c)}>
                  {c}
                </button>
              ))}
            </div>
          </nav>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {p.hasPopular ? (
              <button type="button" aria-pressed={p.popularOnly} onClick={() => p.setPopularOnly(!p.popularOnly)} className="rounded-full border px-3 py-1 text-xs font-medium focus-visible:outline-2" style={chip(p.popularOnly)}>
                Popular only
              </button>
            ) : null}
            <DietaryFilterPills p={p} t={t} />
            {filtersActive ? (
              <button type="button" onClick={clear} className="text-xs underline underline-offset-4" style={{ color: t.textSecondary }}>
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {popular.length >= 2 ? (
          <section aria-labelledby="bento-popular" className="mb-10">
            <h2 id="bento-popular" className="mb-3 text-2xl font-bold">
              Most ordered
            </h2>
            <div className={GRID}>
              {popular.map((item, i) => (
                <Tile key={`pop-${item.id}`} item={item} t={t} currency={p.currencySymbol} big={i === 0} onOpen={() => p.openItem(item)} />
              ))}
            </div>
          </section>
        ) : null}

        {p.grouped.length === 0 ? (
          <div className="rounded-2xl border py-16 text-center" style={{ borderColor: t.border, background: t.surface }}>
            <p className="text-lg font-semibold">No dishes match these filters.</p>
            {filtersActive ? (
              <button type="button" onClick={clear} className="mt-4 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: t.accent, color: t.accentText }}>
                Show all dishes
              </button>
            ) : null}
          </div>
        ) : (
          p.grouped.map(([cat, items]) => {
            const lead = items.length >= 3 ? bigIndex(items) : -1;
            return (
              <section key={cat} aria-labelledby={`bento-${cat}`} className="mb-10">
                <div className="mb-3 flex items-baseline gap-3">
                  <h2 id={`bento-${cat}`} className="text-2xl font-bold">
                    {cat}
                  </h2>
                  <span className="text-sm tabular-nums" style={{ color: t.textSecondary }}>
                    {items.length} {items.length === 1 ? "dish" : "dishes"}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1" style={{ background: t.border }} />
                </div>
                <div className={GRID}>
                  {items.map((item, i) => (
                    <Tile key={item.id} item={item} t={t} currency={p.currencySymbol} big={i === lead} onOpen={() => p.openItem(item)} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
