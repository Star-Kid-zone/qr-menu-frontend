import type { ReactNode } from "react";
import {
  PiFacebookLogoBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
  PiPinterestLogoBold,
  PiTiktokLogoBold,
  PiWhatsappLogoBold,
  PiXLogoBold,
  PiYoutubeLogoBold,
  PiGlobeBold,
} from "react-icons/pi";

export interface SocialPlatformOption {
  value: string;
  label: string;
}

/** Curated platform list for the admin "Social media" dropdown. */
export const SOCIAL_PLATFORM_OPTIONS: SocialPlatformOption[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "pinterest", label: "Pinterest" },
  { value: "website", label: "Website / Other" },
];

/**
 * Resolves a stored platform value (new dropdown keys, or legacy free-text
 * from before the dropdown existed, e.g. "Instagram", "insta") to an icon.
 * Shared between the admin form and the public-facing templates so both
 * sides render the same icon for the same platform.
 */
export function getSocialPlatformIcon(platform?: string): ReactNode {
  const value = (platform || "").toLowerCase();
  if (value.includes("instagram")) return <PiInstagramLogoBold />;
  if (value.includes("facebook")) return <PiFacebookLogoBold />;
  if (value.includes("twitter") || value === "x") return <PiXLogoBold />;
  if (value.includes("linkedin")) return <PiLinkedinLogoBold />;
  if (value.includes("youtube")) return <PiYoutubeLogoBold />;
  if (value.includes("tiktok")) return <PiTiktokLogoBold />;
  if (value.includes("whatsapp")) return <PiWhatsappLogoBold />;
  if (value.includes("pinterest")) return <PiPinterestLogoBold />;
  return <PiGlobeBold />;
}

/** Human-readable label for a stored platform value, for public-facing display. */
export function getSocialPlatformLabel(platform?: string, fallbackName?: string): string {
  const normalized = (platform || "").toLowerCase();
  const match = SOCIAL_PLATFORM_OPTIONS.find((option) => option.value === normalized);
  if (match) return match.label;
  return platform || fallbackName || "Website";
}
