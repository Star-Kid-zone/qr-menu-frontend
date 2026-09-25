"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Bento Menu: a dashboard-style grid where popular items get large tiles and
 * regular items get smaller tiles, category filters as pills — the dish
 * equivalent of the landing page's Bento Dashboard structure. */
export default function MenuStructureBento({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const allItems = p.grouped.flatMap(([, items]) => items);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="border-b px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 style={{ color: t.textPrimary }} className="truncate text-lg xs:text-xl font-bold">{p.businessName}</h1>
              <p.LinkComponent to={p.landingHref} style={{ color: t.accent }} className="text-xs underline underline-offset-2 opacity-70">← Back to Venue</p.LinkComponent>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.allCategories.map((cat) => (
              <button key={cat} onClick={() => p.setActiveCategory(p.activeCategory === cat ? null : cat)} style={p.activeCategory === cat ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }} className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${p.activeCategory === cat ? "" : "border"}`}>{cat}</button>
            ))}
          </div>
          <div className="mt-2">
            <DietaryFilterPills p={p} t={t} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {allItems.length === 0 ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
        ) : (
          <div className="grid auto-rows-[110px] grid-cols-2 gap-2.5 xxs:auto-rows-[120px] xs:auto-rows-[130px] xs:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:auto-rows-[150px]">
            {allItems.map((item, idx) => {
              const big = item.popular;
              return (
                <div
                  key={item.id}
                  onClick={() => p.openItem(item)}
                  style={{ borderColor: t.border, animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                  className={`animate-fade-in-up relative cursor-pointer overflow-hidden rounded-xl border transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] ${big ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
                >
                  <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2.5">
                    <p className={`truncate font-bold text-white ${big ? "text-base" : "text-xs"}`}>{item.item}</p>
                    <p className="font-mono text-xs font-bold text-white/90">{p.currencySymbol}{item.price}</p>
                    <DietaryBadges item={item} className="mt-1 text-white" />
                  </div>
                  {item.popular && <span style={{ background: t.accent, color: t.accentText }} className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-black">⭐ Popular</span>}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
