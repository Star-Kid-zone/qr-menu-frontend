"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { MARGIN_PRESETS, RESOLUTION_PRESETS } from "../types";

interface QrResolutionCardProps {
  size: number;
  setSize: (size: number) => void;
  margin: number;
  setMargin: (margin: number) => void;
  printSizeCm: string;
  printSizeInches: string;
}

export function QrResolutionCard({
  size,
  setSize,
  margin,
  setMargin,
  printSizeCm,
  printSizeInches,
}: QrResolutionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Resolution */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="qr-size-range" className="font-semibold text-muted-foreground">
              Export Resolution
            </label>
            <span className="font-bold text-foreground">
              {size}&times;{size}px{" "}
              <span className="text-[10px] font-normal text-muted-foreground">
                (~{printSizeCm}cm / {printSizeInches}&quot; @ 300dpi)
              </span>
            </span>
          </div>
          <input
            id="qr-size-range"
            type="range"
            min="128"
            max="1024"
            step="32"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
          />
          <div className="flex flex-wrap items-center gap-1">
            {RESOLUTION_PRESETS.map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setSize(res)}
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-semibold transition-all",
                  size === res
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {res}px
              </button>
            ))}
          </div>
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="qr-margin-range" className="font-semibold text-muted-foreground">
              Quiet Zone (Border)
            </label>
            <span className="font-bold text-foreground">
              {margin} {margin === 1 ? "block" : "blocks"}
            </span>
          </div>
          <input
            id="qr-margin-range"
            type="range"
            min="0"
            max="8"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
          />
          <div className="flex flex-wrap items-center gap-1">
            {MARGIN_PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMargin(m)}
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-semibold transition-all",
                  margin === m
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {m === 0 ? "0 (Flush)" : `${m}b`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
