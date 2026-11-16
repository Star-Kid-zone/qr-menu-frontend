import type { WorkspacePalette, WorkspaceColorKey } from "@/types/workspace.types";
import { LANDING_ROLE_FIELD } from "./menuThemes";
import { resolvePartByColour } from "./studio/resolvePart";

/** The parts of the guest landing page an owner can tap in the preview and restyle. */
export type LandingPartId = "page" | "cards" | "text" | "accent" | "hero" | "words" | "show";

export type LandingControl =
  | { kind: "color"; name: WorkspaceColorKey; label: string; hint: string; paletteKey: keyof WorkspacePalette }
  | { kind: "font"; name: "font_family"; label: string; paletteKey: "fontFamily" }
  | { kind: "shape"; name: "card_style"; label: string; paletteKey: "cardStyle" }
  | { kind: "heading"; name: "heading_class"; label: string; paletteKey: "headingClass" }
  | { kind: "overlay"; name: "hero_overlay"; label: string; paletteKey: "heroOverlay" }
  | {
      kind: "text";
      name: "hero_tagline" | "theme_badge" | "theme_marquee";
      label: string;
      hint: string;
      placeholder: string;
      paletteKey: "heroTagline" | "badge" | "marqueeText";
    };

export interface LandingPartConfig {
  id: LandingPartId;
  label: string;
  summary: string;
  controls: LandingControl[];
}

export const LANDING_PARTS: LandingPartConfig[] = [
  {
    id: "page",
    label: "Page & footer",
    summary: "The background behind everything, the bands between sections, and the footer.",
    controls: [
      { kind: "color", name: "accent_color", label: "Page background", hint: "Behind everything", paletteKey: "accent" },
      { kind: "color", name: "section_bg_color", label: "Section bands", hint: "Alternating section backgrounds", paletteKey: "sectionBg" },
      { kind: "color", name: "footer_bg_color", label: "Footer background", hint: "Bottom of the page", paletteKey: "footerBg" },
    ],
  },
  {
    id: "cards",
    label: "Cards",
    summary: "The cards that hold offers, reviews and other content.",
    controls: [
      { kind: "color", name: "secondary_color", label: "Card background", hint: "Cards and surfaces", paletteKey: "secondary" },
      { kind: "color", name: "border_color", label: "Lines", hint: "Borders and dividers", paletteKey: "borderColor" },
      { kind: "shape", name: "card_style", label: "Card shape", paletteKey: "cardStyle" },
    ],
  },
  {
    id: "text",
    label: "Text",
    summary: "The typeface, heading style and text colours.",
    controls: [
      { kind: "font", name: "font_family", label: "Typeface", paletteKey: "fontFamily" },
      { kind: "heading", name: "heading_class", label: "Heading style", paletteKey: "headingClass" },
      { kind: "color", name: "text_primary_color", label: "Headings & body", hint: "Main text", paletteKey: "textPrimary" },
      { kind: "color", name: "text_secondary_color", label: "Supporting text", hint: "Descriptions and captions", paletteKey: "textSecondary" },
    ],
  },
  {
    id: "accent",
    label: "Buttons & highlights",
    summary: "The colour that draws the eye: buttons, links and highlights.",
    controls: [
      { kind: "color", name: "primary_color", label: "Highlight colour", hint: "Buttons, links, highlights", paletteKey: "primary" },
      { kind: "color", name: "accent_text_color", label: "Text on buttons", hint: "Label inside buttons", paletteKey: "accentText" },
    ],
  },
  {
    id: "hero",
    label: "Hero image",
    summary: "The big photo at the top of your page, and the tint laid over it.",
    controls: [{ kind: "overlay", name: "hero_overlay", label: "Photo tint", paletteKey: "heroOverlay" }],
  },
  {
    id: "words",
    label: "Wording",
    summary: "The short lines guests read at the top of your page.",
    controls: [
      { kind: "text", name: "hero_tagline", label: "Tagline", hint: "Under your name in the hero", placeholder: "Fresh flavours, made with care", paletteKey: "heroTagline" },
      { kind: "text", name: "theme_badge", label: "Badge", hint: "Small label above the tagline", placeholder: "Curated · Modern · Delicious", paletteKey: "badge" },
      { kind: "text", name: "theme_marquee", label: "Scrolling strip", hint: "Text that scrolls across the page", placeholder: "Modern Dining · Fresh Daily", paletteKey: "marqueeText" },
    ],
  },
  {
    id: "show",
    label: "What guests see",
    summary: "Choose which buttons and sections appear on your page.",
    controls: [],
  },
];

export function getLandingPart(id: LandingPartId): LandingPartConfig {
  return LANDING_PARTS.find((p) => p.id === id) ?? LANDING_PARTS[0];
}

const norm = (v: unknown): string => (typeof v === "string" ? v : "").trim().toLowerCase();

/** True when any control in the part differs from the template's own look. */
export function isLandingPartCustomised(
  part: LandingPartConfig,
  values: Record<string, unknown>,
  palette: WorkspacePalette | null | undefined
): boolean {
  if (!palette) return false;
  return part.controls.some((c) => {
    const base = palette[c.paletteKey];
    if (base == null) return false;
    return norm(values[c.name]) !== norm(base);
  });
}

/** Which part of the landing page the owner tapped in the preview. */
export function resolveLandingPart(target: Element, values: Record<string, unknown>): LandingPartId {
  return resolvePartByColour(target, values, {
    fields: LANDING_ROLE_FIELD,
    textPart: "text",
    accentPart: "accent",
    // Ties resolve cards first, then the page and its bands.
    backgrounds: [
      { role: "secondary", part: "cards" },
      { role: "sectionBg", part: "page" },
      { role: "accent", part: "page" },
      { role: "footerBg", part: "page" },
    ],
    fallback: "page",
    knownParts: LANDING_PARTS.map((p) => p.id as string),
  }) as LandingPartId;
}
