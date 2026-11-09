"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

interface TooltipProps {
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

/**
 * Hover and keyboard-focus tooltip shown below its control. Pure CSS (no state),
 * with a short hover delay so it doesn't flash while moving the pointer across
 * a toolbar. The tip is linked to the control with aria-describedby.
 */
export function Tooltip({
  content,
  children,
  align = "center",
  side = "bottom",
  decorative = false,
  disabled = false,
  className,
}: TooltipProps) {
  const id = useId();
  const showTip = !disabled && isValidElement(children);

  // The wrapper stays mounted when the tip is disabled, so toggling it never
  // remounts (and drops focus from) the control.
  return (
    <span className={cn("group/tip relative inline-flex", className)}>
      {showTip && !decorative ? cloneElement(children, { "aria-describedby": id }) : children}
      {showTip && (
        <span
          id={id}
          role={decorative ? undefined : "tooltip"}
          aria-hidden={decorative || undefined}
          className={cn(
            "pointer-events-none absolute z-50 w-max max-w-[16rem] rounded-md bg-foreground px-2.5 py-1.5 text-caption font-medium leading-snug text-background opacity-0 shadow-lg transition-opacity motion-reduce:transition-none",
            "group-hover/tip:opacity-100 group-hover/tip:delay-500 group-focus-within/tip:opacity-100",
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
            align === "start" && "left-0",
            align === "end" && "right-0",
            align === "center" && "left-1/2 -translate-x-1/2",
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export default Tooltip;
