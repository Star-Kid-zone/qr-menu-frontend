import type { ReactElement, ReactNode } from "react";

export interface TooltipProps {
  /** One short sentence saying what the control does. */
  content: ReactNode;
  /** The single control the tip describes (button, link). */
  children: ReactElement<{ "aria-describedby"?: string }>;
  /** Which edge of the control the tip lines up with. Use "end" for controls
   *  at the right edge of the page so the tip is never clipped. */
  align?: "start" | "center" | "end";
  /** Open above the control. Use inside containers that clip overflow below. */
  side?: "top" | "bottom";
  /** The control already has an accessible name (e.g. aria-label), so keep the
   *  tip visual-only instead of announcing it a second time. */
  decorative?: boolean;
  /** Hide the tip, e.g. while the control's own menu is open. */
  disabled?: boolean;
  className?: string;
}
