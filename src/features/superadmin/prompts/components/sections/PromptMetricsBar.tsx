"use client";

import React from "react";
import {
  PiImagesBold,
  PiVideoCameraBold,
  PiEyeBold,
  PiStarFill,
} from "react-icons/pi";

export interface PromptMetricsBarProps {
  metrics: {
    total: number;
    photos: number;
    videos: number;
    withRefs: number;
    favorites: number;
  };
}

export function PromptMetricsBar({ metrics }: PromptMetricsBarProps) {
  return (
    <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
        <span className="text-muted-foreground">Total:</span>
        <span className="font-bold text-foreground">{metrics.total}</span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
        <PiImagesBold className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-muted-foreground">Photos:</span>
        <span className="font-bold text-foreground">{metrics.photos}</span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
        <PiVideoCameraBold className="h-3.5 w-3.5 text-purple-500" />
        <span className="text-muted-foreground">Reels:</span>
        <span className="font-bold text-foreground">{metrics.videos}</span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
        <PiEyeBold className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-muted-foreground">With References:</span>
        <span className="font-bold text-foreground">{metrics.withRefs}</span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
        <PiStarFill className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-muted-foreground">Starred:</span>
        <span className="font-bold text-foreground">{metrics.favorites}</span>
      </div>
    </div>
  );
}
