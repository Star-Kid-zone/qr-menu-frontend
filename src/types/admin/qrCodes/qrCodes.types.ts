import type { ReactNode } from 'react';
import type { DataModulesStyle, FinderPatternOuterStyle } from '@lglab/react-qr-code';

export type { DataModulesStyle, FinderPatternOuterStyle };

export type FinderPatternStyle =
  | 'square'
  | 'leaf-lg'
  | 'pinched-square'
  | 'circle'
  | 'heart'
  | 'rounded';

export type DataModuleStyle =
  | 'square'
  | 'box'
  | 'circle'
  | 'rounded'
  | 'plus'
  | 'leaf'
  | 'vertical-line'
  | 'horizontal-line'
  | 'diamond'
  | 'star'
  | 'heart'
  | 'circuit-board';

/* ── Frames ─────────────────────────────────────────────────────────────── */

/** What gets printed: the bare code, a portrait table card, or a sticker. */
export type QrLayout = 'none' | 'card' | 'sticker';
export type QrFrameFormat = Exclude<QrLayout, 'none'>;

/** Where a scan lands. Stored instead of a raw URL so an address change follows through. */
export type QrDestination = 'menu' | 'website';

/** The font roles a frame can use; each maps to a font the app already loads. */
export type QrFrameFont = 'serif' | 'sans' | 'display' | 'mono' | 'text';

/** Business groups a frame is drawn for (mirrors the studio's business families). */
export type QrFrameFamily = 'restaurants' | 'quick-casual' | 'cafes-sweets' | 'bars-lounges' | 'shops' | 'other';

export interface QrFramePalette {
  id: string;
  name: string;
  /** Card or sticker background. */
  paper: string;
  /** Text and QR dots. */
  ink: string;
  /** Ornaments and the corner eyes. */
  accent: string;
}

export interface QrFrameMeta {
  id: string;
  name: string;
  format: QrFrameFormat;
  /** 'all' = suits any business. */
  families: QrFrameFamily[] | 'all';
  /** Business type ids this frame is drawn for; they see it under "For you". */
  businessTypes: string[];
  palettes: QrFramePalette[];
}

/** Saved frame choices, part of the workspace QR config. */
export interface QrFrameSettings {
  layout: QrLayout;
  cardId: string;
  stickerId: string;
  paper: string;
  ink: string;
  accent: string;
  headline: string;
  subline: string;
  showName: boolean;
  tableNumbers: boolean;
  tablePrefix: string;
  /** Print size id from QR_PRINT_SIZES for the current layout. */
  printSize: string;
}

export interface QrFrameColors {
  paper: string;
  ink: string;
  accent: string;
}

/** Everything the page edits; saved as the workspace's qrCode config. */
export interface QrDesign {
  destination: QrDestination;
  margin: number;
  dataPattern: DataModuleStyle;
  dataColor: string;
  finderPattern: FinderPatternStyle;
  finderColor: string;
  backgroundFill: string;
  logo: string | null;
  frame: QrFrameSettings;
}

/** QR look, passed down to every place the code is drawn. */
export interface QrStyle {
  value: string;
  dataPattern: DataModuleStyle;
  dataColor: string;
  finderPattern: FinderPatternStyle;
  finderColor: string;
  backgroundFill: string;
  logo: string | null;
}

/** Draws the QR (on its plate) into a square slot of a frame. */
export type QrSlot = (x: number, y: number, size: number, options?: { radius?: number; pad?: number }) => ReactNode;

export interface QrFrameRenderProps {
  /** Unique per drawing, for clip paths and text paths. */
  uid: string;
  colors: QrFrameColors;
  headline: string;
  subline: string;
  /** Business name, '' when hidden. */
  name: string;
  /** e.g. "Table 12", '' when table numbers are off. */
  table: string;
  qr: QrSlot;
}

export interface QrPrintSize {
  id: string;
  label: string;
  hint: string;
  /** Width and height in millimetres. */
  mm: [number, number];
}

export interface QrPrintSheetLayout {
  columns: number;
  rows: number;
}

export type QrScanTone = 'good' | 'warn' | 'bad';

export interface QrScanIssue {
  tone: Exclude<QrScanTone, 'good'>;
  message: string;
}

export interface QrScanReport {
  tone: QrScanTone;
  issues: QrScanIssue[];
}

export interface QrTextPreset {
  headline: string;
  subline: string;
}

export type QrEditorTab = 'frame' | 'text' | 'style' | 'link';
export type QrFrameFilter = 'for-you' | 'all' | 'universal' | QrFrameFamily;
