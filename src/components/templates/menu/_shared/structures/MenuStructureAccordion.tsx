"use client";

import { useState } from "react";
import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Accordion Categories: each category collapses/expands independently
 * (several can be open at once) instead of a persistent scroll or a
 * single-category-at-a-time tab/sidebar — compact, keyboard-friendly browsing. */
export default function MenuStructureAccordion({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const [openCats, setOpenCats] = useState<Set<string>>(() => new Set(p.grouped[0] ? [p.grouped[0][0]] : []));

  const toggle = (cat: string) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header style={{ background: t.surface, borderColor: t.border }} className="border-b px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 style={{ color: t.textPrimary }} className="truncate text-lg xs:text-xl font-bold">{p.businessName}</h1>
              <p.LinkComponent to={p.landingHref} style={{ color: t.accent }} className="text-xs underline underline-offset-2 opacity-70">← Back to Venue</p.LinkComponent>
            </div>
          </div>
          <input
            type="search"
            value={p.searchQuery}
            onChange={(e) => p.setSearchQuery(e.target.value)}
            placeholder="Search menu…"
            style={{ background: t.sectionBg, borderColor: t.border, color: t.textPrimary }}
            className="mt-3 w-full rounded-full border px-5 py-2.5 text-sm outline-none"
          />
          <div className="mt-2">
            <DietaryFilterPills p={p} t={t} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {p.grouped.length === 0 ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
        ) : (
          <div className="space-y-3">
            {p.grouped.map(([cat, items]) => {
              const isOpen = openCats.has(cat);
              return (
                <div key={cat} style={{ borderColor: t.border }} className="overflow-hidden rounded-xl border">
                  <button onClick={() => toggle(cat)} style={{ background: t.surface, color: t.textPrimary }} className="flex w-full items-center justify-between gap-2 px-4 xs:px-5 py-4 text-left">
                    <span className="min-w-0 truncate text-sm font-black uppercase tracking-widest" style={{ color: t.accent }}>{cat}</span>
                    <span className="flex shrink-0 items-center gap-2 text-xs" style={{ color: t.textSecondary }}>
                      {items.length} item{items.length !== 1 ? "s" : ""}
                      <span style={{ transform: isOpen ? "rotate(180deg)" : "none" }} className="transition-transform">▾</span>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="space-y-2 p-3 xs:p-4 pt-0">
                      {items.map((item, itemIdx) => (
                        <div
                          key={item.id}
                          onClick={() => p.openItem(item)}
                          style={{ background: t.sectionBg, animationDelay: `${Math.min(itemIdx, 8) * 40}ms` }}
                          className="animate-fade-in-up flex cursor-pointer gap-3 rounded-lg p-3 transition-transform duration-150 ease-out active:scale-[0.98]"
                        >
                          <MenuItemImage item={item} primary={t.accent} secondary={t.textSecondary} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 style={{ color: t.textPrimary }} className="min-w-0 truncate text-sm font-bold">{item.item}</h3>
                              <span style={{ color: t.accent }} className="shrink-0 font-mono text-xs font-bold">{p.currencySymbol}{item.price}</span>
                            </div>
                            {item.description && <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-1 text-xs">{item.description}</p>}
                            <DietaryBadges item={item} className="mt-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
