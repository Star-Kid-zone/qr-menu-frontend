"use client";

import {
  cloneElement,
  isValidElement,
  useId,
} from "react";
import { cn } from "@/utils/cn";
import type { TooltipProps } from "@/types/ui/Tooltip.types";

export type { TooltipProps };

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

