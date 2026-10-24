"use client";

import React from "react";
import { PiSparkleFill, PiXBold } from "react-icons/pi";

export interface IndustryOnboardingBannerProps {
  show: boolean;
  itemCount: number;
  onDismiss: () => void;
}

export function IndustryOnboardingBanner({
  show,
  itemCount,
  onDismiss,
}: IndustryOnboardingBannerProps) {
  if (!show || itemCount === 0) return null;

  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground shadow-xs">
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <PiSparkleFill className="size-4" />
        </span>
        <div className="space-y-0.5">
          <p className="font-bold text-foreground">Starter Menu Loaded</p>
          <p className="text-muted-foreground leading-relaxed">
            We’ve pre-loaded sample dishes with photos, categories, and realistic prices so your digital QR menu is live immediately. You can customize, rename, reprice, or delete any dishes anytime!
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-lg p-1 text-muted-foreground hover:bg-primary/10 hover:text-foreground shrink-0 transition"
        title="Dismiss notice"
      >
        <PiXBold className="size-4" />
      </button>
    </div>
  );
}
