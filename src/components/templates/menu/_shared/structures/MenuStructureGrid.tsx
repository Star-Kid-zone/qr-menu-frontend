"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Grid Cards: image-forward 2-3 column item grid instead of vertical rows —
 * more like a product catalog than a printed menu list. */
export default function MenuStructureGrid({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="border-b px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 style={{ color: t.textPrimary }} className="truncate text-lg xs:text-xl font-bold">{p.businessName}</h1>
              <p.LinkComponent to={p.landingHref} style={{ color: t.accent }} className="text-xs underline underline-offset-2 opacity-70">← Back to Venue</p.LinkComponent>
            </div>
            {p.phone && <a href={`tel:${p.phone}`} style={{ color: t.textSecondary }} className="shrink-0 text-xs opacity-70">{p.phone}</a>}
          </div>
          <input
            type="search"
            value={p.searchQuery}
            onChange={(e) => p.setSearchQuery(e.target.value)}
            placeholder="Search menu…"
            style={{ background: t.sectionBg, borderColor: t.border, color: t.textPrimary }}
            className="mt-3 w-full max-w-sm rounded-full border px-5 py-2 text-sm outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {p.hasPopular && (
              <button onClick={() => p.setPopularOnly(!p.popularOnly)} style={p.popularOnly ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }} className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${p.popularOnly ? "" : "border"}`}>⭐ Popular</button>
            )}
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
        {p.grouped.length === 0 ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
        ) : (
          p.grouped.map(([cat, items]) => (
            <section key={cat} className="mb-10">
              <h2 style={{ color: t.accent }} className="mb-4 text-[10px] font-black uppercase tracking-[0.4em]">{cat}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => p.openItem(item)}
                    style={{ background: t.surface, borderColor: t.border, animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                    className="animate-fade-in-up cursor-pointer overflow-hidden rounded-xl border transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                  >
                    <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-32 w-full object-cover" />
                    <div className="p-2 xs:p-3">
                      <h3 style={{ color: t.textPrimary }} className="truncate text-sm font-bold">{item.item}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <span style={{ color: t.accent }} className="font-mono text-sm font-bold">{p.currencySymbol}{item.price}</span>
                        {item.popular && <span style={{ background: t.accent, color: t.accentText }} className="rounded-full px-1.5 py-0.5 text-[9px] font-black">⭐</span>}
                      </div>
                      <DietaryBadges item={item} className="mt-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
