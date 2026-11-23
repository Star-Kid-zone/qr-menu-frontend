import api from './api.service';
import type { Currency, SocialLink } from '@/types';
import type { SiteDocument } from '@/components/templates/sections/types';

import type {
  WorkspaceTheme,
  WorkspaceButtons,
  WorkspaceAnnouncement,
  WorkspaceBusinessProfile,
  WorkspaceReviewConfig,
  GooglePlaceResult,
  GoogleReviewRecord,
  WorkspacePaymentConfig,
  WorkspaceQrCodeConfig,
  WorkspaceGalleryItem,
  WorkspaceOfferItem,
  WorkspaceCurrency,
  WorkspaceContent,
  WorkspaceFaq,
  WorkspaceData,
  WorkspaceListItem,
  SiteDomain,
  SiteVersion,
} from '@/types/admin/workspace/workspace.types';

export type {
  WorkspaceTheme,
  WorkspaceButtons,
  WorkspaceAnnouncement,
  WorkspaceBusinessProfile,
  WorkspaceReviewConfig,
  GooglePlaceResult,
  GoogleReviewRecord,
  WorkspacePaymentConfig,
  WorkspaceQrCodeConfig,
  WorkspaceGalleryItem,
  WorkspaceOfferItem,
  WorkspaceCurrency,
  WorkspaceContent,
  WorkspaceFaq,
  WorkspaceData,
  WorkspaceListItem,
  SiteDomain,
  SiteVersion,
};

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
  /** Hero photo: upload a new one, or choose a gallery/built-in photo (null = the style's own photo). */
  uploadHeroImage: (data: FormData) => api.post<{ url: string }>('/workspace/banner', data),
  chooseHeroImage: (url: string | null) => api.put<{ url: string | null }>('/workspace/banner', { url }),
  /** Custom domains for the guest site. */
  listDomains: () => api.get<SiteDomain[]>('/workspace/domains'),
  addDomain: (domain: string) => api.post<SiteDomain>('/workspace/domains', { domain }),
  removeDomain: (id: string) => api.delete<{ removed: boolean }>(`/workspace/domains/${id}`),
  verifyDomain: (id: string) => api.post<{ domain: SiteDomain; reason: string | null }>(`/workspace/domains/${id}/verify`),
  /** Website layout history (newest first). */
  listSiteVersions: () => api.get<SiteVersion[]>('/workspace/site-versions'),
  restoreSiteVersion: (id: string) => api.post<{ restored: boolean }>(`/workspace/site-versions/${id}/restore`),
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
