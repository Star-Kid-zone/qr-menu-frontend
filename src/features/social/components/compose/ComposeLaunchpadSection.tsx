"use client";

import React from "react";
import {
  PiCalendarBlankBold,
  PiClockBold,
  PiPaperPlaneTiltBold,
} from "react-icons/pi";
import { Button } from "@/shared/components";
import { cn } from "@/shared/utils";
import type { SocialAccount } from "@/services/social.service";
import type { ComposePlatformInfo } from "./types";

export interface ComposeLaunchpadSectionProps {
  accounts: SocialAccount[];
  selectedAccountIds: Set<string>;
  platforms: ComposePlatformInfo[];
  schedule: string;
  setSchedule: (schedule: string) => void;
  setScheduleOffsetMinutes: (minutes: number) => void;
  setScheduleTimeOfDay: (targetHour: number, daysAhead?: number) => void;
  busy: boolean;
  onPublishOrSchedule: (mode: "now" | "schedule") => void;
}

export function ComposeLaunchpadSection({
  accounts,
  selectedAccountIds,
  platforms,
  schedule,
  setSchedule,
  setScheduleOffsetMinutes,
  setScheduleTimeOfDay,
  busy,
  onPublishOrSchedule,
}: ComposeLaunchpadSectionProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 p-5 shadow-xs transition-all hover:border-primary/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-xs shadow-md shadow-primary/25 shrink-0">
            04
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Launchpad</h3>
            <p className="text-[11px] text-muted-foreground">
              Schedule for peak audience traffic or publish immediately
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground">Targeting:</span>
          <div className="flex flex-wrap items-center gap-1">
            {accounts
              .filter((a) => selectedAccountIds.has(a.id))
              .map((a) => {
                const platObj = platforms.find((p) => p.id === a.platform);
                return (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: platObj?.brandColor || "#1877F2" }}
                    title={a.displayName}
                  >
                    {platObj?.icon}
                    <span>{platObj?.name}</span>
                  </span>
                );
              })}
            {selectedAccountIds.size === 0 && (
              <span className="text-[11px] text-muted-foreground italic bg-muted px-2 py-0.5 rounded-md">
                No channels selected yet
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Schedule picker + presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <PiCalendarBlankBold className="size-4 text-primary" />
              <span>Schedule for Later:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <PiClockBold className="size-4 text-muted-foreground shrink-0" />
                <input
                  type="datetime-local"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="bg-transparent text-xs text-foreground focus:outline-none [color-scheme:dark]"
                />
              </div>

              {/* Quick Schedule Presets */}
              <button
                type="button"
                onClick={() => setScheduleOffsetMinutes(60)}
                className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                +1 Hour
              </button>
              <button
                type="button"
                onClick={() => setScheduleTimeOfDay(19, 0)}
                className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                Tonight (7 PM)
              </button>
              <button
                type="button"
                onClick={() => setScheduleTimeOfDay(12, 1)}
                className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                Tomorrow (12 PM)
              </button>

              {schedule && (
                <button
                  type="button"
                  onClick={() => setSchedule("")}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2 lg:pt-0 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={busy || !schedule || selectedAccountIds.size === 0}
              onClick={() => onPublishOrSchedule("schedule")}
              startIcon={<PiClockBold className="size-4" />}
              className="shadow-2xs"
            >
              Schedule Post
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={busy || selectedAccountIds.size === 0}
              onClick={() => onPublishOrSchedule("now")}
              startIcon={
                busy ? undefined : <PiPaperPlaneTiltBold className="size-4.5" />
              }
              loading={busy}
              className={cn(
                "font-bold px-6 shadow-md transition-all active:scale-95",
                selectedAccountIds.size > 0 &&
                  "bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-primary/20",
              )}
            >
              {selectedAccountIds.size === 0
                ? "Select Destination(s) to Publish"
                : `Publish to ${selectedAccountIds.size} Channel${selectedAccountIds.size > 1 ? "s" : ""} Now`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
