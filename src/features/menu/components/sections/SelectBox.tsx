"use client";

import { useEffect, useRef } from "react";
import { PiCheckBold, PiMinusBold } from "react-icons/pi";
import { cn } from "@/utils/cn";

/**
 * Checkbox for picking dishes. The real input stays on top (invisible) so
 * keyboard, screen readers and clicks all work natively; the visible box is
 * drawn underneath. `indeterminate` is the "some selected" state of a
 * select-all box. `onImage` gives the empty box a dark backing so it stays
 * visible on top of any photo.
 */
export function SelectBox({
  checked,
  indeterminate = false,
  onChange,
  label,
  onImage = false,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
  onImage?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const mixed = indeterminate && !checked;
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);

  return (
    <span className={cn("relative inline-flex size-6 shrink-0", className)}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none flex size-6 items-center justify-center rounded-md border-2 text-primary-foreground transition-colors",
          onImage ? "border-white bg-black/40 backdrop-blur-sm" : "border-muted-foreground/60 bg-card",
          "peer-hover:border-primary peer-checked:border-primary peer-checked:bg-primary",
          mixed && "border-primary bg-primary",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
        )}
      >
        {checked ? <PiCheckBold className="size-3.5" /> : mixed ? <PiMinusBold className="size-3.5" /> : null}
      </span>
    </span>
  );
}
