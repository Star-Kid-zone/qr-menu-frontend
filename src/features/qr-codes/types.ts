import type {
  DataModulesStyle,
  FinderPatternOuterStyle,
} from "@lglab/react-qr-code";
import type { WorkspaceQrCodeConfig } from "@/services/workspace.service";

export type FinderPatternStyle =
  | "square"
  | "leaf-lg"
  | "pinched-square"
  | "circle"
  | "heart"
  | "rounded";

export type DataModuleStyle =
  | "square"
  | "box"
  | "circle"
  | "rounded"
  | "plus"
  | "leaf"
  | "vertical-line"
  | "horizontal-line"
  | "diamond"
  | "star"
  | "heart"
  | "circuit-board";

export const finderStyles: { value: FinderPatternStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "leaf-lg", label: "Leaf" },
  { value: "pinched-square", label: "Pinched" },
  { value: "circle", label: "Circle" },
  { value: "heart", label: "Heart" },
  { value: "rounded", label: "Rounded" },
];

export const dataModuleStyles: { value: DataModuleStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "box", label: "Box" },
  { value: "circle", label: "Circle" },
  { value: "rounded", label: "Rounded" },
  { value: "plus", label: "Plus" },
  { value: "leaf", label: "Leaf" },
  { value: "vertical-line", label: "Vertical" },
  { value: "horizontal-line", label: "Horizontal" },
  { value: "diamond", label: "Diamond" },
  { value: "star", label: "Star" },
  { value: "heart", label: "Heart" },
  { value: "circuit-board", label: "Circuit" },
];

export function toReactQrModuleStyle(style: DataModuleStyle | string): DataModulesStyle {
  if (style === "box" || style === "square-sm") return "square-sm";
  if (style === "plus" || style === "hashtag") return "hashtag";
  return (style as DataModulesStyle) || "square";
}

export function toFinderOuterStyle(style: FinderPatternStyle): FinderPatternOuterStyle {
  if (style === "heart") return "circle";
  return style as FinderPatternOuterStyle;
}

export const defaultQrConfig: WorkspaceQrCodeConfig = {
  url: "",
  size: 512,
  margin: 4,
  dataPattern: "square",
  dataColor: "#1e1b4b",
  finderPattern: "square",
  finderColor: "#1e1b4b",
  backgroundFill: "#ffffff",
  logo: null,
};

export const RESOLUTION_PRESETS = [256, 384, 512, 672, 768, 1024];
export const MARGIN_PRESETS = [0, 2, 4, 6, 8];

export const RANDOM_COLOR_PRESETS = [
  { name: "Midnight Navy", bg: "#ffffff", module: "#1e1b4b", finder: "#312e81" },
  { name: "Emerald & Cream", bg: "#fafaf9", module: "#064e3b", finder: "#047857" },
  { name: "Crimson Luxe", bg: "#fff1f2", module: "#881337", finder: "#be123c" },
  { name: "Deep Teal", bg: "#f0fdfa", module: "#134e4a", finder: "#0f766e" },
  { name: "Obsidian & Gold", bg: "#ffffff", module: "#18181b", finder: "#d97706" },
  { name: "Royal Indigo", bg: "#f5f3ff", module: "#3730a3", finder: "#4f46e5" },
  { name: "Espresso Warmth", bg: "#fffbeb", module: "#451a03", finder: "#78350f" },
  { name: "Ocean Breeze", bg: "#f0f9ff", module: "#075985", finder: "#0284c7" },
  { name: "Classic Monochrome", bg: "#ffffff", module: "#09090b", finder: "#18181b" },
  { name: "Electric Purple", bg: "#ffffff", module: "#581c87", finder: "#7e22ce" },
  { name: "Terracotta Sunset", bg: "#fef2f2", module: "#7c2d12", finder: "#ea580c" },
  { name: "Nordic Forest", bg: "#f0fdf4", module: "#14532d", finder: "#15803d" },
  { name: "Cyber Night", bg: "#0f172a", module: "#38bdf8", finder: "#818cf8" },
  { name: "Dark Velvet", bg: "#18181b", module: "#f43f5e", finder: "#fb7185" },
  { name: "Gilded Obsidian", bg: "#09090b", module: "#fbbf24", finder: "#f59e0b" },
  { name: "Berry Plum", bg: "#fdf2f8", module: "#701a75", finder: "#a21caf" },
  { name: "Slate Minimal", bg: "#f8fafc", module: "#1e293b", finder: "#334155" },
  { name: "Charcoal Emerald", bg: "#ffffff", module: "#1c1917", finder: "#059669" },
];
