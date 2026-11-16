'use client';

import React from 'react';
import type { MenuBlueprint, BlueprintSite } from '@/services/superadmin.service';
import { BUSINESS_TYPES } from '@/components/site-system/business-types/definitions';
import { getBusinessType } from '@/components/site-system/business-types';
import { SKINS } from '@/components/site-system/skins';
import { LAYOUTS } from '@/components/templates/sections/layouts/registry';

const SELECT = 'w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground';

/** Recommended ids first, then the rest in catalogue order. */
function recommendedFirst<T extends { id: string }>(all: readonly T[], recommended: readonly string[]): T[] {
  const top = recommended.map((id) => all.find((x) => x.id === id)).filter((x): x is T => Boolean(x));
  return [...top, ...all.filter((x) => !recommended.includes(x.id))];
}

/**
 * The guest-site look a new restaurant starts with: business type, layout and
 * style. With a style chosen, the style decides the colours (the colour
 * fields below are then not applied).
 */
export function BlueprintSiteSection({
  site,
  setFormData,
}: {
  site?: BlueprintSite;
  setFormData: React.Dispatch<React.SetStateAction<MenuBlueprint>>;
}) {
  const value: BlueprintSite = site ?? { businessType: '', layout: '', skinId: '' };
  const business = getBusinessType(value.businessType);
  const layouts = recommendedFirst(LAYOUTS.map((l) => ({ id: l.key, label: l.label })), business?.recommended.layouts ?? []);
  const skins = recommendedFirst(SKINS.map((s) => ({ id: s.id, label: s.label })), business?.recommended.skins ?? []);
  const set = (patch: Partial<BlueprintSite>) => setFormData((prev) => ({ ...prev, site: { ...value, ...prev.site, ...patch } }));

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/10 p-4">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground">Website look</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          New restaurants start with this. When a style is chosen, it sets the colours.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-xs font-bold text-foreground">
          <span className="mb-1 block">Business type</span>
          <select
            className={SELECT}
            value={value.businessType}
            onChange={(e) => {
              const next = getBusinessType(e.target.value);
              // Picking a type fills in its recommended layout and style; both can still be changed.
              set({
                businessType: e.target.value,
                layout: next?.recommended.layouts[0] ?? value.layout,
                skinId: next?.recommended.skins[0] ?? value.skinId,
              });
            }}
          >
            <option value="">Not set</option>
            {BUSINESS_TYPES.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-bold text-foreground">
          <span className="mb-1 block">Layout</span>
          <select className={SELECT} value={value.layout} onChange={(e) => set({ layout: e.target.value })}>
            <option value="">Default page</option>
            {layouts.map((l) => (
              <option key={l.id} value={l.id}>{l.label}{business?.recommended.layouts.includes(l.id) ? ' (recommended)' : ''}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-bold text-foreground">
          <span className="mb-1 block">Style</span>
          <select className={SELECT} value={value.skinId} onChange={(e) => set({ skinId: e.target.value })}>
            <option value="">None (use the colours below)</option>
            {skins.map((s) => (
              <option key={s.id} value={s.id}>{s.label}{business?.recommended.skins.includes(s.id) ? ' (recommended)' : ''}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
