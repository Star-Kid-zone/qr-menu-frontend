"use client";

import React from "react";
import { PiArrowRightBold, PiCheckBold } from "react-icons/pi";
import { cn } from "@/utils";
import {
  tokenStatusBadge,
  type SocialAccount,
  type SocialPlatform,
} from "@/services/social.service";
import type { ComposePlatformInfo } from "./types";

export interface ComposeDestinationsSectionProps {
  accounts: SocialAccount[];
  selectedAccountIds: Set<string>;
  setSelectedAccountIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  activeComposerPlatform: SocialPlatform | null;
  setActiveComposerPlatform: (platform: SocialPlatform | null) => void;
  onConnectPlatform: (platform: SocialPlatform) => void;
  platforms: ComposePlatformInfo[];
  connectedCount: number;
  selectAllConnected: () => void;
  deselectAll: () => void;
}

export function ComposeDestinationsSection({
  accounts,
  selectedAccountIds,
  setSelectedAccountIds,
  activeComposerPlatform,
  setActiveComposerPlatform,
  onConnectPlatform,
  platforms,
  connectedCount,
  selectAllConnected,
  deselectAll,
}: ComposeDestinationsSectionProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 p-6 shadow-xs transition-all hover:border-primary/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-xs shadow-md shadow-primary/25 shrink-0">
            02
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Destinations</span>
              {selectedAccountIds.size > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-caption font-bold">
                  {selectedAccountIds.size} Selected
                </span>
              )}
            </h3>
            <p className="text-caption text-muted-foreground">
              Choose which social channels will broadcast this campaign
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {connectedCount > 0 && (
            <>
              <button
                type="button"
                onClick={selectAllConnected}
                className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
              >
                Deselect
              </button>
            </>
          )}
          <span className="text-caption font-medium text-muted-foreground bg-muted/60 px-3 py-1 rounded-lg border border-border/50">
            {connectedCount} of {platforms.length} Connected
          </span>
        </div>
      </div>

      {/* Dynamic Platform Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
        {platforms.map((platform) => {
          const platformAccounts = accounts.filter((a) => a.platform === platform.id);
          const isConnected = platformAccounts.length > 0;

          if (!isConnected) {
            return (
              <div
                key={platform.id}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-4 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br transition-transform group-hover:scale-105",
                      platform.gradient,
                    )}
                  >
                    {platform.icon}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-bold text-foreground text-sm truncate">
                      {platform.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Not connected yet
                    </p>
                    <span className="inline-block text-caption text-muted-foreground/70">
                      {platform.capabilities}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onConnectPlatform(platform.id)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground shadow-2xs transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary group-hover:scale-105 active:scale-95 shrink-0"
                >
                  <span>Connect</span>
                  <PiArrowRightBold className="size-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            );
          }

          return platformAccounts.map((account) => {
            const isSelected = selectedAccountIds.has(account.id);
            const badge = tokenStatusBadge(account);

            return (
              <div
                key={account.id}
                onClick={() => {
                  setSelectedAccountIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(account.id)) next.delete(account.id);
                    else next.add(account.id);
                    return next;
                  });
                  if (!activeComposerPlatform) setActiveComposerPlatform(platform.id);
                }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all duration-200 select-none flex items-center justify-between gap-3",
                  isSelected
                    ? "border-primary/60 bg-gradient-to-r from-card to-primary/10 shadow-sm ring-1 ring-primary/30"
                    : "border-border/80 bg-card hover:border-border hover:bg-muted/30",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br transition-transform group-hover:scale-105",
                        platform.gradient,
                      )}
                    >
                      {platform.icon}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-success ring-2 ring-card shadow-xs" />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground text-sm truncate">
                        {platform.name}
                      </p>
                      <span
                        className="text-caption font-bold px-2 py-0.2 rounded-full"
                        style={{
                          color: badge.color,
                          backgroundColor: badge.color + "20",
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {account.username ? `@${account.username}` : account.displayName}
                    </p>
                    <span className="inline-block text-caption text-muted-foreground/70">
                      {platform.capabilities}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-lg border transition-all duration-200",
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground shadow-xs"
                        : "border-border bg-background text-transparent group-hover:border-primary/40",
                    )}
                  >
                    <PiCheckBold
                      className={cn(
                        "size-3.5 stroke-[3]",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
