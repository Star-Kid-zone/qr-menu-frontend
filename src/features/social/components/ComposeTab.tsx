"use client";

import React, { useMemo } from "react";
import {
  PiFacebookLogoFill,
  PiInstagramLogoFill,
  PiLinkedinLogoFill,
  PiTiktokLogoFill,
} from "react-icons/pi";
import { SiX } from "react-icons/si";
import { PageHeader } from "@/components/ui";
import type { SocialAccount, SocialPlatform } from "@/services/social.service";
import type { ActivePosterInfo, RecurrenceRule, SocialTabId } from "../types";
import {
  ComposeMediaSection,
  ComposeDestinationsSection,
  ComposeCaptionSection,
  ComposeLaunchpadSection,
  type ComposePlatformInfo,
} from "./compose";

export interface ComposeTabProps {
  accounts: SocialAccount[];
  activePoster: ActivePosterInfo | null;
  setAssetId: (id: string) => void;
  setWeeklyPosterId: (id: string) => void;
  setPlatformAssetId: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  schedule: string;
  setSchedule: (schedule: string) => void;
  captions: Record<string, string>;
  setCaptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedAccountIds: Set<string>;
  setSelectedAccountIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  syncCaptions: boolean;
  setSyncCaptions: (sync: boolean) => void;
  activeComposerPlatform: SocialPlatform | null;
  setActiveComposerPlatform: (platform: SocialPlatform | null) => void;
  recurrenceRule: RecurrenceRule;
  setRecurrenceRule: (rule: RecurrenceRule) => void;
  recurrenceEndDate: string;
  setRecurrenceEndDate: (date: string) => void;
  busy: boolean;
  uploading: boolean;
  onUpload: (file?: File) => void;
  onPublishOrSchedule: (mode: "now" | "schedule") => void;
  onConnectPlatform: (platform: SocialPlatform) => void;
  setActiveTab: (tab: SocialTabId) => void;
}

export function ComposeTab({
  accounts,
  activePoster,
  setAssetId,
  setWeeklyPosterId,
  setPlatformAssetId,
  title,
  setTitle,
  schedule,
  setSchedule,
  captions,
  setCaptions,
  selectedAccountIds,
  setSelectedAccountIds,
  syncCaptions,
  setSyncCaptions,
  activeComposerPlatform,
  setActiveComposerPlatform,
  recurrenceRule,
  setRecurrenceRule,
  recurrenceEndDate,
  setRecurrenceEndDate,
  busy,
  uploading,
  onUpload,
  onPublishOrSchedule,
  onConnectPlatform,
  setActiveTab,
}: ComposeTabProps) {
  const COMPOSE_PLATFORMS: ComposePlatformInfo[] = useMemo(
    () => [
      {
        id: "instagram",
        name: "Instagram",
        subname: "Reels & Feed",
        capabilities: "Reels · Feed · Carousels",
        icon: <PiInstagramLogoFill className="size-5" />,
        brandColor: "#E1306C",
        gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
        glowShadow: "rgba(225, 48, 108, 0.35)",
      },
      {
        id: "facebook",
        name: "Facebook",
        subname: "Page & Videos",
        capabilities: "Page Posts · Videos · Feed",
        icon: <PiFacebookLogoFill className="size-5" />,
        brandColor: "#1877F2",
        gradient: "from-[#1877F2] to-[#0D65D9]",
        glowShadow: "rgba(24, 119, 242, 0.35)",
      },
      {
        id: "twitter",
        name: "Twitter / X",
        subname: "Short Updates & Media",
        capabilities: "Tweets · 280 chars · Media",
        icon: <SiX className="size-4" />,
        brandColor: "#FFFFFF",
        gradient: "from-neutral-800 to-black",
        glowShadow: "rgba(255, 255, 255, 0.2)",
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        subname: "Professional Network",
        capabilities: "Articles · Company Feed",
        icon: <PiLinkedinLogoFill className="size-5" />,
        brandColor: "#0A66C2",
        gradient: "from-[#0A66C2] to-[#004182]",
        glowShadow: "rgba(10, 102, 194, 0.35)",
      },
      {
        id: "tiktok",
        name: "TikTok",
        subname: "Short-form Vertical Reels",
        capabilities: "9:16 Video · Sound",
        icon: <PiTiktokLogoFill className="size-5" />,
        brandColor: "#FE2C55",
        gradient: "from-neutral-950 via-neutral-900 to-black",
        glowShadow: "rgba(254, 44, 85, 0.35)",
      },
    ],
    []
  );

  const connectedCount = useMemo(
    () => accounts.filter((a) => a.status === "connected").length,
    [accounts]
  );

  const selectAllConnected = () => {
    const ids = accounts.filter((a) => a.status === "connected").map((a) => a.id);
    setSelectedAccountIds(new Set(ids));
  };

  const deselectAll = () => {
    setSelectedAccountIds(new Set());
  };

  const setScheduleOffsetMinutes = (minutes: number) => {
    const target = new Date(Date.now() + minutes * 60 * 1000);
    const local = new Date(target.getTime() - target.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setSchedule(local);
  };

  const setScheduleTimeOfDay = (targetHour: number, daysAhead = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(targetHour, 0, 0, 0);
    if (daysAhead === 0 && d.getTime() <= Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setSchedule(local);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Top Header */}
      <PageHeader
        className="shrink-0"
        title="Create a post"
        description="Write it once, choose where it goes, then post now or later."
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-4 pb-8">
          {/* STEP 1: MEDIA ASSET */}
          <ComposeMediaSection
            activePoster={activePoster}
            uploading={uploading}
            onUpload={onUpload}
            setActiveTab={setActiveTab}
            setAssetId={setAssetId}
            setWeeklyPosterId={setWeeklyPosterId}
            setPlatformAssetId={setPlatformAssetId}
            platforms={COMPOSE_PLATFORMS}
          />

          {/* STEP 2: DESTINATIONS */}
          <ComposeDestinationsSection
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}
            setSelectedAccountIds={setSelectedAccountIds}
            activeComposerPlatform={activeComposerPlatform}
            setActiveComposerPlatform={setActiveComposerPlatform}
            onConnectPlatform={onConnectPlatform}
            platforms={COMPOSE_PLATFORMS}
            connectedCount={connectedCount}
            selectAllConnected={selectAllConnected}
            deselectAll={deselectAll}
          />

          {/* STEP 3: CONTENT & CAPTIONS */}
          <ComposeCaptionSection
            title={title}
            setTitle={setTitle}
            captions={captions}
            setCaptions={setCaptions}
            syncCaptions={syncCaptions}
            setSyncCaptions={setSyncCaptions}
            activeComposerPlatform={activeComposerPlatform}
            setActiveComposerPlatform={setActiveComposerPlatform}
            selectedAccountIds={selectedAccountIds}
            accounts={accounts}
            platforms={COMPOSE_PLATFORMS}
            recurrenceRule={recurrenceRule}
            setRecurrenceRule={setRecurrenceRule}
            recurrenceEndDate={recurrenceEndDate}
            setRecurrenceEndDate={setRecurrenceEndDate}
          />

          {/* STEP 4: LAUNCHPAD */}
          <ComposeLaunchpadSection
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}
            platforms={COMPOSE_PLATFORMS}
            schedule={schedule}
            setSchedule={setSchedule}
            setScheduleOffsetMinutes={setScheduleOffsetMinutes}
            setScheduleTimeOfDay={setScheduleTimeOfDay}
            busy={busy}
            onPublishOrSchedule={onPublishOrSchedule}
          />
        </div>
      </div>
    </div>
  );
}
