"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Compact Table: dense single-column rows with a dotted leader between name
 * and price, minimal imagery — reads like a printed menu card rather than an
 * app UI. The most text-first, least visual of the 10 structures. */
export default function MenuStructureCompact({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header className="px-4 xs:px-5 py-8 text-center sm:px-10">
        <h1 style={{ color: t.textPrimary }} className="break-words text-xl xs:text-2xl font-bold tracking-wide">{p.businessName}</h1>
        <p.LinkComponent to={p.landingHref} style={{ color: t.accent }} className="mt-1 inline-block text-xs underline underline-offset-2 opacity-70">← Back to Venue</p.LinkComponent>
        <div className="mx-auto mt-4 max-w-xs">
          <input
            type="search"
            value={p.searchQuery}
            onChange={(e) => p.setSearchQuery(e.target.value)}
            placeholder="Search…"
            style={{ borderColor: t.border, color: t.textPrimary, background: "transparent" }}
            className="w-full rounded-full border px-4 py-1.5 text-xs outline-none"
          />
        </div>
        <div className="mt-3 flex justify-center">
          <DietaryFilterPills p={p} t={t} />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6 sm:px-10">
        {p.grouped.length === 0 ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
        ) : (
          p.grouped.map(([cat, items]) => (
            <section key={cat} className="mb-10">
              <h2 style={{ color: t.accent }} className="mb-4 text-center text-xs font-black uppercase tracking-[0.4em]">{cat}</h2>
              <div className="space-y-3">
                {items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    onClick={() => p.openItem(item)}
                    style={{ animationDelay: `${Math.min(itemIdx, 8) * 40}ms` }}
                    className="animate-fade-in-up cursor-pointer transition-opacity duration-150 ease-out active:opacity-70"
                  >
                    <div className="flex items-end gap-2">
                      <span style={{ color: t.textPrimary }} className="min-w-0 max-w-[60%] truncate font-semibold xxs:max-w-[55%]">{item.item}</span>
                      <span style={{ borderColor: t.border }} className="flex-1 border-b border-dotted translate-y-[-3px]" />
                      <span style={{ color: t.accent }} className="shrink-0 font-mono text-sm font-bold">{p.currencySymbol}{item.price}</span>
                    </div>
                    {item.description && <p style={{ color: t.textSecondary }} className="mt-0.5 text-xs italic">{item.description}</p>}
                    <DietaryBadges item={item} className="mt-1.5" />
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
