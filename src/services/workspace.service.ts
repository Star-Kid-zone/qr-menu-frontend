import api from './api.service';
import type { Currency, SocialLink } from '@/types';

export interface WorkspaceTheme {
  themeColour: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  accentTextColor: string;
  borderColor: string;
  footerBgColor: string;
  sectionBgColor: string;
  fontFamily: string;
  cardStyle: string;
  heroOverlay: string;
  themeBadge: string;
  themeMarquee: string;
  headingClass?: string;
  heroTagline?: string;
  menuTheme: string;
  landingTheme: string;
  landingStructure: string;
  loadingScreenTheme: string;
  // Menu-specific design
  menuPrimaryColor?: string;
  menuSecondaryColor?: string;
  menuAccentColor?: string;
  menuTextPrimaryColor?: string;
  menuTextSecondaryColor?: string;
  menuAccentTextColor?: string;
  menuBorderColor?: string;
  menuFooterBgColor?: string;
  menuSectionBgColor?: string;
  menuFontFamily?: string;
  menuCardStyle?: string;
  menuStructure?: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
}

export interface WorkspaceButtons {
  menubtnStatus: boolean;
  paybtnStatus: boolean;
  reviewbtnStatus: boolean;
  specialOfferStatus: boolean;
}

export interface WorkspaceAnnouncement {
  text: string | null;
  enabled: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface WorkspaceBusinessProfile {
  id?: string;
  name?: string;
  industryId?: string | number | null;
  phone?: string;
  address?: string | null;
  businessHours?: string | null;
  whatsappNumber?: string | null;
  locationUrl?: string | null;
  websiteUrl?: string | null;
  // Canonical shape: array of { platform, url } (matches backend seed data,
  // the public-site template mapper, and admin/listbusiness's editor).
  socialLinks?: SocialLink[] | null;
  availability?: Array<{ day: string; startTime: string; endTime: string }> | null;
  gstin?: string | null;
  taxInclusive?: boolean;
  serviceChargePercent?: number | string | null;
  pincode?: string | null;
}

export interface WorkspaceReviewConfig {
  googleReviewLink: string | null;
  // Derived server-side from the ?placeid= in googleReviewLink — never sent
  // by the client, only read back after a save.
  googlePlaceId?: string | null;
}

export interface GooglePlaceResult {
  placeId: string;
  name: string;
  address: string;
  reviewLink: string;
}

export interface GoogleReviewRecord {
  id: string;
  workspaceId: string;
  googleReviewId: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativePublishDescription: string | null;
  publishTime: string | null;
  createdAt: string;
  isFeatured: boolean;
  replyText?: string | null;
  replyTime?: string | null;
  isAutoReplied?: boolean;
}

export interface WorkspacePaymentConfig {
  type: string;
  link: string | null;
  qrImage: string | null;
}

export interface WorkspaceQrCodeConfig {
  url: string;
  size: number;
  margin: number;
  dataPattern: string;
  dataColor: string;
  finderPattern: string;
  finderColor: string;
  backgroundFill: string;
  logo: string | null;
}

export interface WorkspaceGalleryItem {
  id: string;
  workspaceId: string;
  imageUrl: string;
  createdAt: string;
}

export interface WorkspaceOfferItem {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  discount: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface WorkspaceCurrency {
  code: string;
  symbol: string;
}

export interface WorkspaceContent {
  storyHeadline: string | null;
  storyBody: string | null;
  stats: Array<{ label: string; value: string }>;
}

export interface WorkspaceFaq {
  id: string;
  workspaceId: string;
  question: string;
  answer: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface WorkspaceData {
  workspaceId: string;
  publicSlug: string | null;
  theme: WorkspaceTheme;
  buttons: WorkspaceButtons;
  announcement: WorkspaceAnnouncement;
  business: WorkspaceBusinessProfile | null;
  review: WorkspaceReviewConfig;
  payment: WorkspacePaymentConfig;
  qrCode: WorkspaceQrCodeConfig;
  content: WorkspaceContent;
  gallery: WorkspaceGalleryItem[];
  offers: WorkspaceOfferItem[];
  faqs: WorkspaceFaq[];
  currency: WorkspaceCurrency | null;
  currencyId?: string | null;
}

export interface WorkspaceListItem {
  id: string;
  publicSlug: string | null;
  themeColour: string;
  defaultTimezone: string;
  role: string;
  isDefault: boolean;
}

export const workspaceService = {
  listWorkspaces: () => api.get<WorkspaceListItem[]>('/workspace/list'),
  getWorkspace: () => api.get<WorkspaceData>('/workspace'),
  updateWorkspace: (data: Partial<WorkspaceData>) => api.put<{ message: string, workspace: WorkspaceData }>('/workspace', data),
  addGalleryItem: (data: FormData) => api.post<{ message: string, item: WorkspaceGalleryItem }>('/workspace/gallery', data),
  removeGalleryItem: (itemId: string) => api.delete<{ message: string }>(`/workspace/gallery/${itemId}`),
  addOfferItem: (data: FormData) => api.post<{ message: string, offer: WorkspaceOfferItem }>('/workspace/offers', data),
  updateOfferItem: (offerId: string, data: FormData) => api.put<{ message: string, offer: WorkspaceOfferItem }>(`/workspace/offers/${offerId}`, data),
  removeOfferItem: (offerId: string) => api.delete<{ message: string }>(`/workspace/offers/${offerId}`),
  addFaq: (data: Record<string, unknown>) => api.post<{ message: string, faq: WorkspaceFaq }>('/workspace/faqs', data),
  updateFaq: (id: string, data: Record<string, unknown>) => api.put<{ message: string, faq: WorkspaceFaq }>(`/workspace/faqs/${id}`, data),
  toggleFaq: (id: string) => api.patch<{ message: string, faq: WorkspaceFaq }>(`/workspace/faqs/${id}/toggle`),
  removeFaq: (id: string) => api.delete<{ message: string }>(`/workspace/faqs/${id}`),
  getCurrencies: () => api.get<Currency[]>('/workspace/currencies'),
  uploadPaymentQr: (data: FormData) => api.post<{ message: string, url: string }>('/workspace/payment-qr', data),
  checkSlugAvailability: (slug: string) =>
    api.get<{ available: boolean }>('/workspace/slug-availability', { params: { slug } }),
  updateSlug: (slug: string) =>
    api.put<{ message: string, workspace: WorkspaceData }>('/workspace', { publicSlug: slug }),
  searchPlaces: (query: string) =>
    api.get<{ results: GooglePlaceResult[] }>('/workspace/places/search', { params: { query } }),
  getGoogleReviews: () =>
    api.get<{ reviews: GoogleReviewRecord[]; googlePlaceId: string | null; lastSyncAt: string | null }>(
      '/workspace/reviews/google'
    ),
  syncGoogleReviews: () =>
    api.post<{ message: string; reviews: GoogleReviewRecord[] }>('/workspace/reviews/google/sync'),
  toggleGoogleReviewFeatured: (id: string | number) =>
    api.patch<{ message: string, review: GoogleReviewRecord }>(`/workspace/reviews/google/${id}/toggle`),
};
