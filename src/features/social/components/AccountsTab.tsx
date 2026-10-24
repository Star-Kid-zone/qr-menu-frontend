"use client";

import React from "react";
import {
  PiArrowsCounterClockwiseBold,
  PiCheckCircleBold,
  PiFacebookLogoBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
  PiShieldCheckBold,
  PiTiktokLogoBold,
  PiXBold,
  PiXLogoBold,
} from "react-icons/pi";
import { Badge } from "@/shared/components";
import { Button } from "@/shared/components";
import { Card } from "@/shared/components";
import { PageHeader } from "@/shared/components";
import { cn } from "@/shared/utils";
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
}

export function AccountsTab({
  accounts,
  loading,
  onRefresh,
  onConnect,
  onDisconnectRequest,
}: AccountsTabProps) {
  const supportedPlatforms: {
    platform: SocialPlatform;
    name: string;
    apiName: string;
    color: string;
    gradient?: string;
    icon: React.ReactNode;
    description: string;
    badges: string[];
    isBeta?: boolean;
  }[] = [
    {
      platform: "facebook",
      name: "Facebook Page",
      apiName: "Meta Graph API v20.0",
      color: "#1877F2",
      icon: <PiFacebookLogoBold size={24} />,
      description:
        "Publish organic posts, promotional flyers, menu specials, and dining updates directly to your official Facebook Business Page.",
      badges: ["Page Feed", "Photo Albums", "Insights & Metrics"],
    },
    {
      platform: "instagram",
      name: "Instagram Professional",
      apiName: "Instagram Graph API",
      color: "#E1306C",
      gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
      icon: <PiInstagramLogoBold size={24} />,
      description:
        "Post high-resolution food photography and vertical video Reels directly to your restaurant's Instagram profile.",
      badges: ["Feed Photos", "Instagram Reels", "Audio Sync", "Hashtag Cloud"],
    },
    {
      platform: "twitter",
      name: "Twitter / X",
      apiName: "Twitter API v2 (PKCE)",
      color: "#000000",
      icon: <PiXLogoBold size={22} />,
      description:
        "Broadcast instant lunch specials, daily deals, and timely announcements to diners with automated tweet delivery and video uploads.",
      badges: ["280-char Tweets", "Video Uploads", "Real-time Trends", "PKCE OAuth"],
    },
    {
      platform: "linkedin",
      name: "LinkedIn",
      apiName: "UGC Community Post API",
      color: "#0A66C2",
      icon: <PiLinkedinLogoBold size={24} />,
      description:
        "Connect with local corporate clients, catering opportunities, and professional dinner parties through business posts.",
      badges: ["Company Page", "Corporate Catering", "Long-form (3k chars)", "Auto-Refresh"],
    },
    {
      platform: "tiktok",
      name: "TikTok",
      apiName: "Creator & Video API",
      color: "#FE2C55",
      icon: <PiTiktokLogoBold size={24} />,
      description:
        "Engage foodies with behind-the-scenes chef preparations, kitchen highlights, and short-form video content.",
      badges: ["Vertical 9:16 Video", "Food Trends", "Viral Sounds"],
      isBeta: true,
    },
  ];

  const connectedCount = accounts.filter((a) => a.status === "connected").length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Connected Accounts & Platform Channels"
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            startIcon={<PiArrowsCounterClockwiseBold className="size-4" />}
          >
            Refresh Status
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-4 pb-6">
          {/* Top Overview Banner */}
          <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-muted/20 to-card p-4 shadow-xs">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-foreground">
                    Multi-Platform Publishing Network
                  </h3>
                  <Badge tone={connectedCount > 0 ? "success" : "neutral"} className="text-[10px]">
                    {connectedCount} of 5 Channels Connected
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Connect your restaurant's social channels to compose once and publish everywhere with automated token refreshes.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                  <PiShieldCheckBold className="size-4" />
                  <span>Auto Token Refresh: Active (Every 6h)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of 5 Channels */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supportedPlatforms.map((item) => {
              const acct = accounts.find((a) => a.platform === item.platform);
              const isConnected = !!acct && acct.status === "connected";
              const badge = acct ? tokenStatusBadge(acct) : null;
              const daysLeft = acct ? tokenDaysLeft(acct) : null;

              return (
                <Card
                  key={item.platform}
                  className={cn(
                    "flex flex-col justify-between p-4.5 rounded-2xl border transition-all duration-200",
                    isConnected
                      ? "border-border bg-card shadow-sm hover:border-primary/40"
                      : "border-border/60 bg-card/60 hover:border-border",
                  )}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-xs",
                            item.gradient ? `bg-gradient-to-tr ${item.gradient}` : "",
                          )}
                          style={!item.gradient ? { backgroundColor: item.color } : {}}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-foreground truncate">{item.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-mono">{item.apiName}</p>
                        </div>
                      </div>

                      {item.isBeta ? (
                        <Badge tone="warning" className="text-[9px] shrink-0">
                          Beta
                        </Badge>
                      ) : isConnected ? (
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                          style={{ color: badge?.color, backgroundColor: badge?.color + "20" }}
                        >
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: badge?.color }} />
                          {badge?.label}
                        </span>
                      ) : (
                        <Badge tone="neutral" className="text-[9px] shrink-0">
                          Disconnected
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Feature Pills */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.badges.map((b) => (
                        <span
                          key={b}
                          className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Connected Details */}
                    {isConnected && acct && (
                      <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] text-muted-foreground">Account:</span>
                          <span className="font-semibold text-foreground truncate max-w-[140px]">
                            {acct.username ? `@${acct.username}` : acct.displayName}
                          </span>
                        </div>
                        {daysLeft !== null && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">Token Health:</span>
                            <span
                              className={cn(
                                "font-medium",
                                daysLeft > 14
                                  ? "text-emerald-400"
                                  : daysLeft > 7
                                    ? "text-amber-400"
                                    : "text-red-400",
                              )}
                            >
                              {daysLeft} days remaining (auto-refreshed)
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    {isConnected && acct ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                          <PiCheckCircleBold size={13} /> Active & Ready
                        </span>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          startIcon={<PiXBold className="size-3.5" />}
                          onClick={() => onDisconnectRequest(acct)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : item.isBeta ? (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground italic">Creator API Integration</span>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled
                          className="opacity-60 cursor-not-allowed"
                        >
                          Coming Soon
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => onConnect(item.platform)}
                        className={cn(
                          "w-full font-semibold text-white shadow-xs transition hover:opacity-90",
                          item.gradient ? `bg-gradient-to-r ${item.gradient}` : "",
                        )}
                        style={!item.gradient ? { backgroundColor: item.color } : {}}
                      >
                        Connect {item.name}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
