"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { PiImageBold, PiTrashBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import {
  RANDOM_COLOR_PRESETS,
  dataModuleStyles,
  finderStyles,
  type DataModuleStyle,
  type FinderPatternStyle,
} from "../types";

/** Small drawn shapes so owners pick by sight, not by name. */
function Glyph({ kind }: { kind: string }) {
  const common = { fill: "currentColor" } as const;
  switch (kind) {
    case "box":
      return <rect x="8" y="8" width="8" height="8" {...common} />;
    case "circle":
      return <circle cx="12" cy="12" r="7" {...common} />;
    case "rounded":
      return <rect x="5" y="5" width="14" height="14" rx="5" {...common} />;
    case "plus":
      return <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" {...common} />;
    case "leaf":
    case "leaf-lg":
      return <path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14z" {...common} />;
    case "vertical-line":
      return <rect x="9" y="3" width="6" height="18" rx="3" {...common} />;
    case "horizontal-line":
      return <rect x="3" y="9" width="18" height="6" rx="3" {...common} />;
    case "diamond":
      return <path d="M12 3l9 9-9 9-9-9z" {...common} />;
    case "star":
      return <path d="M12 3l2.7 6 6.3.6-4.8 4.2 1.5 6.2L12 16.7 6.3 20l1.5-6.2L3 9.6 9.3 9z" {...common} />;
    case "heart":
      return <path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 9c0 6-8 11-8 11z" {...common} />;
    case "circuit-board":
      return (
        <path d="M6 6h5v5h7v7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      );
    case "pinched-square":
      return <path d="M8 4h8l4 4v8l-4 4H8l-4-4V8z" {...common} />;
    default:
      return <rect x="5" y="5" width="14" height="14" {...common} />;
  }
}

function Tile({
  label,
  selected,
  onClick,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-border pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-body-medium text-foreground">{title}</h3>
      {children}
    </div>
  );
}

const PRINT_SIZES = [
  { label: "Small", hint: "Table card", px: 256 },
  { label: "Medium", hint: "Menu insert", px: 512 },
  { label: "Large", hint: "Poster", px: 1024 },
];

interface QrDesignPanelProps {
  moduleStyle: DataModuleStyle;
  setModuleStyle: (v: DataModuleStyle) => void;
  moduleColor: string;
  setModuleColor: (v: string) => void;
  finderStyle: FinderPatternStyle;
  setFinderStyle: (v: FinderPatternStyle) => void;
  finderColor: string;
  setFinderColor: (v: string) => void;
  bgColor: string;
  setBgColor: (v: string) => void;
  size: number;
  setSize: (v: number) => void;
  logo: string | null;
  setLogo: (v: string | null) => void;
  onLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  landingUrl: string;
  menuUrl: string;
  qrValue: string;
  setQrValue: (v: string) => void;
}

/** The QR design options, laid out as plain rows on the page. */
export function QrDesignPanel(p: QrDesignPanelProps) {
  const colorInput = (label: string, value: string, set: (v: string) => void) => (
    <label className="flex items-center justify-between gap-3 text-body text-foreground">
      {label}
      <span className="flex items-center gap-2">
        <span className="font-mono text-caption text-muted-foreground">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => set(e.target.value)}
          className="size-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
        />
      </span>
    </label>
  );

  return (
    <div className="space-y-5">
      <Row title="Colors">
        <div className="flex flex-wrap gap-2">
          {RANDOM_COLOR_PRESETS.map((c) => {
            const selected = c.bg === p.bgColor && c.module === p.moduleColor && c.finder === p.finderColor;
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={selected}
                onClick={() => {
                  p.setBgColor(c.bg);
                  p.setModuleColor(c.module);
                  p.setFinderColor(c.finder);
                }}
                style={{ backgroundColor: c.bg }}
                className={cn(
                  "relative size-11 rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/40"
                )}
              >
                <span className="absolute left-2 top-2 size-3 rounded-sm" style={{ backgroundColor: c.finder }} />
                <span className="absolute bottom-2 right-2 size-4 rounded-sm" style={{ backgroundColor: c.module }} />
              </button>
            );
          })}
        </div>
      </Row>

      <Row title="Dot shape">
        <div className="flex flex-wrap gap-2">
          {dataModuleStyles.map((s) => (
            <Tile key={s.value} label={s.label} selected={p.moduleStyle === s.value} onClick={() => p.setModuleStyle(s.value)}>
              <Glyph kind={s.value} />
            </Tile>
          ))}
        </div>
      </Row>

      <Row title="Corner shape">
        <div className="flex flex-wrap gap-2">
          {finderStyles.map((s) => (
            <Tile key={s.value} label={s.label} selected={p.finderStyle === s.value} onClick={() => p.setFinderStyle(s.value)}>
              <Glyph kind={s.value} />
            </Tile>
          ))}
        </div>
      </Row>

      <Row title="Logo in the middle">
        {p.logo ? (
          <div className="flex items-center gap-3">
            <div className="relative size-11 overflow-hidden rounded-lg border border-border bg-white">
              <Image src={p.logo} alt="Your logo" fill unoptimized className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => p.setLogo(null)}
              className="inline-flex items-center gap-1 text-body font-medium text-destructive hover:underline"
            >
              <PiTrashBold aria-hidden className="size-4" /> Remove logo
            </button>
          </div>
        ) : (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-body text-foreground hover:border-primary/40 hover:bg-primary/5 focus-within:outline-2 focus-within:outline-primary">
            <PiImageBold aria-hidden className="size-5 text-muted-foreground" />
            Add your logo
            <input type="file" accept="image/*" className="sr-only" onChange={p.onLogoUpload} />
          </label>
        )}
      </Row>

      <Row title="When guests scan, open">
        <div role="group" aria-label="Scan destination" className="inline-flex rounded-lg border border-border p-1">
          {[
            { label: "Menu", url: p.menuUrl },
            { label: "Website", url: p.landingUrl },
          ].map((o) => {
            const selected = Boolean(o.url) && p.qrValue === o.url;
            return (
              <button
                key={o.label}
                type="button"
                aria-pressed={selected}
                disabled={!o.url}
                onClick={() => p.setQrValue(o.url)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-body-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                  selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </Row>

      <details className="group border-t border-border pt-5">
        <summary className="cursor-pointer text-body-medium text-foreground marker:text-muted-foreground">
          More options
        </summary>
        <div className="mt-4 space-y-4">
          {colorInput("Dot color", p.moduleColor, p.setModuleColor)}
          {colorInput("Corner color", p.finderColor, p.setFinderColor)}
          {colorInput("Background", p.bgColor, p.setBgColor)}
          <div className="space-y-2">
            <p className="text-body text-foreground">Print size</p>
            <div className="grid grid-cols-3 gap-2">
              {PRINT_SIZES.map((s) => (
                <button
                  key={s.px}
                  type="button"
                  aria-pressed={p.size === s.px}
                  onClick={() => p.setSize(s.px)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                    p.size === s.px ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="block text-body-medium text-foreground">{s.label}</span>
                  <span className="block text-caption text-muted-foreground">{s.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
