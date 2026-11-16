"use client";

import type { CSSProperties } from "react";
import type { PublicMenuPayload } from "@/types/public-site";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { iconForCategory } from "@/components/site-system/business-types";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, Price, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "garden-cards";
const LEAF = "62% 38% 54% 46% / 48% 56% 44% 52%";
const SOFT = "calc(var(--site-radius, 16px) * 1.6)";
const card: CSSProperties = { background: tv.surface, borderRadius: SOFT, boxShadow: `0 14px 34px -26px ${mixv(tv.text, "transparent", 55)}` };

/**
 * Garden cards (pairs with Conservatory): soft, rounded cards with a round
 * photo, and each category marked by its icon in a leaf-shaped pebble.
 */
export default function MenuStructureGardenCards({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <div className="mt-8 flex items-center gap-4">
          <span aria-hidden className="grid size-14 shrink-0 place-items-center" style={{ background: mixv(tv.accent, "transparent", 14), color: tv.accent, borderRadius: LEAF }}>
            <SiteIcon name="vegan" size={26} />
          </span>
          <div className="min-w-0">
            <h1 style={displayStyle(fluid.h2)}>{p.businessName}</h1>
            <p style={{ color: tv.muted }}>{look.business.terms.catalogLabel}</p>
          </div>
        </div>
        <MenuFilters sys={sys} className="mt-6 max-w-2xl" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => (
          <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className="mb-14 scroll-mt-28">
            <div className="mb-6 flex items-center gap-3">
              <span aria-hidden className="grid size-11 place-items-center" style={{ background: mixv(tv.accent, "transparent", 12), color: tv.accent, borderRadius: LEAF }}>
                <SiteIcon name={iconForCategory(cat, look)} size={22} />
              </span>
              <h2 id={`${catId(cat)}-h`} style={displayStyle("clamp(1.5rem, 1.25rem + 1vw, 2.1rem)")}>{cat}</h2>
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((item) => (
                <li key={item.id}>
                  <div {...openable(p, item)} className="sk-lift flex h-full cursor-pointer gap-4 p-4 focus-visible:outline-2 focus-visible:outline-offset-2" style={{ ...card, opacity: item.availability ? 1 : 0.6, ...focusRing }}>
                    <MenuItemImage item={item} primary={tv.accent} secondary={tv.muted} className="size-20 shrink-0 rounded-full sm:size-24" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold leading-snug" style={{ color: tv.text }}>{item.item}</h3>
                        <Price item={item} currency={p.currencySymbol} className="shrink-0 text-sm font-semibold" />
                      </div>
                      {item.description ? <p className="mt-1 line-clamp-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
                      <ItemTags item={item} className="mt-2" />
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
