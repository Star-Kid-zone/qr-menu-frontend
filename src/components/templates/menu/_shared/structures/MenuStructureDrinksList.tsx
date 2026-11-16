"use client";

import type { PublicMenuPayload } from "@/types/public-site";
import type { Menu } from "@/types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { iconForCategory } from "@/components/site-system/business-types";
import { detail } from "@/components/site-system/menu-kit/attributes";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";
import { catId, ItemTags, MenuColumns, MenuFilters, MenuShell, MenuTopLinks, openable, useCategorySpy, useMenuSystem } from "@/components/site-system/menu-kit/MenuKit";

const KEY = "drinks-list";

/** The first filled-in detail from a list of [set, field] pairs. */
function firstDetail(item: Menu, pairs: Array<[Parameters<typeof detail>[1], string]>): string {
  for (const [set, field] of pairs) {
    const v = detail(item, set, field);
    if (v) return v;
  }
  return "";
}

const styleOf = (i: Menu) => {
  const wine = [detail(i, "wine", "colour"), detail(i, "wine", "grape")].filter(Boolean).join(", ");
  return wine || firstDetail(i, [["beer", "style"], ["spirits", "baseSpirit"], ["coffee", "roast"], ["shisha", "flavour"], ["cheese", "texture"]]);
};
const abvOf = (i: Menu) => firstDetail(i, [["wine", "abv"], ["beer", "abv"], ["spirits", "abv"]]);
const originOf = (i: Menu) => {
  const wine = [detail(i, "wine", "region"), detail(i, "wine", "country")].filter(Boolean).join(", ");
  return wine || firstDetail(i, [["beer", "brewery"], ["coffee", "origin"], ["product", "origin"], ["cheese", "origin"]]);
};
const vintageOf = (i: Menu) => detail(i, "wine", "vintage");

interface Column {
  key: string;
  label: string;
  get: (i: Menu) => string;
  numeric?: boolean;
}

/** Columns for one category: only details at least one drink in it has, then one column per size. */
function columnsFor(items: Menu[], currency: string): { details: Column[]; prices: Column[] } {
  const candidates: Column[] = [
    { key: "style", label: "Style", get: styleOf },
    { key: "origin", label: "From", get: originOf },
    { key: "vintage", label: "Vintage", get: vintageOf, numeric: true },
    { key: "abv", label: "ABV", get: abvOf, numeric: true },
  ];
  const details = candidates.filter((c) => items.some((i) => c.get(i)));
  const labels: string[] = [];
  let plain = false;
  for (const i of items) {
    if (i.priceOptions?.length) i.priceOptions.forEach((o) => !labels.includes(o.label) && labels.push(o.label));
    else plain = true;
  }
  const prices: Column[] = labels.map((label) => ({
    key: `size-${label}`,
    label,
    numeric: true,
    get: (i: Menu) => {
      const o = i.priceOptions?.find((x) => x.label === label);
      return o ? `${currency}${o.price}` : "";
    },
  }));
  if (plain || labels.length === 0) {
    prices.unshift({ key: "price", label: "Price", numeric: true, get: (i) => (i.priceOptions?.length ? "" : `${currency}${i.price}`) });
  }
  return { details, prices };
}

/**
 * Drinks list (pubs, bars, wine shops): each category is a table — the
 * drink, its style, where it's from, vintage and strength, then one column
 * per size ("Half", "Pint" / "Glass", "Bottle"). Columns appear only when
 * some drink in the category has that detail. On phones each drink becomes
 * a compact row with its sizes underneath.
 */
export default function MenuStructureDrinksList({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const sys = useMenuSystem(payload, routeSlug, KEY);
  const { p, look } = sys;
  const { current, jump } = useCategorySpy(sys.grouped.map(([c]) => c));
  const cell = "px-3 py-3.5 align-top";

  return (
    <MenuShell sys={sys} layoutKey={KEY}>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-5 sm:px-8">
        <MenuTopLinks p={p} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm" style={{ color: tv.accent }}>{look.business.terms.catalogLabel}</p>
            <h1 className="mt-1" style={displayStyle(fluid.hero, { lineHeight: 0.95 })}>{p.businessName}</h1>
          </div>
        </div>
        <MenuFilters sys={sys} className="mt-6 max-w-3xl" searchPlaceholder="Search drinks, styles, makers" />
      </header>

      <MenuColumns sys={sys} current={current} onPick={jump}>
        {sys.grouped.map(([cat, items]) => {
          const { details, prices } = columnsFor(items, p.currencySymbol);
          return (
            <section key={cat} id={catId(cat)} data-cat={cat} aria-labelledby={`${catId(cat)}-h`} className="mb-14 scroll-mt-28">
              <h2 id={`${catId(cat)}-h`} className="flex items-center gap-3 border-b pb-3" style={{ ...displayStyle("clamp(1.6rem, 1.3rem + 1.2vw, 2.3rem)"), borderColor: tv.text }}>
                <span style={{ color: tv.accent }}><SiteIcon name={iconForCategory(cat, look)} size={26} /></span>
                {cat}
              </h2>

              {/* Laptop / tablet: the table. */}
              <table className="hidden w-full border-collapse text-left text-sm md:table">
                <caption className="sr-only">{cat}</caption>
                <thead>
                  <tr style={{ color: tv.muted }}>
                    <th scope="col" className={`${cell} pl-0 font-normal`}>{look.business.terms.itemSingular}</th>
                    {details.map((c) => (
                      <th key={c.key} scope="col" className={`${cell} font-normal ${c.numeric ? "text-right" : ""}`}>{c.label}</th>
                    ))}
                    {prices.map((c) => (
                      <th key={c.key} scope="col" className={`${cell} pr-0 text-right font-normal`}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} onClick={() => p.openItem(item)} className="cursor-pointer border-t transition-colors hover:bg-[color-mix(in_srgb,var(--site-accent)_6%,transparent)]" style={{ borderColor: mixv(tv.border, "transparent", 70), opacity: item.availability ? 1 : 0.6 }}>
                      <th scope="row" className={`${cell} pl-0 font-normal`}>
                        <button type="button" onClick={(e) => { e.stopPropagation(); p.openItem(item); }} className="rounded text-left text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: tv.text, ...focusRing }}>
                          {item.item}
                        </button>
                        {item.description ? <span className="mt-0.5 block max-w-md text-[13px] leading-relaxed" style={{ color: tv.muted }}>{item.description}</span> : null}
                        <ItemTags item={{ ...item, attributes: {} }} className="mt-1.5" />
                      </th>
                      {details.map((c) => (
                        <td key={c.key} className={`${cell} ${c.numeric ? "text-right tabular-nums" : ""}`} style={{ color: tv.muted }}>{c.get(item) || "–"}</td>
                      ))}
                      {prices.map((c) => (
                        <td key={c.key} className={`${cell} pr-0 text-right font-semibold tabular-nums`} style={{ color: tv.accent }}>{c.get(item) || "–"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Phone: compact rows. */}
              <ul className="md:hidden">
                {items.map((item) => {
                  const meta = details.map((c) => c.get(item)).filter(Boolean).join(" · ");
                  const sizes = prices.map((c) => [c.label, c.get(item)] as const).filter(([, v]) => v);
                  return (
                    <li key={item.id} className="border-b" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
                      <div {...openable(p, item)} className="cursor-pointer py-4 focus-visible:outline-2" style={{ opacity: item.availability ? 1 : 0.6, ...focusRing }}>
                        <p className="font-semibold" style={{ color: tv.text }}>{item.item}</p>
                        {meta ? <p className="mt-0.5 text-[13px]" style={{ color: tv.muted }}>{meta}</p> : null}
                        <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm tabular-nums">
                          {sizes.map(([label, v]) => (
                            <div key={label} className="flex gap-1.5">
                              <dt style={{ color: tv.muted }}>{label}</dt>
                              <dd className="font-semibold" style={{ color: tv.accent }}>{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </MenuColumns>
    </MenuShell>
  );
}
