"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import { MotifBand } from "@/components/site-system/kit/blocks";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, Price, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "bill-of-fare";

/**
 * Bill of fare (pairs with Grand Hall): the menu as a printed card — framed,
 * centred headings with an ornamental rule, and each dish set with a dotted
 * leader to its price. Sizes are listed under the dish.
 */
export default function MenuStructureBillOfFare({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-4xl px-5 pb-6 pt-5 text-center sm:px-8">
        <MenuTopLinks p={p} className="text-left" />
        <p className="mt-8 text-sm" style={{ color: tv.accent }}>{look.business.terms.catalogLabel}</p>
        <h1 className="mt-2" style={displayStyle(fluid.hero, { lineHeight: 1 })}>{p.businessName}</h1>
        <MotifBand idPrefix="bof-head" className="mx-auto mt-6" width={220} opacity={0.7} />
        <MenuFilters sys={sys} className="mx-auto mt-8 max-w-xl text-left" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        <div className="relative p-5 sm:p-10" style={{ background: tv.surface, border: `1px solid ${mixv(tv.accent, "transparent", 50)}` }}>
          <span aria-hidden className="pointer-events-none absolute inset-2" style={{ border: `1px solid ${mixv(tv.accent, "transparent", 22)}` }} />
          {sys.grouped.map(([cat, items], gi) => (
            <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className={`relative scroll-mt-28 ${gi ? "mt-14" : ""}`}>
              <div className="text-center">
                <h2 id={`${catId(cat)}-h`} style={displayStyle("clamp(1.6rem, 1.3rem + 1.2vw, 2.25rem)")}>{cat}</h2>
                <MotifBand idPrefix={`bof-${gi}`} className="mx-auto mt-3" width={140} opacity={0.6} />
              </div>
              <ul className="mt-6 grid grid-cols-1 gap-x-12 md:grid-cols-2">
                {items.map((item) => (
                  <li key={item.id} style={{ borderBottom: `1px dotted ${mixv(tv.border, "transparent", 90)}` }}>
                    <div {...openable(p, item)} className="-mx-2 cursor-pointer rounded-lg px-2 py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--site-accent)_6%,transparent)] focus-visible:outline-2" style={{ opacity: item.availability ? 1 : 0.6, ...focusRing }}>
                      <p className="flex items-baseline gap-3">
                        <span className="min-w-0" style={{ fontFamily: tv.display, fontSize: "1.2rem", color: tv.text }}>{item.item}</span>
                        <span aria-hidden className="min-w-6 flex-1 translate-y-[-4px] border-b border-dotted" style={{ borderColor: mixv(tv.accent, "transparent", 55) }} />
                        {item.priceOptions?.length ? null : <Price item={item} currency={p.currencySymbol} className="shrink-0" />}
                      </p>
                      {item.priceOptions?.length ? (
                        <p className="mt-1 flex flex-wrap gap-x-4 text-sm tabular-nums" style={{ color: tv.accent }}>
                          {item.priceOptions.map((o) => (
                            <span key={o.label}>
                              <span style={{ color: tv.muted }}>{o.label}</span> {p.currencySymbol}
                              {o.price}
                            </span>
                          ))}
                        </p>
                      ) : null}
                      {item.description ? <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
                      <ItemTags item={item} className="mt-2" />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </MenuColumns>
    </MenuShell>
  );
}
