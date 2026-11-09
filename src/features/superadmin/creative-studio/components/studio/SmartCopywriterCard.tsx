"use client";

import React from "react";
import { Card, Button } from "@/components/ui";
import { PiTextTBold, PiCopyBold } from "react-icons/pi";
import type { CopyVariant } from "../../types";

export interface SmartCopywriterCardProps {
  generatedImageUrl: string | null;
  generatedVideoUrl: string | null;
  copyVariants: CopyVariant[];
  generatingCopy: boolean;
  handleGenerateCopy: () => Promise<void>;
  copySuccessToast: (msg: string) => void;
}

export function SmartCopywriterCard({
  generatedImageUrl,
  generatedVideoUrl,
  copyVariants,
  generatingCopy,
  handleGenerateCopy,
  copySuccessToast,
}: SmartCopywriterCardProps) {
  if (!generatedImageUrl && !generatedVideoUrl) return null;

  return (
    <Card className="p-6 space-y-3 border-border">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <PiTextTBold className="h-4 w-4 text-primary" />
          Multi-Lingual Marketing Copy
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateCopy}
          disabled={generatingCopy}
        >
          {generatingCopy ? "Generating..." : "Auto-Generate Captions"}
        </Button>
      </div>

      {copyVariants.length > 0 && (
        <div className="space-y-3 pt-2">
          {copyVariants.map((variant, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-caption">
                  {variant.language || "English"}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(variant.caption ?? "");
                    copySuccessToast("Copied caption to clipboard!");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <PiCopyBold className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-muted-foreground">{variant.caption}</p>
              {variant.hashtags && (
                <p className="text-primary font-mono text-caption">
                  {variant.hashtags.join(" ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
