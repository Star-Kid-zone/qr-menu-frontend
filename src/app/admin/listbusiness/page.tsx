"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  lazy,
  Suspense,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PiDeviceMobileBold,
  PiLinkBold,
  PiListBulletsBold,
  PiMegaphoneBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiStorefrontBold,
  PiSwatchesBold,
  PiTrashBold,
  PiUploadSimpleBold,
  PiXBold,
} from "react-icons/pi";
import { normalizeTenantSlug, tenantSlugSchema } from "@/schemas/tenant.schema";
import type { Availability } from "@/types/components/admin/workspace/PublicSlugEditor.types";
import { getApiErrorMessage } from "@/utils/errors";

import {
  Button,
  Card,
  ConfirmDeleteModal,
  EmptyState,
  PageHeader,
  PageLoader,
  StatusMessage,
  FormField,
  Input,
  Textarea,
  Spinner,
  ScrollableTabRow,
  SubTabPills,
} from "@/components/ui";

import {
  settingService,
  industryService,
  businessService,
  menuService,
} from "@/services";
import { workspaceService } from "@/services/workspace.service";

import { BannerAnnouncementForm } from "@/components/admin/workspace/BannerAnnouncementForm";
import { WorkspaceSettingsForm } from "@/components/admin/workspace/WorkspaceSettingsForm";
import { AddSettingModal } from "@/components/admin/workspace/AddSettingModal";
import { PhonePreview } from "@/components/admin/workspace/PhonePreview";
import { LandingPreviewRenderer } from "@/components/admin/workspace/LandingPreviewRenderer";
import { MenuPreviewRenderer } from "@/components/admin/workspace/MenuPreviewRenderer";
import type { BannerAnnouncementValues } from "@/types/components/admin/workspace/BannerAnnouncementForm.types";
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";

import {
  buildWorkspaceSettingsPayload,
  mapWorkspaceSettingToFormValues,
} from "@/utils/workspace.utils";

import type {
  WorkspaceBusiness,
  WorkspaceDashboardData,
  WorkspaceSetting,
  WorkspaceSettingsFormValues,
} from "@/types/workspace.types";
import type {
  WorkspaceGalleryItem,
  WorkspaceOfferItem,
  WorkspacePaymentConfig,
  WorkspaceReviewConfig,
} from "@/services/workspace.service";
import type { Currency, Industry } from "@/types";

import { cn } from "@/utils/cn";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import { WorkspaceTabId } from "@/types/app/admin/listbusiness/page.types";
import {
  INLINE_WORKSPACE_FORM_ID,
  INLINE_BANNER_FORM_ID,
  INLINE_ADD_BUSINESS_FORM_ID,
  TABS,
  DEFAULT_TAB,
} from "@/constants/app/admin/listbusiness/page.constants";
import { usePermissions } from "@/hooks/usePermissions";
import { BusinessForm, editBusinessFormId } from "./BusinessForm";
import type { BusinessSchemaValues } from "./BusinessForm";

// Lazy load larger components or those with many dependencies
const ListGallery = lazy(() =>
  import("@/components/admin/workspace/ListGallery").then((m) => ({
    default: m.ListGallery,
  })),
);
const ListOffers = lazy(() =>
  import("@/components/admin/workspace/ListOffers").then((m) => ({
    default: m.ListOffers,
  })),
);
const WorkspaceFeatureLibrarySection = lazy(() =>
  import("@/components/admin/workspace/WorkspaceFeatureLibrarySection").then(
    (m) => ({
      default: m.WorkspaceFeatureLibrarySection,
    }),
  ),
);
const ListTestimonials = lazy(() =>
  import("@/components/admin/workspace/ListTestimonials").then((m) => ({
    default: m.ListTestimonials,
  })),
);
const ListFaqs = lazy(() =>
  import("@/components/admin/workspace/ListFaqs").then((m) => ({
    default: m.ListFaqs,
  })),
);
const ListLottery = lazy(() =>
  import("@/components/admin/workspace/ListLottery").then((m) => ({
    default: m.ListLottery,
  })),
);

import type { ListOffersHandle } from "@/components/admin/workspace/ListOffers";
import type { ListGalleryHandle } from "@/components/admin/workspace/ListGallery";
import type { ListTestimonialsHandle } from "@/components/admin/workspace/ListTestimonials";
import type { ListFaqsHandle } from "@/components/admin/workspace/ListFaqs";
import type { ListLotteryHandle } from "@/components/admin/workspace/ListLottery";
import type { WorkspaceTestimonial, WorkspaceFaq, WorkspaceLotteryReward } from "@/services/workspace.service";

const isWorkspaceTabId = (value: string | null): value is WorkspaceTabId =>
  TABS.some((tab) => tab.id === value);

function ListBusinessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedTab = searchParams?.get("tab") || null;
  const { hasPermission } = usePermissions();
  const visibleTabs = TABS.filter((tab) => hasPermission(tab.unit));

  useEffect(() => {
    if (requestedTab === "overview") {
      const next = new URLSearchParams(searchParams?.toString() || "");
      next.set("tab", "workspace");
      router.replace(`?${next.toString()}`);
    }
  }, [requestedTab, searchParams, router]);

  const activeTab =
    isWorkspaceTabId(requestedTab) && visibleTabs.some((tab) => tab.id === requestedTab)
      ? requestedTab
      : DEFAULT_TAB;

  const [businesses, setBusinesses] = useState<WorkspaceBusiness[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceSetting | null>(null);
  const [workspaceGallery, setWorkspaceGallery] = useState<
    WorkspaceGalleryItem[]
  >([]);
  const [workspaceOffers, setWorkspaceOffers] = useState<WorkspaceOfferItem[]>([]);
  const [workspaceTestimonials, setWorkspaceTestimonials] = useState<WorkspaceTestimonial[]>([]);
  const [workspaceFaqs, setWorkspaceFaqs] = useState<WorkspaceFaq[]>([]);
  const [workspaceLotteryRewards, setWorkspaceLotteryRewards] = useState<WorkspaceLotteryReward[]>([]);
  const [workspacePayment, setWorkspacePayment] = useState<WorkspacePaymentConfig | null>(null);
  const [workspaceReview, setWorkspaceReview] = useState<WorkspaceReviewConfig | null>(null);
  const [workspaceMenuItems, setWorkspaceMenuItems] = useState<Array<Record<string, unknown>>>([]);
  const [contentDraft, setContentDraft] = useState<{ storyHeadline: string; storyBody: string; stats: Array<{ label: string; value: string }> }>({
    storyHeadline: "",
    storyBody: "",
    stats: [],
  });
  const [savedContentDraft, setSavedContentDraft] = useState(contentDraft);
  const [contentEditMode, setContentEditMode] = useState(false);
  const [contentSaveLoading, setContentSaveLoading] = useState(false);
  const [contentSaveError, setContentSaveError] = useState<string | null>(null);
  const [businessEditMode, setBusinessEditMode] = useState(false);
  const [businessSection, setBusinessSection] = useState<"profile" | "social" | "hours">("profile");
  const [workspaceDesignSection, setWorkspaceDesignSection] = useState<"landing" | "menu">("landing");
  const [businessFormLoading, setBusinessFormLoading] = useState(false);
  const [publicSiteEditMode, setPublicSiteEditMode] = useState(false);
  const [slugDraft, setSlugDraft] = useState("");
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugAvailability, setSlugAvailability] = useState<Availability>("idle");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteBusinessId, setDeleteBusinessId] = useState<number | null>(null);
  const listOffersRef = useRef<ListOffersHandle>(null);
  const listGalleryRef = useRef<ListGalleryHandle>(null);
  const listTestimonialsRef = useRef<ListTestimonialsHandle>(null);
  const listFaqsRef = useRef<ListFaqsHandle>(null);
  const listLotteryRef = useRef<ListLotteryHandle>(null);
  const [addWorkspaceModalOpen, setAddWorkspaceModalOpen] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [workspaceEditMode, setWorkspaceEditMode] = useState(false);
  const [bannersEditMode, setBannersEditMode] = useState(false);
  const [workspaceCurrencies, setWorkspaceCurrencies] = useState<Currency[]>(
    [],
  );
  const [workspaceSaveLoading, setWorkspaceSaveLoading] = useState(false);
  const [workspaceSaveError, setWorkspaceSaveError] = useState<string | null>(
    null,
  );
  const [bannersSaveLoading, setBannersSaveLoading] = useState(false);
  const [bannersSaveError, setBannersSaveError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [workspaceDraft, setWorkspaceDraft] = useState<WorkspaceSettingsFormValues | null>(null);
  const [businessDraft, setBusinessDraft] = useState<BusinessSchemaValues | null>(null);
  const [bannerDraft, setBannerDraft] = useState<BannerAnnouncementValues | null>(null);

  const fetchIndustries = useCallback(async () => {
    try {
      const response = await industryService.getIndustries();
      setIndustries(response.data || []);
    } catch (error) {
      console.error("Failed to fetch industries", error);
    }
  }, []);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  const setActiveTab = useCallback(
    (tab: WorkspaceTabId) => {
      const nextParams = new URLSearchParams(searchParams?.toString() || "");
      nextParams.set("tab", tab);
      router.replace(`?${nextParams.toString()}`);
    },
    [searchParams, router],
  );

  const fetchWorkspaceData = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);
      const response = await workspaceService.getWorkspace();
      const data = response.data;

      setBusinesses(data.business ? [{
        ...data.business,
        business_name: data.business.name,
        website_url: data.business.websiteUrl,
        social_media: data.business.socialLinks,
        industry_id: data.business.industryId != null ? Number(data.business.industryId) : null,
        active: true
      } as any] : []);

      const mappedWorkspace: WorkspaceSetting = {
        id: data.workspaceId ? parseInt(data.workspaceId) : undefined,
        public_slug: data.publicSlug,
        theme_colour:         data.theme?.themeColour        || "",
        primary_color:        data.theme?.primaryColor        || "#171717",
        secondary_color:      data.theme?.secondaryColor      || "#64748b",
        accent_color:         data.theme?.accentColor         || "#0f172a",
        text_primary_color:   data.theme?.textPrimaryColor    || "#0f172a",
        text_secondary_color: data.theme?.textSecondaryColor  || "#475569",
        accent_text_color:    data.theme?.accentTextColor     || "#ffffff",
        border_color:         data.theme?.borderColor         || "#e2e8f0",
        footer_bg_color:      data.theme?.footerBgColor       || "#0f172a",
        section_bg_color:     data.theme?.sectionBgColor      || "#f1f5f9",
        font_family:          data.theme?.fontFamily          || '"Inter","Plus Jakarta Sans",system-ui,sans-serif',
        card_style:           data.theme?.cardStyle           || "rounded-2xl",
        hero_overlay:         data.theme?.heroOverlay         || "linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))",
        heading_class:        data.theme?.headingClass        || "",
        theme_badge:          data.theme?.themeBadge          || "",
        theme_marquee:        data.theme?.themeMarquee        || "",
        hero_tagline:         data.theme?.heroTagline         || "",
        menu_theme:           data.theme?.menuTheme           || "modern",
        landing_theme:        data.theme?.landingTheme        || "modern",
        landing_structure:    data.theme?.landingStructure    || "",
        loading_screen_theme: data.theme?.loadingScreenTheme  || "modern",
        menu_primary_color:        data.theme?.menuPrimaryColor        || "#0F766E",
        menu_secondary_color:      data.theme?.menuSecondaryColor      || "#14B8A6",
        menu_accent_color:         data.theme?.menuAccentColor         || "#134E4A",
        menu_text_primary_color:   data.theme?.menuTextPrimaryColor    || "#0f172a",
        menu_text_secondary_color: data.theme?.menuTextSecondaryColor  || "#475569",
        menu_accent_text_color:    data.theme?.menuAccentTextColor     || "#ffffff",
        menu_border_color:         data.theme?.menuBorderColor         || "#e2e8f0",
        menu_footer_bg_color:      data.theme?.menuFooterBgColor       || "#0f172a",
        menu_section_bg_color:     data.theme?.menuSectionBgColor      || "#f1f5f9",
        menu_font_family:          data.theme?.menuFontFamily          || '"Inter","Plus Jakarta Sans",system-ui,sans-serif',
        menu_card_style:           data.theme?.menuCardStyle           || "rounded-2xl",
        menu_structure:            data.theme?.menuStructure           || "",
        menubtn_status: data.buttons?.menubtnStatus ?? true,
        paybtn_status: data.buttons?.paybtnStatus ?? true,
        reviewbtn_status: data.buttons?.reviewbtnStatus ?? true,
        special_offer_status: data.buttons?.specialOfferStatus ?? true,
        lottery_status: data.buttons?.lotteryStatus ?? false,
        announcement_enabled: data.announcement?.enabled ?? false,
        announcement_text: data.announcement?.text || "",
        currency_id: data.currency ? null : null,
        industry_feature_catalog: data.industryFeatureCatalog || {},
        logo_url: data.theme?.logoUrl || "",
        banner_url: data.theme?.bannerUrl || "",
      } as any;

      setWorkspace(mappedWorkspace);
      setWorkspaceGallery(data.gallery as any || []);
      setWorkspaceOffers(data.offers as any || []);
      setWorkspaceTestimonials(data.testimonials || []);
      setWorkspaceFaqs(data.faqs || []);
      setWorkspaceLotteryRewards(data.lotteryRewards || []);
      setWorkspacePayment(data.payment || null);
      setWorkspaceReview(data.review || null);
      const nextContentDraft = {
        storyHeadline: data.content?.storyHeadline || "",
        storyBody: data.content?.storyBody || "",
        stats: data.content?.stats || [],
      };
      setContentDraft(nextContentDraft);
      setSavedContentDraft(nextContentDraft);
    } catch (fetchError) {
      console.error("Error fetching workspace data:", fetchError);
      setError("We could not load your workspace right now. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchWorkspaceData();
  }, [fetchWorkspaceData]);

  useEffect(() => {
    if (activeTab !== "workspace") {
      setWorkspaceEditMode(false);
      setWorkspaceSaveError(null);
    }
    if (activeTab !== "banners") {
      setBannersEditMode(false);
      setBannersSaveError(null);
    }
    if (activeTab !== "businesses") {
      setBusinessEditMode(false);
    }
    if (activeTab !== "public-site") {
      setPublicSiteEditMode(false);
      setSlugError(null);
    }
    if (activeTab !== "content") {
      setContentEditMode(false);
      setContentSaveError(null);
      setContentDraft(savedContentDraft);
    }
  }, [activeTab, savedContentDraft]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy:", text);
    }
  };

  useEffect(() => {
    if (!workspace) {
      setWorkspaceCurrencies([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await settingService.getCurrencies();
        if (!cancelled) {
          setWorkspaceCurrencies(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        if (!cancelled) setWorkspaceCurrencies([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [workspace]);

  const savedSlug = normalizeTenantSlug(workspace?.public_slug ?? "");

  useEffect(() => {
    if (!publicSiteEditMode) {
      setSlugAvailability("idle");
      return;
    }
    const normalized = normalizeTenantSlug(slugDraft);
    if (!normalized) {
      setSlugAvailability("invalid");
      return;
    }
    const parsed = tenantSlugSchema.safeParse(normalized);
    if (!parsed.success) {
      setSlugAvailability("invalid");
      return;
    }
    if (parsed.data === savedSlug) {
      setSlugAvailability("unchanged");
      return;
    }
    setSlugAvailability("checking");
    const slugToCheck = parsed.data;
    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await workspaceService.checkSlugAvailability(slugToCheck);
          const payload = res.data?.data as { available?: boolean } | undefined;
          setSlugAvailability(payload?.available ? "available" : "taken");
        } catch {
          setSlugAvailability("error");
        }
      })();
    }, 400);
    return () => window.clearTimeout(t);
  }, [publicSiteEditMode, slugDraft, savedSlug]);

  const slugAvailabilityLabel = (() => {
    switch (slugAvailability) {
      case "checking":
        return <span className="text-muted-foreground">Checking availability…</span>;
      case "available":
        return <span className="font-semibold text-success">Available</span>;
      case "taken":
        return <span className="font-bold text-destructive">Already in use</span>;
      case "invalid":
        return <span className="text-destructive">Fix the format to continue</span>;
      case "unchanged":
        return <span className="text-muted-foreground">Same as current slug</span>;
      case "error":
        return <span className="text-destructive">Could not verify; you can still try Save</span>;
      default:
        return null;
    }
  })();

  const canSaveSlug =
    tenantSlugSchema.safeParse(normalizeTenantSlug(slugDraft)).success &&
    normalizeTenantSlug(slugDraft) !== savedSlug &&
    (slugAvailability === "available" || slugAvailability === "error");

  const previewLandingUrl = useMemo(
    () => buildPublicLandingUrl(workspace?.public_slug),
    [workspace?.public_slug],
  );
  const previewMenuUrl = useMemo(
    () => buildPublicMenuUrl(workspace?.public_slug),
    [workspace?.public_slug],
  );
  const previewDefaultView =
    activeTab === "workspace" ? workspaceDesignSection : "landing";

  const previewData: RawPublicSiteData = useMemo(() => {
    const biz = businesses[0] ?? null;
    const effectiveBusiness = businessEditMode && businessDraft ? businessDraft : biz;

    const settingsBase = mapWorkspaceSettingToFormValues(workspace);
    const effectiveSettings: Record<string, unknown> = {
      ...settingsBase,
      ...(workspaceEditMode && workspaceDraft ? workspaceDraft : {}),
      ...(bannersEditMode && bannerDraft ? bannerDraft : {}),
      id: workspace?.id ?? null,
      public_slug: workspace?.public_slug ?? "",
      logo_url: (workspace as any)?.logo_url ?? "",
      banner_url: (workspace as any)?.banner_url ?? "",
      story_headline: contentDraft.storyHeadline,
      story_body: contentDraft.storyBody,
      stats: contentDraft.stats,
    };

    return {
      user_id: workspace?.id ?? 0,
      settings: effectiveSettings,
      business: effectiveBusiness
        ? {
            business_name: effectiveBusiness.business_name,
            industry_id: (effectiveBusiness as any).industryId ?? effectiveBusiness.industry_id ?? null,
            phone: effectiveBusiness.phone,
            address: effectiveBusiness.address,
            business_hours: (effectiveBusiness as any).businessHours ?? null,
            whatsapp_number: (effectiveBusiness as any).whatsappNumber ?? null,
            location_url: (effectiveBusiness as any).locationUrl ?? null,
            features: (effectiveBusiness as any).features ?? null,
            website_url: effectiveBusiness.website_url,
            social_media: effectiveBusiness.social_media,
            availability: effectiveBusiness.availability,
          }
        : null,
      payment: workspacePayment
        ? {
            payment_type: workspacePayment.type,
            payment_link: workspacePayment.link,
            payment_qr_image: workspacePayment.qrImage,
          }
        : null,
      review: workspaceReview
        ? { review_link: workspaceReview.googleReviewLink }
        : null,
      gallery: workspaceGallery as unknown as RawPublicSiteData["gallery"],
      offers: workspaceOffers as unknown as RawPublicSiteData["offers"],
      menuItems: workspaceMenuItems as unknown as RawPublicSiteData["menuItems"],
      testimonials: workspaceTestimonials as RawPublicSiteData["testimonials"],
      faqs: workspaceFaqs as RawPublicSiteData["faqs"],
      lotteryRewards: workspaceLotteryRewards as RawPublicSiteData["lotteryRewards"],
      currency: (workspace as any)?.currency ?? null,
    };
  }, [
    workspace,
    businesses,
    businessEditMode,
    businessDraft,
    workspaceEditMode,
    workspaceDraft,
    bannersEditMode,
    bannerDraft,
    contentDraft,
    workspaceGallery,
    workspaceOffers,
    workspaceTestimonials,
    workspaceFaqs,
    workspaceLotteryRewards,
    workspacePayment,
    workspaceReview,
    workspaceMenuItems,
  ]);

  const workspaceFormInitialValues = useMemo(
    () => mapWorkspaceSettingToFormValues(workspace),
    [workspace],
  );

  const bannerFormInitialValues = useMemo(() => {
    const v = mapWorkspaceSettingToFormValues(workspace);
    return {
      announcement_enabled: v.announcement_enabled,
      announcement_text: v.announcement_text,
    };
  }, [workspace]);

  const handleWorkspaceSave = useCallback(
    async (values: WorkspaceSettingsFormValues) => {
      if (!workspace?.id) return;
      setWorkspaceSaveLoading(true);
      setWorkspaceSaveError(null);
      try {
        await workspaceService.updateWorkspace({
          theme: {
            themeColour:        values.theme_colour,
            primaryColor:       values.primary_color,
            secondaryColor:     values.secondary_color,
            accentColor:        values.accent_color,
            textPrimaryColor:   values.text_primary_color,
            textSecondaryColor: values.text_secondary_color,
            accentTextColor:    values.accent_text_color,
            borderColor:        values.border_color,
            footerBgColor:      values.footer_bg_color,
            sectionBgColor:     values.section_bg_color,
            fontFamily:         values.font_family,
            cardStyle:          values.card_style,
            heroOverlay:        values.hero_overlay,
            headingClass:       values.heading_class,
            themeBadge:         values.theme_badge,
            themeMarquee:       values.theme_marquee,
            heroTagline:        values.hero_tagline,
            menuTheme:          values.menu_theme,
            landingTheme:       values.landing_theme,
            landingStructure:   values.landing_structure,
            loadingScreenTheme: values.loading_screen_theme,
            menuPrimaryColor:        values.menu_primary_color,
            menuSecondaryColor:      values.menu_secondary_color,
            menuAccentColor:         values.menu_accent_color,
            menuTextPrimaryColor:    values.menu_text_primary_color,
            menuTextSecondaryColor:  values.menu_text_secondary_color,
            menuAccentTextColor:     values.menu_accent_text_color,
            menuBorderColor:         values.menu_border_color,
            menuFooterBgColor:       values.menu_footer_bg_color,
            menuSectionBgColor:      values.menu_section_bg_color,
            menuFontFamily:          values.menu_font_family,
            menuCardStyle:           values.menu_card_style,
            menuStructure:           values.menu_structure,
          },
          buttons: {
            menubtnStatus: values.menubtn_status,
            paybtnStatus: values.paybtn_status,
            reviewbtnStatus: values.reviewbtn_status,
            specialOfferStatus: values.special_offerstatus,
            lotteryStatus: values.lottery_status,
          },
          currencyId: values.currency_id?.toString() || null,
        });
        setWorkspaceEditMode(false);
        await fetchWorkspaceData();
      } catch (err: unknown) {
        setWorkspaceSaveError("Failed to save workspace settings.");
      } finally {
        setWorkspaceSaveLoading(false);
      }
    },
    [workspace, fetchWorkspaceData],
  );

  const handleBannerSave = useCallback(
    async (bannerValues: {
      announcement_enabled: boolean;
      announcement_text: string;
    }) => {
      if (!workspace?.id) return;
      setBannersSaveLoading(true);
      setBannersSaveError(null);
      try {
        await workspaceService.updateWorkspace({
          announcement: {
            enabled: bannerValues.announcement_enabled,
            text: bannerValues.announcement_text,
          }
        });
        setBannersEditMode(false);
        await fetchWorkspaceData();
      } catch (err: unknown) {
        setBannersSaveError("Failed to save banner settings.");
      } finally {
        setBannersSaveLoading(false);
      }
    },
    [workspace, fetchWorkspaceData],
  );

  const handleContentSave = useCallback(async () => {
    if (!workspace?.id) return;
    setContentSaveLoading(true);
    setContentSaveError(null);
    try {
      await workspaceService.updateWorkspace({
        content: {
          storyHeadline: contentDraft.storyHeadline || null,
          storyBody: contentDraft.storyBody || null,
          stats: contentDraft.stats.filter((s) => s.label.trim() && s.value.trim()),
        },
      });
      setContentEditMode(false);
      await fetchWorkspaceData();
    } catch (err: unknown) {
      setContentSaveError("Failed to save story & stats.");
    } finally {
      setContentSaveLoading(false);
    }
  }, [workspace, contentDraft, fetchWorkspaceData]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await menuService.getMenus();
        if (!cancelled) {
          setWorkspaceMenuItems(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        if (!cancelled) setWorkspaceMenuItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openDeleteModal = (businessId: number) => {
    setDeleteBusinessId(businessId);
    setDeleteModalOpen(true);
  };

  const workspaceFeatureLibraryTarget =
    workspace?.id != null
      ? {
          id: workspace.id,
          industry_feature_catalog: workspace.industry_feature_catalog,
        }
      : null;

  const tabMetric = (tab: WorkspaceTabId) => {
    if (tab === "workspace") return workspace ? "Ready" : "Setup";
    if (tab === "businesses") return `${businesses.length}`;
    if (tab === "public-site") {
      const s = workspace?.public_slug?.trim();
      return s ? s : "—";
    }
    if (tab === "banners")
      return workspace?.announcement_enabled ? "On" : "Off";
    if (tab === "offers") return `${workspaceOffers.length}`;
    if (tab === "gallery") return `${workspaceGallery.length}`;
    if (tab === "features")
      return workspaceFeatureLibraryTarget ? "Live" : "Locked";
    if (tab === "content")
      return contentDraft.storyHeadline || contentDraft.storyBody || contentDraft.stats.length > 0 ? "Set" : "Empty";
    if (tab === "testimonials") return `${workspaceTestimonials.length}`;
    if (tab === "faqs") return `${workspaceFaqs.length}`;
    if (tab === "lottery") return `${workspaceLotteryRewards.length}`;
    return "";
  };

  const panelActions = (() => {
    if (activeTab === "businesses") {
      if (!businesses[0]) return null;
      if (businessEditMode) {
        return (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setBusinessEditMode(false)}
              disabled={businessFormLoading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              form={editBusinessFormId(businesses[0].id)}
              loading={businessFormLoading}
              className="w-full sm:w-auto"
            >
              Save
            </Button>
          </div>
        );
      }
      return (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setBusinessEditMode(true)}
          startIcon={<PiPencilSimpleBold className="size-4" />}
        >
          Edit profile
        </Button>
      );
    }

    if (activeTab === "public-site" && workspace) {
      if (publicSiteEditMode) {
        return (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={slugSaving}
              onClick={() => {
                setPublicSiteEditMode(false);
                setSlugError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              loading={slugSaving}
              disabled={!canSaveSlug || slugSaving}
              onClick={async () => {
                const normalized = normalizeTenantSlug(slugDraft);
                if (!tenantSlugSchema.safeParse(normalized).success) return;
                setSlugSaving(true);
                setSlugError(null);
                try {
                  await workspaceService.updateSlug(normalized);
                  setPublicSiteEditMode(false);
                  void fetchWorkspaceData();
                } catch (err) {
                  setSlugError(getApiErrorMessage(err, "Could not save slug. Try again."));
                } finally {
                  setSlugSaving(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        );
      }
      return (
        <Button
          variant="secondary"
          size="sm"
          startIcon={<PiPencilSimpleBold className="size-4" />}
          onClick={() => {
            setSlugDraft(workspace?.public_slug?.trim() ?? "");
            setSlugError(null);
            setPublicSiteEditMode(true);
          }}
        >
          Edit slug
        </Button>
      );
    }

    if (activeTab === "content" && workspace) {
      if (contentEditMode) {
        return (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={contentSaveLoading}
              onClick={() => {
                setContentEditMode(false);
                setContentSaveError(null);
                setContentDraft(savedContentDraft);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleContentSave()} loading={contentSaveLoading}>
              Save
            </Button>
          </div>
        );
      }
      return (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setContentEditMode(true)}
          startIcon={<PiPencilSimpleBold className="size-4" />}
        >
          Edit
        </Button>
      );
    }

    return null;
  })();

  const renderWorkspaceTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <PageHeader
        title="Workspace"
        className="shrink-0 px-1"
        actions={
          workspace ? (
            workspaceEditMode ? (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setWorkspaceEditMode(false);
                    setWorkspaceSaveError(null);
                  }}
                  disabled={workspaceSaveLoading}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form={INLINE_WORKSPACE_FORM_ID}
                  loading={workspaceSaveLoading}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setWorkspaceSaveError(null);
                  setWorkspaceEditMode(true);
                }}
                startIcon={<PiPencilSimpleBold className="size-4" />}
                size="sm"
              >
                Edit
              </Button>
            )
          ) : null
        }
      />

      {workspace && (
        <SubTabPills
          options={[
            { id: "landing", label: "Landing page" },
            { id: "menu", label: "Menu page" },
          ]}
          active={workspaceDesignSection}
          onChange={setWorkspaceDesignSection}
        />
      )}

      <div className="min-h-0 flex-1">
        {workspace ? (
          <div className="h-full overflow-y-auto rounded-lg border border-border bg-card p-4 pr-3 md:p-6">
            <WorkspaceSettingsForm
              key={`${workspace.id}-${workspaceEditMode}`}
              formId={INLINE_WORKSPACE_FORM_ID}
              isOpen={workspaceEditMode}
              readOnly={!workspaceEditMode}
              compact
              section={workspaceDesignSection}
              initialValues={workspaceFormInitialValues}
              onSubmit={handleWorkspaceSave}
              error={workspaceSaveError}
              loading={workspaceSaveLoading}
              currencies={workspaceCurrencies}
              showPalettePresets={workspaceEditMode}
              onValuesChange={setWorkspaceDraft}
            />
          </div>
        ) : (
          <EmptyState
            icon={<PiSwatchesBold className="size-8" />}
            title="Create your workspace"
            description="Set up the shared brand layer."
            action={
              <Button
                onClick={() => setAddWorkspaceModalOpen(true)}
                startIcon={<PiPlusBold className="size-5" />}
              >
                Create workspace
              </Button>
            }
          />
        )}
      </div>
    </div>
  );

  const renderPublicSiteTab = () => {
    const slug = workspace?.public_slug?.trim() ?? "";
    const landingUrl = slug ? buildPublicLandingUrl(slug) : "";
    const menuUrl = slug ? buildPublicMenuUrl(slug) : "";

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <PageHeader
          className="shrink-0"
          title="Public site"
          description="Manage your public subdomain and routing URLs."
          actions={panelActions}
        />

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {workspace ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="space-y-4 p-6 md:col-span-2">
                <p className="text-caption uppercase tracking-wide text-muted-foreground">
                  Public slug
                </p>
                <Input
                  className="font-mono"
                  value={publicSiteEditMode ? slugDraft : slug || ""}
                  placeholder={publicSiteEditMode ? "e.g. my-restaurant" : "Not set"}
                  disabled={!publicSiteEditMode || slugSaving}
                  onChange={(e) => setSlugDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  autoComplete="off"
                />
                {publicSiteEditMode && slugAvailabilityLabel ? (
                  <p className="text-caption">{slugAvailabilityLabel}</p>
                ) : null}
                {slugError && publicSiteEditMode ? (
                  <StatusMessage variant="error">{slugError}</StatusMessage>
                ) : null}
              </Card>
              <Card className="space-y-3 p-6 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-caption uppercase tracking-wide text-muted-foreground">
                    Landing URL
                  </p>
                  {landingUrl ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void copyToClipboard(landingUrl)}
                    >
                      Copy URL
                    </Button>
                  ) : null}
                </div>
                {landingUrl ? (
                  <a
                    href={landingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-body font-semibold text-foreground hover:underline"
                  >
                    {landingUrl}
                  </a>
                ) : (
                  <p className="text-body text-muted-foreground">
                    Set a public slug to generate your landing page URL.
                  </p>
                )}
              </Card>
              <Card className="space-y-3 p-6 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-caption uppercase tracking-wide text-muted-foreground">
                    Guest menu URL
                  </p>
                  {menuUrl ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => void copyToClipboard(menuUrl)}
                    >
                      Copy URL
                    </Button>
                  ) : null}
                </div>
                {menuUrl ? (
                  <a
                    href={menuUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-body font-semibold text-primary hover:underline"
                  >
                    {menuUrl}
                  </a>
                ) : (
                  <p className="text-body text-muted-foreground">
                    Set a public slug to generate the guest menu URL.
                  </p>
                )}
              </Card>
            </div>
          ) : (
            <EmptyState
              icon={<PiLinkBold className="size-8" />}
              title="Create a workspace first"
              description="Public tenant URLs are tied to your workspace public slug."
              action={
                <Button
                  onClick={() => setAddWorkspaceModalOpen(true)}
                  startIcon={<PiPlusBold className="size-5" />}
                >
                  Create workspace
                </Button>
              }
            />
          )}
        </div>
      </div>
    );
  };

  const renderBusinessesTab = () => {
    const biz = businesses[0] ?? null;
    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <PageHeader
          className="shrink-0"
          title="Business profile"
          description="Your restaurant's public-facing information."
          actions={panelActions}
        />
        {biz && (
          <SubTabPills
            options={[
              { id: "profile", label: "Profile" },
              { id: "social", label: "Social media" },
              { id: "hours", label: "Hours" },
            ]}
            active={businessSection}
            onChange={setBusinessSection}
          />
        )}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {biz ? (
            <BusinessForm
              key={`business-${biz.id}-${businessEditMode}`}
              formId={editBusinessFormId(biz.id)}
              industries={industries}
              initialData={biz}
              disabled={!businessEditMode}
              section={businessSection}
              onLoadingChange={setBusinessFormLoading}
              onValuesChange={setBusinessDraft}
              onSubmit={async (values) => {
                try {
                  await workspaceService.updateWorkspace({
                    business: {
                      name: values.business_name,
                      phone: values.phone,
                      address: values.address,
                      websiteUrl: values.website_url,
                      socialLinks: values.social_media,
                      availability: values.availability,
                      industryId: values.industry_id,
                    },
                  });
                  setBusinessEditMode(false);
                  void fetchWorkspaceData();
                } catch (err) {
                  console.error("Business update failed", err);
                }
              }}
            />
          ) : (
            <EmptyState
              icon={<PiStorefrontBold className="size-8" />}
              title="No business profile yet"
              description="Your business profile will appear here once created."
            />
          )}
        </div>
      </div>
    );
  };

  const renderBannersTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Banners"
        description="Manage global workspace announcements."
        actions={
          workspace ? (
            bannersEditMode ? (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setBannersEditMode(false);
                    setBannersSaveError(null);
                  }}
                  disabled={bannersSaveLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  form={INLINE_BANNER_FORM_ID}
                  loading={bannersSaveLoading}
                  className="w-full sm:w-auto"
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setBannersSaveError(null);
                  setBannersEditMode(true);
                }}
                startIcon={<PiPencilSimpleBold className="size-4" />}
              >
                Edit
              </Button>
            )
          ) : null
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {workspace ? (
          <BannerAnnouncementForm
            formId={INLINE_BANNER_FORM_ID}
            isOpen={bannersEditMode}
            readOnly={!bannersEditMode}
            compact
            initialValues={bannerFormInitialValues}
            onSubmit={handleBannerSave}
            error={bannersSaveError}
            loading={bannersSaveLoading}
            onValuesChange={setBannerDraft}
          />
        ) : (
          <EmptyState
            icon={<PiMegaphoneBold className="size-8" />}
            title="Create a workspace first"
            description="Banners are tied to a shared workspace configuration."
            action={
              <Button
                onClick={() => setAddWorkspaceModalOpen(true)}
                startIcon={<PiPlusBold className="size-5" />}
              >
                Create workspace
              </Button>
            }
          />
        )}
      </div>
    </div>
  );

  const renderOffersTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Offers"
        description="Manage workspace-wide promotions."
        actions={
          <Button
            size="sm"
            onClick={() => listOffersRef.current?.openNewOffer()}
            startIcon={<PiPlusBold className="size-4" />}
          >
            New Offer
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-6">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[12rem] items-center justify-center"><Spinner size="md" /></div>
          }
        >
          <ListOffers
            ref={listOffersRef}
            embedded
            initialOffers={workspaceOffers}
            initialCurrencySymbol={workspace?.currency?.symbol || "Rs"}
            onChanged={() => void fetchWorkspaceData()}
          />
        </Suspense>
      </div>
    </div>
  );

  const renderGalleryTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Gallery"
        description="Manage shared visual assets."
        actions={
          <Button
            size="sm"
            onClick={() => listGalleryRef.current?.openUpload()}
            startIcon={<PiUploadSimpleBold className="size-4" />}
          >
            Upload Image
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-6">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[12rem] items-center justify-center"><Spinner size="md" /></div>
          }
        >
          <ListGallery
            ref={listGalleryRef}
            embedded
            initialImages={workspaceGallery}
            onChanged={() => void fetchWorkspaceData()}
          />
        </Suspense>
      </div>
    </div>
  );

  const renderTestimonialsTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Testimonials"
        description="Real guest quotes shown on your landing page. Nothing shows there until you add one."
        actions={
          <Button
            size="sm"
            onClick={() => listTestimonialsRef.current?.openNew()}
            startIcon={<PiPlusBold className="size-4" />}
          >
            New Testimonial
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-6">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[12rem] items-center justify-center"><Spinner size="md" /></div>
          }
        >
          <ListTestimonials
            ref={listTestimonialsRef}
            embedded
            initialTestimonials={workspaceTestimonials}
            onChanged={() => void fetchWorkspaceData()}
          />
        </Suspense>
      </div>
    </div>
  );

  const renderFaqsTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="FAQs"
        description="Real questions guests actually ask. Nothing shows there until you add one."
        actions={
          <Button
            size="sm"
            onClick={() => listFaqsRef.current?.openNew()}
            startIcon={<PiPlusBold className="size-4" />}
          >
            New FAQ
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-6">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[12rem] items-center justify-center"><Spinner size="md" /></div>
          }
        >
          <ListFaqs
            ref={listFaqsRef}
            embedded
            initialFaqs={workspaceFaqs}
            onChanged={() => void fetchWorkspaceData()}
          />
        </Suspense>
      </div>
    </div>
  );

  const renderLotteryTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Lucky Draw"
        description="Rewards, odds, and who's played and won. Enable it from the Workspace tab's toggles."
        actions={
          <Button
            size="sm"
            onClick={() => listLotteryRef.current?.openNew()}
            startIcon={<PiPlusBold className="size-4" />}
          >
            New Reward
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-6">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[12rem] items-center justify-center"><Spinner size="md" /></div>
          }
        >
          <ListLottery
            ref={listLotteryRef}
            embedded
            initialRewards={workspaceLotteryRewards}
            onChanged={() => void fetchWorkspaceData()}
          />
        </Suspense>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Story & Stats"
        description="Real &ldquo;Our Story&rdquo; copy and stats bar shown on your landing page &mdash; leave blank to hide those sections."
        actions={panelActions}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto rounded-lg border border-border bg-card p-4 md:p-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <FormField label="Story Headline" htmlFor="story-headline">
            <Input
              id="story-headline"
              type="text"
              value={contentDraft.storyHeadline}
              onChange={(e) => setContentDraft((d) => ({ ...d, storyHeadline: e.target.value }))}
              placeholder="e.g. Family-run since 2010"
              disabled={!contentEditMode || contentSaveLoading}
            />
          </FormField>
          <FormField label="Story Body" htmlFor="story-body">
            <Textarea
              id="story-body"
              value={contentDraft.storyBody}
              onChange={(e) => setContentDraft((d) => ({ ...d, storyBody: e.target.value }))}
              rows={10}
              placeholder="Tell guests the real story behind your business…"
              disabled={!contentEditMode || contentSaveLoading}
            />
          </FormField>
        </div>

        <div className="space-y-3 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Stats Bar (up to 4)
            </span>
            {contentEditMode && contentDraft.stats.length < 4 && (
              <button
                type="button"
                onClick={() => setContentDraft((d) => ({ ...d, stats: [...d.stats, { label: "", value: "" }] }))}
                disabled={contentSaveLoading}
                className="flex items-center gap-1 rounded text-caption font-semibold text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <PiPlusBold className="size-3.5" /> Add
              </button>
            )}
          </div>
          {contentDraft.stats.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-border bg-background p-6 text-center">
              <p className="text-caption text-muted-foreground">No stats yet.</p>
            </div>
          ) : (
            contentDraft.stats.map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-start gap-2">
                  <div className="grid flex-1 grid-cols-2 gap-2">
                    <Input
                      type="text"
                      aria-label={`Stat ${i + 1} value`}
                      value={s.value}
                      onChange={(e) => setContentDraft((d) => ({ ...d, stats: d.stats.map((row, ri) => ri === i ? { ...row, value: e.target.value } : row) }))}
                      placeholder="15+"
                      disabled={!contentEditMode || contentSaveLoading}
                    />
                    <Input
                      type="text"
                      aria-label={`Stat ${i + 1} label`}
                      value={s.label}
                      onChange={(e) => setContentDraft((d) => ({ ...d, stats: d.stats.map((row, ri) => ri === i ? { ...row, label: e.target.value } : row) }))}
                      placeholder="Years of craft"
                      disabled={!contentEditMode || contentSaveLoading}
                    />
                  </div>
                  {contentEditMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setContentDraft((d) => ({ ...d, stats: d.stats.filter((_, ri) => ri !== i) }))}
                      disabled={contentSaveLoading}
                      aria-label={`Remove stat ${i + 1}`}
                      className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <PiTrashBold className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {contentSaveError && (
          <div className="lg:col-span-2">
            <StatusMessage variant="error">{contentSaveError}</StatusMessage>
          </div>
        )}
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Features"
        description="Manage industry-driven features."
      />

      {workspaceFeatureLibraryTarget ? (
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-card p-4 pr-3 md:p-6">
          <Suspense
            fallback={
              <div className="flex min-h-[12rem] items-center justify-center"><Spinner size="md" /></div>
            }
          >
            <WorkspaceFeatureLibrarySection
              workspace={workspaceFeatureLibraryTarget}
              onSaved={fetchWorkspaceData}
            />
          </Suspense>
        </div>
      ) : (
        <div className="min-h-0 flex-1">
          <EmptyState
            icon={<PiListBulletsBold className="size-8" />}
            title="Create a workspace first"
            description="The feature library needs a workspace before it can save feature selections."
            action={
              <Button
                onClick={() => setAddWorkspaceModalOpen(true)}
                startIcon={<PiPlusBold className="size-5" />}
              >
                Create workspace
              </Button>
            }
          />
        </div>
      )}
    </div>
  );

  const renderPanel = () => {
    if (activeTab === "workspace") return renderWorkspaceTab();
    if (activeTab === "businesses") return renderBusinessesTab();
    if (activeTab === "public-site") return renderPublicSiteTab();
    if (activeTab === "banners") return renderBannersTab();
    if (activeTab === "offers") return renderOffersTab();
    if (activeTab === "gallery") return renderGalleryTab();
    if (activeTab === "features") return renderFeaturesTab();
    if (activeTab === "content") return renderContentTab();
    if (activeTab === "testimonials") return renderTestimonialsTab();
    if (activeTab === "faqs") return renderFaqsTab();
    if (activeTab === "lottery") return renderLotteryTab();
    return renderWorkspaceTab();
  };

  return (
    <div className="flex h-full w-full gap-4">
      <div className="flex h-full min-w-0 flex-1 flex-col gap-4">
        <div className="shrink-0">
          <div className="w-full rounded-xl border border-border bg-card p-1.5 shadow-sm">
            <ScrollableTabRow
              activeKey={activeTab}
              role="tablist"
              aria-label="Workspace sections"
              scrollContainerClassName="gap-1"
            >
              {visibleTabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    data-tab-active={selected || undefined}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    <span className="shrink-0">
                      {tab.icon}
                    </span>
                    <span>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </ScrollableTabRow>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">{renderPanel()}</div>
      </div>

      {/* Desktop Preview Column */}
      <aside className="hidden w-[320px] shrink-0 lg:block">
        <PhonePreview
          landingUrl={previewLandingUrl}
          menuUrl={previewMenuUrl}
          defaultView={previewDefaultView}
          renderLanding={() => <LandingPreviewRenderer data={previewData} />}
          renderMenu={() => <MenuPreviewRenderer data={previewData} />}
        />
      </aside>

      {/* Floating Action Hover Button for Mobile Preview */}
      <button
        type="button"
        onClick={() => setMobilePreviewOpen(true)}
        aria-label="Open live mobile preview"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 lg:hidden"
      >
        <PiDeviceMobileBold size={17} />
        <span>Preview</span>
      </button>

      {/* Mobile Live Preview Modal Sheet */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs lg:hidden">
          <div className="flex max-h-[92vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <PiDeviceMobileBold size={14} />
                </div>
                <p className="text-xs font-bold text-foreground">Live Mobile Preview</p>
              </div>
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(false)}
                aria-label="Close preview"
                className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <PiXBold size={14} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <PhonePreview
                landingUrl={previewLandingUrl}
                menuUrl={previewMenuUrl}
                defaultView={previewDefaultView}
                renderLanding={() => <LandingPreviewRenderer data={previewData} />}
                renderMenu={() => <MenuPreviewRenderer data={previewData} />}
              />
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && deleteBusinessId && (
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteBusinessId(null);
          }}
          onConfirm={async () => {
            await businessService.deleteBusiness(deleteBusinessId);
          }}
          onSuccess={fetchWorkspaceData}
          entityName="business profile"
          description="Are you sure you want to delete this business profile? This action will permanently remove all associated data and cannot be undone."
        />
      )}

      {addWorkspaceModalOpen ? (
        <Suspense fallback={null}>
          <AddSettingModal
            isOpen={addWorkspaceModalOpen}
            onClose={() => setAddWorkspaceModalOpen(false)}
            onSettingAdded={fetchWorkspaceData}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

export default function ListBusinessPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading workspace…" />}>
      <ListBusinessPageContent />
    </Suspense>
  );
}
