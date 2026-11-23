"use client";

import React from "react";
import { ReactQRCode } from "@lglab/react-qr-code";
import { QR_LOGO_RATIO } from "@/constants/qrCodes.constants";
import type { QrStyle } from "@/types";
import { toFinderOuterStyle, toReactQrModuleStyle } from "../qrStyle.utils";

interface QrCodeMarkProps {
  style: QrStyle;
  x: number;
  y: number;
  size: number;
  /** Quiet zone in modules. Frames supply their own padding, so they pass 0. */
  margin?: number;
  /** Let the plate behind show through (frames draw a rounded plate). */
  transparent?: boolean;
}

/**
 * The scannable code as a nested <svg>, so it can sit inside frame artwork.
 * With a logo the strongest error correction (H) is used, because the logo
 * covers modules in the middle of the code.
 */
export function QrCodeMark({ style, x, y, size, margin = 0, transparent = false }: QrCodeMarkProps) {
  const logoPx = size * QR_LOGO_RATIO;
  return (
    <ReactQRCode
      value={style.value || "https://example.com"}
      size={size}
      marginSize={margin}
      level={style.logo ? "H" : "M"}
      background={transparent ? "transparent" : style.backgroundFill}
      dataModulesSettings={{ style: toReactQrModuleStyle(style.dataPattern), color: style.dataColor }}
      finderPatternInnerSettings={{ style: style.finderPattern, color: style.finderColor }}
      finderPatternOuterSettings={{ style: toFinderOuterStyle(style.finderPattern), color: style.finderColor }}
      imageSettings={style.logo ? { src: style.logo, width: logoPx, height: logoPx, excavate: true } : undefined}
      svgProps={{ x, y, width: size, height: size, "aria-hidden": true }}
    />
  );
}

let glyphPath: string | null = null;

/** A stand-in code for thumbnails: looks like a QR, costs a single path. */
function placeholderModules(): string {
  if (glyphPath) return glyphPath;
  const n = 25;
  const inFinder = (i: number, j: number) => (i < 8 && j < 8) || (i < 8 && j >= n - 8) || (i >= n - 8 && j < 8);
  let d = "";
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (inFinder(i, j)) continue;
      if (((i * 7 + j * 13 + i * j * 3) % 5) < 2) d += `M${j} ${i}h1v1h-1z`;
    }
  }
  glyphPath = d;
  return d;
}

export function QrGlyph({ style, x, y, size }: { style: QrStyle; x: number; y: number; size: number }) {
  const n = 25;
  const finder = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx} y={fy} width={7} height={7} fill={style.finderColor} />
      <rect x={fx + 1} y={fy + 1} width={5} height={5} fill={style.backgroundFill} />
      <rect x={fx + 2} y={fy + 2} width={3} height={3} fill={style.finderColor} />
    </g>
  );
  return (
    <svg x={x} y={y} width={size} height={size} viewBox={`0 0 ${n} ${n}`} aria-hidden>
      <path d={placeholderModules()} fill={style.dataColor} />
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}
