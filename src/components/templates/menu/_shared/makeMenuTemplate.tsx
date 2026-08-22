'use client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MenuItemImage } from '@/components/templates/core/MenuImage';
import { useMenuTemplateData } from '@/components/templates/core/useTemplateData';
import { Modal } from '@/components/Modal';
import type { PublicMenuPayload } from '@/types/public-site';

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

// ── Animated filter chip ──────────────────────────────────────────────────────
function Chip({
  label,
  active,
  onClick,
  accent,
  accentText,
  bg,
  border,
  textMuted,
  reduced,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent: string;
  accentText: string;
  bg: string;
  border: string;
  textMuted: string;
  reduced: boolean | null;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all"
      style={
        active
          ? { background: accent, color: accentText, border: `1.5px solid ${accent}` }
          : { background: bg, color: textMuted, border: `1.5px solid ${border}` }
      }
      whileHover={reduced ? {} : { scale: 1.05 }}
      whileTap={reduced ? {} : { scale: 0.95 }}
      animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      {label}
    </motion.button>
  );
}

const CARD_RADIUS_MAP: Record<string, string> = {
  'rounded-none': '0',
  'rounded-lg':   '0.5rem',
  'rounded-xl':   '0.75rem',
  'rounded-2xl':  '1rem',
  'rounded-3xl':  '1.5rem',
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
    const r = useReducedMotion();

    // Merge workspace settings over the template's hardcoded defaults
    const t: MenuTheme = {
      ...theme,
      accent:      p.primary    || theme.accent,
      bg:          p.accent     || theme.bg,
      cardBg:      p.secondary  || theme.cardBg,
      textPrimary: p.textPrimary    || theme.textPrimary,
      textMuted:   p.textSecondary  || theme.textMuted,
      accentText:  p.accentText || theme.accentText,
      border:      p.borderColor || theme.border,
      cardBorder:  p.borderColor || theme.cardBorder,
      searchText:  p.textPrimary || theme.searchText,
      font:        p.fontFamily  || theme.font,
      cardRadius:  (p.cardStyle && CARD_RADIUS_MAP[p.cardStyle]) || theme.cardRadius,
    };

    // Are any filters active?
    const filtersActive = p.popularOnly || !!p.activeCategory || !!p.activeType;
    const showTypeRow = p.allTypes.length > 1;
    const showCatRow = p.allCategories.length > 1;
    const showFilters = p.hasPopular || showCatRow || showTypeRow;

    return (
      <div className="min-h-screen pb-36" style={{ background: t.bg, fontFamily: t.font, color: t.textPrimary }}>

        {/* ── Sticky header ── */}
        <header
          className="sticky top-0 z-20 px-4 py-4"
          style={{ background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, backdropFilter: 'blur(14px)' }}
        >
          <div className="mx-auto max-w-2xl space-y-3">

            {/* Business name + back */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className={`truncate text-lg xs:text-xl font-bold tracking-tight ${t.headingClass ?? ''}`} style={{ color: t.textPrimary }}>
                  {p.businessName}
                </h1>
                <p.LinkComponent
                  to={p.landingHref}
                  className="text-xs opacity-60 hover:opacity-100 transition-opacity underline underline-offset-2"
                  style={{ color: t.accent }}
                >
                  ← Back to Venue
                </p.LinkComponent>
              </div>
              {p.phone && (
                <a href={`tel:${p.phone}`} className="shrink-0 text-xs opacity-60" style={{ color: t.textMuted }}>
                  {p.phone}
                </a>
              )}
            </div>

            {/* Search */}
            <input
              type="search"
              value={p.searchQuery}
              onChange={(e) => p.setSearchQuery(e.target.value)}
              className="w-full rounded-full px-5 py-2.5 text-sm outline-none"
              style={{ background: t.searchBg, border: `1px solid ${t.searchBorder}`, color: t.searchText }}
              placeholder="Search menu…"
            />

            {/* ── Filter chips ── */}
            {showFilters && (
              <div className="space-y-2">

                {/* Popular + clear row */}
                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-0.5">
                  {p.hasPopular && (
                    <Chip
                      label="⭐ Popular"
                      active={p.popularOnly}
                      onClick={() => p.setPopularOnly(!p.popularOnly)}
                      accent={t.accent}
                      accentText={t.accentText}
                      bg={t.searchBg}
                      border={t.searchBorder}
                      textMuted={t.textMuted}
                      reduced={r}
                    />
                  )}
                  {showCatRow && p.allCategories.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      active={p.activeCategory === cat}
                      onClick={() => p.setActiveCategory(p.activeCategory === cat ? null : cat)}
                      accent={t.accent}
                      accentText={t.accentText}
                      bg={t.searchBg}
                      border={t.searchBorder}
                      textMuted={t.textMuted}
                      reduced={r}
                    />
                  ))}
                </div>

                {/* Type chips — only if multiple types exist */}
                {showTypeRow && (
                  <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-0.5">
                    {p.allTypes.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        active={p.activeType === type}
                        onClick={() => p.setActiveType(p.activeType === type ? null : type)}
                        accent={t.catColor}
                        accentText={t.accentText}
                        bg={t.searchBg}
                        border={t.searchBorder}
                        textMuted={t.textMuted}
                        reduced={r}
                      />
                    ))}
                  </div>
                )}

                {/* Clear all */}
                <AnimatePresence>
                  {filtersActive && (
                    <motion.button
                      type="button"
                      className="text-[10px] uppercase tracking-widest underline underline-offset-2 opacity-60 hover:opacity-100"
                      style={{ color: t.textMuted }}
                      onClick={() => {
                        p.setActiveCategory(null);
                        p.setActiveType(null);
                        p.setPopularOnly(false);
                      }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      ✕ Clear filters
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* ── Menu content ── */}
        <main className="mx-auto max-w-2xl px-4 py-8">
          <AnimatePresence mode="wait">
            {p.grouped.length === 0 ? (
              <motion.div
                key="empty"
                className="py-24 text-center"
                style={{ color: t.textMuted }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-4xl mb-3">🍽</p>
                <p className="text-sm italic">No items match your filters.</p>
                {filtersActive && (
                  <button
                    type="button"
                    className="mt-4 text-xs underline underline-offset-2 opacity-70"
                    style={{ color: t.accent }}
                    onClick={() => {
                      p.setActiveCategory(null);
                      p.setActiveType(null);
                      p.setPopularOnly(false);
                      p.setSearchQuery('');
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {p.grouped.map(([cat, items], ci) => (
                  <motion.section
                    key={cat}
                    className="mb-12"
                    initial={r ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: ci * 0.04 }}
                  >
                    {/* Category heading */}
                    <div className="mb-5 border-b pb-2" style={{ borderColor: t.border }}>
                      <div className="flex items-center justify-between gap-2">
                        <h2
                          className={`min-w-0 truncate text-[10px] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] ${t.catClass ?? ''}`}
                          style={{ color: t.catColor }}
                        >
                          {cat}
                        </h2>
                        <span className="shrink-0 text-[10px] opacity-40" style={{ color: t.textMuted }}>
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {items.map((item, ii) => (
                        <motion.div
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => p.openItem(item)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              p.openItem(item);
                            }
                          }}
                          className="group flex cursor-pointer gap-4 overflow-hidden p-3 transition-all"
                          style={{
                            background: t.cardBg,
                            border: `1px solid ${t.cardBorder}`,
                            borderRadius: t.cardRadius ?? '0.75rem',
                          }}
                          initial={r ? false : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.28, delay: ci * 0.04 + ii * 0.025 }}
                          whileHover={r ? {} : { scale: 1.01 }}
                        >
                          <MenuItemImage
                            item={item}
                            primary={t.accent}
                            secondary={t.textMuted}
                            className="h-20 w-20 shrink-0 rounded-lg object-cover"
                          />
                          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate font-bold leading-tight" style={{ color: t.textPrimary }}>
                                  {item.item}
                                </h3>
                                {/* Badges */}
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {item.popular && (
                                    <span
                                      className="inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
                                      style={{ background: t.accent, color: t.accentText }}
                                    >
                                      ⭐ Popular
                                    </span>
                                  )}
                                  {item.type && (
                                    <span
                                      className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                                      style={{ background: t.searchBg, color: t.catColor, border: `1px solid ${t.border}` }}
                                    >
                                      {item.type}
                                    </span>
                                  )}
                                  {!item.availability && (
                                    <span
                                      className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest opacity-70"
                                      style={{ background: t.searchBg, color: t.textMuted, border: `1px solid ${t.border}` }}
                                    >
                                      Unavailable
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span
                                className="shrink-0 font-mono text-sm font-bold tabular-nums"
                                style={{ color: t.priceColor }}
                              >
                                {p.currencySymbol}{item.price}
                              </span>
                            </div>
                            {item.description && (
                              <p
                                className="mt-1.5 line-clamp-2 text-xs leading-relaxed"
                                style={{ color: t.textMuted }}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── Pay button ── */}
        {p.payBtn && Boolean(p.paymentLink) && (
          <div
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
            style={{ background: t.headerBg, borderTop: `1px solid ${t.headerBorder}`, backdropFilter: 'blur(16px)' }}
          >
            <motion.button
              type="button"
              className="w-full rounded-2xl py-4 text-center text-sm font-black uppercase tracking-widest"
              style={{ background: t.payBg, color: t.payText }}
              onClick={p.onPay}
              whileHover={r ? {} : { scale: 1.01 }}
              whileTap={r ? {} : { scale: 0.98 }}
            >
              Settle Bill Securely
            </motion.button>
          </div>
        )}

        {/* ── Item detail modal ── */}
        <Modal isOpen={Boolean(p.selectedItem)} onClose={p.closeItem} title={p.selectedItem?.item ?? ''}>
          {p.selectedItem && (
            <div className="space-y-4">
              <MenuItemImage
                item={p.selectedItem}
                primary={t.accent}
                secondary={t.textMuted}
                className="h-48 w-full rounded-xl object-cover"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-lg font-bold" style={{ color: t.priceColor }}>
                  {p.currencySymbol}{p.selectedItem.price}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.selectedItem.popular && (
                    <span
                      className="inline-block rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
                      style={{ background: t.accent, color: t.accentText }}
                    >
                      ⭐ Popular
                    </span>
                  )}
                  {p.selectedItem.type && (
                    <span
                      className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
                      style={{ background: t.searchBg, color: t.catColor, border: `1px solid ${t.border}` }}
                    >
                      {p.selectedItem.type}
                    </span>
                  )}
                  {!p.selectedItem.availability && (
                    <span
                      className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest opacity-70"
                      style={{ background: t.searchBg, color: t.textMuted, border: `1px solid ${t.border}` }}
                    >
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
              {p.selectedItem.category && (
                <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: t.catColor }}>
                  {p.selectedItem.category}
                </p>
              )}
              {p.selectedItem.description && (
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                  {p.selectedItem.description}
                </p>
              )}
            </div>
          )}
        </Modal>
      </div>
    );
}

/** Legacy factory API — binds a fixed theme and returns a component taking only `{ payload, routeSlug }`. */
export function makeMenuTemplate(theme: MenuTheme) {
  return function MenuTemplate({ payload, routeSlug }: { payload: PublicMenuPayload; routeSlug: string | null }) {
    return <MenuTemplateRenderer theme={theme} payload={payload} routeSlug={routeSlug} />;
  };
}
