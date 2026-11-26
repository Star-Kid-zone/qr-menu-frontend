import type { ReactNode } from 'react';
import type { PermissionUnit } from '@/constants/permissions';
import type { WorkspaceBusiness, WorkspaceSetting, WorkspaceSettingsFormValues } from '@/types/admin/workspace/workspace.types';
import type { BannerAnnouncementValues } from '@/types/admin/workspace/BannerAnnouncementForm.types';
import type { GoogleReviewRecord, WorkspaceBusinessProfile, WorkspaceFaq, WorkspaceGalleryItem, WorkspaceOfferItem, WorkspacePaymentConfig, WorkspaceReviewConfig } from '@/services/workspace.service';
import type { BusinessSchemaValues } from './components/BusinessForm';

export type WorkspaceTabId =
  | 'workspace'
  | 'businesses'
  | 'public-site'
  | 'banners'
  | 'offers'
  | 'gallery'
  | 'content'
  | 'faqs'
  | 'reviews';

export interface WorkspaceTabConfig {
  id: WorkspaceTabId;
  label: string;
  description: string;
  icon: ReactNode;
  unit: PermissionUnit;
}

// The hub's business row keeps the API's camelCase extras next to the legacy
// snake_case fields so the live preview can read them.
export type HubBusiness = WorkspaceBusiness &
  Pick<WorkspaceBusinessProfile, "industryId" | "businessHours" | "whatsappNumber" | "locationUrl">;

// The mapped workspace carries every form field plus the uploaded asset URLs.
export type HubWorkspaceSetting = WorkspaceSetting &
  Partial<WorkspaceSettingsFormValues> & { logo_url?: string; banner_url?: string; timezone?: string };

export type SlugCheckResult = { slug: string; status: "available" | "taken" | "error" };

/** Saved data plus any open drafts the website hub's live preview renders. */
export interface SitePreviewInputs {
  workspace: HubWorkspaceSetting | null;
  businesses: HubBusiness[];
  businessEditMode: boolean;
  businessDraft: BusinessSchemaValues | null;
  workspaceEditMode: boolean;
  workspaceDraft: WorkspaceSettingsFormValues | null;
  bannersEditMode: boolean;
  bannerDraft: BannerAnnouncementValues | null;
  contentDraft: { storyHeadline: string; storyBody: string; stats: Array<{ label: string; value: string }> };
  workspaceGallery: WorkspaceGalleryItem[];
  workspaceOffers: WorkspaceOfferItem[];
  workspaceFaqs: WorkspaceFaq[];
  workspaceGoogleReviews: GoogleReviewRecord[];
  workspacePayment: WorkspacePaymentConfig | null;
  workspaceReview: WorkspaceReviewConfig | null;
  workspaceMenuItems: Array<Record<string, unknown>>;
}
