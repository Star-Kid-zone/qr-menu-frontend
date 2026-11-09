"use client";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/Notice";

interface IndustryOnboardingBannerProps {
  show: boolean;
  itemCount: number;
  onDismiss: () => void;
}

/** One-time note that the menu started from a starter menu. Dismissed for good. */
export function IndustryOnboardingBanner({ show, itemCount, onDismiss }: IndustryOnboardingBannerProps) {
  if (!show || itemCount === 0) return null;
  return (
    <Notice
      tone="info"
      className="shrink-0"
      action={
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Got it
        </Button>
      }
    >
      Your menu started with sample dishes. Change, reprice or delete any of them.
    </Notice>
  );
}
