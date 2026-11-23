'use client';
import type { KeyboardEvent, ReactNode } from 'react';
import { PiMagnifyingGlassBold, PiPhoneBold, PiStarFill, PiXBold } from 'react-icons/pi';
import { MenuItemImage } from '@/components/templates/core/MenuImage';
import { useMenuTemplateData } from '@/components/templates/core/useTemplateData';
import { DishDetailSheet } from './structures/MenuItemDetailModal';
import { DietaryBadges } from './structures/DietaryBadges';
import { MenuChrome } from '@/components/site-system/menu-kit/chrome';
import type { PublicMenuPayload } from '@/types/public/publicSite.types';
import type { Menu } from '@/types';

export interface MenuTheme {
  bg: string;
  surface: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accentText: string;
  font: string;
  headingClass?: string;
  cardBg: string;
  cardBorder: string;
  cardRadius?: string;
  headerBg: string;
  headerBorder: string;
  searchBg: string;
  searchBorder: string;
  searchText: string;
  catColor: string;
  catClass?: string;
  priceColor: string;
  payBg: string;
  payText: string;
  itemHover?: string;
  dividerColor?: string;
}

const CARD_RADIUS_MAP: Record<string, string> = {
  'rounded-none': '0',
  'rounded-lg':   '0.5rem',
  'rounded-xl':   '0.75rem',
  'rounded-2xl':  '1rem',
  'rounded-3xl':  '1.5rem',
};

/** Fades the ends of a sideways-scrolling row so it reads as "more this way". */
const EDGE_FADE = '[mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)]';

function Chip({ label, active, onClick, t, icon }: { label: string; active: boolean; onClick: () => void; t: MenuTheme; icon?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      style={
        active
          ? { background: t.textPrimary, color: t.bg, borderColor: t.textPrimary, outlineColor: t.accent }
          : { background: t.searchBg, color: t.textPrimary, borderColor: t.searchBorder, outlineColor: t.accent }
      }
    >
      {icon}
      {label}
    </button>
  );
}

const keyOpen = (open: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open();
  }
};

export function MenuTemplateRenderer({
  theme,
  payload,
  routeSlug,
}: {
  theme: MenuTheme;
  payload: PublicMenuPayload;
  routeSlug: string | null;
}) {
  const p = useMenuTemplateData(payload, routeSlug);

  // Merge workspace settings over the template's defaults.
  const t: MenuTheme = {
    ...theme,
    accent:      p.primary       || theme.accent,
    bg:          p.accent        || theme.bg,
    cardBg:      p.secondary     || theme.cardBg,
    textPrimary: p.textPrimary   || theme.textPrimary,
    textMuted:   p.textSecondary || theme.textMuted,
    accentText:  p.accentText    || theme.accentText,
    border:      p.borderColor   || theme.border,
    cardBorder:  p.borderColor   || theme.cardBorder,
    searchText:  p.textPrimary   || theme.searchText,
    font:        p.fontFamily    || theme.font,
    cardRadius:  (p.cardStyle && CARD_RADIUS_MAP[p.cardStyle]) || theme.cardRadius,
  };
  const radius = t.cardRadius ?? '1rem';
  const price = (m: Menu) => `${p.currencySymbol}${m.price}`;

  const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType || !!p.activeDietaryTag;
  const clearAll = () => {
    p.setActiveCategory(null);
    p.setActiveType(null);
    p.setPopularOnly(false);
    p.setActiveDietaryTag(null);
    p.setSearchQuery('');
  };
  const showCatRow = p.filterCategories.length > 1;
  const showTypeRow = p.allTypes.length > 1;
  const popular = p.grouped.flatMap(([, items]) => items).filter((m) => m.popular);
  const showPopularStrip = popular.length > 1 && !filtersActive && !p.searchQuery;
  const focusRing = { outlineColor: t.accent };

  return (
    <div className="min-h-dvh overflow-x-clip pb-32" style={{ background: t.bg, fontFamily: t.font, color: t.textPrimary }}>
      {/* ── Masthead ── */}
      <header className="mx-auto max-w-6xl px-4 pb-5 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <div className="flex items-center justify-between gap-3 text-[13px]" style={{ color: t.textMuted }}>
          <p.LinkComponent
            to={p.landingHref}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full pr-2 font-medium hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: t.textMuted, ...focusRing }}
          >
            ← Back to {p.businessName}
          </p.LinkComponent>
          {p.phone && (
            <a
              href={`tel:${p.phone}`}
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3 font-medium tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ borderColor: t.border, color: t.textPrimary, ...focusRing }}
            >
              <PiPhoneBold className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">{p.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
          )}
        </div>
        <h1
          className={`mt-5 text-[2.25rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl ${t.headingClass ?? ''}`}
          style={{ color: t.textPrimary, textWrap: 'balance' }}
        >
          {p.businessName}
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: t.textMuted }}>
          Menu
        </p>
      </header>

      {/* ── Sticky search + category bar ── */}
      <div
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ background: `color-mix(in srgb, ${t.bg} 88%, transparent)`, borderColor: t.headerBorder }}
      >
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-3 sm:px-6 lg:px-8">
          {p.showSearch && (
            <label className="relative block">
              <span className="sr-only">Search the menu</span>
              <PiMagnifyingGlassBold className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2" style={{ color: t.textMuted }} aria-hidden />
              <input
                type="search"
                value={p.searchQuery}
                onChange={(e) => p.setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-full border pl-11 pr-4 text-[15px] outline-none transition-shadow focus-visible:ring-2 sm:max-w-md"
                style={{ background: t.searchBg, borderColor: t.searchBorder, color: t.searchText, ['--tw-ring-color' as string]: t.accent }}
                placeholder="Search dishes"
              />
            </label>
          )}

          {(showCatRow || p.hasPopular) && (
            <nav aria-label="Menu sections" className={`no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 ${EDGE_FADE} lg:[mask-image:none] lg:flex-wrap`}>
              <Chip label="All" active={!p.activeCategory && !p.popularOnly} onClick={() => { p.setActiveCategory(null); p.setPopularOnly(false); }} t={t} />
              {p.hasPopular && (
                <Chip label="Popular" icon={<PiStarFill className="size-3.5" aria-hidden />} active={p.popularOnly} onClick={() => p.setPopularOnly(!p.popularOnly)} t={t} />
              )}
              {showCatRow &&
                p.filterCategories.map((cat) => (
                  <Chip key={cat} label={cat} active={p.activeCategory === cat} onClick={() => p.setActiveCategory(p.activeCategory === cat ? null : cat)} t={t} />
                ))}
            </nav>
          )}

          {(showTypeRow || p.allDietaryTags.length > 0) && (
            <div className={`no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 ${EDGE_FADE} lg:[mask-image:none] lg:flex-wrap`}>
              {showTypeRow &&
                p.allTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={p.activeType === type}
                    onClick={() => p.setActiveType(p.activeType === type ? null : type)}
                    className="inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={
                      p.activeType === type
                        ? { background: t.accent, color: t.accentText, borderColor: t.accent, ...focusRing }
                        : { borderColor: t.border, color: t.textMuted, ...focusRing }
                    }
                  >
                    {type}
                  </button>
                ))}
              {p.allDietaryTags.map((tag) => {
                const on = p.activeDietaryTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={on}
                    onClick={() => p.setActiveDietaryTag(on ? null : tag)}
                    className="inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-[13px] capitalize focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={on ? { background: t.accent, color: t.accentText, borderColor: t.accent, ...focusRing } : { borderColor: t.border, color: t.textMuted, ...focusRing }}
                  >
                    {tag.replace(/_/g, ' ')}
                  </button>
                );
              })}
              {filtersActive && (
                <button type="button" onClick={clearAll} className="inline-flex h-8 shrink-0 items-center gap-1 px-2 text-[13px] underline underline-offset-4" style={{ color: t.textMuted }}>
                  <PiXBold className="size-3" aria-hidden /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* ── Popular strip: the one big, photo-led moment on the page ── */}
        {showPopularStrip && (
          <section aria-labelledby="popular-heading" className="mb-12">
            <h2 id="popular-heading" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
              Guests&apos; favourites
            </h2>
            <ul className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 ${EDGE_FADE} lg:[mask-image:none]`}>
              {popular.slice(0, 8).map((item) => (
                <li key={item.id} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-3rem)/4)]">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => p.openItem(item)}
                    onKeyDown={keyOpen(() => p.openItem(item))}
                    className="group block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{ ...focusRing, borderRadius: radius }}
                  >
                    <div className="overflow-hidden" style={{ borderRadius: radius }}>
                      <MenuItemImage item={item} primary={t.accent} secondary={t.textMuted} className="aspect-[4/3] w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <h3 className="min-w-0 truncate text-[15px] font-semibold">{item.item}</h3>
                      <span className="shrink-0 text-[15px] font-semibold tabular-nums" style={{ color: t.priceColor }}>{price(item)}</span>
                    </div>
                    {item.category && <p className="mt-0.5 truncate text-[13px]" style={{ color: t.textMuted }}>{item.category}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {p.grouped.length === 0 ? (
          <div className="mx-auto max-w-sm py-24 text-center">
            <p className="text-lg font-semibold">No dishes match</p>
            <p className="mt-1 text-[15px]" style={{ color: t.textMuted }}>Try another search or clear the filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: t.accent, color: t.accentText, ...focusRing }}
            >
              Show the full menu
            </button>
          </div>
        ) : (
          p.grouped.map(([cat, items]) => (
            <section key={cat} aria-labelledby={`cat-${cat}`} className="mb-14 scroll-mt-40">
              <div className="mb-5 flex items-baseline gap-3 border-b pb-3" style={{ borderColor: t.border }}>
                <h2 id={`cat-${cat}`} className={`min-w-0 text-2xl font-semibold tracking-tight sm:text-[1.75rem] ${t.catClass ?? ''}`} style={{ color: t.textPrimary }}>
                  {cat}
                </h2>
                <span className="shrink-0 text-[13px] tabular-nums" style={{ color: t.textMuted }}>
                  {items.length} {items.length === 1 ? 'dish' : 'dishes'}
                </span>
              </div>

              {/* One column on phones, two on laptops, three on large monitors. */}
              <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => p.openItem(item)}
                    onKeyDown={keyOpen(() => p.openItem(item))}
                    className={`group flex min-w-0 cursor-pointer gap-4 border p-3 transition-[border-color,box-shadow] hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-4 ${item.availability ? '' : 'opacity-60'}`}
                    style={{ background: t.cardBg, borderColor: t.cardBorder, borderRadius: radius, ...focusRing }}
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start gap-2">
                        <h3 className="min-w-0 flex-1 text-[15px] font-semibold leading-snug [overflow-wrap:anywhere]" style={{ color: t.textPrimary }}>
                          {item.item}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-[15px] font-semibold tabular-nums" style={{ color: t.priceColor }}>
                        {price(item)}
                      </p>
                      {item.description && (
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed" style={{ color: t.textMuted }}>
                          {item.description}
                        </p>
                      )}
                      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2.5 empty:hidden" style={{ color: t.textMuted }}>
                        {item.popular && (
                          <span className="inline-flex h-5 items-center gap-1 rounded-full px-1.5 text-[11px] font-semibold" style={{ background: t.accent, color: t.accentText }}>
                            <PiStarFill className="size-2.5" aria-hidden /> Popular
                          </span>
                        )}
                        {!item.availability && <span className="text-[11px] font-medium">Not available today</span>}
                        <DietaryBadges item={item} />
                      </div>
                    </div>
                    <MenuItemImage
                      item={item}
                      primary={t.accent}
                      secondary={t.textMuted}
                      className="size-24 shrink-0 self-start sm:size-28"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <MenuChrome p={p} />

      {/* ── Pay bill: floating pill (full width on phones) ── */}
      {p.payBtn && Boolean(p.paymentLink) && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 sm:pb-6">
          <button
            type="button"
            onClick={p.onPay}
            className="pointer-events-auto mx-auto flex h-14 w-full items-center justify-center rounded-full text-base font-semibold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.98] sm:h-12 sm:w-auto sm:px-10"
            style={{ background: t.payBg, color: t.payText, ...focusRing }}
          >
            Pay bill
          </button>
        </div>
      )}

      <DishDetailSheet
        item={p.selectedItem ?? null}
        onClose={p.closeItem}
        currencySymbol={p.currencySymbol}
        c={{ surface: t.cardBg, border: t.border, textPrimary: t.textPrimary, textSecondary: t.textMuted, accent: t.accent, accentText: t.accentText, fontFamily: t.font }}
      />
    </div>
  );
}
