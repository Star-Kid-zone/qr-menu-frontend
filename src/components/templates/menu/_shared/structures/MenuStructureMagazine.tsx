"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { buildMenuTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";

/** Magazine Menu: a big hero banner up top, then alternating editorial rows —
 * each category gets a full-width image beside its item list, left/right
 * alternating — a browsable "menu as a lookbook" feel. */
export default function MenuStructureMagazine({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: t.textPrimary }} className="min-h-screen pb-32">
      {/* ── Hero banner ── */}
      <section style={{ background: t.sectionBg }} className="px-4 xs:px-5 py-10 text-center sm:px-10">
        <h1 style={{ color: t.textPrimary }} className="break-words text-2xl xs:text-3xl font-bold sm:text-4xl">{p.businessName}</h1>
        <p.LinkComponent to={p.landingHref} style={{ color: t.accent }} className="mt-2 inline-block text-xs font-bold uppercase tracking-widest underline underline-offset-2">← Back to Venue</p.LinkComponent>
        <div className="mx-auto mt-5 max-w-sm">
          <input
            type="search"
            value={p.searchQuery}
            onChange={(e) => p.setSearchQuery(e.target.value)}
            placeholder="Search menu…"
            style={{ background: t.bg, borderColor: t.border, color: t.textPrimary }}
            className="w-full rounded-full border px-5 py-2.5 text-sm outline-none"
          />
        </div>
      </section>

      {/* ── Alternating editorial rows, one per category ── */}
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-10">
        {p.grouped.length === 0 ? (
          <div style={{ color: t.textSecondary }} className="py-24 text-center text-sm italic">No items match your filters.</div>
        ) : (
          p.grouped.map(([cat, items], idx) => {
            const flip = idx % 2 === 1;
            const heroItem = items.find((it: any) => it.image_url || it.imageUrl || it.image || (it.images && it.images.length > 0)) ?? items[0];
            return (
              <section key={cat} className="mb-16">
                <div className={`flex flex-col items-start gap-8 ${flip ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
                  <div className="w-full sm:w-2/5">
                    {heroItem ? (
                      <MenuItemImage item={heroItem} primary={t.accent} secondary={t.textSecondary} className="aspect-[4/3] w-full rounded-2xl object-cover" />
                    ) : (
                      <ImagePlaceholder aspect="portrait" label={cat} className="rounded-2xl text-current" />
                    )}
                  </div>
                  <div className="w-full sm:w-3/5">
                    <h2 style={{ color: t.accent }} className="mb-4 truncate text-xl xs:text-2xl font-bold">{cat}</h2>
                    <div className="space-y-3">
                      {items.map((item, itemIdx) => (
                        <div
                          key={item.id}
                          onClick={() => p.openItem(item)}
                          className="animate-fade-in-up flex cursor-pointer items-baseline justify-between gap-3 border-b pb-2 transition-transform duration-150 ease-out active:scale-[0.98]"
                          style={{ borderColor: t.border, animationDelay: `${Math.min(itemIdx, 8) * 40}ms` }}
                        >
                          <span style={{ color: t.textPrimary }} className="min-w-0 truncate font-semibold">{item.item}</span>
                          <span style={{ color: t.accent }} className="shrink-0 font-mono text-sm font-bold">{p.currencySymbol}{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
