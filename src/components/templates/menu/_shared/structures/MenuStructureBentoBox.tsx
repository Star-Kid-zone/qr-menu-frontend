"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import type { Menu } from "@/types";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { itemImage } from "@/components/site-system/kit/content";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, Price, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "bento-box";

/** The compartment that gets the most room: the first item with a photo (else the first item). */
function leadOf(items: Menu[]): Menu {
  return items.find((i) => itemImage(i)) ?? items[0];
}

/** Empty compartments needed on the 4-column grid, where the lead takes 2×2 and leaves 4 small slots beside it. */
export function wideFillers(rest: number): number {
  const capacity = rest <= 4 ? 4 : 4 + Math.ceil((rest - 4) / 4) * 4;
  return capacity - rest;
}

/**
 * Bento box (pairs with Tatami): each category is a lacquered box divided
 * into compartments. The lead item takes the large compartment with its
 * photo; the rest fill the smaller ones, separated by fine lines.
 */
export default function MenuStructureBentoBox({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <div className="mt-8 flex items-end gap-4">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center text-lg" style={{ border: `1.5px solid ${tv.accent}`, color: tv.accent, fontFamily: tv.display }}>
            {p.businessName.trim().charAt(0)}
          </span>
          <div className="min-w-0">
            <h1 style={displayStyle(fluid.h2, { lineHeight: 1 })}>{p.businessName}</h1>
            <p className="mt-1" style={{ color: tv.muted }}>{look.business.terms.catalogLabel}</p>
          </div>
        </div>
        <MenuFilters sys={sys} className="mt-6 max-w-2xl" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => {
          const lead = leadOf(items);
          const rest = items.filter((i) => i !== lead);
          return (
            <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className="mb-12 scroll-mt-28">
              <h2 id={`${catId(cat)}-h`} className="mb-4" style={displayStyle("clamp(1.5rem, 1.25rem + 1vw, 2.1rem)")}>{cat}</h2>
              <ul
                className="grid grid grid-cols-1-cols-2 gap-px overflow-hidden md:grid-cols-4"
                style={{ background: mixv(tv.border, "transparent", 90), border: `3px solid ${tv.text}`, borderRadius: "var(--site-radius, 10px)" }}
              >
                <li className={rest.length ? "col-span-2 row-span-2" : "col-span-2 md:col-span-4"} style={{ background: tv.surface }}>
                  <div {...openable(p, lead)} className="group flex h-full cursor-pointer flex-col focus-visible:outline-2 focus-visible:-outline-offset-4" style={{ opacity: lead.availability ? 1 : 0.6, ...focusRing }}>
                    <MenuItemImage item={lead} primary={tv.accent} secondary={tv.muted} className="sk-zoom aspect-[4/3] w-full md:aspect-auto md:min-h-[14rem] md:flex-1" />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 style={displayStyle("1.3rem", { lineHeight: 1.2 })}>{lead.item}</h3>
                        <Price item={lead} currency={p.currencySymbol} className="shrink-0" />
                      </div>
                      {lead.description ? <p className="mt-1 text-sm leading-relaxed" style={{ color: tv.muted }}>{lead.description}</p> : null}
                      <ItemTags item={lead} className="mt-2" />
                    </div>
                  </div>
                </li>
                {rest.map((item) => (
                  <li key={item.id} style={{ background: tv.surface }}>
                    <div {...openable(p, item)} className="flex h-full cursor-pointer flex-col p-4 transition-colors hover:bg-[color-mix(in_srgb,var(--site-accent)_6%,transparent)] focus-visible:outline-2 focus-visible:-outline-offset-4" style={{ opacity: item.availability ? 1 : 0.6, ...focusRing }}>
                      {itemImage(item) ? <MenuItemImage item={item} primary={tv.accent} secondary={tv.muted} className="mb-3 aspect-square w-full" /> : null}
                      <h3 className="font-semibold leading-snug" style={{ color: tv.text }}>{item.item}</h3>
                      {item.description ? <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
                      <Price item={item} currency={p.currencySymbol} className="mt-auto pt-2 text-sm !items-start" />
                    </div>
                  </li>
                ))}
                {/* Keep the box rectangular: empty compartments fill the last row (2 columns on phones, 4 from md, the lead filling 2×2). */}
                {rest.length % 2 === 1 ? <li aria-hidden className="md:hidden" style={{ background: tv.surface }} /> : null}
                {Array.from({ length: rest.length ? wideFillers(rest.length) : 0 }, (_, i) => (
                  <li key={`f${i}`} aria-hidden className="hidden md:block" style={{ background: tv.surface }} />
                ))}
              </ul>
            </section>
          );
        })}
      </MenuColumns>
    </MenuShell>
  );
}
