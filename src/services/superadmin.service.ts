import api from './api.service';
import type { DashboardData } from './analytics.service';

export type DateRange = 'today' | 'last_7_days' | 'last_30_days' | 'last_90_days';

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

export interface PlatformAnalyticsOverview {
  range: string;
  period: { start: string; end: string };
  total_visitors: number;
  total_views: number;
  total_clicks: number;
  total_events: number;
  visitors_over_time: Array<{ date: string; visitors: number; events: number }>;
  action_distribution: Array<{ name: string; value: number }>;
}

export interface AnalyticsByUserResponse {
  range: string;
  period: { start: string; end: string };
  tenants: Array<{
    user_id: number;
    name: string;
    phone: string;
    total_events: number;
    unique_visitors: number;
  }>;
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
};

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
