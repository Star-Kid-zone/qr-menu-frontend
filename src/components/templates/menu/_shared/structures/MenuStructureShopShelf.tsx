"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import type { Menu } from "@/types";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { detail, itemChips } from "@/components/site-system/menu-kit/attributes";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, Price, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "shop-shelf";

/** Stock as the owner set it: true / false, or unknown (nothing shown). */
function stockOf(item: Menu): boolean | null {
  const v = item.attributes?.product?.inStock;
  return v === true ? true : v === false ? false : null;
}

/**
 * Shop shelf (wine shops, delis, chocolatiers, hampers): products on a grid —
 * photo, maker, name, size and unit price, origin and stock, with the price
 * (or each size's price) at the foot of the card.
 */
export default function MenuStructureShopShelf({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <h1 className="mt-8" style={displayStyle(fluid.hero, { lineHeight: 0.95 })}>{p.businessName}</h1>
        <p className="mt-2" style={{ color: tv.muted }}>{look.business.terms.catalogLabel}</p>
        <MenuFilters sys={sys} className="mt-6 max-w-3xl" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => (
          <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className="mb-14 scroll-mt-28">
            <div className="mb-5 flex items-baseline justify-between gap-3 border-b pb-3" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
              <h2 id={`${catId(cat)}-h`} style={displayStyle("clamp(1.5rem, 1.25rem + 1vw, 2.1rem)")}>{cat}</h2>
              <span className="text-sm tabular-nums" style={{ color: tv.muted }}>
                {items.length} {items.length === 1 ? look.business.terms.itemSingular.toLowerCase() : look.business.terms.itemPlural.toLowerCase()}
              </span>
            </div>
            <ul className="grid grid grid-cols-1-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const brand = detail(item, "product", "brand");
                const size = detail(item, "product", "size") || detail(item, "bakery", "weight") || detail(item, "hamper", "boxSize");
                const unit = detail(item, "product", "unitPrice");
                const origin = detail(item, "product", "origin") || detail(item, "wine", "region") || detail(item, "cheese", "origin");
                const stock = stockOf(item);
                const chips = itemChips(item, 3).filter((c) => c !== "Out of stock" && c !== brand && c !== origin && c !== size);
                return (
                  <li key={item.id} className="min-w-0">
                    <div
                      {...openable(p, item)}
                      className="group flex h-full cursor-pointer flex-col overflow-hidden border transition-shadow hover:shadow-[0_10px_30px_-18px_rgb(0_0_0/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ background: tv.surface, borderColor: mixv(tv.border, "transparent", 80), borderRadius: tv.radius, opacity: item.availability && stock !== false ? 1 : 0.65, ...focusRing }}
                    >
                      <div className="relative">
                        <MenuItemImage item={item} primary={tv.accent} secondary={tv.muted} className="sk-zoom aspect-square w-full" />
                        {stock !== null ? (
                          <span
                            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                            style={stock ? { background: tv.surface, color: tv.text } : { background: tv.text, color: tv.bg }}
                          >
                            {stock ? "In stock" : "Out of stock"}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-3 sm:p-4">
                        {brand ? <p className="truncate text-xs" style={{ color: tv.muted }}>{brand}</p> : null}
                        <h3 className="mt-0.5 line-clamp-2 font-semibold leading-snug" style={{ color: tv.text }}>{item.item}</h3>
                        {size || origin ? (
                          <p className="mt-1 truncate text-xs" style={{ color: tv.muted }}>{[size, origin].filter(Boolean).join(", ")}</p>
                        ) : null}
                        {chips.length ? (
                          <p className="mt-2 flex flex-wrap gap-1">
                            {chips.map((c) => (
                              <span key={c} className="rounded-full border px-1.5 py-0.5 text-[11px]" style={{ borderColor: mixv(tv.border, "transparent", 90), color: tv.muted }}>{c}</span>
                            ))}
                          </p>
                        ) : null}
                        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                          <Price item={item} currency={p.currencySymbol} className="font-semibold" />
                          {unit ? <span className="text-right text-[11px]" style={{ color: tv.muted }}>{unit}</span> : null}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </MenuColumns>
    </MenuShell>
  );
}
