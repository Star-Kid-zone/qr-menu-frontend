export type {
  UserDetailResponse,
  TenantMenuItem,
  TenantStaffMember,
  TenantAnalyticsData,
  TenantRedirect,
  UserListRow,
  DateRange,
  MenuBlueprint,
} from "@/services/superadmin.service";

export type UserDetailTabId =
  | "overview"
  | "menus"
  | "gallery"
  | "offers"
  | "feedback"
  | "payments_reviews"
  | "staff"
  | "redirects"
  | "analytics";

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
