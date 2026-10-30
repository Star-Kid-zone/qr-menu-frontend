"use client";

import React from "react";
import {
  PiTagBold,
  PiSparkleBold,
  PiHashBold,
  PiRepeatBold,
} from "react-icons/pi";
import { cn } from "@/utils";
import {
  PLATFORM_META,
  type SocialAccount,
  type SocialPlatform,
} from "@/services/social.service";
import { POPULAR_HASHTAGS } from "../../constants";
import type { RecurrenceRule } from "../../types";
import type { ComposePlatformInfo } from "./types";

export interface ComposeCaptionSectionProps {
  title: string;
  setTitle: (title: string) => void;
  captions: Record<string, string>;
  setCaptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  syncCaptions: boolean;
  setSyncCaptions: (sync: boolean) => void;
  activeComposerPlatform: SocialPlatform | null;
  setActiveComposerPlatform: (platform: SocialPlatform | null) => void;
  selectedAccountIds: Set<string>;
  accounts: SocialAccount[];
  platforms: ComposePlatformInfo[];
  recurrenceRule: RecurrenceRule;
  setRecurrenceRule: (rule: RecurrenceRule) => void;
  recurrenceEndDate: string;
  setRecurrenceEndDate: (date: string) => void;
}

export function ComposeCaptionSection({
  title,
  setTitle,
  captions,
  setCaptions,
  syncCaptions,
  setSyncCaptions,
  activeComposerPlatform,
  setActiveComposerPlatform,
  selectedAccountIds,
  accounts,
  platforms,
  recurrenceRule,
  setRecurrenceRule,
  recurrenceEndDate,
  setRecurrenceEndDate,
}: ComposeCaptionSectionProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 p-5 shadow-xs transition-all hover:border-primary/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-xs shadow-md shadow-primary/25 shrink-0">
            03
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Content &amp; Captions</h3>
            <p className="text-[11px] text-muted-foreground">
              Compose customized copy per platform or mirror one unified caption
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer bg-muted/40 px-3 py-1.5 rounded-xl border border-border/60 hover:text-foreground transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={syncCaptions}
              onChange={(e) => {
                const checked = e.target.checked;
                setSyncCaptions(checked);
                if (checked) {
                  const first =
                    Object.values(captions).find((c) => c.trim()) || "";
                  if (first) {
                    const sync: Record<string, string> = { all: first };
                    selectedAccountIds.forEach((id) => {
                      sync[id] = first;
                    });
                    (
                      ["facebook", "instagram", "twitter", "linkedin", "tiktok"] as const
                    ).forEach((p) => {
                      sync[p] = first;
                    });
                    setCaptions((prev) => ({ ...prev, ...sync }));
                  }
                }
              }}
              className="size-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="font-semibold text-foreground">
              Mirror caption across all channels
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {/* Campaign title */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <PiTagBold className="size-3.5 text-primary" />
            <span>Campaign Title (optional internal note)</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekend Brunch Special or Chef's Tasting Menu"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Per-Platform Switcher Tabs (when not synced) */}
        {!syncCaptions && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Customize by Channel:
              </span>
              <span className="text-[11px] text-muted-foreground">
                Each network enforces unique length limits and formatting
              </span>
            </div>

            <div className="flex gap-2 border-b border-border/60 pb-2 overflow-x-auto">
              {platforms.map((plat) => {
                const meta = PLATFORM_META[plat.id];
                const currentPlat = activeComposerPlatform || "instagram";
                const isTabActive = currentPlat === plat.id;
                const platCaption =
                  captions[plat.id] ?? (captions["all"] ?? "");
                const charCount = platCaption.length;
                const isOver = meta.maxCaptionLength
                  ? charCount > meta.maxCaptionLength
                  : false;

                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => setActiveComposerPlatform(plat.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-2xs",
                      isTabActive
                        ? "text-white shadow-sm ring-1 ring-white/20"
                        : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                    style={
                      isTabActive
                        ? {
                            backgroundColor: plat.brandColor,
                            borderColor: plat.brandColor,
                          }
                        : {}
                    }
                  >
                    <span className="text-xs">{plat.icon}</span>
                    <span>{plat.name}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-md font-mono",
                        isOver
                          ? "bg-red-500 text-white font-bold"
                          : isTabActive
                            ? "bg-black/30 text-white/95"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {charCount}/{meta.maxCaptionLength}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Textarea */}
        {syncCaptions ? (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <PiSparkleBold className="size-3.5 text-primary" />
                <span>Unified Caption (Mirrored across all connected platforms)</span>
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {(captions["all"] ?? Object.values(captions)[0] ?? "").length} characters
              </span>
            </div>
            <textarea
              value={captions["all"] ?? Object.values(captions)[0] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                const sync: Record<string, string> = { all: v };
                selectedAccountIds.forEach((id) => {
                  sync[id] = v;
                });
                (
                  ["facebook", "instagram", "twitter", "linkedin", "tiktok"] as const
                ).forEach((p) => {
                  sync[p] = v;
                });
                setCaptions((prev) => ({ ...prev, ...sync }));
              }}
              placeholder="Write an appetizing description of your special, include ingredients, timing, and calls to action..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all leading-relaxed"
            />
          </div>
        ) : (
          (() => {
            const plat = activeComposerPlatform || "instagram";
            const meta = PLATFORM_META[plat];
            const currentPlatObj = platforms.find((p) => p.id === plat);
            const currentVal = captions[plat] ?? (captions["all"] ?? "");
            const charCount = currentVal.length;
            const isOver = meta.maxCaptionLength
              ? charCount > meta.maxCaptionLength
              : false;

            return (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span
                      className="flex size-5 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-2xs"
                      style={{ backgroundColor: meta.color }}
                    >
                      {currentPlatObj?.icon}
                    </span>
                    <span>{meta.label} Custom Caption</span>
                    {plat === "twitter" && (
                      <span className="text-[10px] text-muted-foreground font-normal">
                        (Tweet limit: 280 chars)
                      </span>
                    )}
                    {plat === "instagram" && (
                      <span className="text-[10px] text-muted-foreground font-normal">
                        (Reel &amp; Feed caption)
                      </span>
                    )}
                    {plat === "linkedin" && (
                      <span className="text-[10px] text-muted-foreground font-normal">
                        (Professional post)
                      </span>
                    )}
                  </label>
                  <span
                    className={cn(
                      "text-[11px] font-mono",
                      isOver ? "text-red-500 font-bold" : "text-muted-foreground",
                    )}
                  >
                    {charCount} / {meta.maxCaptionLength} {isOver && "⚠️ EXCEEDS LIMIT"}
                  </span>
                </div>
                <textarea
                  value={currentVal}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCaptions((prev) => {
                      const next = { ...prev, [plat]: v };
                      const matchedAcc = accounts.find((a) => a.platform === plat);
                      if (matchedAcc) next[matchedAcc.id] = v;
                      return next;
                    });
                  }}
                  placeholder={`Write custom ${meta.label} caption with relevant tags...`}
                  rows={4}
                  className={cn(
                    "w-full rounded-xl border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:outline-none focus:ring-1 transition-all leading-relaxed",
                    isOver
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-border focus:border-primary focus:ring-primary",
                  )}
                />
              </div>
            );
          })()
        )}

        {/* Quick Hashtags Toolbar */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <PiHashBold className="size-3 text-primary" />
              <span>Popular Restaurant Hashtags</span>
            </p>
            <span className="text-[10px] text-muted-foreground">Click to append</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_HASHTAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const plat = activeComposerPlatform || "instagram";
                  if (syncCaptions) {
                    const prevAll =
                      captions["all"] ?? Object.values(captions)[0] ?? "";
                    const nextVal = prevAll ? `${prevAll} ${tag}` : tag;
                    const sync: Record<string, string> = { all: nextVal };
                    selectedAccountIds.forEach((id) => {
                      sync[id] = nextVal;
                    });
                    (
                      ["facebook", "instagram", "twitter", "linkedin", "tiktok"] as const
                    ).forEach((p) => {
                      sync[p] = nextVal;
                    });
                    setCaptions((prev) => ({ ...prev, ...sync }));
                  } else {
                    const prevPlat =
                      captions[plat] ?? (captions["all"] ?? "");
                    const nextVal = prevPlat ? `${prevPlat} ${tag}` : tag;
                    setCaptions((prev) => {
                      const next = { ...prev, [plat]: nextVal };
                      const matchedAcc = accounts.find((a) => a.platform === plat);
                      if (matchedAcc) next[matchedAcc.id] = nextVal;
                      return next;
                    });
                  }
                }}
                className="flex items-center gap-1 rounded-full border border-border/80 bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95 shadow-2xs"
              >
                <span className="text-primary/70">#</span>
                <span>{tag.replace(/^#/, "")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recurring Post / Autopilot Section */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary shadow-xs shrink-0">
                <PiRepeatBold className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>Recurring Post (Autopilot)</span>
                  <span className="rounded-full bg-primary/20 px-2 py-0.2 text-[9px] font-bold text-primary">
                    Smart Automation
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Automatically re-publish weekly specials, happy hours, or seasonal promos
                </p>
              </div>
            </div>

            <select
              value={recurrenceRule}
              onChange={(e) => setRecurrenceRule(e.target.value as any)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none shadow-2xs"
            >
              <option value="">Don't repeat</option>
              <option value="daily">Repeat Daily</option>
              <option value="weekly">Repeat Weekly</option>
              <option value="biweekly">Repeat Every 2 Weeks</option>
              <option value="monthly">Repeat Monthly</option>
            </select>
          </div>

          {recurrenceRule && (
            <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-border/40">
              <label className="text-[11px] font-bold text-muted-foreground shrink-0">
                Autopilot End Date:
              </label>
              <input
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none shadow-2xs"
              />
              {recurrenceEndDate && (
                <button
                  type="button"
                  onClick={() => setRecurrenceEndDate("")}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline"
                >
                  Clear end date
                </button>
              )}
              <span className="text-[10px] text-primary font-medium ml-auto">
                Will generate next post automatically when current post succeeds.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
