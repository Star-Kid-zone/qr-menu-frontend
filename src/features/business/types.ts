import type { ReactNode } from "react";
import type { PermissionUnit } from "@/constants/permissions";

export type WorkspaceTabId =
  | "workspace"
  | "businesses"
  | "public-site"
  | "banners"
  | "offers"
  | "gallery"
  | "content"
  | "faqs"
  | "reviews";

export const INLINE_WORKSPACE_FORM_ID = "inline-workspace-settings";
export const INLINE_BANNER_FORM_ID = "inline-banner-settings";
export const INLINE_ADD_BUSINESS_FORM_ID = "inline-add-business";

export interface WorkspaceTabConfig {
  id: WorkspaceTabId;
  label: string;
  description: string;
  icon: ReactNode;
  unit: PermissionUnit;
}

export const DEFAULT_TAB: WorkspaceTabId = "workspace";

export type WebsiteSectionId = "look" | "content" | "offers";

export interface WebsiteSectionConfig {
  id: WebsiteSectionId;
  label: string;
  tabs: WorkspaceTabId[];
}
