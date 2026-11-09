import React from "react";
import {
  PiBookOpenText,
  PiGoogleLogo,
  PiImages,
  PiLink,
  PiMegaphoneSimple,
  PiPaintBrush,
  PiQuestion,
  PiStorefront,
  PiTag,
} from "react-icons/pi";
import type { WebsiteSectionConfig, WorkspaceTabConfig } from "./types";

/**
 * Internal panels. Ids are kept stable so existing `?tab=` links keep working;
 * they are grouped into the four sections below for display.
 * "businesses" now lives in Settings and "reviews" on the Reviews page; both
 * ids are kept so old links can be redirected.
 */
export const TABS: WorkspaceTabConfig[] = [
  { id: "workspace", label: "Look & feel", description: "Theme, colours and fonts", icon: <PiPaintBrush className="size-5" />, unit: "workspace" },
  { id: "banners", label: "Announcement bar", description: "Message across the top", icon: <PiMegaphoneSimple className="size-5" />, unit: "workspace" },
  { id: "content", label: "Our story", description: "Story and highlights", icon: <PiBookOpenText className="size-5" />, unit: "workspace" },
  { id: "gallery", label: "Photos", description: "Restaurant and food photos", icon: <PiImages className="size-5" />, unit: "workspace" },
  { id: "faqs", label: "Questions", description: "Questions guests ask", icon: <PiQuestion className="size-5" />, unit: "workspace" },
  { id: "offers", label: "Offers", description: "Deals for guests", icon: <PiTag className="size-5" />, unit: "workspace" },
  { id: "public-site", label: "Address & QR codes", description: "Moved to QR menu", icon: <PiLink className="size-5" />, unit: "workspace" },
  { id: "businesses", label: "Business details", description: "Moved to Settings", icon: <PiStorefront className="size-5" />, unit: "workspace" },
  { id: "reviews", label: "Reviews on your website", description: "Moved to Reviews", icon: <PiGoogleLogo className="size-5" />, unit: "reviews" },
];

/** What the Website page shows: four jobs, in the order owners use them. */
export const WEBSITE_SECTIONS: WebsiteSectionConfig[] = [
  { id: "look", label: "Look & feel", tabs: ["workspace"] },
  { id: "content", label: "Content", tabs: ["banners", "content", "gallery", "faqs"] },
  { id: "offers", label: "Offers", tabs: ["offers"] },
];

/** Panels that moved off the Website page, and where they live now. */
export const MOVED_TABS: Partial<Record<WorkspaceTabConfig["id"], string>> = {
  businesses: "/admin/settings?tab=business",
  reviews: "/admin/listreview",
  "public-site": "/admin/qr-menu",
};
