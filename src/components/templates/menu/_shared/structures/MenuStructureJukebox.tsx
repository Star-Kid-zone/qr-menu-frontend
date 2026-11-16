"use client";

import { useState, type CSSProperties } from "react";
import type { PublicMenuPayload } from "@/types/public-site";
import { displayStyle, fluid, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, priceText, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";
import { itemChips } from "@/components/site-system/menu-kit/attributes";

const KEY = "jukebox";

/** "A1", "A2" … "B1": the selection code printed on each jukebox button. */
export function selectionCode(index: number): string {
  return `${String.fromCharCode(65 + Math.floor(index / 6))}${(index % 6) + 1}`;
}

/** Neon glow in the footer accent (readable on the footer colour). */
const glow: CSSProperties = { color: tv.footerAccent, textShadow: `0 0 2px ${tv.footerAccent}, 0 0 12px ${mixv(tv.footerAccent, "transparent", 60)}` };

/**
 * Jukebox (pairs with Midnight Diner): the menu as a lit jukebox. Each
 * category is a selection with its code; choosing one flips its list in, the
 * way a record drops. Items are a neon list on the dark panel.
 */
export default function MenuStructureJukebox({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const cats = sys.grouped.map(([c]) => c);
  const [chosen, setChosen] = useState<string | null>(null);
  const active = chosen && cats.includes(chosen) ? chosen : (cats[0] ?? null);
  const index = active ? cats.indexOf(active) : -1;
  const group = sys.grouped[index];
  const focus = { outlineColor: tv.footerAccent };

  const pick = (cat: string) => {
    setChosen(cat);
    document.getElementById("jukebox-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <h1 className="mt-8" style={displayStyle(fluid.hero, { lineHeight: 0.95 })}>{p.businessName}</h1>
        <p className="mt-2" style={{ color: tv.muted }}>{look.business.terms.catalogLabel}</p>
        <MenuFilters sys={sys} className="mt-6 max-w-2xl" />
      </header>

      <MenuColumns sys={sys} current={active} onPick={pick}>
        {group ? (
          <div id="jukebox-panel" className="scroll-mt-24 overflow-hidden" style={{ background: tv.footer, color: tv.footerMuted, borderRadius: "28px 28px 14px 14px", border: `3px solid ${tv.text}` }}>
            {/* Selection buttons */}
            <nav aria-label="Selections" className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 sm:p-6">
              {cats.map((cat, i) => {
                const on = cat === active;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(cat)}
                    className="flex min-h-11 items-center gap-2 rounded-lg border px-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ ...focus, borderColor: on ? tv.footerAccent : mixv(tv.footerText, "transparent", 25), background: on ? mixv(tv.footerAccent, "transparent", 14) : "transparent", color: tv.footerText }}
                  >
                    <span className="shrink-0 font-bold tabular-nums" style={on ? glow : { color: tv.footerMuted }}>{selectionCode(i)}</span>
                    <span className="min-w-0 truncate">{cat}</span>
                  </button>
                );
              })}
            </nav>
            <section key={active} id={catId(group[0])} data-cat={group[0]} aria-labelledby="jukebox-h" className="sk-flip border-t px-4 pb-6 pt-5 sm:px-6" style={{ borderColor: mixv(tv.footerText, "transparent", 20) }}>
              <h2 id="jukebox-h" className="flex items-baseline gap-3" style={displayStyle("clamp(1.6rem, 1.3rem + 1.2vw, 2.3rem)", glow)}>
                <span className="text-base tabular-nums" style={{ color: tv.footerMuted, textShadow: "none" }}>{selectionCode(index)}</span>
                {group[0]}
              </h2>
              <ol className="mt-4">
                {group[1].map((item) => {
                  const chips = itemChips(item, 3);
                  return (
                    <li key={item.id} className="border-b last:border-b-0" style={{ borderColor: mixv(tv.footerText, "transparent", 14) }}>
                      <div {...openable(p, item)} className="group flex cursor-pointer items-baseline gap-4 py-4 focus-visible:outline-2" style={{ ...focus, opacity: item.availability ? 1 : 0.55 }}>
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-semibold transition-[text-shadow] group-hover:[text-shadow:0_0_10px_var(--site-footer-accent)]" style={{ color: tv.footerText }}>{item.item}</p>
                          {item.description ? <p className="mt-0.5 text-sm leading-relaxed">{item.description}</p> : null}
                          {chips.length || item.popular ? <p className="mt-1 text-xs">{[item.popular ? "Popular" : "", ...chips].filter(Boolean).join(", ")}</p> : null}
                        </div>
                        <p className="shrink-0 text-right font-bold tabular-nums" style={glow}>{priceText(item, p.currencySymbol)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        ) : null}
      </MenuColumns>
    </MenuShell>
  );
}
