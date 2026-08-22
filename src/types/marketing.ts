import type { IconType } from "react-icons";

export interface PosterTextField {
  id: string;
  label: string;
  defaultText: string;
  maxLength: number;
  /** Position/size as a percentage of the poster's design width/height — scales cleanly at any render size. */
  xPct: number;
  yPct: number;
  widthPct: number;
  /** Font size as a percentage of the poster's design width (converted to px at render time). */
  fontSizePct: number;
  fontWeight: number | string;
  color: string;
  align: "left" | "center" | "right";
  fontFamily?: string;
  lineHeight?: number;
  textTransform?: "none" | "uppercase" | "capitalize";
  letterSpacingPx?: number;
}

export type PosterDecoration =
  | { type: "rect"; xPct: number; yPct: number; widthPct: number; heightPct: number; color: string; borderRadiusPct?: number; opacity?: number; rotateDeg?: number }
  | { type: "circle"; xPct: number; yPct: number; sizePct: number; color: string; opacity?: number }
  | { type: "line"; xPct: number; yPct: number; widthPct: number; color: string; thicknessPx?: number; rotateDeg?: number }
  | { type: "icon"; xPct: number; yPct: number; sizePct: number; icon: IconType; color: string; opacity?: number };

export interface PosterTemplateConfig {
  slug: string;
  name: string;
  category: string;
  /** Design-space dimensions (e.g. 1080x1350) — only the ratio and the text/decoration percentages matter for rendering. */
  width: number;
  height: number;
  background: { type: "gradient"; value: string } | { type: "solid"; value: string };
  decorations: PosterDecoration[];
  textFields: PosterTextField[];
}

export interface PosterDesign {
  id: string;
  workspaceId: string;
  templateSlug: string;
  textValues: Record<string, string>;
  renderedImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
