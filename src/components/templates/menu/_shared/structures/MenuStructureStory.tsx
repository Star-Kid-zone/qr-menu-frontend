"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Story Menu: each category is its own full-width banner section with a
 * short intro line, items listed beneath — mirrors the landing page's
 * Storytelling structure but applied to menu categories instead of a
 * business narrative. */
export default function MenuStructureStory({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      <header className="px-4 xs:px-5 py-12 text-center sm:px-10">
        <h1 style={{ color: t.textPrimary }} className="break-words text-2xl xs:text-3xl font-bold sm:text-5xl">{p.businessName}</h1>
        <p.LinkComponent to={p.landingHref} style={{ color: t.accent }} className="mt-2 inline-block text-xs font-bold uppercase tracking-widest underline underline-offset-2">← Back to Venue</p.LinkComponent>
        <div className="mx-auto mt-6 max-w-sm">
          <input
            type="search"
            value={p.searchQuery}
            onChange={(e) => p.setSearchQuery(e.target.value)}
            placeholder="Search menu…"
            style={{ background: t.sectionBg, borderColor: t.border, color: t.textPrimary }}
            className="w-full rounded-full border px-5 py-2.5 text-sm outline-none"
          />
        </div>
        <div className="mt-4 flex justify-center">
          <DietaryFilterPills p={p} t={t} />
        </div>
      </header>

      {p.grouped.length === 0 ? (
        <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
      ) : (
        p.grouped.map(([cat, items], idx) => {
          const banner = items.find((it) => it.image_url || it.imageUrl || it.image || (it.images && it.images.length > 0));
          return (
            <section key={cat} style={{ background: idx % 2 === 0 ? t.bg : t.sectionBg }} className="px-4 xs:px-5 py-14 sm:px-10">
              <div className="mx-auto max-w-3xl">
                <div className="mb-8 overflow-hidden rounded-2xl">
                  {banner ? (
                    <MenuItemImage item={banner} primary={t.accent} secondary={t.textSecondary} className="h-40 w-full object-cover xs:h-48" />
                  ) : (
                    <ImagePlaceholder aspect="wide" label={cat} className="text-current" />
                  )}
                </div>
                <h2 style={{ color: t.accent }} className="mb-6 break-words text-xl xs:text-2xl font-bold">{cat}</h2>
                <div className="space-y-4">
                  {items.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      onClick={() => p.openItem(item)}
                      className="animate-fade-in-up flex cursor-pointer items-start justify-between gap-4 border-b pb-4 transition-[transform,opacity] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ borderColor: t.border, animationDelay: `${Math.min(itemIdx, 8) * 40}ms` }}
                    >
                      <div className="min-w-0">
                        <h3 style={{ color: t.textPrimary }} className="font-bold">{item.item}</h3>
                        {item.description && <p style={{ color: t.textSecondary }} className="mt-1 text-sm leading-relaxed">{item.description}</p>}
                        <DietaryBadges item={item} className="mt-1.5" />
                      </div>
                      <span style={{ color: t.accent }} className="shrink-0 font-mono font-bold">{p.currencySymbol}{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
