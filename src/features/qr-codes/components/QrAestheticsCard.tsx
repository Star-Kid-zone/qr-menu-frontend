"use client";

import React from "react";
import { PiPaletteBold, PiShuffleBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import {
  dataModuleStyles,
  finderStyles,
  type DataModuleStyle,
  type FinderPatternStyle,
} from "../types";

interface QrAestheticsCardProps {
  moduleStyle: DataModuleStyle;
  setModuleStyle: (style: DataModuleStyle) => void;
  moduleColor: string;
  setModuleColor: (color: string) => void;
  finderStyle: FinderPatternStyle;
  setFinderStyle: (style: FinderPatternStyle) => void;
  finderColor: string;
  setFinderColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  onRandomizeColors: () => void;
}

export function QrAestheticsCard({
  moduleStyle,
  setModuleStyle,
  moduleColor,
  setModuleColor,
  finderStyle,
  setFinderStyle,
  finderColor,
  setFinderColor,
  bgColor,
  setBgColor,
  onRandomizeColors,
}: QrAestheticsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <PiPaletteBold size={14} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Aesthetics</p>
            <p className="text-sm font-bold text-foreground">Patterns &amp; Colors</p>
          </div>
        </div>

        {/* Randomize Colors Button */}
        <button
          type="button"
          onClick={onRandomizeColors}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-2xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 cursor-pointer"
          title="Randomly select colors for background, data pattern, and corner eyes"
        >
          <PiShuffleBold size={13} className="text-primary" />
          <span>Random Select</span>
        </button>
      </div>

      {/* Side-by-side grid for Data Pattern and Corner Eye Pattern */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column: Data Pattern + Color */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-foreground">Data Pattern</span>
              <p className="text-[10px] text-muted-foreground">Module shape</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground font-medium">Color</span>
              <input
                type="color"
                value={moduleColor}
                onChange={(e) => setModuleColor(e.target.value)}
                className="h-6 w-8 cursor-pointer rounded border border-border p-0"
                title="Data module color"
              />
              <span className="font-mono text-[10px] text-muted-foreground w-12 hidden sm:inline">
                {moduleColor}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
            {dataModuleStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => setModuleStyle(style.value)}
                className={cn(
                  "rounded-md border py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                  moduleStyle === style.value
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted"
                )}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Corner Eye Pattern + Color */}
        <div className="space-y-2 md:border-l md:border-border md:pl-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-foreground">Corner Eye Pattern</span>
              <p className="text-[10px] text-muted-foreground">Positioning markers</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground font-medium">Color</span>
              <input
                type="color"
                value={finderColor}
                onChange={(e) => setFinderColor(e.target.value)}
                className="h-6 w-8 cursor-pointer rounded border border-border p-0"
                title="Corner eye color"
              />
              <span className="font-mono text-[10px] text-muted-foreground w-12 hidden sm:inline">
                {finderColor}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {finderStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => setFinderStyle(style.value)}
                className={cn(
                  "rounded-md border py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                  finderStyle === style.value
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted"
                )}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background Color row */}
      <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
        <div>
          <p className="text-xs font-semibold text-foreground">Background Color</p>
          <p className="text-[10px] text-muted-foreground">
            Light backgrounds (#ffffff) provide the highest contrast and scan reliability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-6 w-8 cursor-pointer rounded border border-border p-0"
            title="Background fill color"
          />
          <span className="font-mono text-xs text-muted-foreground w-12 hidden sm:inline">
            {bgColor}
          </span>
        </div>
      </div>
    </div>
  );
}
