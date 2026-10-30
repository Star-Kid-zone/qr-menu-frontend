import api from './api.service';
import { API_BASE_URL } from '@/config/app.constants';
import { getCsrfToken } from '@/utils/storage';
import type { DashboardData } from './analytics.service';

export type DateRange = 'today' | '24h' | 'last_7_days' | 'last_30_days' | 'last_90_days' | 'all';

export interface PlatformOverview {
  range: string;
  period: { start: string; end: string };
  users: {
    total: number;
    active: number;
    by_role: { admin: number; superadmin: number };
  };
  workspaces: { total: number; with_public_slug: number };
  businesses: { total: number; active: number };
  menus: { total: number };
  analytics_in_period: {
    total_events: number;
    distinct_visitors: number;
  };
}

export interface UserListRow {
  id: number;
  phone: string;
  name: string;
  role: string;
  active: boolean;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
  workspace_count: number;
  business_count: number;
  menu_count: number;
}

export interface UsersListResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  users: UserListRow[];
}

export interface BlueprintMenuItem {
  item: string;
  price: string;
  category: string;
  type: string;
  description: string;
  popular: boolean;
  imageUrl: string;
  dietaryTags?: string[];
  allergens?: string[];
  spiceLevel?: number | null;
  calories?: number | null;
}

export interface BlueprintTheme {
  landingTheme: string;
  menuTheme: string;
  landingStructure: string;
  menuStructure: string;
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
  heroTagline: string;
  announcementText: string;
  announcementEnabled: boolean;
  bannerUrl: string;
  logoUrl: string;
}

export interface BlueprintStory {
  headline: string;
  body: string;
  stats: Array<{ label: string; value: string }>;
}

export interface BlueprintBusiness {
  businessHours: string;
  availability: Array<{ day: string; startTime: string; endTime: string }>;
}

export interface BlueprintOffer {
  title: string;
  description: string;
  discount: string;
  badgeText?: string;
  imageUrl: string;
}

export interface BlueprintGalleryItem {
  imageUrl: string;
}

export interface BlueprintFaq {
  question: string;
  answer: string;
}

export interface MenuBlueprint {
  id: string;
  name: string;
  tagline: string;
  categoryNames: string[];
  icon: string;
  badge: string;
  isCustom?: boolean;
  items: BlueprintMenuItem[];
  theme?: BlueprintTheme;
  story?: BlueprintStory;
  business?: BlueprintBusiness;
  offers?: BlueprintOffer[];
  gallery?: BlueprintGalleryItem[];
  faqs?: BlueprintFaq[];
}

export interface OnboardingTemplateConfigResponse {
  autoSeedEnabled: boolean;
  defaultBlueprintId: string;
  blueprints: MenuBlueprint[];
}

export interface TenantMenuItem {
  id: number;
  item: string;
  price: string | number;
  imageUrl?: string | null;
  description?: string | null;
  category: string;
  type: string;
  popular: boolean;
  availability: boolean;
  availabilityTime?: string | null;
}

export interface TenantStaffMember {
  id: number;
  name: string;
  phone: string;
  role: 'manager' | 'staff';
  active: boolean;
  createdAt: string;
}

export interface UserDetailResponse {
  user: {
    id: number;
    phone: string;
    name: string;
    role: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
  workspaces: Array<{
    id: number;
    public_slug?: string | null;
    public_site_url?: string | null;
    paymentType?: string;
    paymentLink?: string | null;
    paymentQrImage?: string | null;
    reviewLink?: string | null;
    googlePlaceId?: string | null;
    themeColour?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    announcementText?: string | null;
    announcementEnabled?: boolean;
    [key: string]: unknown;
  }>;
  businesses: Array<{
    id: number;
    businessName: string;
    phone?: string;
    whatsappNumber?: string | null;
    address?: string | null;
    websiteUrl?: string | null;
    locationUrl?: string | null;
    businessHours?: string | null;
    socialLinks?: Array<{ platform: string; url: string }> | null;
    active: boolean;
    [key: string]: unknown;
  }>;
  menus: TenantMenuItem[];
  staff: TenantStaffMember[];
  gallery?: Array<{
    id: number;
    workspaceId: number;
    imageUrl: string;
    createdAt?: string;
  }>;
  offers?: Array<{
    id: number;
    workspaceId: number;
    title: string;
    description: string;
    discount?: string | null;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt?: string;
  }>;
  faqs?: Array<{
    id: number;
    workspaceId: number;
    question: string;
    answer: string;
    isVisible: boolean;
    sortOrder?: number;
  }>;
  googleReviews?: Array<{
    id: number;
    workspaceId: number;
    authorName: string;
    authorPhotoUrl?: string | null;
    rating: number;
    text?: string | null;
    relativePublishDescription?: string | null;
    publishTime?: string | null;
  }>;
  socialAccounts?: Array<{
    id: number;
    platform: string;
    displayName: string;
    username?: string | null;
    profileImageUrl?: string | null;
    status: string;
  }>;
  counts: {
    menus: number;
    reviews: number;
    payments: number;
    staff_members: number;
    analytics_events: number;
    gallery?: number;
    offers?: number;
    faqs?: number;
  };
}

export interface PlatformTimelinePoint {
  date: string;
  label?: string;
  visitors: number;
  views: number;
  clicks: number;
  searches: number;
  events: number;
}

export interface PlatformClickTarget {
  target: string;
  label: string;
  count: number;
  isConversion: boolean;
}

export interface PlatformSearchQuery {
  query: string;
  count: number;
}

export interface PlatformTopDish {
  menuItemId: string;
  item: string;
  price: string | number;
  imageUrl: string | null;
  type: string;
  category: string;
  restaurantName: string;
  count: number;
}

export interface PlatformHourlyPoint {
  hour: number;
  label: string;
  events: number;
  visitors: number;
}

export interface PlatformWeekdayPoint {
  day: string;
  count: number;
}

export interface PlatformFunnelStep {
  step: string;
  count: number;
  dropoffPct: number;
}

export interface PlatformAnalyticsOverview {
  range: string;
  period: { start: string; end: string };
  total_visitors: number;
  total_views: number;
  total_clicks: number;
  total_searches?: number;
  total_events: number;
  total_conversions?: number;
  conversion_rate?: number;
  active_tenants_count?: number;
  visitors_over_time: PlatformTimelinePoint[];
  action_distribution: Array<{ name: string; value: number }>;
  click_targets?: PlatformClickTarget[];
  top_searches?: PlatformSearchQuery[];
  zero_result_searches?: PlatformSearchQuery[];
  top_dishes?: PlatformTopDish[];
  hourly_distribution?: PlatformHourlyPoint[];
  weekday_distribution?: PlatformWeekdayPoint[];
  devices?: {
    device_types: Array<{ name: string; value: number }>;
    os: Array<{ name: string; value: number }>;
  };
  funnel?: PlatformFunnelStep[];
}

export interface AnalyticsTenantRow {
  user_id: number;
  name: string;
  phone: string;
  business_name?: string | null;
  public_slug?: string | null;
  total_events: number;
  unique_visitors: number;
  visits?: number;
  clicks?: number;
  searches?: number;
  conversions?: number;
  conversion_rate?: number;
  last_event_at?: string | null;
}

export interface AnalyticsByUserResponse {
  range: string;
  period: { start: string; end: string };
  tenants: AnalyticsTenantRow[];
}

async function unwrap<T>(p: Promise<any>): Promise<T> {
  const res = await p;
  if (res && res.data !== undefined) {
    if (
      res.data &&
      typeof res.data === 'object' &&
      !Array.isArray(res.data) &&
      'data' in res.data &&
      res.data.data !== undefined
    ) {
      return res.data.data as T;
    }
    return res.data as T;
  }
  return res as T;
}

export interface TenantAnalyticsData extends DashboardData {
  visitorsList?: {
    visitors: Array<{
      visitorId: string;
      fingerprint: string | null;
      ipAddress: string | null;
      userAgent: string | null;
      firstSeen: string;
      lastSeen: string;
      totalEvents: number;
      visits: number;
      clicks: number;
      searches: number;
    }>;
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
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
      targetUser: { id: string; name: string; phone: string; role: string };
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
    return unwrap<any>(api.patch(`/superadmin/users/${userId}/workspace`, data));
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

  decodePoster(data: { image: string; mode?: string; render?: string; spec?: any; model?: string; hint?: string; width?: number; height?: number }) {
    return unwrap<{ spec: any; cost?: number }>(api.post('/superadmin/marketing-assets/decode', data));
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
    return unwrap<{ variants: any[]; cost?: number }>(api.post('/superadmin/marketing-assets/copy', data));
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

export interface PlatformPrompt {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string | null;
  category: string;
  mediaType: 'image' | 'video' | 'poster';
  aspectRatio: string;
  recommendedModel: string;
  stylePreset: string;
  referenceImages: string[];
  tags: string[];
  cameraNotes?: string | null;
  usageCount: number;
  isFavorite: boolean;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromptCategorySummary {
  category: string;
  count: number;
}


export interface PlatformMarketingAsset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'poster_spec';
  mediaUrl: string;
  thumbnailUrl?: string | null;
  captionSuggestion?: string | null;
  hashtags?: string[];
  spec?: any;
  aspectRatio: string;
  industryGroup?: string | null;
  categoryTag?: string | null;
  targetAudience: 'all' | 'industry' | 'selected_tenants';
  targetIndustryId?: string | null;
  isPublishedToTenants: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface TenantRedirect {
  id: string;
  workspaceId: string;
  sourcePath: string;
  targetType: 'internal' | 'external';
  target: string;
  statusCode: 301 | 302;
  hitCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantRedirectInput {
  sourcePath: string;
  targetType?: 'internal' | 'external';
  target: string;
  statusCode?: 301 | 302;
}

export interface BlueprintMenuItem {
  item: string;
  price: string;
  category: string;
  type: string;
  description: string;
  popular: boolean;
  imageUrl: string;
}

export interface MenuBlueprint {
  id: string;
  name: string;
  tagline: string;
  categoryNames: string[];
  icon: string;
  badge: string;
  items: BlueprintMenuItem[];
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'feature' | 'promo';
  badgeText: string;
  actionUrl?: string | null;
  actionText?: string | null;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  readCount?: number;
}

export interface QueueJob {
  id: number;
  status: 'queued' | 'running' | 'succeeded' | 'retrying' | 'dead_letter' | 'cancelled';
  runAfter: string;
  lockedAt: string | null;
  attemptCount: number;
  lastError: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  destinationId: number | null;
  destinationStatus: string | null;
  caption: string | null;
  linkUrl: string | null;
  permalink: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  platform: 'facebook' | 'instagram' | null;
  accountName: string | null;
  accountUsername: string | null;
  accountStatus: string | null;
  tokenExpiresAt: string | null;
  workspaceId: number | null;
  businessName: string | null;
  userId: number | null;
  userName: string | null;
  userPhone: string | null;
}

export interface SocialAccountHealth {
  id: number;
  platform: 'facebook' | 'instagram';
  displayName: string;
  username: string | null;
  profileImageUrl: string | null;
  status: 'connected' | 'expired' | 'revoked' | 'error';
  tokenExpiresAt: string | null;
  lastCheckedAt: string | null;
  createdAt: string;
  workspaceId: number | null;
  businessName: string | null;
  userId: number | null;
  userName: string | null;
  userPhone: string | null;
}

export interface JobsAndQueueResponse {
  stats: {
    queued: number;
    running: number;
    succeeded: number;
    deadLetter: number;
    cancelled: number;
    totalAccounts: number;
    connectedAccounts: number;
    errorAccounts: number;
  };
  recentJobs: QueueJob[];
  socialAccountsHealth: SocialAccountHealth[];
}

export interface TenantWorkspaceSettings {
  specialOfferStatus?: boolean;
  menubtnStatus?: boolean;
  paybtnStatus?: boolean;
  reviewbtnStatus?: boolean;
  socialApprovalRequired?: boolean;
  announcementEnabled?: boolean;
  announcementText?: string;
  themeColour?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}
