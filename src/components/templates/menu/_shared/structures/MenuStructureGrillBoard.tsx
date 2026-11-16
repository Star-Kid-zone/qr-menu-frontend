"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { itemImage } from "@/components/site-system/kit/content";
import { displayStyle, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, hasOptions, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "grill-board";
const R = "calc(var(--site-radius, 8px) * 0.5)";

/**
 * Grill board (pairs with Ember): price tiles you can read from across the
 * room — the price set largest, then the name, then the details. Sizes get a
 * row of their own on the tile. The category bar stays at the top.
 */
export default function MenuStructureGrillBoard({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header style={{ background: tv.text, color: tv.bg }}>
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-5 sm:px-8">
          <MenuTopLinks p={p} inverse />
          <h1 className="mt-8" style={displayStyle("clamp(2.6rem, 1.6rem + 4.4vw, 5.5rem)", { color: tv.bg, lineHeight: 0.92, letterSpacing: "-0.02em" })}>{p.businessName}</h1>
          <p className="mt-2" style={{ color: mixv(tv.bg, "transparent", 70) }}>{look.business.terms.catalogLabel}</p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
        <MenuFilters sys={sys} className="max-w-2xl" />
      </div>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => (
          <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className="mb-14 scroll-mt-28">
            <h2 id={`${catId(cat)}-h`} className="mb-5 inline-block -skew-x-[10deg] px-4 py-1" style={{ background: tv.accent, color: tv.accentText }}>
              <span className="inline-block skew-x-[10deg]" style={displayStyle("clamp(1.4rem, 1.2rem + 0.8vw, 1.9rem)", { color: tv.accentText })}>{cat}</span>
            </h2>
            <ul className="grid grid grid-cols-1-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {items.map((item) => (
                <li key={item.id} className="min-w-0">
                  <div
                    {...openable(p, item)}
                    className="group flex h-full cursor-pointer flex-col overflow-hidden border focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ background: tv.surface, borderColor: mixv(tv.border, "transparent", 70), borderRadius: R, opacity: item.availability ? 1 : 0.6, ...focusRing }}
                  >
                    {itemImage(item) ? <MenuItemImage item={item} primary={tv.accent} secondary={tv.muted} className="sk-zoom aspect-[16/10] w-full" /> : null}
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      {hasOptions(item) ? (
                        <dl className="flex flex-wrap gap-x-4 gap-y-1">
                          {item.priceOptions!.map((o) => (
                            <div key={o.label}>
                              <dt className="text-xs" style={{ color: tv.muted }}>{o.label}</dt>
                              <dd className="tabular-nums" style={displayStyle("clamp(1.4rem, 1.2rem + 0.8vw, 1.9rem)", { color: tv.accent, lineHeight: 1 })}>{p.currencySymbol}{o.price}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="tabular-nums" style={displayStyle("clamp(1.8rem, 1.4rem + 1.4vw, 2.6rem)", { color: tv.accent, lineHeight: 1 })}>
                          {p.currencySymbol}
                          {item.price}
                        </p>
                      )}
                      <h3 className="mt-2 font-semibold leading-snug" style={{ color: tv.text }}>{item.item}</h3>
                      {item.description ? <p className="mt-1 line-clamp-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
                      <ItemTags item={item} className="mt-auto pt-2" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </MenuColumns>
    </MenuShell>
  );
}
