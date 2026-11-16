"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { iconForCategory } from "@/components/site-system/business-types";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, Price, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "market-stalls";
const R = "calc(var(--site-radius, 10px) * 0.6)";

/** Striped awning with a scalloped edge (accent and surface). */
function Awning({ stripe = 22 }: { stripe?: number }) {
  const r = stripe / 2;
  return (
    <div aria-hidden>
      <div style={{ height: stripe * 0.7, backgroundImage: `repeating-linear-gradient(90deg, ${tv.accent} 0 ${stripe}px, ${tv.surface} ${stripe}px ${stripe * 2}px)` }} />
      <div
        style={{
          height: r,
          backgroundImage: `radial-gradient(circle at ${r}px 0, ${tv.accent} ${r - 0.5}px, transparent ${r}px), radial-gradient(circle at ${stripe + r}px 0, ${tv.surface} ${r - 0.5}px, transparent ${r}px)`,
          backgroundSize: `${stripe * 2}px ${r}px`,
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}

/**
 * Market stalls (pairs with Bazaar): each category is a stall — an awning
 * over a sign with the category's name and icon, its items laid out on the
 * counter below as small cards with a price tag.
 */
export default function MenuStructureMarketStalls({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <Awning stripe={26} />
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <h1 className="mt-6" style={displayStyle(fluid.hero, { lineHeight: 0.95 })}>{p.businessName}</h1>
        <p className="mt-2" style={{ color: tv.muted }}>{look.business.terms.catalogLabel}</p>
        <MenuFilters sys={sys} className="mt-6 max-w-2xl" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => (
          <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className="mb-12 scroll-mt-28 overflow-hidden" style={{ background: tv.surface, borderRadius: R, border: `1px solid ${mixv(tv.border, "transparent", 70)}` }}>
            <Awning />
            <h2 id={`${catId(cat)}-h`} className="mx-auto -mt-1 flex w-fit items-center gap-2 px-5 py-2" style={{ ...displayStyle("clamp(1.35rem, 1.15rem + 0.8vw, 1.85rem)"), background: tv.bg, border: `2px solid ${tv.text}`, borderRadius: R }}>
              <SiteIcon name={iconForCategory(cat, look)} size={22} style={{ color: tv.accent }} />
              {cat}
            </h2>
            <ul className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id} className="min-w-0">
                  <div {...openable(p, item)} className="group flex h-full cursor-pointer flex-col overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: tv.bg, borderRadius: R, opacity: item.availability ? 1 : 0.6, ...focusRing }}>
                    <div className="relative">
                      <MenuItemImage item={item} primary={tv.accent} secondary={tv.muted} className="sk-zoom aspect-[4/3] w-full" />
                      {item.priceOptions?.length ? null : (
                        <span className="absolute bottom-2 left-2 -rotate-3 px-2 py-0.5 text-sm font-bold tabular-nums" style={{ background: tv.accent, color: tv.accentText, borderRadius: R }}>
                          {p.currencySymbol}{item.price}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="font-semibold leading-snug" style={{ color: tv.text }}>{item.item}</h3>
                      {item.description ? <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
                      {item.priceOptions?.length ? <Price item={item} currency={p.currencySymbol} className="mt-2 !items-start text-sm font-semibold" /> : null}
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
