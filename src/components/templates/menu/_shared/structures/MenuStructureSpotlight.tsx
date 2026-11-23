"use client";

import { useState, type CSSProperties } from "react";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import { MenuItemImage } from "@/components/templates/core/MenuImage";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { iconForCategory } from "@/components/site-system/business-types";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, Price, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "spotlight";

/**
 * Spotlight (pairs with Noir Salon): one category on stage at a time. The
 * rail switches categories instead of scrolling; the dishes of the chosen one
 * come up as large rows, and "next" walks through the menu in order.
 */
export default function MenuStructureSpotlight({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const cats = sys.grouped.map(([c]) => c);
  const [chosen, setChosen] = useState<string | null>(null);
  const active = chosen && cats.includes(chosen) ? chosen : (cats[0] ?? null);
  const index = active ? cats.indexOf(active) : -1;
  const group = sys.grouped[index];

  const pick = (cat: string) => {
    setChosen(cat);
    document.getElementById("spotlight-stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pb-8 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <h1 className="mt-10" style={displayStyle(fluid.hero, { lineHeight: 0.95, letterSpacing: "-0.02em" })}>{p.businessName}</h1>
        <p className="mt-3" style={{ color: tv.muted, fontSize: fluid.lead }}>{look.business.terms.catalogLabel}</p>
        <MenuFilters sys={sys} className="mt-8 max-w-2xl" />
      </header>

      <MenuColumns sys={sys} current={active} onPick={pick}>
        {group ? (
          <section id="spotlight-stage" aria-labelledby="spotlight-h" className="scroll-mt-24">
            <div key={active} className="sk-fade" style={{ ["--sk-d" as string]: "450ms" } as CSSProperties}>
              <div id={catId(group[0])} data-cat={group[0]} className="flex items-center gap-4 border-b pb-5" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
                <span className="grid size-14 shrink-0 place-items-center rounded-full" style={{ background: mixv(tv.accent, "transparent", 14), color: tv.accent }}>
                  <SiteIcon name={iconForCategory(group[0], look)} size={28} />
                </span>
                <div className="min-w-0">
                  <h2 id="spotlight-h" style={displayStyle(fluid.h2)}>{group[0]}</h2>
                  <p className="text-sm" style={{ color: tv.muted }}>
                    {group[1].length} {group[1].length === 1 ? look.business.terms.itemSingular.toLowerCase() : look.business.terms.itemPlural.toLowerCase()}
                    {cats.length > 1 ? `, ${index + 1} of ${cats.length}` : ""}
                  </p>
                </div>
              </div>
              <ul>
                {group[1].map((item) => (
                  <li key={item.id} style={{ borderBottom: `1px solid ${mixv(tv.border, "transparent", 70)}` }}>
                    <div {...openable(p, item)} className="group flex cursor-pointer gap-5 py-6 focus-visible:outline-2 focus-visible:outline-offset-2" style={{ opacity: item.availability ? 1 : 0.6, ...focusRing }}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="transition-colors group-hover:[color:var(--site-accent)]" style={displayStyle(fluid.h3, { lineHeight: 1.2 })}>{item.item}</h3>
                          <Price item={item} currency={p.currencySymbol} className="shrink-0 pt-1 text-lg" />
                        </div>
                        {item.description ? <p className="mt-2 max-w-prose text-sm leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
                        <ItemTags item={item} className="mt-3" />
                      </div>
                      <MenuItemImage item={item} primary={tv.accent} secondary={tv.muted} className="size-24 shrink-0 self-start rounded-xl sm:size-32" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {cats.length > 1 ? (
              <nav aria-label="Other sections" className="mt-10 flex items-center justify-between gap-4">
                {index > 0 ? (
                  <button type="button" onClick={() => pick(cats[index - 1])} className="inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm focus-visible:outline-2" style={{ borderColor: mixv(tv.border, "transparent", 90), color: tv.text, ...focusRing }}>
                    <SiteIcon name="arrow-right" size={16} style={{ transform: "rotate(180deg)" }} />
                    {cats[index - 1]}
                  </button>
                ) : <span />}
                {index < cats.length - 1 ? (
                  <button type="button" onClick={() => pick(cats[index + 1])} className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold focus-visible:outline-2" style={{ background: tv.accent, color: tv.accentText, ...focusRing }}>
                    {cats[index + 1]}
                    <SiteIcon name="arrow-right" size={16} />
                  </button>
                ) : null}
              </nav>
            ) : null}
          </section>
        ) : null}
      </MenuColumns>
    </MenuShell>
  );
}
