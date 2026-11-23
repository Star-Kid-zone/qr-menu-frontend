"use client";

import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { Menu } from "@/types";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, priceText, useCategorySpy, useMenuSystem, type MenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "deco-card";

function DecoRule() {
  return (
    <span aria-hidden className="flex flex-col items-center gap-1">
      <span className="h-px w-24" style={{ background: tv.accent }} />
      <span className="h-px w-14" style={{ background: tv.accent }} />
      <span className="h-px w-6" style={{ background: tv.accent }} />
    </span>
  );
}

function Entry({ item, align, sys }: { item: Menu; align: "left" | "right"; sys: MenuSystem }) {
  const { p } = sys;
  return (
    <li>
      <div {...openable(p, item)} className={`cursor-pointer rounded py-1 focus-visible:outline-2 focus-visible:outline-offset-4 ${align === "right" ? "md:text-right" : ""}`} style={{ opacity: item.availability ? 1 : 0.6, ...focusRing }}>
        <p style={displayStyle("1.25rem", { lineHeight: 1.25 })}>{item.item}</p>
        {item.description ? <p className="mt-1 text-sm leading-relaxed" style={{ color: tv.muted }}>{item.description}</p> : null}
        <p className="mt-1 tabular-nums" style={{ color: tv.accent, letterSpacing: "0.02em" }}>{priceText(item, p.currencySymbol)}</p>
        <ItemTags item={item} className={`mt-1.5 ${align === "right" ? "md:justify-end" : ""}`} />
      </div>
    </li>
  );
}

/**
 * Deco card (pairs with Supper Club): one framed card, every category set
 * symmetrically — a centred title over stepped rules, the items split into
 * two mirrored columns either side of a fine centre line.
 */
export default function MenuStructureDecoCard({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-4xl px-5 pb-6 pt-5 text-center sm:px-8">
        <MenuTopLinks p={p} className="text-left" />
        <h1 className="mt-8" style={displayStyle(fluid.hero, { letterSpacing: "0.03em" })}>{p.businessName}</h1>
        <div className="mt-4"><DecoRule /></div>
        <p className="mt-3 text-sm" style={{ color: tv.muted, letterSpacing: "0.08em" }}>{look.business.terms.catalogLabel}</p>
        <MenuFilters sys={sys} className="mx-auto mt-6 max-w-xl text-left" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        <div className="p-2" style={{ border: `1px solid ${tv.accent}` }}>
          <div className="px-5 py-10 sm:px-10" style={{ background: tv.surface, border: `1px solid ${mixv(tv.accent, "transparent", 45)}` }}>
            {sys.grouped.map(([cat, items], gi) => {
              const half = Math.ceil(items.length / 2);
              return (
                <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className={`scroll-mt-28 ${gi ? "mt-14" : ""}`}>
                  <div className="text-center">
                    <h2 id={`${catId(cat)}-h`} style={displayStyle("clamp(1.5rem, 1.25rem + 1vw, 2.1rem)", { letterSpacing: "0.04em" })}>{cat}</h2>
                    <div className="mt-3"><DecoRule /></div>
                  </div>
                  <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-[1fr_1px_1fr]">
                    <ul className="space-y-6">{items.slice(0, half).map((it) => <Entry key={it.id} item={it} align="right" sys={sys} />)}</ul>
                    <span aria-hidden className="hidden md:block" style={{ background: mixv(tv.accent, "transparent", 45) }} />
                    <ul className="space-y-6">{items.slice(half).map((it) => <Entry key={it.id} item={it} align="left" sys={sys} />)}</ul>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </MenuColumns>
    </MenuShell>
  );
}
