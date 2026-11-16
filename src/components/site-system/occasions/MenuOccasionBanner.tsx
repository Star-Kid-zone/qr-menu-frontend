"use client";

import { useMemo, type CSSProperties } from "react";
import { lookFromSettings } from "../kit/look";
import { siteLookCssVars } from "../tokens";
import { OccasionOverlay } from "./OccasionOverlay";

/**
 * The occasion banner at the top of a menu page. Rendered once by the menu
 * page (and the admin preview) above whichever menu structure is in use, so
 * all 22 structures and the default menu get it without each one adding it.
 */
export function MenuOccasionBanner({ settings, live = true }: { settings: Record<string, unknown> | null | undefined; live?: boolean }) {
  const look = useMemo(() => lookFromSettings(settings, "", "menu"), [settings]);
  if (!look.occasion) return null;
  return (
    <div style={siteLookCssVars(look) as CSSProperties}>
      <OccasionOverlay look={look} live={live} />
    </div>
  );
}
