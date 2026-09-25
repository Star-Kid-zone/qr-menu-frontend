"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Sidebar Categories: a sticky left category nav; the right pane shows only
 * the selected category's items (not an all-categories scroll) — closer to a
 * real restaurant ordering app than a scrollable printed menu. */
export default function MenuStructureSidebar({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  const activeCat = p.activeCategory ?? p.allCategories[0] ?? null;
  const visibleGroup = p.grouped.find(([cat]) => cat === activeCat) ?? p.grouped[0];

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="border-b px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 style={{ color: t.textPrimary }} className="truncate text-lg xs:text-xl font-bold">{p.businessName}</h1>
            <p.LinkComponent to={p.landingHref} style={{ color: t.accent }} className="text-xs underline underline-offset-2 opacity-70">← Back to Venue</p.LinkComponent>
          </div>
          <input
            type="search"
            value={p.searchQuery}
            onChange={(e) => p.setSearchQuery(e.target.value)}
            placeholder="Search…"
            style={{ background: t.sectionBg, borderColor: t.border, color: t.textPrimary }}
            className="w-24 min-w-0 shrink rounded-full border px-3 py-2 text-sm outline-none xs:w-32 sm-mobile:w-40 sm:w-64"
          />
        </div>
        <div className="mx-auto mt-2 max-w-5xl">
          <DietaryFilterPills p={p} t={t} />
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl">
        {/* ── Sticky left category nav ── */}
        <aside style={{ borderColor: t.border }} className="hidden w-48 shrink-0 border-r py-6 sm:block">
          <nav className="sticky top-6 space-y-1 px-3">
            {p.allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => p.setActiveCategory(cat)}
                style={activeCat === cat ? { background: t.accent, color: t.accentText } : { color: t.textSecondary }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold"
              >
                {cat}
              </button>
            ))}
            {p.hasPopular && (
              <button onClick={() => p.setPopularOnly(!p.popularOnly)} style={p.popularOnly ? { background: t.accent, color: t.accentText } : { color: t.textSecondary }} className="mt-3 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold">
                ⭐ Popular Only
              </button>
            )}
          </nav>
        </aside>

        {/* ── Right pane: selected category only ── */}
        <main className="flex-1 px-4 py-6 sm:px-8">
          {/* Mobile category selector */}
          <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto sm:hidden">
            {p.allCategories.map((cat) => (
              <button key={cat} onClick={() => p.setActiveCategory(cat)} style={activeCat === cat ? { background: t.accent, color: t.accentText } : { borderColor: t.border, color: t.textSecondary }} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${activeCat === cat ? "" : "border"}`}>
                {cat}
              </button>
            ))}
          </div>

          {!visibleGroup ? (
            <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
          ) : (
            <>
              <h2 style={{ color: t.accent }} className="mb-5 truncate text-lg font-black uppercase tracking-widest">{visibleGroup[0]}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleGroup[1].map((item, itemIdx) => (
                  <div
                    key={item.id}
                    onClick={() => p.openItem(item)}
                    style={{ background: t.surface, borderColor: t.border, animationDelay: `${Math.min(itemIdx, 8) * 40}ms` }}
                    className="animate-fade-in-up flex cursor-pointer gap-4 rounded-xl border p-4 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                  >
                    <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 style={{ color: t.textPrimary }} className="min-w-0 truncate text-sm font-bold">{item.item}</h3>
                        <span style={{ color: t.accent }} className="shrink-0 font-mono text-sm font-bold">{p.currencySymbol}{item.price}</span>
                      </div>
                      {item.description && <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-xs">{item.description}</p>}
                      <DietaryBadges item={item} className="mt-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
