import api from './api.service';
import { API_BASE_URL } from '@/config/app.constants';
import { getCsrfToken } from '@/utils/storage';

import type { DateRange, PlatformOverview, UserListRow, UsersListResponse, BlueprintMenuItem, OccasionPackWording, BlueprintContent, BlueprintSite, BlueprintTheme, BlueprintStory, BlueprintOffer, BlueprintGalleryItem, BlueprintFaq, MenuBlueprint, OnboardingTemplateConfigResponse, TenantMenuItem, UserDetailResponse, PlatformAnalyticsOverview, AnalyticsByUserResponse, TenantAnalyticsData, PlatformPrompt, PromptCategorySummary, PlatformMarketingAsset, TenantRedirect, CreateTenantRedirectInput, PlatformAnnouncement, QueueJob, JobsAndQueueResponse, TenantWorkspaceSettings } from '@/types/superadmin/superadmin.types';

export type { DateRange, PlatformOverview, UserListRow, UsersListResponse, BlueprintMenuItem, OccasionPackWording, BlueprintContent, BlueprintSite, BlueprintTheme, BlueprintStory, BlueprintOffer, BlueprintGalleryItem, BlueprintFaq, MenuBlueprint, OnboardingTemplateConfigResponse, TenantMenuItem, UserDetailResponse, PlatformAnalyticsOverview, AnalyticsByUserResponse, TenantAnalyticsData, PlatformPrompt, PromptCategorySummary, PlatformMarketingAsset, TenantRedirect, CreateTenantRedirectInput, PlatformAnnouncement, QueueJob, JobsAndQueueResponse, TenantWorkspaceSettings };

export const superadminService = {
  getOverview(range?: DateRange) {
    return api.get<PlatformOverview>('/superadmin/overview', { params: { range } }).then((res) => res.data);
  },

  listUsers(params: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: 'admin' | 'superadmin';
    active?: boolean;
  }) {
    return api.get<UsersListResponse>('/superadmin/users', { params }).then((res) => res.data);
  },

  getUser(id: string) {
    return api.get<UserDetailResponse>(`/superadmin/users/${id}`).then((res) => res.data);
  },

  toggleUserStatus(id: string, active: boolean) {
    return api.put(`/superadmin/users/${id}/status`, { active });
  },

  updateTenantMenu(userId: string, menuId: string, data: Partial<TenantMenuItem>) {
    return api.put(`/superadmin/users/${userId}/menus/${menuId}`, data);
  },

  toggleTenantMenuAvailability(userId: string, menuId: string, availability: boolean) {
    return api.patch(`/superadmin/users/${userId}/menus/${menuId}/availability`, { availability });
  },

  updateTenantPaymentReview(userId: string, data: { paymentType?: string; paymentLink?: string | null; reviewLink?: string | null }) {
    return api.put(`/superadmin/users/${userId}/payment-review`, data);
  },

  updateTenantBusiness(userId: string, data: Record<string, unknown>) {
    return api.put(`/superadmin/users/${userId}/business`, data);
  },

  getPlatformAnalytics(range?: DateRange) {
    return api.get<PlatformAnalyticsOverview>('/superadmin/analytics/overview', { params: { range } }).then((res) => res.data);
  },

  getAnalyticsByUser(range?: DateRange, limit?: number) {
    return api.get<AnalyticsByUserResponse>('/superadmin/analytics/by-user', { params: { range, limit } }).then((res) => res.data);
  },

  getTenantAnalytics(userId: string, range?: DateRange, page?: number) {
    return api.get<TenantAnalyticsData>(`/superadmin/analytics/tenants/${userId}`, { params: { range, page } }).then((res) => res.data);
  },

  impersonateTenant(userId: string) {
    return api.post<{
      message: string;
      targetUser: { id: string; name: string; email?: string | null; role: string };
      impersonation: {
        isImpersonating: boolean;
        originalSuperadminId: string;
        targetUserId: string;
        targetUserName: string;
      };
    }>(`/superadmin/users/${userId}/impersonate`).then((res) => res.data);
  },

  getOnboardingTemplateConfig() {
    return api.get<OnboardingTemplateConfigResponse>('/superadmin/onboarding-template').then((res) => res.data);
  },

  updateOnboardingTemplateConfig(data: { autoSeedEnabled?: boolean; defaultBlueprintId?: string }) {
    return api.put<{
      message: string;
      autoSeedEnabled: boolean;
      defaultBlueprintId: string;
    }>('/superadmin/onboarding-template', data).then((res) => res.data);
  },

  getBlueprints() {
    return api.get<MenuBlueprint[]>('/superadmin/blueprints').then((res) => res.data);
  },

  createBlueprint(data: Partial<MenuBlueprint>) {
    return api.post<{ message: string; blueprint: MenuBlueprint }>('/superadmin/blueprints', data).then((res) => res.data);
  },

  updateBlueprint(id: string, data: Partial<MenuBlueprint>) {
    return api.put<{ message: string; blueprint: MenuBlueprint }>(`/superadmin/blueprints/${id}`, data).then((res) => res.data);
  },

  deleteBlueprint(id: string) {
    return api.delete<{ message: string }>(`/superadmin/blueprints/${id}`).then((res) => res.data);
  },

  resetBlueprint(id: string) {
    return api.post<{ message: string; blueprint: MenuBlueprint }>(`/superadmin/blueprints/${id}/reset`).then((res) => res.data);
  },

  applyBlueprint(userId: string, blueprintId: string, mode: 'append' | 'replace' = 'append') {
    return api.post<{
      message: string;
      blueprintName: string;
      itemsAdded: number;
      mode: string;
    }>(`/superadmin/users/${userId}/apply-blueprint`, { blueprintId, mode }).then((res) => res.data);
  },

  /** Corrections to the occasion date table, keyed "occasion-id:year". */
  /** Superadmin wording for the occasion packs (suggested banner / specials category). */
  getOccasionPacks() {
    return api.get<Record<string, OccasionPackWording>>('/superadmin/occasion-packs').then((res) => res.data);
  },

  saveOccasionPacks(packs: Record<string, OccasionPackWording>) {
    return api.put<Record<string, OccasionPackWording>>('/superadmin/occasion-packs', { packs }).then((res) => res.data);
  },

  getAnnouncements() {
    return api.get<PlatformAnnouncement[]>('/superadmin/announcements').then((res) => res.data);
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
    return api.post<PlatformAnnouncement>('/superadmin/announcements', data).then((res) => res.data);
  },

  toggleAnnouncement(id: string, isActive: boolean) {
    return api.patch<PlatformAnnouncement>(`/superadmin/announcements/${id}/status`, { isActive }).then((res) => res.data);
  },

  deleteAnnouncement(id: string) {
    return api.delete<{ message: string }>(`/superadmin/announcements/${id}`).then((res) => res.data);
  },

  getActiveAnnouncements() {
    return api.get<PlatformAnnouncement[]>('/public/announcements').then((res) => res.data);
  },

  dismissAnnouncement(id: string) {
    return api.post<{ success: boolean; message: string }>(`/public/announcements/${id}/dismiss`).then((res) => res.data);
  },

  getJobsAndQueue() {
    return api.get<JobsAndQueueResponse>('/superadmin/jobs').then((res) => res.data);
  },

  retryJob(id: string) {
    return api.post<{ message: string; job: QueueJob }>(`/superadmin/jobs/${id}/retry`).then((res) => res.data);
  },

  cancelJob(id: string) {
    return api.post<{ message: string; job: QueueJob }>(`/superadmin/jobs/${id}/cancel`).then((res) => res.data);
  },

  triggerQueueRunner() {
    return api.post<{ message: string }>('/superadmin/jobs/trigger-runner').then((res) => res.data);
  },

  updateTenantWorkspace(userId: string, data: TenantWorkspaceSettings) {
    return api.patch<unknown>(`/superadmin/users/${userId}/workspace`, data).then((res) => res.data);
  },

  listTenantRedirects(userId: string) {
    return api.get<TenantRedirect[]>(`/superadmin/users/${userId}/redirects`).then((res) => res.data);
  },

  createTenantRedirect(userId: string, data: CreateTenantRedirectInput) {
    return api.post<{ message: string; redirect: TenantRedirect }>(`/superadmin/users/${userId}/redirects`, data).then((res) => res.data);
  },

  deleteTenantRedirect(userId: string, redirectId: string) {
    return api.delete<{ message: string }>(`/superadmin/users/${userId}/redirects/${redirectId}`).then((res) => res.data);
  },

  /* ─── Creative Studio & Platform Marketing Assets (Modules C, D, E) ─── */
  listMarketingAssets(params?: { type?: string; isPublished?: boolean; industryGroup?: string }) {
    return api.get<{ data: PlatformMarketingAsset[] }>('/superadmin/marketing-assets', { params }).then((res) => res.data);
  },

  createMarketingAsset(data: Partial<PlatformMarketingAsset>) {
    return api.post<{ asset: PlatformMarketingAsset }>('/superadmin/marketing-assets', data).then((res) => res.data);
  },

  deleteMarketingAsset(id: string) {
    return api.delete<{ success: boolean }>(`/superadmin/marketing-assets/${id}`).then((res) => res.data);
  },

  uploadMarketingAsset(file: File) {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string; filename: string; mimeType: string; size: number }>('/superadmin/marketing-assets/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res) => res.data);
  },

  decodePoster(data: { image: string; mode?: string; render?: string; spec?: Record<string, unknown>; model?: string; hint?: string; width?: number; height?: number }) {
    return api.post<{ spec: Record<string, unknown>; cost?: number }>('/superadmin/marketing-assets/decode', data).then((res) => res.data);
  },


  generateAiImage(data: { prompt: string; provider?: string; model?: string; aspectRatio?: string; referenceImageUrl?: string }) {
    return api.post<{ url: string; cost?: number }>('/superadmin/marketing-assets/generate-image', data).then((res) => res.data);
  },


  generateAiVideo(data: { prompt: string; model?: string; duration?: number; aspectRatio?: string; firstFrameUrl?: string }) {
    return api.post<{ id: string; status: string }>('/superadmin/marketing-assets/generate-video', data).then((res) => res.data);
  },

  getVideoStatus(jobId: string) {
    return api.get<{ status: string; url?: string; cost?: number; error?: string }>(`/superadmin/marketing-assets/video/${jobId}`).then((res) => res.data);
  },

  generateMarketingCopy(data: { restaurantName?: string; cuisine?: string; tone?: string; dishName?: string; price?: string | number; description?: string; goal?: string; languages?: string[]; count?: number }) {
    return api.post<{ variants: Array<{ caption?: string; hashtags?: string[] }>; cost?: number }>('/superadmin/marketing-assets/copy', data).then((res) => res.data);
  },

  publishAssetToTenants(id: string, data: { targetAudience: 'all' | 'industry' | 'selected_tenants'; targetIndustryId?: string; workspaceIds?: string[] }) {
    return api.post<{ success: boolean; asset: PlatformMarketingAsset }>(`/superadmin/marketing-assets/${id}/publish`, data).then((res) => res.data);
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
      // Errors before streaming starts come back as the standard JSON envelope: show its `error` text.
      const errText = await res.text().catch(() => '');
      let message = errText;
      try {
        const body = JSON.parse(errText) as { error?: unknown };
        if (typeof body.error === 'string' && body.error) message = body.error;
      } catch {
        // Not JSON: keep the raw text.
      }
      throw new Error(message || `The script could not be started (${res.status}).`);
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
    return api.get<{ files: Array<{ name: string; sizeBytes: number; mtime: number; kind: 'image' | 'video' }> }>('/superadmin/marketing-assets/script-downloads').then((res) => res.data);
  },

  ingestScriptDownload(data: { filename: string; title?: string; caption?: string; hashtags?: string[] }) {
    return api.post<{ success: boolean; asset: PlatformMarketingAsset }>('/superadmin/marketing-assets/ingest-download', data).then((res) => res.data);
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
    return api.get<{ data: PlatformPrompt[]; categories: PromptCategorySummary[] }>('/superadmin/prompts', { params }).then((res) => res.data);
  },

  getPrompt(id: string) {
    return api.get<{ prompt: PlatformPrompt }>(`/superadmin/prompts/${id}`).then((res) => res.data);
  },

  createPrompt(data: Partial<PlatformPrompt>) {
    return api.post<{ prompt: PlatformPrompt }>('/superadmin/prompts', data).then((res) => res.data);
  },

  updatePrompt(id: string, data: Partial<PlatformPrompt>) {
    return api.put<{ prompt: PlatformPrompt }>(`/superadmin/prompts/${id}`, data).then((res) => res.data);
  },

  deletePrompt(id: string) {
    return api.delete<{ success: boolean; deletedId: string }>(`/superadmin/prompts/${id}`).then((res) => res.data);
  },

  togglePromptFavorite(id: string) {
    return api.post<{ prompt: PlatformPrompt }>(`/superadmin/prompts/${id}/favorite`).then((res) => res.data);
  },

  recordPromptUsage(id: string) {
    return api.post<{ prompt: PlatformPrompt }>(`/superadmin/prompts/${id}/use`).then((res) => res.data);
  },

  seedDefaultPrompts(force?: boolean) {
    return api.post<{ message: string; count: number; data?: PlatformPrompt[] }>('/superadmin/prompts/seed', { force }).then((res) => res.data);
  },
};
