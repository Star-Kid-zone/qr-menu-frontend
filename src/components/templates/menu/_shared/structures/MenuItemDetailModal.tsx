"use client";

import { Modal } from "@/components/Modal";
import { MenuItemGallery } from "@/components/templates/core/MenuItemGallery";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import type { MenuStructureTheme } from "./buildMenuTheme";
import { DietaryBadges } from "./DietaryBadges";

/** Shared item-detail modal reused by every menu structure — keeps the same
 * "tap an item to see the full description" affordance consistent across
 * layouts without duplicating the modal markup ten times. */
export function MenuItemDetailModal({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  return (
    <Modal isOpen={Boolean(p.selectedItem)} onClose={p.closeItem} title={p.selectedItem?.item ?? ""}>
      {p.selectedItem && (
        <div className="space-y-4">
          <MenuItemGallery key={p.selectedItem.id} item={p.selectedItem} primary={t.accent} secondary={t.textSecondary} className="h-48 w-full rounded-xl" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span style={{ color: t.accent }} className="font-mono text-lg font-bold">
              {p.currencySymbol}{p.selectedItem.price}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {p.selectedItem.popular && (
                <span style={{ background: t.accent, color: t.accentText }} className="inline-block rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                  ⭐ Popular
                </span>
              )}
              {p.selectedItem.type && (
                <span style={{ borderColor: t.border, color: t.textSecondary }} className="inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {p.selectedItem.type}
                </span>
              )}
              {!p.selectedItem.availability && (
                <span style={{ borderColor: t.border, color: t.textSecondary }} className="inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest opacity-70">
                  Unavailable
                </span>
              )}
            </div>
          </div>
          {p.selectedItem.category && (
            <p style={{ color: t.accent }} className="text-[10px] font-black uppercase tracking-[0.4em]">{p.selectedItem.category}</p>
          )}
          <DietaryBadges item={p.selectedItem} />
          {p.selectedItem.description && (
            <p style={{ color: t.textSecondary }} className="text-sm leading-relaxed">{p.selectedItem.description}</p>
          )}
        </div>
      )}
    </Modal>
  );
}

/** Shared "Settle Bill Securely" fixed footer, reused by every structure. */
export function MenuPayFooter({ p, t }: { p: PublicMenuTemplateProps; t: MenuStructureTheme }) {
  if (!(p.payBtn && p.paymentLink)) return null;
  return (
    <div style={{ background: t.surface, borderColor: t.border }} className="fixed bottom-0 left-0 right-0 z-40 border-t p-4 backdrop-blur">
      <button onClick={p.onPay} style={{ background: t.accent, color: t.accentText }} className="mx-auto block w-full max-w-2xl rounded-2xl py-4 text-center text-sm font-black uppercase tracking-widest">
        Settle Bill Securely
      </button>
    </div>
  );
}
