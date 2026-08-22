"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";

/** List Classic: the intentional, named version of a single-column grouped
 * item list with top filter chips — the baseline browsing pattern, now
 * explicitly selectable alongside the other 9 structures. */
export default function MenuStructureList({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType;

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="sticky top-0 z-20 border-b px-4 py-4 backdrop-blur">
        <div className="mx-auto max-w-2xl space-y-3">
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
            className="w-full rounded-full border px-5 py-2.5 text-sm outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {p.hasPopular && (
              <button onClick={() => p.setPopularOnly(!p.popularOnly)} style={p.popularOnly ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }} className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${p.popularOnly ? "" : "border"}`}>
                ⭐ Popular
              </button>
            )}
            {p.allCategories.length > 1 && p.allCategories.map((cat) => (
              <button key={cat} onClick={() => p.setActiveCategory(p.activeCategory === cat ? null : cat)} style={p.activeCategory === cat ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }} className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${p.activeCategory === cat ? "" : "border"}`}>
                {cat}
              </button>
            ))}
            {filtersActive && (
              <button onClick={() => { p.setActiveCategory(null); p.setActiveType(null); p.setPopularOnly(false); }} style={{ color: t.textSecondary }} className="text-[10px] uppercase tracking-widest underline underline-offset-2 opacity-70">
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {p.grouped.length === 0 ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center">
            <p className="mb-3 text-4xl">🍽</p>
            <p className="text-sm italic">No items match your filters.</p>
          </div>
        ) : (
          p.grouped.map(([cat, items]) => (
            <section key={cat} className="mb-10">
              <div style={{ borderColor: t.border }} className="mb-4 border-b pb-2">
                <h2 style={{ color: t.accent }} className="text-[10px] font-black uppercase tracking-[0.4em]">{cat}</h2>
              </div>
              <div className="space-y-2">
                {items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    onClick={() => p.openItem(item)}
                    style={{ background: t.surface, borderColor: t.border, animationDelay: `${Math.min(itemIdx, 8) * 40}ms` }}
                    className="animate-fade-in-up flex cursor-pointer gap-4 rounded-xl border p-3 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                  >
                    <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 style={{ color: t.textPrimary }} className="min-w-0 truncate font-bold">{item.item}</h3>
                        <span style={{ color: t.accent }} className="shrink-0 font-mono text-sm font-bold">{p.currencySymbol}{item.price}</span>
                      </div>
                      {item.description && <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-xs">{item.description}</p>}
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
