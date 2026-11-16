"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PiStarFill, PiXBold } from "react-icons/pi";
import { MenuItemGallery } from "@/components/templates/core/MenuItemGallery";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { Menu } from "@/types";
import type { MenuStructureTheme } from "./buildMenuTheme";
import { DietaryBadges } from "./DietaryBadges";
import { itemDetailRows } from "@/components/site-system/menu-kit/attributes";
import { MenuChrome } from "@/components/site-system/menu-kit/chrome";

/** Colours the dish sheet needs — a subset of MenuStructureTheme, so the
 *  default menu (which has its own theme shape) can reuse it too. */
export interface DishSheetColors {
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  fontFamily?: string;
}

const noopSubscribe = () => () => {};
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Dish detail: a bottom sheet on phones (slides up, scrolls inside, clears the
 * home indicator) and a centred dialog on wider screens. Escape / backdrop /
 * close button dismiss it; focus is trapped inside and returned to the dish
 * the guest opened it from.
 */
export function DishDetailSheet({
  item,
  onClose,
  currencySymbol,
  c,
}: {
  item: Menu | null;
  onClose: () => void;
  currencySymbol: string;
  c: DishSheetColors;
}) {
  const reduced = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const open = Boolean(item);
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      returnTo?.focus?.();
    };
  }, [open, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" style={{ fontFamily: c.fontFamily }}>
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] shadow-2xl sm:max-h-[min(88dvh,820px)] sm:max-w-xl sm:rounded-[1.5rem]"
            style={{ background: c.surface, color: c.textPrimary }}
            initial={reduced ? { opacity: 0 } : { y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: 48, opacity: 0 }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: reduced ? 0.01 : 0.32 }}
          >
            {/* Drag-handle look (phones only) */}
            <span aria-hidden className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-white/80 shadow sm:hidden" />
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PiXBold className="size-4" aria-hidden />
            </button>

            <div className="overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <MenuItemGallery key={item.id} item={item} primary={c.accent} secondary={c.textSecondary} className="aspect-[4/3] w-full sm:aspect-[16/10]" />

              <div className="space-y-4 px-5 pt-5 sm:px-7 sm:pt-6">
                <div className="flex flex-wrap items-center gap-2 text-[13px]" style={{ color: c.textSecondary }}>
                  {item.category ? <span>{item.category}</span> : null}
                  {item.popular ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: c.accent, color: c.accentText }}>
                      <PiStarFill className="size-3" aria-hidden /> Popular
                    </span>
                  ) : null}
                  {!item.availability ? (
                    <span className="rounded-full border px-2 py-0.5 text-xs font-medium" style={{ borderColor: c.border }}>
                      Not available today
                    </span>
                  ) : null}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h2 id={titleId} className="min-w-0 text-[1.5rem] font-semibold leading-tight tracking-tight sm:text-[1.75rem]" style={{ textWrap: "balance" }}>
                    {item.item}
                  </h2>
                  {item.priceOptions?.length ? null : (
                    <p className="shrink-0 pt-0.5 text-xl font-semibold tabular-nums sm:text-2xl" style={{ color: c.accent }}>
                      {currencySymbol}
                      {item.price}
                    </p>
                  )}
                </div>

                {/* Sizes (site system): every size with its price. */}
                {item.priceOptions?.length ? (
                  <ul className="flex flex-wrap gap-2" aria-label="Sizes and prices">
                    {item.priceOptions.map((o) => (
                      <li key={o.label} className="rounded-xl border px-3.5 py-2" style={{ borderColor: c.border }}>
                        <span className="block text-xs" style={{ color: c.textSecondary }}>{o.label}</span>
                        <span className="block text-lg font-semibold tabular-nums" style={{ color: c.accent }}>
                          {currencySymbol}
                          {o.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {item.description ? (
                  <p className="max-w-[60ch] text-[15px] leading-relaxed" style={{ color: c.textSecondary }}>
                    {item.description}
                  </p>
                ) : null}

                {/* Item details (site system attribute sets), only when the owner filled some in. */}
                {(() => {
                  const rows = itemDetailRows(item);
                  if (!rows.length) return null;
                  return (
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t pt-4 text-sm" style={{ borderColor: c.border }}>
                      {rows.map((r) => (
                        <div key={r.key} className="min-w-0">
                          <dt className="text-xs" style={{ color: c.textSecondary }}>{r.label}</dt>
                          <dd className="break-words">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  );
                })()}

                <DietaryBadges item={item} detailed className="border-t pt-4" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Shared item-detail sheet reused by every menu structure. */
export function MenuItemDetailModal({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  return <DishDetailSheet item={p.selectedItem ?? null} onClose={p.closeItem} currencySymbol={p.currencySymbol} c={t} />;
}

/**
 * Shared floating "Pay bill" button: full-width bar on phones, a compact
 * centred pill on wider screens, clear of the home indicator.
 * Structures keep `pb-32` on their page wrapper so the last dishes can scroll
 * out from under it.
 */
export function MenuPayFooter({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  return (
    <>
      {/* Every original structure ends with this component, so this is where they get the age notice and footer. */}
      <MenuChrome p={p} />
      <PayBar p={p} t={t} />
    </>
  );
}

function PayBar({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  if (!(p.payBtn && p.paymentLink)) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 sm:pb-6">
      <button
        type="button"
        onClick={p.onPay}
        style={{ background: t.accent, color: t.accentText, fontFamily: t.fontFamily }}
        className="pointer-events-auto mx-auto flex h-14 w-full items-center justify-center rounded-full text-base font-semibold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/5 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.98] sm:h-12 sm:w-auto sm:px-10"
      >
        Pay bill
      </button>
    </div>
  );
}
