"use client";

import React from "react";
import { cn } from "@/utils/cn";

/** A titled group inside an editor panel. */
export function PanelSection({ title, hint, action, children }: { title: string; hint?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-border pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-body-medium text-foreground">{title}</h3>
          {hint ? <p className="mt-0.5 text-caption text-muted-foreground">{hint}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** A labelled native colour picker with its hex value. */
export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-body text-foreground">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-caption uppercase text-muted-foreground">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
        />
      </span>
    </label>
  );
}

/** Small toggle chip for filters and presets. */
export function Chip({ selected, onClick, children, title }: { selected?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Square choice tile with a ring when selected. */
export function ChoiceTile({ label, selected, onClick, className, children }: {
  label: string; selected: boolean; onClick: () => void; className?: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "border-primary bg-accent text-primary ring-1 ring-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
