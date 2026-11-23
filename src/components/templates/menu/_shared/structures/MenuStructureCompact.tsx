"use client";

import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { Menu } from "@/types";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { buildMenuTheme, type MenuStructureTheme } from "./buildMenuTheme";
import { MenuItemDetailModal, MenuPayFooter } from "./MenuItemDetailModal";
import { DietaryFilterPills } from "./DietaryFilterPills";
import { DietaryBadges } from "./DietaryBadges";

/** Compact: a printed menu card you'd hold at the table — typography only,
 * a knotted ornament, fine rules, dotted leaders to the price. One column on
 * phones; two balanced columns inside a paper card on laptops and monitors. */

const slug = (s: string) => `menu-cat-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** A small interlaced knot used as the card's ornament (header, category rules, foot). */
function Knot({ size = 22, color }: { size?: number; color: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round">
      <path d="M12 3c3 3 3 6 0 9s-3 6 0 9" />
      <path d="M3 12c3-3 6-3 9 0s6 3 9 0" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

/** A fine rule with a diamond in the middle — used under each category name. */
function Rule({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" className="mx-auto mt-2 block h-3 w-40 max-w-full" viewBox="0 0 160 12" fill="none" stroke={color} strokeWidth={1}>
      <path d="M0 6h70M90 6h70" />
      <path d="M80 1l5 5-5 5-5-5z" />
    </svg>
  );
}

function StarMark({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill={color} className="inline-block align-[-1px]">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z" />
    </svg>
  );
}

function DishRow({ item, t, currency, onOpen }: { item: Menu; t: MenuStructureTheme; currency: string; onOpen: () => void }) {
  const soldOut = !item.availability;
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group -mx-2 block w-[calc(100%+1rem)] rounded-md px-2 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: t.accent }}
      >
        <span className="flex items-baseline gap-2">
          <span
            className={`min-w-0 break-words text-[1.05rem] font-semibold leading-snug group-hover:underline group-hover:underline-offset-4 ${soldOut ? "opacity-60" : ""}`}
            style={{ color: t.textPrimary, textDecorationColor: `color-mix(in srgb, ${t.accent} 60%, transparent)` }}
          >
            {item.item}
            {item.popular ? (
              <span className="ml-1.5 whitespace-nowrap">
                <StarMark color={t.accent} />
                <span className="sr-only"> Popular</span>
              </span>
            ) : null}
          </span>
          <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-4px] border-b border-dotted" style={{ borderColor: `color-mix(in srgb, ${t.textSecondary} 55%, transparent)` }} />
          <span className="shrink-0 tabular-nums font-semibold" style={{ color: soldOut ? t.textSecondary : t.accent }}>
            {soldOut ? "Sold out" : `${currency}${item.price}`}
          </span>
        </span>
        {item.description ? (
          <span className="mt-0.5 block max-w-[52ch] text-sm italic leading-relaxed" style={{ color: t.textSecondary }}>
            {item.description}
          </span>
        ) : null}
        <DietaryBadges item={item} className="mt-1.5" />
      </button>
    </li>
  );
}

export default function MenuStructureCompact({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
  const p = useMenuTemplateData(payload, routeSlug);
  const t = buildMenuTheme(p);
  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType || !!p.activeDietaryTag || !!p.searchQuery;
  const paper = t.surface;
  const ink = t.textPrimary;

  const clear = () => {
    p.setActiveCategory(null);
    p.setActiveType(null);
    p.setPopularOnly(false);
    p.setActiveDietaryTag(null);
    p.setSearchQuery("");
  };

  return (
    <div style={{ background: t.bg, fontFamily: t.fontFamily, color: ink }} className="min-h-dvh px-3 pb-36 pt-6 sm:px-6 sm:pt-10">
      <div
        className="mx-auto w-full max-w-xl rounded-[4px] border p-1.5 lg:max-w-5xl"
        style={{ background: paper, borderColor: t.border, boxShadow: `0 1px 0 ${t.border}, 0 18px 40px -28px color-mix(in srgb, ${ink} 45%, transparent)` }}
      >
        {/* Inner rule: the double border of a printed card. */}
        <div className="rounded-[2px] border px-4 pb-10 pt-8 sm:px-10 lg:px-14" style={{ borderColor: `color-mix(in srgb, ${t.border} 100%, ${ink} 10%)` }}>
          <header className="text-center">
            <div className="flex justify-center">
              <Knot size={26} color={t.accent} />
            </div>
            <h1 className={`mt-3 break-words text-3xl font-semibold leading-tight sm:text-4xl`} style={{ color: ink }}>
              {p.businessName}
            </h1>
            <p className="mt-1 text-lg [font-variant:small-caps] tracking-[0.12em]" style={{ color: t.accent }}>
              menu
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm" style={{ color: t.textSecondary }}>
              <p.LinkComponent to={p.landingHref} style={{ color: t.textSecondary }} className="underline decoration-dotted underline-offset-4 hover:opacity-80">
                Back to {p.businessName}
              </p.LinkComponent>
              {p.phone ? (
                <a href={`tel:${p.phone}`} className="tabular-nums hover:opacity-80">
                  {p.phone}
                </a>
              ) : null}
            </div>

            {p.showSearch ? (
              <label className="mx-auto mt-6 block max-w-sm">
                <span className="sr-only">Search the menu</span>
                <input
                  type="search"
                  value={p.searchQuery}
                  onChange={(e) => p.setSearchQuery(e.target.value)}
                  placeholder="Search dishes"
                  style={{ borderColor: t.border, color: ink, background: "transparent" }}
                  className="w-full border-b px-1 py-2 text-center text-base italic outline-none placeholder:opacity-60 focus-visible:border-b-2"
                />
              </label>
            ) : null}

            {/* Jump to a course */}
            {p.grouped.length > 1 ? (
              <nav aria-label="Categories" className="mx-auto mt-5 max-w-3xl">
                <ul className="flex flex-wrap justify-center gap-x-1 gap-y-1 text-[0.95rem]">
                  {p.grouped.map(([cat], i) => (
                    <li key={cat} className="flex items-center">
                      {i > 0 ? <span aria-hidden="true" className="mx-1.5 text-[10px]" style={{ color: t.accent }}>◆</span> : null}
                      <a href={`#${slug(cat)}`} className="rounded px-1 py-0.5 lowercase [font-variant:small-caps] tracking-wide hover:underline focus-visible:outline-2" style={{ color: t.textSecondary, outlineColor: t.accent }}>
                        {cat}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {p.hasPopular ? (
                <button
                  type="button"
                  aria-pressed={p.popularOnly}
                  onClick={() => p.setPopularOnly(!p.popularOnly)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm focus-visible:outline-2"
                  style={p.popularOnly ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { borderColor: t.border, color: t.textSecondary, outlineColor: t.accent }}
                >
                  <StarMark color={p.popularOnly ? t.accentText : t.accent} /> House favourites
                </button>
              ) : null}
              <DietaryFilterPills p={p} t={t} />
              {filtersActive ? (
                <button type="button" onClick={clear} className="text-sm underline underline-offset-4" style={{ color: t.textSecondary }}>
                  Clear
                </button>
              ) : null}
            </div>
          </header>

          <main className="mt-10">
            {p.grouped.length === 0 ? (
              <div className="py-16 text-center" style={{ color: t.textSecondary }}>
                <p className="text-lg italic">Nothing on the menu matches that.</p>
                {filtersActive ? (
                  <button type="button" onClick={clear} className="mt-3 underline underline-offset-4" style={{ color: t.accent }}>
                    Show the full menu
                  </button>
                ) : null}
              </div>
            ) : (
              // Two balanced columns on wide screens; a category never splits across columns.
              <div className="lg:columns-2 lg:gap-16">
                {p.grouped.map(([cat, items]) => (
                  <section key={cat} id={slug(cat)} aria-labelledby={`${slug(cat)}-h`} className="mb-10 scroll-mt-6 break-inside-avoid">
                    <h2 id={`${slug(cat)}-h`} className="text-center text-2xl lowercase [font-variant:small-caps] tracking-[0.08em]" style={{ color: ink }}>
                      {cat}
                    </h2>
                    <Rule color={t.accent} />
                    <ul className="mt-4">
                      {items.map((item) => (
                        <DishRow key={item.id} item={item} t={t} currency={p.currencySymbol} onOpen={() => p.openItem(item)} />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <Knot size={18} color={`color-mix(in srgb, ${t.accent} 70%, transparent)`} />
            </div>
          </main>
        </div>
      </div>

      <MenuPayFooter p={p} t={t} />
      <MenuItemDetailModal p={p} t={t} />
    </div>
  );
}
