"use client";

import React from "react";
import {
  PiArrowsCounterClockwiseBold,
  PiFacebookLogoBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
  PiTiktokLogoBold,
  PiXLogoBold,
} from "react-icons/pi";
import { Badge, Button, PageHeader } from "@/components/ui";
import { cn } from "@/utils";
import {
  tokenDaysLeft,
  tokenStatusBadge,
  type SocialAccount,
  type SocialPlatform,
} from "@/services/social.service";

interface AccountsTabProps {
  accounts: SocialAccount[];
  loading: boolean;
  onRefresh: () => void;
  onConnect: (platform: SocialPlatform) => void;
  onDisconnectRequest: (account: SocialAccount) => void;
  /** Inside Settings > Connected accounts: no page heading, natural height. */
  embedded?: boolean;
}

export function AccountsTab({
  accounts,
  loading,
  onRefresh,
  onConnect,
  onDisconnectRequest,
  embedded = false,
}: AccountsTabProps) {
  const supportedPlatforms: {
    platform: SocialPlatform;
    name: string;
    apiName: string;
    color: string;
    gradient?: string;
    icon: React.ReactNode;
    isBeta?: boolean;
  }[] = [
    {
      platform: "facebook",
      name: "Facebook Page",
      apiName: "Posts to your Facebook Page",
      color: "#1877F2",
      icon: <PiFacebookLogoBold size={24} />,
    },
    {
      platform: "instagram",
      name: "Instagram Professional",
      apiName: "Posts to a professional account",
      color: "#E1306C",
      gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
      icon: <PiInstagramLogoBold size={24} />,
    },
    {
      platform: "twitter",
      name: "Twitter / X",
      apiName: "Posts to your X account",
      color: "#000000",
      icon: <PiXLogoBold size={22} />,
    },
    {
      platform: "linkedin",
      name: "LinkedIn",
      apiName: "Posts to your company page",
      color: "#0A66C2",
      icon: <PiLinkedinLogoBold size={24} />,
    },
    {
      platform: "tiktok",
      name: "TikTok",
      apiName: "Short videos",
      color: "#FE2C55",
      icon: <PiTiktokLogoBold size={24} />,
      isBeta: true,
    },
  ];

  return (
    <div className={embedded ? "flex flex-col gap-4" : "flex h-full min-h-0 flex-col gap-4"}>
      {embedded ? null : <PageHeader
        className="shrink-0"
        title="Connected accounts"
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            startIcon={<PiArrowsCounterClockwiseBold className="size-4" />}
          >
            Refresh status
          </Button>
        }
      />}

      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {supportedPlatforms.map((item) => {
          const acct = accounts.find((a) => a.platform === item.platform);
          const isConnected = !!acct && acct.status === "connected";
          const badge = acct ? tokenStatusBadge(acct) : null;
          const daysLeft = acct ? tokenDaysLeft(acct) : null;
          const expiringSoon = isConnected && daysLeft !== null && daysLeft <= 14;

          return (
            <li key={item.platform} className="flex items-center gap-3 p-4">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg text-white",
                  item.gradient ? `bg-gradient-to-tr ${item.gradient}` : "",
                )}
                style={!item.gradient ? { backgroundColor: item.color } : {}}
              >
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-body-medium text-foreground">
                  <span className="truncate">{item.name}</span>
                  {item.isBeta ? <Badge tone="warning" className="text-caption">Beta</Badge> : null}
                </p>
                <p className="truncate text-body text-muted-foreground">
                  {isConnected && acct ? (
                    <>
                      <span className="text-foreground">{acct.username ? `@${acct.username}` : acct.displayName}</span>
                      {expiringSoon ? (
                        <span className="text-destructive"> · Reconnect within {daysLeft} days</span>
                      ) : badge ? (
                        <span style={{ color: badge.color }}> · {badge.label}</span>
                      ) : null}
                    </>
                  ) : item.isBeta ? (
                    "Coming soon"
                  ) : (
                    "Not connected"
                  )}
                </p>
              </div>

              {isConnected && acct ? (
                <Button type="button" variant="secondary" size="sm" onClick={() => onDisconnectRequest(acct)}>
                  Disconnect
                </Button>
              ) : item.isBeta ? null : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onConnect(item.platform)}
                  aria-label={`Connect ${item.name}`}
                  disabled={loading}
                >
                  Connect
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
