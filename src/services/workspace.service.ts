import api from './api.service';
import type { SocialLink } from '@/types';

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
  lotteryStatus: boolean;
}

export interface WorkspaceAnnouncement {
  text: string | null;
  enabled: boolean;
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
  availability?: any;
  features?: unknown;
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

export interface WorkspaceTestimonial {
  id: string;
  workspaceId: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  rating: number | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
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

export interface WorkspaceLotteryReward {
  id: string;
  workspaceId: string;
  label: string;
  emoji: string;
  ratioWins: number;
  ratioPlays: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface WorkspaceLotteryEntry {
  id: string;
  guestName: string | null;
  won: boolean;
  rewardLabel: string | null;
  rewardEmoji: string | null;
  playedDate: string;
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
  testimonials: WorkspaceTestimonial[];
  faqs: WorkspaceFaq[];
  lotteryRewards: WorkspaceLotteryReward[];
  currency: WorkspaceCurrency | null;
  industryFeatureCatalog?: any;
  industry_feature_catalog?: any;
  currencyId?: string | null;
}

export const workspaceService = {
  getWorkspace: () => api.get<WorkspaceData>('/workspace'),
  updateWorkspace: (data: Partial<WorkspaceData>) => api.put<{ message: string, workspace: WorkspaceData }>('/workspace', data),
  addGalleryItem: (data: FormData) => api.post<{ message: string, item: WorkspaceGalleryItem }>('/workspace/gallery', data),
  removeGalleryItem: (itemId: string) => api.delete<{ message: string }>(`/workspace/gallery/${itemId}`),
  addOfferItem: (data: FormData) => api.post<{ message: string, offer: WorkspaceOfferItem }>('/workspace/offers', data),
  updateOfferItem: (offerId: string, data: FormData) => api.put<{ message: string, offer: WorkspaceOfferItem }>(`/workspace/offers/${offerId}`, data),
  removeOfferItem: (offerId: string) => api.delete<{ message: string }>(`/workspace/offers/${offerId}`),
  addTestimonial: (data: Record<string, unknown>) => api.post<{ message: string, testimonial: WorkspaceTestimonial }>('/workspace/testimonials', data),
  updateTestimonial: (id: string, data: Record<string, unknown>) => api.put<{ message: string, testimonial: WorkspaceTestimonial }>(`/workspace/testimonials/${id}`, data),
  toggleTestimonial: (id: string) => api.patch<{ message: string, testimonial: WorkspaceTestimonial }>(`/workspace/testimonials/${id}/toggle`),
  removeTestimonial: (id: string) => api.delete<{ message: string }>(`/workspace/testimonials/${id}`),
  addFaq: (data: Record<string, unknown>) => api.post<{ message: string, faq: WorkspaceFaq }>('/workspace/faqs', data),
  updateFaq: (id: string, data: Record<string, unknown>) => api.put<{ message: string, faq: WorkspaceFaq }>(`/workspace/faqs/${id}`, data),
  toggleFaq: (id: string) => api.patch<{ message: string, faq: WorkspaceFaq }>(`/workspace/faqs/${id}/toggle`),
  removeFaq: (id: string) => api.delete<{ message: string }>(`/workspace/faqs/${id}`),
  getLotteryRewards: () => api.get<{ rewards: WorkspaceLotteryReward[] }>('/workspace/lottery/rewards'),
  addLotteryReward: (data: Record<string, unknown>) => api.post<{ message: string, reward: WorkspaceLotteryReward }>('/workspace/lottery/rewards', data),
  updateLotteryReward: (id: string, data: Record<string, unknown>) => api.put<{ message: string, reward: WorkspaceLotteryReward }>(`/workspace/lottery/rewards/${id}`, data),
  removeLotteryReward: (id: string) => api.delete<{ message: string }>(`/workspace/lottery/rewards/${id}`),
  getLotteryEntries: (page = 1, pageSize = 20) => api.get<{ entries: WorkspaceLotteryEntry[], page: number, pageSize: number, total: number, totalPages: number }>('/workspace/lottery/entries', { params: { page, pageSize } }),
  getCurrencies: () => api.get<any[]>('/workspace/currencies'),
  uploadPaymentQr: (data: FormData) => api.post<{ message: string, url: string }>('/workspace/payment-qr', data),
  checkSlugAvailability: (slug: string) =>
    api.get<{ data: { available: boolean } }>('/workspace/slug-availability', { params: { slug } }),
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
};
