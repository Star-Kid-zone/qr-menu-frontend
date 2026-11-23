export type {
  UserDetailResponse,
  TenantMenuItem,
  TenantStaffMember,
  TenantAnalyticsData,
  TenantRedirect,
  UserListRow,
  DateRange,
  MenuBlueprint,
} from "@/types";

export type UserDetailTabId =
  | "overview"
  | "menus"
  | "gallery"
  | "offers"
  | "feedback"
  | "payments_reviews"
  | "staff"
  | "redirects"
  | "analytics"
  // Grouped tabs: Website content (gallery, offers, reviews & FAQs) and Payments & links (payments, redirects).
  | "content"
  | "links";

export interface BusinessFormData {
  businessName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  websiteUrl: string;
  locationUrl: string;
  businessHours: string;
  [key: string]: unknown;
}

export interface PaymentFormData {
  paymentType: string;
  paymentLink: string;
  reviewLink: string;
  [key: string]: unknown;
}

export interface WorkspaceFormData {
  specialOfferStatus: boolean;
  menubtnStatus: boolean;
  paybtnStatus: boolean;
  reviewbtnStatus: boolean;
  socialApprovalRequired: boolean;
  announcementEnabled: boolean;
  announcementText: string;
  [key: string]: unknown;
}
