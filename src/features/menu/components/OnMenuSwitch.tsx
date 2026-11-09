"use client";

import { cn } from "@/utils/cn";

/** Labelled switch for whether guests can see and order a dish ("Sold out" when off). */
export function OnMenuSwitch({
  dishName,
  on,
  busy,
  onToggle,
  showLabel = true,
}: {
  dishName: string;
  on: boolean;
  busy?: boolean;
  onToggle: () => void;
  showLabel?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${dishName} on menu`}
        disabled={busy}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50",
          on ? "bg-success" : "bg-input"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute left-0.5 top-0.5 size-5 rounded-full bg-card shadow-sm transition-transform motion-reduce:transition-none",
            on && "translate-x-4"
          )}
        />
      </button>
      {showLabel ? (
        <span className={cn("text-caption", on ? "text-foreground" : "text-muted-foreground")}>{on ? "On menu" : "Sold out"}</span>
      ) : null}
    </span>
  );
}
