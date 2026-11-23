"use client";

import React, { ChangeEvent } from "react";
import Image from "@/components/ui/Image";
import { PiImageBold, PiTrashBold } from "react-icons/pi";
import {
  DATA_MODULE_STYLES,
  FINDER_STYLES,
  QR_FANCY_DOT_STYLES,
  QR_LOGO_ACCEPT,
  RANDOM_COLOR_PRESETS,
} from "@/constants/qrCodes.constants";
import type { QrDesign } from "@/types";
import { cn } from "@/utils/cn";
import { ChoiceTile, ColorField, PanelSection } from "./PanelParts";

/** Small drawn shapes so owners pick by sight, not by name. */
function Glyph({ kind }: { kind: string }) {
  const fill = { fill: "currentColor" } as const;
  switch (kind) {
    case "box":
      return <rect x="8" y="8" width="8" height="8" {...fill} />;
    case "circle":
      return <circle cx="12" cy="12" r="7" {...fill} />;
    case "rounded":
      return <rect x="5" y="5" width="14" height="14" rx="5" {...fill} />;
    case "plus":
      return <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" {...fill} />;
    case "leaf":
    case "leaf-lg":
      return <path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z" {...fill} />;
    case "vertical-line":
      return <rect x="9" y="3" width="6" height="18" rx="3" {...fill} />;
    case "horizontal-line":
      return <rect x="3" y="9" width="18" height="6" rx="3" {...fill} />;
    case "diamond":
      return <path d="M12 3l9 9-9 9-9-9z" {...fill} />;
    case "star":
      return <path d="M12 3l2.7 6 6.3.6-4.8 4.2 1.5 6.2L12 16.7 6.3 20l1.5-6.2L3 9.6 9.3 9z" {...fill} />;
    case "heart":
      return <path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 9c0 6-8 11-8 11z" {...fill} />;
    case "circuit-board":
      return <path d="M6 6h5v5h7v7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
    case "pinched-square":
      return <path d="M8 4h8l4 4v8l-4 4H8l-4-4V8z" {...fill} />;
    default:
      return <rect x="5" y="5" width="14" height="14" {...fill} />;
  }
}

interface QrStylePanelProps {
  design: QrDesign;
  onChange: (patch: Partial<QrDesign>) => void;
  onLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function QrStylePanel({ design, onChange, onLogoUpload }: QrStylePanelProps) {
  return (
    <div className="space-y-6">
      <PanelSection title="Code colours" hint="Dark dots on a light background scan best.">
        <div className="flex flex-wrap gap-2">
          {RANDOM_COLOR_PRESETS.map((c) => {
            const selected = c.bg === design.backgroundFill && c.module === design.dataColor && c.finder === design.finderColor;
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={selected}
                onClick={() => onChange({ backgroundFill: c.bg, dataColor: c.module, finderColor: c.finder })}
                style={{ backgroundColor: c.bg }}
                className={cn(
                  "relative size-11 rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/40",
                )}
              >
                <span className="absolute left-2 top-2 size-3 rounded-sm" style={{ backgroundColor: c.finder }} />
                <span className="absolute bottom-2 right-2 size-4 rounded-sm" style={{ backgroundColor: c.module }} />
              </button>
            );
          })}
        </div>
        <details>
          <summary className="cursor-pointer text-body text-muted-foreground hover:text-foreground">Pick your own colours</summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <ColorField label="Dots" value={design.dataColor} onChange={(dataColor) => onChange({ dataColor })} />
            <ColorField label="Corners" value={design.finderColor} onChange={(finderColor) => onChange({ finderColor })} />
            <ColorField label="Background" value={design.backgroundFill} onChange={(backgroundFill) => onChange({ backgroundFill })} />
          </div>
        </details>
      </PanelSection>

      <PanelSection title="Dot shape">
        <div className="flex flex-wrap gap-2">
          {DATA_MODULE_STYLES.map((s) => (
            <ChoiceTile
              key={s.value}
              label={QR_FANCY_DOT_STYLES.includes(s.value) ? `${s.label} (test before printing)` : s.label}
              selected={design.dataPattern === s.value}
              onClick={() => onChange({ dataPattern: s.value })}
              className="size-11"
            >
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                <Glyph kind={s.value} />
              </svg>
            </ChoiceTile>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Corner shape">
        <div className="flex flex-wrap gap-2">
          {FINDER_STYLES.map((s) => (
            <ChoiceTile key={s.value} label={s.label} selected={design.finderPattern === s.value} onClick={() => onChange({ finderPattern: s.value })} className="size-11">
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                <Glyph kind={s.value} />
              </svg>
            </ChoiceTile>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Logo in the middle" hint="With a logo the code adds extra error correction, so it still scans.">
        {design.logo ? (
          <div className="flex items-center gap-3">
            <div className="relative size-12 overflow-hidden rounded-lg border border-border bg-white">
              <Image src={design.logo} alt="Your logo" fill unoptimized className="object-contain" />
            </div>
            <label className="cursor-pointer text-body font-medium text-primary hover:underline focus-within:outline-2 focus-within:outline-primary">
              Replace
              <input type="file" accept={QR_LOGO_ACCEPT} className="sr-only" onChange={onLogoUpload} />
            </label>
            <button
              type="button"
              onClick={() => onChange({ logo: null })}
              className="inline-flex items-center gap-1 text-body font-medium text-destructive hover:underline"
            >
              <PiTrashBold aria-hidden className="size-4" /> Remove
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-body text-foreground hover:border-primary/40 hover:bg-accent/40 focus-within:outline-2 focus-within:outline-primary">
            <PiImageBold aria-hidden className="size-5 text-muted-foreground" />
            <span>
              <span className="block">Add your logo</span>
              <span className="block text-caption text-muted-foreground">PNG, JPG, WebP or SVG. Square works best.</span>
            </span>
            <input type="file" accept={QR_LOGO_ACCEPT} className="sr-only" onChange={onLogoUpload} />
          </label>
        )}
      </PanelSection>

      {design.frame.layout === "none" ? (
        <PanelSection title="Border around the code" hint="Cameras need a clear edge. 2 blocks or more is safest.">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={8}
              value={design.margin}
              aria-label="Border around the code, in blocks"
              onChange={(e) => onChange({ margin: Number(e.target.value) })}
              className="h-2 flex-1 cursor-pointer accent-primary"
            />
            <span className="w-20 text-right text-body text-foreground">
              {design.margin} {design.margin === 1 ? "block" : "blocks"}
            </span>
          </div>
        </PanelSection>
      ) : null}
    </div>
  );
}
