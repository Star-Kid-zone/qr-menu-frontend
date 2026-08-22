"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";

/** Tabbed Categories: a horizontal scrollable tab bar (not chips) where
 * content swaps to show exactly one category at a time — a top-nav analog
 * of the Sidebar structure, for narrower viewports/simpler menus. */
export default function MenuStructureTabs({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  const activeCat = p.activeCategory ?? p.allCategories[0] ?? null;
  const visibleGroup = p.grouped.find(([cat]) => cat === activeCat) ?? p.grouped[0];

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="sticky top-0 z-20 border-b px-4 pt-4">
        <div className="mx-auto max-w-2xl">
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
            className="mt-3 w-full rounded-full border px-5 py-2.5 text-sm outline-none"
          />
          <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto border-b" style={{ borderColor: t.border }}>
            {p.allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => p.setActiveCategory(cat)}
                style={activeCat === cat ? { color: t.accent, borderColor: t.accent } : { color: t.textSecondary, borderColor: "transparent" }}
                className="shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {!visibleGroup ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
        ) : (
          <div className="space-y-3">
            {visibleGroup[1].map((item, itemIdx) => (
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
        )}
      </main>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
