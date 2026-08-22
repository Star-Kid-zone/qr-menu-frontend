"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";

/** Masonry Gallery: a Pinterest-style masonry grid of dish photos with the
 * name/price overlaid at the bottom of each tile — visual-first browsing,
 * category filters as pills up top, tap opens the shared item-detail modal. */
export default function MenuStructureMasonry({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
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
            {p.hasPopular && (
              <button onClick={() => p.setPopularOnly(!p.popularOnly)} style={p.popularOnly ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }} className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${p.popularOnly ? "" : "border"}`}>⭐ Popular</button>
            )}
            {p.allCategories.map((cat) => (
              <button key={cat} onClick={() => p.setActiveCategory(p.activeCategory === cat ? null : cat)} style={p.activeCategory === cat ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }} className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${p.activeCategory === cat ? "" : "border"}`}>{cat}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {allItems.length === 0 ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
        ) : (
          <div className="columns-2 gap-3 xs:gap-4 sm:columns-3 lg:columns-4">
            {allItems.map((item, i) => (
              <div
                key={item.id}
                onClick={() => p.openItem(item)}
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                className={`animate-fade-in-up relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
              >
                <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="truncate text-sm font-bold text-white">{item.item}</p>
                  <p className="font-mono text-xs font-bold text-white/90">{p.currencySymbol}{item.price}</p>
                </div>
                {item.popular && (
                  <span style={{ background: t.accent, color: t.accentText }} className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-black">⭐</span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
