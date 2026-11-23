import type { WorkspacePalette, WorkspaceColorKey } from "@/types/admin/workspace/workspace.types";
import { LANDING_ROLE_FIELD } from "./menuThemes";
import { resolvePartByColour } from "./studio/resolvePart";
import { LANDING_PARTS as CONST_LANDING_PARTS } from "@/constants/workspace.constants";

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

export const LANDING_PARTS: LandingPartConfig[] = CONST_LANDING_PARTS as unknown as LandingPartConfig[];

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
