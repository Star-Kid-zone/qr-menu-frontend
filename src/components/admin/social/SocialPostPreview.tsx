"use client";

import { useState } from "react";
import {
  PiBookmarkSimpleBold,
  PiChatCircleBold,
  PiDeviceMobileBold,
  PiDotsThreeBold,
  PiFacebookLogoBold,
  PiGlobeBold,
  PiHeartBold,
  PiImagesBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
  PiPaperPlaneTiltBold,
  PiPlayCircleBold,
  PiRepeatBold,
  PiShareFatBold,
  PiThumbsUpBold,
  PiVideoFill,
  PiXLogoBold,
} from "react-icons/pi";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import type { SocialAccount, SocialPlatform } from "@/services/social.service";

interface SocialPostPreviewProps {
  posterUrl?: string | null;
  posterTitle?: string | null;
  isVideo?: boolean;
  caption?: string;
  captions?: Record<string, string>;
  selectedAccountIds?: Set<string>;
  accounts?: SocialAccount[];
  scheduledAt?: string | null;
  recurrenceRule?: string | null;
  // Backward compatibility props
  facebookCaption?: string;
  instagramCaption?: string;
  facebookSelected?: boolean;
  instagramSelected?: boolean;
}

export function SocialPostPreview({
  posterUrl,
  posterTitle,
  isVideo = false,
  caption = "",
  captions = {},
  selectedAccountIds,
  accounts = [],
  scheduledAt,
  recurrenceRule,
  facebookCaption = "",
  instagramCaption = "",
  facebookSelected = true,
  instagramSelected = true,
}: SocialPostPreviewProps) {
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");

  // Find account per platform
  const accountForPlatform = accounts.find((a) => a.platform === platform);
  const fbAccount = accounts.find((a) => a.platform === "facebook");
  const igAccount = accounts.find((a) => a.platform === "instagram");
  const xAccount = accounts.find((a) => a.platform === "twitter");
  const inAccount = accounts.find((a) => a.platform === "linkedin");

  // Determine caption for current platform
  let effectiveCaption = "";
  if (accountForPlatform && captions[accountForPlatform.id]) {
    effectiveCaption = captions[accountForPlatform.id];
  } else if (platform === "instagram" && instagramCaption) {
    effectiveCaption = instagramCaption;
  } else if (platform === "facebook" && facebookCaption) {
    effectiveCaption = facebookCaption;
  } else if (caption) {
    effectiveCaption = caption;
  } else {
    // Fallback to first available caption
    effectiveCaption = Object.values(captions)[0] || "";
  }
  effectiveCaption = effectiveCaption.trim();

  // Determine display name
  const displayName =
    accountForPlatform?.displayName ||
    accountForPlatform?.username ||
    (platform === "instagram" ? "your_restaurant" : "Your Restaurant Page");

  const username =
    accountForPlatform?.username ||
    (platform === "twitter" ? "YourRestaurant" : "your_restaurant");

  // Available preview tabs based on connected platforms or default to all four
  const previewPlatforms: { id: SocialPlatform; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "instagram", label: "Instagram", icon: PiInstagramLogoBold },
    { id: "facebook", label: "Facebook", icon: PiFacebookLogoBold },
    { id: "twitter", label: "X / Twitter", icon: PiXLogoBold },
    { id: "linkedin", label: "LinkedIn", icon: PiLinkedinLogoBold },
  ];

  // Helper to highlight hashtags and links
  const renderFormattedCaption = (text: string) => {
    if (!text) {
      return <span className="italic text-muted-foreground/60">Your caption will appear here...</span>;
    }

    const parts = text.split(/(#[a-zA-Z0-9_]+|https?:\/\/[^\s]+)/g);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.startsWith("#")) {
            return (
              <span key={i} className="font-semibold text-primary/90">
                {part}
              </span>
            );
          }
          if (part.startsWith("http://") || part.startsWith("https://")) {
            return (
              <span key={i} className="text-blue-500 underline underline-offset-2">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
          <PiDeviceMobileBold className="size-4 text-primary" /> Live Preview
        </p>

        {/* Selected Channels Mini Pills */}
        <div className="flex items-center gap-1">
          {accounts.map((acct) => {
            const isSelected = selectedAccountIds
              ? selectedAccountIds.has(acct.id)
              : acct.platform === "facebook"
              ? facebookSelected
              : acct.platform === "instagram"
              ? instagramSelected
              : false;

            if (!isSelected) return null;

            return (
              <span
                key={acct.id}
                title={`${acct.platform} selected`}
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[10px]",
                  acct.platform === "facebook" && "bg-[#1877f2]/15 text-[#1877f2]",
                  acct.platform === "instagram" && "bg-[#e1306c]/15 text-[#e1306c]",
                  acct.platform === "twitter" && "bg-neutral-800 text-white dark:bg-white dark:text-neutral-900",
                  acct.platform === "linkedin" && "bg-[#0a66c2]/15 text-[#0a66c2]",
                )}
              >
                {acct.platform === "facebook" && <PiFacebookLogoBold size={11} />}
                {acct.platform === "instagram" && <PiInstagramLogoBold size={11} />}
                {acct.platform === "twitter" && <PiXLogoBold size={10} />}
                {acct.platform === "linkedin" && <PiLinkedinLogoBold size={11} />}
              </span>
            );
          })}
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="grid grid-cols-4 gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {previewPlatforms.map((p) => {
          const Icon = p.icon;
          const isActive = platform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={cn(
                "flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              <Icon className="size-3 shrink-0" />
              <span className="truncate">{p.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Recurrence Notice Banner if active */}
      {recurrenceRule && (
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
          <PiRepeatBold className="size-3.5 shrink-0" />
          <span className="truncate">Repeats: {recurrenceRule} on autopilot</span>
        </div>
      )}

      {/* Post Preview Card Mockup */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
        <div className="overflow-hidden rounded-xl border border-border/80 bg-background/80 shadow-sm backdrop-blur-xs">
          {/* ────────────────── INSTAGRAM PREVIEW ────────────────── */}
          {platform === "instagram" && (
            <div className="flex flex-col text-xs">
              {/* Profile Bar */}
              <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[1.5px]">
                    <div className="flex size-full items-center justify-center rounded-full bg-card text-[10px] font-bold text-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="leading-tight">
                    <p className="font-semibold text-foreground">
                      {username.toLowerCase().replace(/\s+/g, "_")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {isVideo ? "Reel · Audio" : "Original audio"}
                    </p>
                  </div>
                </div>
                <button type="button" className="text-muted-foreground hover:text-foreground" aria-label="Options">
                  <PiDotsThreeBold size={16} />
                </button>
              </div>

              {/* Media Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/30">
                {posterUrl ? (
                  isVideo ? (
                    <div className="relative size-full bg-neutral-950">
                      <video
                        src={posterUrl}
                        controls
                        className="size-full object-cover"
                        playsInline
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                        <PiVideoFill className="size-3 text-pink-400" /> Reel
                      </div>
                    </div>
                  ) : (
                    <img
                      src={posterUrl}
                      alt={posterTitle || "Social post preview"}
                      className="size-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                    <div className="flex size-12 items-center justify-center rounded-full border border-dashed border-border bg-card">
                      {isVideo ? <PiPlayCircleBold size={24} /> : <PiImagesBold size={24} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">No Media Selected</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">Pick an image or video from library</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between px-3 pt-2.5">
                <div className="flex items-center gap-3">
                  <button type="button" className="text-foreground transition-colors hover:text-[#e1306c]" aria-label="Like">
                    <PiHeartBold size={18} />
                  </button>
                  <button type="button" className="text-foreground hover:text-primary" aria-label="Comment">
                    <PiChatCircleBold size={18} />
                  </button>
                  <button type="button" className="text-foreground hover:text-primary" aria-label="Share">
                    <PiPaperPlaneTiltBold size={18} />
                  </button>
                </div>
                <button type="button" className="text-foreground hover:text-primary" aria-label="Save">
                  <PiBookmarkSimpleBold size={18} />
                </button>
              </div>

              {/* Caption & Stats */}
              <div className="space-y-1 p-3 pt-2">
                <p className="font-semibold text-foreground">148 likes</p>
                <div className="text-body leading-relaxed text-foreground whitespace-pre-wrap break-words">
                  <span className="mr-1.5 font-bold">{username.toLowerCase().replace(/\s+/g, "_")}</span>
                  {renderFormattedCaption(effectiveCaption)}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {scheduledAt ? `Scheduled for ${new Date(scheduledAt).toLocaleDateString()}` : "Just now"}
                </p>
              </div>
            </div>
          )}

          {/* ────────────────── FACEBOOK PREVIEW ────────────────── */}
          {platform === "facebook" && (
            <div className="flex flex-col text-xs">
              {/* FB Profile Bar */}
              <div className="flex items-center justify-between border-b border-border/40 p-3 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {displayName.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#1877f2] text-white">
                      <PiFacebookLogoBold size={9} />
                    </span>
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-foreground">{displayName}</p>
                    <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span>{scheduledAt ? "Scheduled" : "Just now"}</span> · <PiGlobeBold size={11} />
                    </p>
                  </div>
                </div>
                <button type="button" className="text-muted-foreground hover:text-foreground" aria-label="Post settings">
                  <PiDotsThreeBold size={16} />
                </button>
              </div>

              {/* Caption Text (FB shows text above media) */}
              <div className="px-3 py-2 text-body leading-relaxed text-foreground whitespace-pre-wrap break-words">
                {renderFormattedCaption(effectiveCaption)}
              </div>

              {/* Media Container */}
              <div className="relative aspect-square w-full overflow-hidden border-y border-border/30 bg-muted/30">
                {posterUrl ? (
                  isVideo ? (
                    <video
                      src={posterUrl}
                      controls
                      className="size-full object-cover"
                      playsInline
                    />
                  ) : (
                    <img
                      src={posterUrl}
                      alt={posterTitle || "Social post preview"}
                      className="size-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                    <div className="flex size-12 items-center justify-center rounded-full border border-dashed border-border bg-card">
                      {isVideo ? <PiPlayCircleBold size={24} /> : <PiImagesBold size={24} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">No Media Attached</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">Attach media to complete your post</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Facebook Reactions Bar */}
              <div className="grid grid-cols-3 border-t border-border/40 px-2 py-1 text-center font-semibold text-muted-foreground">
                <button type="button" className="flex items-center justify-center gap-1.5 rounded-md py-1.5 hover:bg-muted/50 hover:text-foreground">
                  <PiThumbsUpBold size={14} /> Like
                </button>
                <button type="button" className="flex items-center justify-center gap-1.5 rounded-md py-1.5 hover:bg-muted/50 hover:text-foreground">
                  <PiChatCircleBold size={14} /> Comment
                </button>
                <button type="button" className="flex items-center justify-center gap-1.5 rounded-md py-1.5 hover:bg-muted/50 hover:text-foreground">
                  <PiShareFatBold size={14} /> Share
                </button>
              </div>
            </div>
          )}

          {/* ────────────────── TWITTER / X PREVIEW ────────────────── */}
          {platform === "twitter" && (
            <div className="flex flex-col p-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-bold text-foreground truncate">{displayName}</span>
                      <span className="text-[11px] text-muted-foreground truncate">@{username}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">{scheduledAt ? "Scheduled" : "1m"}</span>
                    </div>
                    <PiXLogoBold className="size-3.5 shrink-0 text-muted-foreground" />
                  </div>

                  {/* Tweet Text */}
                  <div className="mt-1 text-body leading-relaxed text-foreground whitespace-pre-wrap break-words">
                    {renderFormattedCaption(effectiveCaption)}
                  </div>

                  {/* 280-char counter notice for Twitter */}
                  {effectiveCaption.length > 280 && (
                    <div className="mt-1 text-[10px] text-red-500 font-semibold">
                      ⚠️ Exceeds 280-char Twitter limit ({effectiveCaption.length}/280)
                    </div>
                  )}

                  {/* Attached Media */}
                  {posterUrl && (
                    <div className="mt-2.5 overflow-hidden rounded-xl border border-border/60">
                      {isVideo ? (
                        <video
                          src={posterUrl}
                          controls
                          className="aspect-video w-full object-cover"
                          playsInline
                        />
                      ) : (
                        <img
                          src={posterUrl}
                          alt={posterTitle || "Tweet media"}
                          className="aspect-video w-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  {/* Tweet Action Icons */}
                  <div className="mt-3 flex items-center justify-between text-muted-foreground/80 pr-2">
                    <button type="button" className="hover:text-blue-500 transition-colors" aria-label="Reply">
                      <PiChatCircleBold size={15} />
                    </button>
                    <button type="button" className="hover:text-green-500 transition-colors" aria-label="Retweet">
                      <PiRepeatBold size={15} />
                    </button>
                    <button type="button" className="hover:text-pink-500 transition-colors" aria-label="Like">
                      <PiHeartBold size={15} />
                    </button>
                    <button type="button" className="hover:text-blue-500 transition-colors" aria-label="Bookmark">
                      <PiBookmarkSimpleBold size={15} />
                    </button>
                    <button type="button" className="hover:text-blue-500 transition-colors" aria-label="Share">
                      <PiPaperPlaneTiltBold size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── LINKEDIN PREVIEW ────────────────── */}
          {platform === "linkedin" && (
            <div className="flex flex-col text-xs">
              {/* LinkedIn Header */}
              <div className="flex items-center justify-between border-b border-border/40 p-3 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#0a66c2]/15 text-xs font-bold text-[#0a66c2]">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-foreground">{displayName}</p>
                      <span className="text-[10px] text-muted-foreground">• 1st</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                      Hospitality & Dining • Restaurant
                    </p>
                    <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span>{scheduledAt ? "Scheduled" : "Just now"}</span> • <PiGlobeBold size={10} />
                    </p>
                  </div>
                </div>
                <PiLinkedinLogoBold className="size-4 text-[#0a66c2]" />
              </div>

              {/* Caption */}
              <div className="px-3 py-2 text-body leading-relaxed text-foreground whitespace-pre-wrap break-words">
                {renderFormattedCaption(effectiveCaption)}
              </div>

              {/* Media */}
              <div className="relative aspect-video w-full overflow-hidden border-y border-border/30 bg-muted/30">
                {posterUrl ? (
                  isVideo ? (
                    <video
                      src={posterUrl}
                      controls
                      className="size-full object-cover"
                      playsInline
                    />
                  ) : (
                    <img
                      src={posterUrl}
                      alt={posterTitle || "LinkedIn post preview"}
                      className="size-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                    <PiImagesBold size={24} className="text-muted-foreground/60" />
                    <p className="text-xs font-semibold text-foreground">No Media Attached</p>
                  </div>
                )}
              </div>

              {/* LinkedIn Reactions Bar */}
              <div className="grid grid-cols-4 border-t border-border/40 px-1 py-1 text-center font-semibold text-muted-foreground">
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-1.5 hover:bg-muted/50 hover:text-foreground">
                  <PiThumbsUpBold size={13} /> <span className="text-[10px]">Like</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-1.5 hover:bg-muted/50 hover:text-foreground">
                  <PiChatCircleBold size={13} /> <span className="text-[10px]">Comment</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-1.5 hover:bg-muted/50 hover:text-foreground">
                  <PiRepeatBold size={13} /> <span className="text-[10px]">Repost</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-1 rounded-md py-1.5 hover:bg-muted/50 hover:text-foreground">
                  <PiPaperPlaneTiltBold size={13} /> <span className="text-[10px]">Send</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Status Footer */}
      <div className="flex shrink-0 items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-[11px]">
        <span className="text-muted-foreground">Active Account:</span>
        <div className="flex items-center gap-1.5">
          {accountForPlatform ? (
            <Badge tone="success" className="text-[9px] py-0 px-1.5">
              {platform.toUpperCase()} Connected
            </Badge>
          ) : (
            <Badge tone="neutral" className="text-[9px] py-0 px-1.5">
              {platform.toUpperCase()} Not Connected
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
