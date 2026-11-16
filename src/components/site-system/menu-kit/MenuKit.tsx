"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import type { PublicMenuPayload } from "@/types/public-site";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { Menu } from "@/types";
import { AgeNotice, MenuFooter } from "./chrome";
import { useMenuTemplateData } from "@/components/templates/core/useTemplateData";
import { isMenuPartShown } from "@/components/templates/sections/menu/parts";
import { DishDetailSheet } from "@/components/templates/menu/_shared/structures/MenuItemDetailModal";
import { SiteLookProvider, useSiteLook } from "../SiteLookContext";
import { siteLookCssVars } from "../tokens";
import { textureBackground } from "../ornaments";
import { SiteIcon } from "../icons/SiteIcon";
import { iconForCategory } from "../business-types";
import type { SiteLook } from "../types";
import { lookFromSettings } from "../kit/look";
import { MotionStyles } from "../kit/motion";
import { focusRing, mixv, tv } from "../kit/tokens";
import { attributeFilters, itemChips, matchesAttributes, type AttributeFilter } from "./attributes";
import { SiteFonts } from "@/components/site-system/kit/SiteFonts";

/**
 * Menu kit: everything the site-system menu structures share (PLAN §2.5) —
 * the resolved look, scroll-following category navigation (chips on phones,
 * a sidebar from 1024px), search, filters built from the item details, the
 * item sheet, an age notice for alcohol, the pay button and a footer.
 * Structures only decide how categories and items are laid out.
 */

export const catId = (cat: string) => `mcat-${cat.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-")}`;

export interface MenuSystem {
  p: PublicMenuTemplateProps;
  look: SiteLook;
  settings: Record<string, unknown>;
  /** Categories after search, filters and detail filters. */
  grouped: Array<[string, Menu[]]>;
  filters: AttributeFilter[];
  chosen: Record<string, string>;
  choose: (key: string, value: string | null) => void;
  anyFilter: boolean;
  clearAll: () => void;
}

export function useMenuSystem(payload: PublicMenuPayload, routeSlug: string | null, layoutKey: string): MenuSystem {
  const p = useMenuTemplateData(payload, routeSlug);
  const settings = useMemo(() => (payload.mapped.settings ?? {}) as Record<string, unknown>, [payload.mapped.settings]);
  const look = useMemo(() => lookFromSettings(settings, layoutKey, "menu"), [settings, layoutKey]);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const all = useMemo(() => payload.menuItems ?? [], [payload.menuItems]);
  // Detail filters follow the owner's "show filters" switch, like the other filter chips.
  const filtersOn = isMenuPartShown(settings.site_document, "filters");
  const filters = useMemo(() => (filtersOn ? attributeFilters(all) : []), [all, filtersOn]);
  const grouped = useMemo(
    () =>
      Object.keys(chosen).length === 0
        ? p.grouped
        : p.grouped.map(([cat, items]) => [cat, items.filter((it) => matchesAttributes(it, chosen))] as [string, Menu[]]).filter(([, items]) => items.length > 0),
    [p.grouped, chosen],
  );
  const choose = (key: string, value: string | null) =>
    setChosen((c) => {
      const next = { ...c };
      if (value === null || c[key] === value) delete next[key];
      else next[key] = value;
      return next;
    });
  const anyFilter = Boolean(p.searchQuery || p.popularOnly || p.activeCategory || p.activeType || p.activeDietaryTag || Object.keys(chosen).length);
  const clearAll = () => {
    p.setSearchQuery("");
    p.setActiveCategory(null);
    p.setActiveType(null);
    p.setPopularOnly(false);
    p.setActiveDietaryTag(null);
    setChosen({});
  };
  return { p, look, settings, grouped, filters, chosen, choose, anyFilter, clearAll };
}

/** The page root: tokens, texture, fonts, motion kit and the look context. */
export function MenuShell({ sys, children, layoutKey }: { sys: MenuSystem; children: ReactNode; layoutKey: string }) {
  const { look } = sys;
  const style: CSSProperties = {
    ...siteLookCssVars(look),
    backgroundColor: look.palette.bg,
    ...textureBackground(look.skin.background.texture, look.palette),
    fontFamily: "var(--site-font)",
    color: "var(--site-text)",
  };
  return (
    <SiteLookProvider look={look}>
      <SiteFonts look={look} />
      <MotionStyles />
      <div style={style} className="min-h-dvh overflow-x-clip pb-32" data-menu-structure={layoutKey} data-motion={look.motion}>
        {children}
        <AgeNotice look={look} />
        <MenuFooter p={sys.p} />
        <PayButton p={sys.p} />
        <DishDetailSheet
          item={sys.p.selectedItem ?? null}
          onClose={sys.p.closeItem}
          currencySymbol={sys.p.currencySymbol}
          c={{ surface: look.palette.surface, border: look.palette.border, textPrimary: look.palette.text, textSecondary: look.palette.textMuted, accent: look.palette.accent, accentText: look.palette.accentText, fontFamily: look.fonts.body }}
        />
      </div>
    </SiteLookProvider>
  );
}

/* ───────────────────────── item helpers ───────────────────────── */

/** Opens the item sheet from a click or Enter / Space. */
export function openable(p: PublicMenuTemplateProps, item: Menu) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": `${item.item}, ${priceText(item, p.currencySymbol)}`,
    onClick: () => p.openItem(item),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        p.openItem(item);
      }
    },
  };
}

export function hasOptions(item: Menu): boolean {
  return Array.isArray(item.priceOptions) && item.priceOptions.length > 0;
}

/** "₹220" or "Half ₹220 · Pint ₹380". */
export function priceText(item: Menu, currency: string): string {
  if (hasOptions(item)) return item.priceOptions!.map((o) => `${o.label} ${currency}${o.price}`).join(" · ");
  return `${currency}${item.price}`;
}

/** Prices for a card: one price, or each size on its own line. */
export function Price({ item, currency, className = "", style }: { item: Menu; currency: string; className?: string; style?: CSSProperties }) {
  if (!hasOptions(item)) {
    return (
      <span className={`tabular-nums ${className}`} style={{ color: tv.accent, ...style }}>
        {currency}
        {item.price}
      </span>
    );
  }
  return (
    <span className={`flex flex-col items-end gap-0.5 tabular-nums ${className}`} style={{ color: tv.accent, ...style }}>
      {item.priceOptions!.map((o) => (
        <span key={o.label} className="whitespace-nowrap">
          <span className="text-xs" style={{ color: tv.muted }}>{o.label}</span> {currency}
          {o.price}
        </span>
      ))}
    </span>
  );
}

/** Details as small chips, plus Popular / not available. */
export function ItemTags({ item, className = "" }: { item: Menu; className?: string }) {
  const chips = itemChips(item);
  const off = !item.availability;
  if (!chips.length && !item.popular && !off && !item.dietaryTags?.length && !item.spiceLevel) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-xs ${className}`}>
      {item.popular ? (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold" style={{ background: mixv(tv.accent, tv.surface, 14), color: tv.accent }}>
          <SiteIcon name="star" size={11} />
          Popular
        </span>
      ) : null}
      {off ? <span className="rounded-full border px-2 py-0.5" style={{ borderColor: tv.border, color: tv.muted }}>Not available today</span> : null}
      {chips.map((c) => (
        <span key={c} className="rounded-full border px-2 py-0.5" style={{ borderColor: mixv(tv.border, "transparent", 90), color: tv.muted }}>
          {c}
        </span>
      ))}
      {(item.dietaryTags ?? []).slice(0, 3).map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 capitalize" style={{ color: tv.muted }}>
          <SiteIcon name={tag} size={13} />
          {tag.replace(/_/g, " ")}
        </span>
      ))}
      {item.spiceLevel ? (
        <span className="inline-flex" aria-label={`Spice level ${item.spiceLevel} of 3`} style={{ color: tv.accent }}>
          {Array.from({ length: Number(item.spiceLevel) }, (_, i) => <SiteIcon key={i} name="chili" size={13} />)}
        </span>
      ) : null}
    </div>
  );
}

/* ───────────────────────── navigation ───────────────────────── */

/** The category being read (scroll position), and a jump to any other. */
export function useCategorySpy(cats: string[]) {
  const [current, setCurrent] = useState<string | null>(cats[0] ?? null);
  const key = cats.join("|");
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = key.split("|").map((c) => document.getElementById(catId(c))).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setCurrent((hit.target as HTMLElement).dataset.cat ?? null);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [key]);
  const jump = (cat: string) => {
    setCurrent(cat);
    document.getElementById(catId(cat))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return { current, jump };
}

/** Phone / tablet: a sticky row of category chips that keeps the current one in view. */
export function CategoryChips({ cats, current, onPick, label = "Menu sections", className = "" }: { cats: string[]; current: string | null; onPick: (c: string) => void; label?: string; className?: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!current) return;
    bar.current?.querySelector<HTMLElement>(`[data-chip="${CSS.escape(current)}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [current]);
  if (cats.length < 2) return null;
  return (
    <nav aria-label={label} className={className}>
      <div ref={bar} className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-2.5 sm:px-8" style={{ maskImage: "linear-gradient(to right, transparent 0, black 12px, black calc(100% - 24px), transparent)" }}>
        {cats.map((cat) => {
          const on = cat === current;
          return (
            <button
              key={cat}
              type="button"
              data-chip={cat}
              aria-current={on ? "true" : undefined}
              onClick={() => onPick(cat)}
              className="shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              style={on ? { background: tv.text, color: tv.bg, borderColor: tv.text, ...focusRing } : { color: tv.muted, borderColor: mixv(tv.border, "transparent", 90), ...focusRing }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Laptop: a sticky sidebar of categories with their icons and counts. */
export function CategorySidebar({ groups, current, onPick, className = "" }: { groups: Array<[string, Menu[]]>; current: string | null; onPick: (c: string) => void; className?: string }) {
  const look = useSiteLook();
  if (groups.length < 2) return null;
  return (
    <nav aria-label="Menu sections" className={`sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto pr-2 lg:block ${className}`}>
      <ul className="space-y-0.5">
        {groups.map(([cat, items]) => {
          const on = cat === current;
          return (
            <li key={cat}>
              <button
                type="button"
                aria-current={on ? "true" : undefined}
                onClick={() => onPick(cat)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2"
                style={{ background: on ? mixv(tv.accent, "transparent", 12) : "transparent", color: on ? tv.text : tv.muted, ...focusRing }}
              >
                <span style={{ color: on ? tv.accent : "currentColor" }}>
                  <SiteIcon name={iconForCategory(cat, look)} size={18} />
                </span>
                <span className="min-w-0 flex-1 truncate">{cat}</span>
                <span className="text-xs tabular-nums opacity-70">{items.length}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Search box + popular + detail filters + clear. */
export function MenuFilters({ sys, className = "", searchPlaceholder }: { sys: MenuSystem; className?: string; searchPlaceholder?: string }) {
  const { p, filters, chosen, choose, anyFilter, clearAll, look } = sys;
  const noun = look.business.terms.itemPlural.toLowerCase();
  return (
    <div className={`space-y-3 ${className}`}>
      {p.showSearch ? (
        <label className="flex min-w-0 items-center gap-2 rounded-full border px-4 focus-within:outline-2 focus-within:outline-offset-1" style={{ borderColor: mixv(tv.border, "transparent", 90), background: tv.surface, color: tv.muted, ...focusRing }}>
          <SiteIcon name="search" size={16} />
          <span className="sr-only">Search the menu</span>
          <input
            type="search"
            value={p.searchQuery}
            onChange={(e) => p.setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder ?? `Search ${noun}`}
            className="h-11 w-full min-w-0 bg-transparent text-[15px] outline-none"
            style={{ color: tv.text }}
          />
        </label>
      ) : null}
      {p.hasPopular || filters.length || anyFilter ? (
        <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 lg:flex-wrap">
          {p.hasPopular ? (
            <Toggle on={p.popularOnly} onClick={() => p.setPopularOnly(!p.popularOnly)}>
              <SiteIcon name="star" size={12} /> Popular
            </Toggle>
          ) : null}
          {filters.map((f) => (
            <span key={f.key} role="group" aria-label={f.label} className="flex shrink-0 items-center gap-1.5 border-l pl-2 first:border-l-0 first:pl-0" style={{ borderColor: mixv(tv.border, "transparent", 80) }}>
              <span className="text-xs" style={{ color: tv.muted }}>{f.label}</span>
              {f.options.slice(0, 8).map((o) => (
                <Toggle key={o.value} on={chosen[f.key] === o.value} onClick={() => choose(f.key, o.value)}>
                  {o.label}
                </Toggle>
              ))}
            </span>
          ))}
          {anyFilter ? (
            <button type="button" onClick={clearAll} className="shrink-0 whitespace-nowrap px-2 text-[13px] underline underline-offset-4 focus-visible:outline-2" style={{ color: tv.accent, ...focusRing }}>
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-3 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2"
      style={on ? { background: tv.accent, color: tv.accentText, borderColor: tv.accent, ...focusRing } : { borderColor: mixv(tv.border, "transparent", 90), color: tv.muted, ...focusRing }}
    >
      {children}
    </button>
  );
}

/** Shown when search / filters leave nothing. */
export function NoMatches({ sys }: { sys: MenuSystem }) {
  return (
    <div className="mx-auto max-w-sm py-24 text-center" style={{ color: tv.muted }}>
      <p className="text-lg font-semibold" style={{ color: tv.text }}>Nothing matches</p>
      <p className="mt-1 text-sm">Try another word, or clear the filters to see everything.</p>
      <button type="button" onClick={sys.clearAll} className="mt-5 rounded-full px-5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: tv.accent, color: tv.accentText, ...focusRing }}>
        Show everything
      </button>
    </div>
  );
}

/** Back to the site + call, for the top of every structure. */
export function MenuTopLinks({ p, className = "", inverse = false }: { p: PublicMenuTemplateProps; className?: string; /** On a band in the text colour. */ inverse?: boolean }) {
  const ink = inverse ? tv.bg : tv.text;
  const soft = inverse ? mixv(tv.bg, "transparent", 75) : tv.muted;
  return (
    <div className={`flex items-center justify-between gap-3 text-[13px] ${className}`} style={{ color: soft }}>
      <p.LinkComponent to={p.landingHref} className="inline-flex min-h-10 items-center gap-1.5 rounded pr-2 hover:underline focus-visible:outline-2" style={{ color: soft, ...focusRing }}>
        <SiteIcon name="arrow-right" size={14} style={{ transform: "rotate(180deg)" }} />
        Back to {p.businessName}
      </p.LinkComponent>
      {p.phone ? (
        <a href={`tel:${p.phone}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 focus-visible:outline-2" style={{ borderColor: mixv(ink, "transparent", 35), color: ink, ...focusRing }}>
          <SiteIcon name="phone" size={14} />
          <span className="hidden sm:inline">{p.phone}</span>
          <span className="sm:hidden">Call</span>
        </a>
      ) : null}
    </div>
  );
}

/**
 * The common body: sticky category chips on phones and tablets; from 1024px
 * a sticky sidebar beside the content. `onPick` defaults to scrolling to the
 * category (scroll-following); pass one to make the rail switch instead.
 */
export function MenuColumns({
  sys,
  children,
  current,
  onPick,
  chipBackground = tv.bg,
}: {
  sys: MenuSystem;
  children: ReactNode;
  current: string | null;
  onPick: (cat: string) => void;
  chipBackground?: string;
}) {
  const cats = sys.grouped.map(([c]) => c);
  return (
    <>
      <div className="sticky top-0 z-30 border-b lg:hidden" style={{ background: mixv(chipBackground, "transparent", 94), borderColor: mixv(tv.border, "transparent", 70), backdropFilter: "blur(10px)" }}>
        <CategoryChips cats={cats} current={current} onPick={onPick} />
      </div>
      <div className={`mx-auto max-w-6xl gap-10 px-5 pt-8 sm:px-8 ${cats.length > 1 ? "lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)]" : ""}`}>
        <CategorySidebar groups={sys.grouped} current={current} onPick={onPick} />
        <main className="min-w-0">{sys.grouped.length === 0 ? <NoMatches sys={sys} /> : children}</main>
      </div>
    </>
  );
}

/* ───────────────────────── page chrome ───────────────────────── */

function PayButton({ p }: { p: PublicMenuTemplateProps }) {
  if (!(p.payBtn && p.paymentLink)) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 sm:pb-6">
      <button
        type="button"
        onClick={p.onPay}
        className="pointer-events-auto mx-auto flex h-14 w-full items-center justify-center rounded-full text-base font-semibold shadow-[0_10px_30px_-8px_rgb(0_0_0/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.98] sm:h-12 sm:w-auto sm:px-10"
        style={{ background: tv.accent, color: tv.accentText, ...focusRing }}
      >
        Pay bill
      </button>
    </div>
  );
}
