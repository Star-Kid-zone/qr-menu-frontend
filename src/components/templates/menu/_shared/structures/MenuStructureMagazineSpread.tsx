"use client";

import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { Menu } from "@/types";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { itemImage } from "@/components/site-system/kit/content";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, Price, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "magazine-spread";

/** The category's feature: its first popular item with a photo, else its first item with a photo, else its first item. */
function featureOf(items: Menu[]): Menu {
  return items.find((i) => i.popular && itemImage(i)) ?? items.find((i) => itemImage(i)) ?? items[0];
}

/**
 * Magazine spread (pairs with Atelier Editorial): every category opens with a
 * feature — one dish set large with its photo — and the rest run beside it
 * as a column of short entries, under a heavy rule.
 */
export default function MenuStructureMagazineSpread({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <div className="mt-8 border-b-2 pb-4" style={{ borderColor: tv.text }}>
          <h1 className="sk-wipe" style={displayStyle(fluid.hero, { lineHeight: 0.92, letterSpacing: "-0.03em" })}>{p.businessName}</h1>
        </div>
        <div className="flex flex-col gap-4 pb-6 pt-3 lg:flex-row lg:items-start lg:justify-between">
          <p className="text-sm" style={{ color: tv.muted }}>The {look.business.terms.catalogLabel.toLowerCase()}</p>
          <MenuFilters sys={sys} className="lg:w-[28rem]" />
        </div>
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => {
          const lead = featureOf(items);
          const rest = items.filter((i) => i !== lead);
          return (
            <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className="mb-16 scroll-mt-28 border-t-2 pt-5" style={{ borderColor: tv.text }}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 id={`${catId(cat)}-h`} style={displayStyle(fluid.h2, { letterSpacing: "-0.015em" })}>{cat}</h2>
                <span className="shrink-0 text-sm tabular-nums" style={{ color: tv.muted }}>{items.length}</span>
              </div>
              <div className={`mt-6 grid gap-8 ${rest.length ? "xl:grid-cols-[1.1fr_1fr]" : ""}`}>
                <article {...openable(p, lead)} className="group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4" style={{ opacity: lead.availability ? 1 : 0.6, ...focusRing }}>
                  <div className="overflow-hidden" style={{ borderRadius: tv.radius }}>
                    <MenuItemImage item={lead} primary={tv.accent} secondary={tv.muted} className="sk-zoom aspect-[4/3] w-full" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h3 style={displayStyle("clamp(1.5rem, 1.25rem + 1vw, 2.1rem)", { lineHeight: 1.15 })}>{lead.item}</h3>
                    <Price item={lead} currency={p.currencySymbol} className="shrink-0 pt-1 text-lg" />
                  </div>
                  {lead.description ? <p className="mt-2 max-w-prose leading-relaxed" style={{ color: tv.muted }}>{lead.description}</p> : null}
                  <ItemTags item={lead} className="mt-3" />
                </article>
                {rest.length ? (
                  <ul className="divide-y self-start" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
                    {rest.map((item) => (
                      <li key={item.id}>
                        <div {...openable(p, item)} className="group flex cursor-pointer gap-4 py-4 first:pt-0 focus-visible:outline-2" style={{ opacity: item.availability ? 1 : 0.6, ...focusRing }}>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <h3 className="group-hover:underline group-hover:underline-offset-4" style={{ fontFamily: tv.display, fontSize: "1.15rem", color: tv.text }}>{item.item}</h3>
                              <Price item={item} currency={p.currencySymbol} className="shrink-0 text-sm" />
                            </div>
                            {item.description ? <p className="mt-1 line-clamp-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
                            <ItemTags item={item} className="mt-2" />
                          </div>
                          {itemImage(item) ? <MenuItemImage item={item} primary={tv.accent} secondary={tv.muted} className="size-16 shrink-0 rounded-md" /> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          );
        })}
      </MenuColumns>
    </MenuShell>
  );
}
