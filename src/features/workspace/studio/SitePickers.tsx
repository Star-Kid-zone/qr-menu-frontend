"use client";

import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { SearchInput } from "@/components/ui";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { BUSINESS_TYPES, businessTypesByFamily, getBusinessType } from "@/components/site-system/business-types";
import { skinsByFamily, getSkin } from "@/components/site-system/skins";
import { LAYOUTS } from "@/components/templates/sections/layouts/registry";
import { BUSINESS_FAMILIES, SKIN_FAMILIES, type BusinessFamily, type Palette, type SkinDefinition, type SkinFamily } from "@/components/site-system/types";
import { BUSINESS_FAMILY_LABELS, SKIN_FAMILY_LABELS } from "@/constants/site.constants";

/**
 * Studio pickers for the site system (PLAN Step 8): business type, layout and
 * style. They only change form values (saved with the normal Save), so the
 * live preview updates as the owner clicks.
 */

const FAMILY_LABEL: Record<BusinessFamily, string> = BUSINESS_FAMILY_LABELS as unknown as Record<BusinessFamily, string>;

const SKIN_FAMILY_LABEL: Record<SkinFamily, string> = SKIN_FAMILY_LABELS as unknown as Record<SkinFamily, string>;

/* ───────────────────────── business type ───────────────────────── */

export function BusinessTypePicker({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => businessTypesByFamily(), []);
  const q = query.trim().toLowerCase();
  const match = (label: string, desc: string) => !q || label.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  return (
    <section aria-labelledby="bt-title" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id="bt-title" className="sr-only">What kind of place is it?</h3>
          
        </div>
        <div className="w-full sm:w-64">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search types" aria-label="Search business types" />
        </div>
      </div>
      <div className="space-y-4">
        {BUSINESS_FAMILIES.map((fam) => {
          const list = groups[fam].filter((b) => match(b.label, b.description));
          if (!list.length) return null;
          return (
            <div key={fam} role="radiogroup" aria-label={FAMILY_LABEL[fam]}>
              <p className="mb-2 text-caption font-medium text-muted-foreground">{FAMILY_LABEL[fam]}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((b) => {
                  const on = b.id === value;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      disabled={disabled}
                      onClick={() => onChange(b.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                        on ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50",
                      )}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                        <SiteIcon name={b.defaultIcon} size={20} iconStyle="line" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">{b.label}</span>
                        <span className="line-clamp-2 block text-xs text-muted-foreground">{b.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── layouts ───────────────────────── */

type Box = [number, number, number, number];

/** A thumbnail of each layout's structure (40×28), drawn in the chosen style's colours. */
const LAYOUT_THUMBS: Record<string, Box[]> = {
  "": [[4, 4, 32, 4], [4, 11, 32, 13]],
  split: [[3, 3, 11, 22], [17, 3, 20, 8], [17, 13, 20, 5], [17, 20, 20, 5]],
  minimal: [[3, 3, 34, 13], [3, 19, 10, 6], [15, 19, 10, 6], [27, 19, 10, 6]],
  magazine: [[3, 3, 22, 12], [27, 3, 10, 22], [3, 17, 22, 8]],
  cards: [[4, 3, 32, 6], [4, 11, 32, 6], [4, 19, 32, 6]],
  dashboard: [[3, 3, 20, 10], [25, 3, 12, 10], [3, 15, 12, 10], [17, 15, 20, 10]],
  tabs: [[4, 3, 8, 4], [14, 3, 8, 4], [24, 3, 8, 4], [4, 11, 32, 14]],
  story: [[3, 3, 15, 10], [20, 5, 17, 3], [20, 10, 17, 3], [22, 15, 15, 10], [3, 17, 17, 3], [3, 22, 17, 3]],
  "sidebar-right": [[3, 3, 22, 7], [3, 12, 22, 6], [3, 20, 22, 5], [28, 3, 9, 22]],
  compact: [[12, 3, 16, 5], [12, 10, 16, 4], [12, 16, 16, 4], [12, 22, 16, 3]],
  "horizontal-split": [[3, 3, 34, 8], [3, 13, 16, 12], [21, 13, 16, 12]],
  "grand-hall": [[16, 2, 8, 3], [4, 8, 14, 3], [4, 13, 10, 2], [23, 7, 13, 18]],
  "noir-salon": [[2, 2, 36, 24], [10, 11, 20, 5]],
  "atelier-editorial": [[2, 2, 5, 24], [9, 3, 29, 6], [9, 11, 19, 14], [30, 11, 8, 14]],
  conservatory: [[10, 2, 20, 3], [4, 10, 14, 3], [21, 8, 15, 17]],
  pier: [[6, 2, 28, 3], [2, 7, 36, 15], [2, 22, 36, 4]],
  ember: [[2, 2, 36, 3], [4, 9, 15, 6], [22, 6, 16, 20]],
  tatami: [[34, 2, 4, 24], [2, 2, 15, 24], [18, 2, 14, 24]],
  bazaar: [[2, 2, 36, 3], [4, 9, 14, 4], [21, 8, 15, 16]],
  "supper-club": [[12, 2, 16, 3], [10, 8, 20, 4], [7, 14, 26, 12]],
  "midnight-diner": [[2, 2, 36, 3], [4, 8, 20, 12], [27, 8, 10, 17]],
};

function Thumb({ boxes, palette, selected }: { boxes: Box[]; palette: Palette; selected: boolean }) {
  return (
    <svg viewBox="0 0 40 28" className="h-16 w-full rounded-md" aria-hidden style={{ background: palette.bg }}>
      {boxes.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={i === 0 ? palette.accent : i % 2 ? palette.surface : palette.band} stroke={palette.border} strokeWidth=".3" opacity={selected || i === 0 ? 1 : 0.9} />
      ))}
    </svg>
  );
}

export function LayoutGallery({
  value,
  recommended,
  palette,
  disabled,
  onChange,
}: {
  value: string;
  recommended: readonly string[];
  palette: Palette;
  disabled: boolean;
  onChange: (key: string) => void;
}) {
  const ordered = useMemo(() => {
    const rec = LAYOUTS.filter((l) => recommended.includes(l.key));
    return [...rec, ...LAYOUTS.filter((l) => !recommended.includes(l.key))];
  }, [recommended]);
  const tiles = [{ key: "", label: "Simple page", description: "One column, every section in order." }, ...ordered];
  return (
    <section aria-labelledby="layout-title" className="space-y-3">
      <div>
        <h3 id="layout-title" className="sr-only">Layout</h3>
        
      </div>
      <div role="radiogroup" aria-labelledby="layout-title" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((l) => {
          const on = l.key === value;
          const rec = recommended.includes(l.key);
          return (
            <button
              key={l.key || "default"}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={disabled}
              onClick={() => onChange(l.key)}
              title={l.description}
              className={cn(
                "space-y-2 rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                on ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50",
              )}
            >
              <Thumb boxes={LAYOUT_THUMBS[l.key] ?? LAYOUT_THUMBS[""]} palette={palette} selected={on} />
              <span className="flex flex-col items-start gap-0.5 px-0.5">
                <span className="text-sm font-medium leading-tight text-foreground">{l.label}</span>
                {rec ? <span className="text-xs font-medium text-primary">Suggested</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── styles ───────────────────────── */

function SkinCard({ skin, on, disabled, onPick }: { skin: SkinDefinition; on: boolean; disabled: boolean; onPick: () => void }) {
  const p = skin.palette;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      disabled={disabled}
      onClick={onPick}
      title={skin.description}
      className={cn(
        "overflow-hidden rounded-xl border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
        on ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50",
      )}
    >
      <span className="flex h-14 items-end justify-between gap-2 p-2" style={{ background: p.bg, color: p.text }}>
        <span className="truncate text-lg leading-none" style={{ fontFamily: skin.fonts.display }}>Aa</span>
        <span className="flex gap-1">
          {[p.accent, p.surface, p.band, p.footer].map((c, i) => (
            <span key={i} className="size-3.5 rounded-full border" style={{ background: c, borderColor: p.border }} />
          ))}
        </span>
      </span>
      <span className="block truncate px-2 py-1.5 text-xs font-medium text-foreground">{skin.label}</span>
    </button>
  );
}

export function StyleGallery({
  value,
  recommended,
  disabled,
  onChange,
}: {
  value: string;
  recommended: readonly string[];
  disabled: boolean;
  onChange: (skin: SkinDefinition) => void;
}) {
  const groups = useMemo(() => skinsByFamily(), []);
  const [family, setFamily] = useState<SkinFamily | "suggested">("suggested");
  const suggested = recommended.map((id) => getSkin(id)).filter((s): s is SkinDefinition => Boolean(s));
  const list = family === "suggested" ? suggested : groups[family];
  return (
    <section aria-labelledby="style-title" className="space-y-3">
      <div>
        <h3 id="style-title" className="sr-only">Style</h3>
        
      </div>
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Style families">
        {(["suggested", ...SKIN_FAMILIES] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={family === f}
            onClick={() => setFamily(f)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
              family === f ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f === "suggested" ? "Suggested" : SKIN_FAMILY_LABEL[f]}
          </button>
        ))}
      </div>
      {list.length ? (
        <div role="radiogroup" aria-labelledby="style-title" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((s) => (
            <SkinCard key={s.id} skin={s} on={s.id === value} disabled={disabled} onPick={() => onChange(s)} />
          ))}
        </div>
      ) : (
        <p className="text-caption text-muted-foreground">Choose a business type to see suggested styles, or pick a family above.</p>
      )}
    </section>
  );
}

export { skinFormValues } from "@/components/site-system/skins/formValues";
export { BUSINESS_TYPES, getBusinessType };
