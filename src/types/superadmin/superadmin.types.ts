import type { DashboardData } from '@/types/admin/analytics/analytics.types';

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
  id: string;
  email: string;
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

/** Superadmin wording for one occasion; empty = the shipped wording. */
export interface OccasionPackWording {
  banner?: string;
  specialsCategory?: string;
}

export interface BlueprintContent {
  amenities: Array<{ id: string; note?: string }>;
  awards: Array<{ title: string; publisher?: string; year?: number; url?: string; logoUrl?: string }>;
  team: Array<{ name: string; role?: string; bio?: string; photoUrl?: string }>;
  events: Array<{ title: string; description?: string; startsInDays: number; durationHours?: number; imageUrl?: string; linkUrl?: string }>;
}

export interface BlueprintSite {
  businessType: string;
  layout: string;
  skinId: string;
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

interface BlueprintBusiness {
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
  /** The guest-site look a new restaurant starts with. */
  site?: BlueprintSite;
  content?: BlueprintContent;
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
  id: string;
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

interface TenantStaffMember {
  id: string;
  name: string;
  email?: string | null;
  role: 'manager' | 'staff';
  active: boolean;
  createdAt: string;
}

export interface UserDetailResponse {
  user: {
    id: string;
    email?: string | null;
    name: string;
    role: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
  workspaces: Array<{
    id: string;
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
    id: string;
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
    id: string;
    workspaceId: string;
    imageUrl: string;
    createdAt?: string;
  }>;
  offers?: Array<{
    id: string;
    workspaceId: string;
    title: string;
    description: string;
    discount?: string | null;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt?: string;
  }>;
  faqs?: Array<{
    id: string;
    workspaceId: string;
    question: string;
    answer: string;
    isVisible: boolean;
    sortOrder?: number;
  }>;
  googleReviews?: Array<{
    id: string;
    workspaceId: string;
    authorName: string;
    authorPhotoUrl?: string | null;
    rating: number;
    text?: string | null;
    relativePublishDescription?: string | null;
    publishTime?: string | null;
  }>;
  socialAccounts?: Array<{
    id: string;
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

interface PlatformTimelinePoint {
  date: string;
  label?: string;
  visitors: number;
  views: number;
  clicks: number;
  searches: number;
  events: number;
}

interface PlatformClickTarget {
  target: string;
  label: string;
  count: number;
  isConversion: boolean;
}

interface PlatformSearchQuery {
  query: string;
  count: number;
}

interface PlatformTopDish {
  menuItemId: string;
  item: string;
  price: string | number;
  imageUrl: string | null;
  type: string;
  category: string;
  restaurantName: string;
  count: number;
}

interface PlatformHourlyPoint {
  hour: number;
  label: string;
  events: number;
  visitors: number;
}

interface PlatformWeekdayPoint {
  day: string;
  count: number;
}

interface PlatformFunnelStep {
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

interface AnalyticsTenantRow {
  user_id: string;
  name: string;
  email?: string | null;
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

export interface PromptFormData {
  title: string;
  prompt: string;
  negativePrompt: string;
  category: string;
  mediaType: 'image' | 'video' | 'poster';
  aspectRatio: string;
  recommendedModel: string;
  stylePreset: string;
  referenceImages: string[];
  tags: string[];
  cameraNotes: string;
  isFavorite: boolean;
}

export interface PromptLibrary {
  prompts: PlatformPrompt[];
  categories: PromptCategorySummary[];
}

export interface PromptFilters {
  selectedCategory: string;
  selectedMediaType: string;
  favoritesOnly: boolean;
  searchQuery: string;
}

export interface PlatformMarketingAsset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'poster_spec';
  mediaUrl: string;
  thumbnailUrl?: string | null;
  captionSuggestion?: string | null;
  hashtags?: string[];
  spec?: Record<string, unknown>;
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
  id: string;
  status: 'queued' | 'running' | 'succeeded' | 'retrying' | 'dead_letter' | 'cancelled';
  runAfter: string;
  lockedAt: string | null;
  attemptCount: number;
  lastError: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  destinationId: string | null;
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
  workspaceId: string | null;
  businessName: string | null;
  userId: string | null;
  userName: string | null;
}

interface SocialAccountHealth {
  id: string;
  platform: 'facebook' | 'instagram';
  displayName: string;
  username: string | null;
  profileImageUrl: string | null;
  status: 'connected' | 'expired' | 'revoked' | 'error';
  tokenExpiresAt: string | null;
  lastCheckedAt: string | null;
  createdAt: string;
  workspaceId: string | null;
  businessName: string | null;
  userId: string | null;
  userName: string | null;
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
