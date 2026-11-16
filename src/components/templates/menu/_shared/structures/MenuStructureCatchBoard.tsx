"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import type { Menu } from "@/types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { iconForCategory } from "@/components/site-system/business-types";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, hasOptions, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";
import { itemChips } from "@/components/site-system/menu-kit/attributes";

const KEY = "catch-board";

/** A catch with no fixed price (price 0, no sizes) is sold at the day's market price. */
export function isMarketPrice(item: Menu): boolean {
  return !hasOptions(item) && !(Number(item.price) > 0);
}

/**
 * Catch board (pairs with Pier): each category is a board hung on the wall —
 * the footer colour with its own readable ink, a heavy frame, items chalked
 * up with a rule to the price. Anything without a fixed price reads
 * "Market price", the way a fish counter writes it.
 */
export default function MenuStructureCatchBoard({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <h1 className="mt-8" style={displayStyle(fluid.hero, { lineHeight: 0.95 })}>{p.businessName}</h1>
        <p className="mt-2" style={{ color: tv.muted }}>Today&apos;s {look.business.terms.catalogLabel.toLowerCase()}</p>
        <MenuFilters sys={sys} className="mt-6 max-w-2xl" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => (
          <section
            key={cat}
            id={catId(cat)}
            data-cat={cat}
            aria-labelledby={`${catId(cat)}-h`}
            className="mb-10 scroll-mt-28 p-5 sm:p-8"
            style={{ background: tv.footer, color: tv.footerMuted, border: `10px solid ${mixv(tv.text, tv.accent, 70)}`, borderRadius: 6, boxShadow: `inset 0 0 0 1px ${mixv(tv.footerText, "transparent", 12)}` }}
          >
            <h2 id={`${catId(cat)}-h`} className="flex items-center gap-3 border-b border-dashed pb-3" style={{ ...displayStyle("clamp(1.6rem, 1.3rem + 1.2vw, 2.3rem)", { color: tv.footerText }), borderColor: mixv(tv.footerText, "transparent", 35) }}>
              <SiteIcon name={iconForCategory(cat, look)} size={26} style={{ color: tv.footerAccent }} />
              {cat}
            </h2>
            <ul className="mt-2">
              {items.map((item) => {
                const chips = itemChips(item, 3);
                return (
                  <li key={item.id} className="border-b border-dashed last:border-b-0" style={{ borderColor: mixv(tv.footerText, "transparent", 18) }}>
                    <div {...openable(p, item)} className="cursor-pointer py-4 focus-visible:outline-2" style={{ opacity: item.availability ? 1 : 0.55, ...focusRing, outlineColor: tv.footerAccent }}>
                      <p className="flex items-baseline gap-3">
                        <span className="min-w-0 text-lg font-semibold" style={{ color: tv.footerText }}>{item.item}</span>
                        <span aria-hidden className="min-w-6 flex-1 translate-y-[-4px] border-b border-dashed" style={{ borderColor: mixv(tv.footerText, "transparent", 35) }} />
                        <span className="shrink-0 text-lg font-semibold tabular-nums" style={{ color: tv.footerAccent }}>
                          {isMarketPrice(item) ? "Market price" : hasOptions(item) ? null : `${p.currencySymbol}${item.price}`}
                        </span>
                      </p>
                      {hasOptions(item) ? (
                        <p className="mt-1 flex flex-wrap gap-x-4 text-sm tabular-nums">
                          {item.priceOptions!.map((o) => (
                            <span key={o.label}>
                              {o.label} <span style={{ color: tv.footerAccent, fontWeight: 600 }}>{p.currencySymbol}{o.price}</span>
                            </span>
                          ))}
                        </p>
                      ) : null}
                      {item.description ? <p className="mt-1 text-sm leading-relaxed">{item.description}</p> : null}
                      {chips.length || item.popular || !item.availability ? (
                        <p className="mt-1.5 text-xs">
                          {[item.popular ? "Popular" : "", !item.availability ? "Not available today" : "", ...chips].filter(Boolean).join(", ")}
                        </p>
                      ) : null}
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
