import api from './api.service';
import { API_BASE_URL } from '@/config/app.constants';
import { getCsrfToken } from '@/utils/storage';
import type { DashboardData } from '@/types';

import type {
  DateRange,
  PlatformOverview,
  UserListRow,
  UsersListResponse,
  BlueprintMenuItem,
  OccasionPackWording,
  BlueprintContent,
  BlueprintSite,
  BlueprintTheme,
  BlueprintStory,
  BlueprintBusiness,
  BlueprintOffer,
  BlueprintGalleryItem,
  BlueprintFaq,
  MenuBlueprint,
  OnboardingTemplateConfigResponse,
  TenantMenuItem,
  TenantStaffMember,
  UserDetailResponse,
  PlatformTimelinePoint,
  PlatformClickTarget,
  PlatformSearchQuery,
  PlatformTopDish,
  PlatformHourlyPoint,
  PlatformWeekdayPoint,
  PlatformFunnelStep,
  PlatformAnalyticsOverview,
  AnalyticsTenantRow,
  AnalyticsByUserResponse,
  TenantAnalyticsData,
  PlatformPrompt,
  PromptCategorySummary,
  PlatformMarketingAsset,
  TenantRedirect,
  CreateTenantRedirectInput,
  PlatformAnnouncement,
  QueueJob,
  SocialAccountHealth,
  JobsAndQueueResponse,
  TenantWorkspaceSettings,
} from '@/types/superadmin/superadmin.types';

export type {
  DateRange,
  PlatformOverview,
  UserListRow,
  UsersListResponse,
  BlueprintMenuItem,
  OccasionPackWording,
  BlueprintContent,
  BlueprintSite,
  BlueprintTheme,
  BlueprintStory,
  BlueprintBusiness,
  BlueprintOffer,
  BlueprintGalleryItem,
  BlueprintFaq,
  MenuBlueprint,
  OnboardingTemplateConfigResponse,
  TenantMenuItem,
  TenantStaffMember,
  UserDetailResponse,
  PlatformTimelinePoint,
  PlatformClickTarget,
  PlatformSearchQuery,
  PlatformTopDish,
  PlatformHourlyPoint,
  PlatformWeekdayPoint,
  PlatformFunnelStep,
  PlatformAnalyticsOverview,
  AnalyticsTenantRow,
  AnalyticsByUserResponse,
  TenantAnalyticsData,
  PlatformPrompt,
  PromptCategorySummary,
  PlatformMarketingAsset,
  TenantRedirect,
  CreateTenantRedirectInput,
  PlatformAnnouncement,
  QueueJob,
  SocialAccountHealth,
  JobsAndQueueResponse,
  TenantWorkspaceSettings,
};

async function unwrap<T>(p: Promise<{ data?: unknown } | null | undefined>): Promise<T> {
  const res = await p;
  if (res && res.data !== undefined) {
    const body = res.data;
    if (
      body &&
      typeof body === 'object' &&
      !Array.isArray(body) &&
      'data' in body &&
      body.data !== undefined
    ) {
      return body.data as T;
    }
    return body as T;
  }
  return res as T;
}

export const superadminService = {
  getOverview(range?: DateRange) {
    return unwrap<PlatformOverview>(api.get('/superadmin/overview', { params: { range } }));
  },

  listUsers(params: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: 'admin' | 'superadmin';
    active?: boolean;
  }) {
    return unwrap<UsersListResponse>(api.get('/superadmin/users', { params }));
  },

  getUser(id: number) {
    return unwrap<UserDetailResponse>(api.get(`/superadmin/users/${id}`));
  },

  toggleUserStatus(id: number, active: boolean) {
    return api.put(`/superadmin/users/${id}/status`, { active });
  },

  updateTenantMenu(userId: number, menuId: number, data: Partial<TenantMenuItem>) {
    return api.put(`/superadmin/users/${userId}/menus/${menuId}`, data);
  },

  toggleTenantMenuAvailability(userId: number, menuId: number, availability: boolean) {
    return api.patch(`/superadmin/users/${userId}/menus/${menuId}/availability`, { availability });
  },

  updateTenantPaymentReview(userId: number, data: { paymentType?: string; paymentLink?: string | null; reviewLink?: string | null }) {
    return api.put(`/superadmin/users/${userId}/payment-review`, data);
  },

  updateTenantBusiness(userId: number, data: Record<string, unknown>) {
    return api.put(`/superadmin/users/${userId}/business`, data);
  },

  getPlatformAnalytics(range?: DateRange) {
    return unwrap<PlatformAnalyticsOverview>(api.get('/superadmin/analytics/overview', { params: { range } }));
  },

  getAnalyticsByUser(range?: DateRange, limit?: number) {
    return unwrap<AnalyticsByUserResponse>(
      api.get('/superadmin/analytics/by-user', { params: { range, limit } })
    );
  },

  getTenantAnalytics(userId: number, range?: DateRange, page?: number) {
    return unwrap<TenantAnalyticsData>(
      api.get(`/superadmin/analytics/tenants/${userId}`, { params: { range, page } })
    );
  },

  impersonateTenant(userId: number) {
    return unwrap<{
      message: string;
      targetUser: { id: string; name: string; email?: string | null; role: string };
      impersonation: {
        isImpersonating: boolean;
        originalSuperadminId: string;
        targetUserId: string;
        targetUserName: string;
      };
    }>(api.post(`/superadmin/users/${userId}/impersonate`));
  },

  getOnboardingTemplateConfig() {
    return unwrap<OnboardingTemplateConfigResponse>(api.get('/superadmin/onboarding-template'));
  },

  updateOnboardingTemplateConfig(data: { autoSeedEnabled?: boolean; defaultBlueprintId?: string }) {
    return unwrap<{
      message: string;
      autoSeedEnabled: boolean;
      defaultBlueprintId: string;
    }>(api.put('/superadmin/onboarding-template', data));
  },

  getBlueprints() {
    return unwrap<MenuBlueprint[]>(api.get('/superadmin/blueprints'));
  },

  createBlueprint(data: Partial<MenuBlueprint>) {
    return unwrap<{ message: string; blueprint: MenuBlueprint }>(api.post('/superadmin/blueprints', data));
  },

  updateBlueprint(id: string, data: Partial<MenuBlueprint>) {
    return unwrap<{ message: string; blueprint: MenuBlueprint }>(api.put(`/superadmin/blueprints/${id}`, data));
  },

  deleteBlueprint(id: string) {
    return unwrap<{ message: string }>(api.delete(`/superadmin/blueprints/${id}`));
  },

  resetBlueprint(id: string) {
    return unwrap<{ message: string; blueprint: MenuBlueprint }>(api.post(`/superadmin/blueprints/${id}/reset`));
  },

  applyBlueprint(userId: number, blueprintId: string, mode: 'append' | 'replace' = 'append') {
    return unwrap<{
      message: string;
      blueprintName: string;
      itemsAdded: number;
      mode: string;
    }>(api.post(`/superadmin/users/${userId}/apply-blueprint`, { blueprintId, mode }));
  },

  /** Corrections to the occasion date table, keyed "occasion-id:year". */
  /** Superadmin wording for the occasion packs (suggested banner / specials category). */
  getOccasionPacks() {
    return unwrap<Record<string, OccasionPackWording>>(api.get('/superadmin/occasion-packs'));
  },

  saveOccasionPacks(packs: Record<string, OccasionPackWording>) {
    return unwrap<Record<string, OccasionPackWording>>(api.put('/superadmin/occasion-packs', { packs }));
  },

  getAnnouncements() {
    return unwrap<PlatformAnnouncement[]>(api.get('/superadmin/announcements'));
  },

  createAnnouncement(data: {
    title: string;
    content: string;
    type?: string;
    badgeText?: string;
    actionUrl?: string;
    actionText?: string;
    isActive?: boolean;
  }) {
    return unwrap<PlatformAnnouncement>(api.post('/superadmin/announcements', data));
  },

  toggleAnnouncement(id: string | number, isActive: boolean) {
    return unwrap<PlatformAnnouncement>(api.patch(`/superadmin/announcements/${id}/status`, { isActive }));
  },

  deleteAnnouncement(id: string | number) {
    return unwrap<{ message: string }>(api.delete(`/superadmin/announcements/${id}`));
  },

  getActiveAnnouncements() {
    return unwrap<PlatformAnnouncement[]>(api.get('/public/announcements'));
  },

  dismissAnnouncement(id: string | number) {
    return unwrap<{ success: boolean; message: string }>(api.post(`/public/announcements/${id}/dismiss`));
  },

  getJobsAndQueue() {
    return unwrap<JobsAndQueueResponse>(api.get('/superadmin/jobs'));
  },

  retryJob(id: string | number) {
    return unwrap<{ message: string; job: QueueJob }>(api.post(`/superadmin/jobs/${id}/retry`));
  },

  cancelJob(id: string | number) {
    return unwrap<{ message: string; job: QueueJob }>(api.post(`/superadmin/jobs/${id}/cancel`));
  },

  triggerQueueRunner() {
    return unwrap<{ message: string }>(api.post('/superadmin/jobs/trigger-runner'));
  },

  updateTenantWorkspace(userId: string | number, data: TenantWorkspaceSettings) {
    return unwrap<unknown>(api.patch(`/superadmin/users/${userId}/workspace`, data));
  },

  listTenantRedirects(userId: string | number) {
    return unwrap<TenantRedirect[]>(api.get(`/superadmin/users/${userId}/redirects`));
  },

  createTenantRedirect(userId: string | number, data: CreateTenantRedirectInput) {
    return unwrap<{ message: string; redirect: TenantRedirect }>(
      api.post(`/superadmin/users/${userId}/redirects`, data)
    );
  },

  deleteTenantRedirect(userId: string | number, redirectId: string | number) {
    return unwrap<{ message: string }>(api.delete(`/superadmin/users/${userId}/redirects/${redirectId}`));
  },

  /* ─── Creative Studio & Platform Marketing Assets (Modules C, D, E) ─── */
  listMarketingAssets(params?: { type?: string; isPublished?: boolean; industryGroup?: string }) {
    return unwrap<{ data: PlatformMarketingAsset[] }>(api.get('/superadmin/marketing-assets', { params }));
  },

  createMarketingAsset(data: Partial<PlatformMarketingAsset>) {
    return unwrap<{ asset: PlatformMarketingAsset }>(api.post('/superadmin/marketing-assets', data));
  },

  deleteMarketingAsset(id: string) {
    return unwrap<{ success: boolean }>(api.delete(`/superadmin/marketing-assets/${id}`));
  },

  uploadMarketingAsset(file: File) {
    const form = new FormData();
    form.append('file', file);
    return unwrap<{ url: string; filename: string; mimeType: string; size: number }>(
      api.post('/superadmin/marketing-assets/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  },

  decodePoster(data: { image: string; mode?: string; render?: string; spec?: Record<string, unknown>; model?: string; hint?: string; width?: number; height?: number }) {
    return unwrap<{ spec: Record<string, unknown>; cost?: number }>(api.post('/superadmin/marketing-assets/decode', data));
  },


  generateAiImage(data: { prompt: string; provider?: string; model?: string; aspectRatio?: string; referenceImageUrl?: string }) {
    return unwrap<{ url: string; cost?: number }>(api.post('/superadmin/marketing-assets/generate-image', data));
  },


  generateAiVideo(data: { prompt: string; model?: string; duration?: number; aspectRatio?: string; firstFrameUrl?: string }) {
    return unwrap<{ id: string; status: string }>(api.post('/superadmin/marketing-assets/generate-video', data));
  },

  getVideoStatus(jobId: string) {
    return unwrap<{ status: string; url?: string; cost?: number; error?: string }>(api.get(`/superadmin/marketing-assets/video/${jobId}`));
  },

  generateMarketingCopy(data: { restaurantName?: string; cuisine?: string; tone?: string; dishName?: string; price?: string | number; description?: string; goal?: string; languages?: string[]; count?: number }) {
    return unwrap<{ variants: Array<{ caption?: string; hashtags?: string[] }>; cost?: number }>(api.post('/superadmin/marketing-assets/copy', data));
  },

  publishAssetToTenants(id: string, data: { targetAudience: 'all' | 'industry' | 'selected_tenants'; targetIndustryId?: string; workspaceIds?: string[] }) {
    return unwrap<{ success: boolean; asset: PlatformMarketingAsset }>(api.post(`/superadmin/marketing-assets/${id}/publish`, data));
  },

  async runAutomationScript(
    data: { script: string; prompt: string; title?: string; autoIngest?: boolean },
    onChunk?: (text: string) => void
  ): Promise<{ fullLog: string; ingestedAsset?: PlatformMarketingAsset }> {
    const csrfToken = getCsrfToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    // Intentional raw fetch (exception to the `api` rule): reads a streamed response body, which axios cannot do in the browser.
    const res = await fetch(`${API_BASE_URL}/superadmin/marketing-assets/run-automation`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => 'Failed to run script');
      throw new Error(errText || `Server error (${res.status})`);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let fullLog = '';
    let ingestedAsset: PlatformMarketingAsset | undefined;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = dec.decode(value, { stream: true });
      fullLog += chunk;
      if (onChunk) onChunk(chunk);

      if (chunk.includes('[INGESTED_ASSET]:')) {
        try {
          const match = chunk.match(/\[INGESTED_ASSET\]:(.*?)(\n|$)/);
          if (match && match[1]) {
            ingestedAsset = JSON.parse(match[1]);
          }
        } catch {}
      }
    }

    return { fullLog, ingestedAsset };
  },

  listScriptDownloads() {
    return unwrap<{ files: Array<{ name: string; sizeBytes: number; mtime: number; kind: 'image' | 'video' }> }>(
      api.get('/superadmin/marketing-assets/script-downloads')
    );
  },

  ingestScriptDownload(data: { filename: string; title?: string; caption?: string; hashtags?: string[] }) {
    return unwrap<{ success: boolean; asset: PlatformMarketingAsset }>(
      api.post('/superadmin/marketing-assets/ingest-download', data)
    );
  },

  // ─── AI Prompt Library & Visual References ────────────────────────────────
  listPrompts(params?: {
    category?: string;
    mediaType?: string;
    isFavorite?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    return unwrap<{ data: PlatformPrompt[]; categories: PromptCategorySummary[] }>(
      api.get('/superadmin/prompts', { params })
    );
  },

  getPrompt(id: string) {
    return unwrap<{ prompt: PlatformPrompt }>(api.get(`/superadmin/prompts/${id}`));
  },

  createPrompt(data: Partial<PlatformPrompt>) {
    return unwrap<{ prompt: PlatformPrompt }>(api.post('/superadmin/prompts', data));
  },

  updatePrompt(id: string, data: Partial<PlatformPrompt>) {
    return unwrap<{ prompt: PlatformPrompt }>(api.put(`/superadmin/prompts/${id}`, data));
  },

  deletePrompt(id: string) {
    return unwrap<{ success: boolean; deletedId: string }>(api.delete(`/superadmin/prompts/${id}`));
  },

  togglePromptFavorite(id: string) {
    return unwrap<{ prompt: PlatformPrompt }>(api.post(`/superadmin/prompts/${id}/favorite`));
  },

  recordPromptUsage(id: string) {
    return unwrap<{ prompt: PlatformPrompt }>(api.post(`/superadmin/prompts/${id}/use`));
  },

  seedDefaultPrompts(force?: boolean) {
    return unwrap<{ message: string; count: number; data?: PlatformPrompt[] }>(
      api.post('/superadmin/prompts/seed', { force })
    );
  },
};
