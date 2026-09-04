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
  PiPaperPlaneTiltBold,
  PiShareFatBold,
  PiThumbsUpBold,
} from "react-icons/pi";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import type { SocialAccount } from "@/services/social.service";

interface SocialPostPreviewProps {
  posterUrl?: string | null;
  posterTitle?: string | null;
  caption?: string;
  facebookCaption?: string;
  instagramCaption?: string;
  facebookSelected?: boolean;
  instagramSelected?: boolean;
  accounts?: SocialAccount[];
  scheduledAt?: string | null;
}

export function SocialPostPreview({
  posterUrl,
  posterTitle,
  caption = "",
  facebookCaption = "",
  instagramCaption = "",
  facebookSelected = true,
  instagramSelected = true,
  accounts = [],
  scheduledAt,
}: SocialPostPreviewProps) {
  const [platform, setPlatform] = useState<"instagram" | "facebook">("instagram");

  const fbAccount = accounts.find((a) => a.platform === "facebook");
  const igAccount = accounts.find((a) => a.platform === "instagram");

  const effectiveCaption =
    platform === "instagram"
      ? (instagramCaption.trim() || caption.trim())
      : (facebookCaption.trim() || caption.trim());

  const displayName =
    platform === "instagram"
      ? igAccount?.username || igAccount?.displayName || "your_business"
      : fbAccount?.displayName || "Your Business Page";

  // Helper to highlight hashtags in caption
  const renderFormattedCaption = (text: string) => {
    if (!text) return <span className="italic text-muted-foreground/60">Your post caption will appear here in real time...</span>;

    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return (
      <span>
        {parts.map((part, i) =>
          part.startsWith("#") ? (
            <span key={i} className="font-semibold text-primary/90">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    );
  };

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
          <PiDeviceMobileBold className="size-4 text-primary" /> Live Social Preview
        </p>
        <div className="flex items-center gap-1">
          {facebookSelected && (
            <span title="Facebook selected" className="flex size-5 items-center justify-center rounded-full bg-[#1877f2]/15 text-[#1877f2]">
              <PiFacebookLogoBold size={12} />
            </span>
          )}
          {instagramSelected && (
            <span title="Instagram selected" className="flex size-5 items-center justify-center rounded-full bg-[#e1306c]/15 text-[#e1306c]">
              <PiInstagramLogoBold size={12} />
            </span>
          )}
        </div>
      </div>

      {/* Platform Switcher */}
      <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setPlatform("instagram")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
            platform === "instagram"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <PiInstagramLogoBold className="size-3.5" /> Instagram
        </button>
        <button
          type="button"
          onClick={() => setPlatform("facebook")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
            platform === "facebook"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <PiFacebookLogoBold className="size-3.5" /> Facebook
        </button>
      </div>

      {/* Post Preview Card Mockup */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
        <div className="overflow-hidden rounded-xl border border-border/80 bg-background/80 shadow-sm backdrop-blur-xs">
          {platform === "instagram" ? (
            /* Instagram Post Mockup */
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
                    <p className="font-semibold text-foreground">{displayName.toLowerCase().replace(/\s+/g, "_")}</p>
                    <p className="text-[10px] text-muted-foreground">Original audio</p>
                  </div>
                </div>
                <button type="button" className="text-muted-foreground hover:text-foreground" aria-label="Options">
                  <PiDotsThreeBold size={16} />
                </button>
              </div>

              {/* Media Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/30">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={posterTitle || "Social post preview"}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                    <div className="flex size-12 items-center justify-center rounded-full border border-dashed border-border bg-card">
                      <PiImagesBold size={24} className="text-muted-foreground/60" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">No Poster Selected</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Select a poster from the library or templates
                      </p>
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
                  <span className="mr-1.5 font-bold">{displayName.toLowerCase().replace(/\s+/g, "_")}</span>
                  {renderFormattedCaption(effectiveCaption)}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {scheduledAt ? `Scheduled for ${new Date(scheduledAt).toLocaleDateString()}` : "Just now"}
                </p>
              </div>
            </div>
          ) : (
            /* Facebook Post Mockup */
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
                  <img
                    src={posterUrl}
                    alt={posterTitle || "Social post preview"}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
                    <div className="flex size-12 items-center justify-center rounded-full border border-dashed border-border bg-card">
                      <PiImagesBold size={24} className="text-muted-foreground/60" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">No Media Attached</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">Attach a poster to complete your post</p>
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
        </div>
      </div>

      {/* Info Status Footer */}
      <div className="flex shrink-0 items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-[11px]">
        <span className="text-muted-foreground">Channels:</span>
        <div className="flex items-center gap-1.5">
          {facebookSelected && (
            <Badge tone={fbAccount ? "success" : "neutral"} className="text-[8px] py-0 px-1.5">
              FB {fbAccount ? "Connected" : "Needed"}
            </Badge>
          )}
          {instagramSelected && (
            <Badge tone={igAccount ? "success" : "neutral"} className="text-[8px] py-0 px-1.5">
              IG {igAccount ? "Connected" : "Needed"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
