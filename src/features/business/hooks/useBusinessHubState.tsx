"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { normalizeTenantSlug, tenantSlugSchema } from "@/schemas/tenant.schema";
import type { Availability } from "@/types/components/admin/workspace/PublicSlugEditor.types";
import { toast } from "@/components/ui";
import { getApiErrorMessage } from "@/utils/errors";
import { menuService } from "@/services/menu.service";
import { workspaceService } from "@/services/workspace.service";
import type { BannerAnnouncementValues } from "@/types/components/admin/workspace/BannerAnnouncementForm.types";
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";
import {
  mapWorkspaceSettingToFormValues,
  isoToDatetimeLocal,
  datetimeLocalToIso,
} from "@/utils/workspace.utils";
import type {
  WorkspaceBusiness,
  WorkspaceSetting,
  WorkspaceSettingsFormValues,
} from "@/types/workspace.types";
import type {
  WorkspaceFaq,
  WorkspaceGalleryItem,
  WorkspaceOfferItem,
  WorkspacePaymentConfig,
  WorkspaceReviewConfig,
  GoogleReviewRecord,
  WorkspaceBusinessProfile,
  WorkspaceData,
} from "@/services/workspace.service";
import type { Currency, Menu } from "@/types";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import { usePermissions } from "@/hooks/usePermissions";
import { getStoredPermissions } from "@/utils/storage";
import type {
  ListOffersHandle,
  ListGalleryHandle,
  ListFaqsHandle,
} from "@/features/workspace";
import { parseSiteDocument } from "@/components/templates/sections/document";
import { DEFAULT_TAB, type WorkspaceTabId } from "../types";
import { TABS } from "../constants";
import type { BusinessSchemaValues } from "../components/BusinessForm";

const isWorkspaceTabId = (value: string | null): value is WorkspaceTabId =>
  TABS.some((tab) => tab.id === value);

// The hub's business row keeps the API's camelCase extras next to the legacy
// snake_case fields so the live preview can read them.
type HubBusiness = WorkspaceBusiness &
  Pick<WorkspaceBusinessProfile, "industryId" | "businessHours" | "whatsappNumber" | "locationUrl">;

// The mapped workspace carries every form field plus the uploaded asset URLs.
type HubWorkspaceSetting = WorkspaceSetting &
  Partial<WorkspaceSettingsFormValues> & { logo_url?: string; banner_url?: string; timezone?: string };

type SlugCheckResult = { slug: string; status: "available" | "taken" | "error" };

export function useBusinessHubState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedTab = searchParams?.get("tab") || null;
  const { hasPermission, canViewWebsite, canEditWebsite } = usePermissions();
  // View-only roles still see the website tabs; editing is switched off on the page.
  const visibleTabs = TABS.filter((tab) =>
    tab.unit === "workspace" ? canViewWebsite : hasPermission(tab.unit)
  );
  const canViewReviews = hasPermission("reviews");

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

  const [businesses, setBusinesses] = useState<HubBusiness[]>([]);
  const [workspace, setWorkspace] = useState<HubWorkspaceSetting | null>(null);
  const [workspaceGallery, setWorkspaceGallery] = useState<WorkspaceGalleryItem[]>([]);
  const [workspaceOffers, setWorkspaceOffers] = useState<WorkspaceOfferItem[]>([]);
  const [workspaceFaqs, setWorkspaceFaqs] = useState<WorkspaceFaq[]>([]);
  const [workspaceGoogleReviews, setWorkspaceGoogleReviews] = useState<GoogleReviewRecord[]>([]);
  const [workspacePayment, setWorkspacePayment] = useState<WorkspacePaymentConfig | null>(null);
  const [workspaceReview, setWorkspaceReview] = useState<WorkspaceReviewConfig | null>(null);
  const [workspaceMenuItems, setWorkspaceMenuItems] = useState<Array<Record<string, unknown>>>([]);
  const [contentDraft, setContentDraft] = useState<{
    storyHeadline: string;
    storyBody: string;
    stats: Array<{ label: string; value: string }>;
  }>({
    storyHeadline: "",
    storyBody: "",
    stats: [],
  });
  const [savedContentDraft, setSavedContentDraft] = useState(contentDraft);
  const [contentEditMode, setContentEditMode] = useState(false);
  const [contentSaveLoading, setContentSaveLoading] = useState(false);
  const [contentSaveError, setContentSaveError] = useState<string | null>(null);
  const [businessEditMode, setBusinessEditMode] = useState(false);
  const [businessSection, setBusinessSection] = useState<"profile" | "taxes" | "social" | "hours">("profile");
  const [workspaceDesignSection, setWorkspaceDesignSection] = useState<"landing" | "menu">("landing");
  const [businessFormLoading, setBusinessFormLoading] = useState(false);
  const [publicSiteEditMode, setPublicSiteEditMode] = useState(false);
  const [slugDraft, setSlugDraft] = useState("");
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugCheck, setSlugCheck] = useState<SlugCheckResult | null>(null);
  const listOffersRef = useRef<ListOffersHandle>(null);
  const listGalleryRef = useRef<ListGalleryHandle>(null);
  const listFaqsRef = useRef<ListFaqsHandle>(null);
  const [addWorkspaceModalOpen, setAddWorkspaceModalOpen] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [workspaceEditMode, setWorkspaceEditMode] = useState(false);
  const [workspaceActiveSubSection, setWorkspaceActiveSubSection] = useState<string | null>(null);
  const [bannersEditMode, setBannersEditMode] = useState(false);
  const [workspaceCurrencies] = useState<Currency[]>([]);
  const [workspaceSaveLoading, setWorkspaceSaveLoading] = useState(false);
  const [workspaceSaveError, setWorkspaceSaveError] = useState<string | null>(null);
  const [bannersSaveLoading, setBannersSaveLoading] = useState(false);
  const [bannersSaveError, setBannersSaveError] = useState<string | null>(null);
  // The first workspace load starts on mount, so the hook starts out refreshing.
  const [refreshing, setRefreshing] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceDraft, setWorkspaceDraft] = useState<WorkspaceSettingsFormValues | null>(null);
  const [businessDraft, setBusinessDraft] = useState<BusinessSchemaValues | null>(null);
  const [bannerDraft, setBannerDraft] = useState<BannerAnnouncementValues | null>(null);

  const setActiveTab = useCallback(
    (tab: WorkspaceTabId) => {
      const nextParams = new URLSearchParams(searchParams?.toString() || "");
      nextParams.set("tab", tab);
      router.replace(`?${nextParams.toString()}`);
    },
    [searchParams, router]
  );

  const applyWorkspaceData = useCallback((data: WorkspaceData) => {
    setBusinesses(
      data.business
        ? [
            {
              ...data.business,
              business_name: data.business.name,
              website_url: data.business.websiteUrl,
              social_media: data.business.socialLinks,
              industry_id:
                data.business.industryId != null
                  ? Number(data.business.industryId)
                  : null,
              active: true,
            } as unknown as HubBusiness,
          ]
        : []
    );

    const mappedWorkspace: HubWorkspaceSetting = {
      id: data.workspaceId ? parseInt(data.workspaceId) : undefined,
      public_slug: data.publicSlug,
      theme_colour: data.theme?.themeColour || "",
      primary_color: data.theme?.primaryColor ?? "",
      secondary_color: data.theme?.secondaryColor ?? "",
      accent_color: data.theme?.accentColor ?? "",
      text_primary_color: data.theme?.textPrimaryColor ?? "",
      text_secondary_color: data.theme?.textSecondaryColor ?? "",
      accent_text_color: data.theme?.accentTextColor ?? "",
      border_color: data.theme?.borderColor ?? "",
      footer_bg_color: data.theme?.footerBgColor ?? "",
      section_bg_color: data.theme?.sectionBgColor ?? "",
      font_family: data.theme?.fontFamily ?? "",
      card_style: data.theme?.cardStyle || "rounded-2xl",
      hero_overlay:
        data.theme?.heroOverlay ||
        "linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))",
      heading_class: data.theme?.headingClass || "",
      theme_badge: data.theme?.themeBadge || "",
      theme_marquee: data.theme?.themeMarquee || "",
      hero_tagline: data.theme?.heroTagline || "",
      menu_theme: data.theme?.menuTheme ?? "",
      landing_theme: data.theme?.landingTheme ?? "",
      landing_structure: data.theme?.landingStructure || "",
      loading_screen_theme: data.theme?.loadingScreenTheme || "modern",
      menu_primary_color: data.theme?.menuPrimaryColor ?? "",
      menu_secondary_color: data.theme?.menuSecondaryColor ?? "",
      menu_accent_color: data.theme?.menuAccentColor ?? "",
      menu_text_primary_color: data.theme?.menuTextPrimaryColor ?? "",
      menu_text_secondary_color: data.theme?.menuTextSecondaryColor ?? "",
      menu_accent_text_color: data.theme?.menuAccentTextColor ?? "",
      menu_border_color: data.theme?.menuBorderColor ?? "",
      menu_footer_bg_color: data.theme?.menuFooterBgColor ?? "",
      menu_section_bg_color: data.theme?.menuSectionBgColor ?? "",
      menu_font_family: data.theme?.menuFontFamily ?? "",
      menu_card_style: data.theme?.menuCardStyle || "rounded-2xl",
      menu_structure: data.theme?.menuStructure || "",
      skin_id: data.theme?.skinId || "",
      menu_skin_id: data.theme?.menuSkinId || "",
      business_type: data.theme?.businessType || "",
      site_document: parseSiteDocument(data.siteDocument),
      menubtn_status: data.buttons?.menubtnStatus ?? true,
      paybtn_status: data.buttons?.paybtnStatus ?? true,
      reviewbtn_status: data.buttons?.reviewbtnStatus ?? true,
      special_offerstatus: data.buttons?.specialOfferStatus ?? true,
      announcement_enabled: data.announcement?.enabled ?? false,
      announcement_text: data.announcement?.text || "",
      announcement_starts_at: isoToDatetimeLocal(
        data.announcement?.startsAt as string | null | undefined
      ),
      announcement_ends_at: isoToDatetimeLocal(
        data.announcement?.endsAt as string | null | undefined
      ),
      currency_id: null,
      logo_url: data.theme?.logoUrl || "",
      banner_url: data.theme?.bannerUrl || "",
      timezone: data.timezone || "UTC",
    };

    setWorkspace(mappedWorkspace);
    setWorkspaceGallery(data.gallery || []);
    setWorkspaceOffers(data.offers || []);
    setWorkspaceFaqs(data.faqs || []);
    setWorkspacePayment(data.payment || null);
    setWorkspaceReview(data.review || null);
    const nextContentDraft = {
      storyHeadline: data.content?.storyHeadline || "",
      storyBody: data.content?.storyBody || "",
      stats: data.content?.stats || [],
    };
    setContentDraft(nextContentDraft);
    setSavedContentDraft(nextContentDraft);
    setHasLoaded(true);
  }, []);

  const handleWorkspaceLoadError = useCallback((fetchError: unknown) => {
    console.error("Error fetching workspace data:", fetchError);
    setError(getApiErrorMessage(fetchError, "Check your connection and try again."));
  }, []);

  const fetchWorkspaceData = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);
      const response = await workspaceService.getWorkspace();
      applyWorkspaceData(response.data);
    } catch (fetchError) {
      handleWorkspaceLoadError(fetchError);
    } finally {
      setRefreshing(false);
    }
  }, [applyWorkspaceData, handleWorkspaceLoadError]);

  // Initial load: `refreshing` already starts true and `error` null.
  useEffect(() => {
    workspaceService
      .getWorkspace()
      .then((response) => applyWorkspaceData(response.data))
      .catch(handleWorkspaceLoadError)
      .finally(() => setRefreshing(false));
  }, [applyWorkspaceData, handleWorkspaceLoadError]);

  useEffect(() => {
    // Read stored permissions at call time: the first effect can run before
    // the hook has picked up the real permissions after hydration.
    const stored = getStoredPermissions();
    if (!canViewReviews || (stored && !stored.includes("reviews"))) return;
    workspaceService
      .getGoogleReviews()
      .then((response) => setWorkspaceGoogleReviews(response.data.reviews || []))
      .catch((fetchError: unknown) => console.error("Error fetching Google reviews:", fetchError));
  }, [canViewReviews]);

  // Leaving a tab drops its unsaved edit state (adjusted during render when the tab changes).
  const [resetForTab, setResetForTab] = useState(activeTab);
  if (resetForTab !== activeTab) {
    setResetForTab(activeTab);
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
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleWorkspaceSave = useCallback(
    async (values: WorkspaceSettingsFormValues) => {
      if (!workspace?.id) return;
      setWorkspaceSaveLoading(true);
      setWorkspaceSaveError(null);
      try {
        await workspaceService.updateWorkspace({
          theme: {
            themeColour: values.theme_colour,
            primaryColor: values.primary_color,
            secondaryColor: values.secondary_color,
            accentColor: values.accent_color,
            textPrimaryColor: values.text_primary_color,
            textSecondaryColor: values.text_secondary_color,
            accentTextColor: values.accent_text_color,
            borderColor: values.border_color,
            footerBgColor: values.footer_bg_color,
            sectionBgColor: values.section_bg_color,
            fontFamily: values.font_family,
            cardStyle: values.card_style,
            heroOverlay: values.hero_overlay,
            headingClass: values.heading_class,
            themeBadge: values.theme_badge,
            themeMarquee: values.theme_marquee,
            heroTagline: values.hero_tagline,
            menuTheme: values.menu_theme,
            landingTheme: values.landing_theme,
            landingStructure: values.landing_structure,
            loadingScreenTheme: values.loading_screen_theme,
            menuPrimaryColor: values.menu_primary_color,
            menuSecondaryColor: values.menu_secondary_color,
            menuAccentColor: values.menu_accent_color,
            menuTextPrimaryColor: values.menu_text_primary_color,
            menuTextSecondaryColor: values.menu_text_secondary_color,
            menuAccentTextColor: values.menu_accent_text_color,
            menuBorderColor: values.menu_border_color,
            menuFooterBgColor: values.menu_footer_bg_color,
            menuSectionBgColor: values.menu_section_bg_color,
            menuFontFamily: values.menu_font_family,
            menuCardStyle: values.menu_card_style,
            menuStructure: values.menu_structure,
            skinId: values.skin_id,
            menuSkinId: values.menu_skin_id,
            businessType: values.business_type,
          },
          siteDocument: values.site_document,
          buttons: {
            menubtnStatus: values.menubtn_status,
            paybtnStatus: values.paybtn_status,
            reviewbtnStatus: values.reviewbtn_status,
            specialOfferStatus: values.special_offerstatus,
          },
        });
        setWorkspaceEditMode(false);
        setWorkspaceActiveSubSection(null);
        toast.success("Workspace settings updated successfully!");
        await fetchWorkspaceData();
      } catch {
        toast.error("Failed to save workspace settings.");
        setWorkspaceSaveError("Failed to save workspace settings.");
      } finally {
        setWorkspaceSaveLoading(false);
      }
    },
    [workspace?.id, fetchWorkspaceData]
  );

  const handleBannerSave = useCallback(
    async (bannerValues: {
      announcement_enabled: boolean;
      announcement_text: string;
      announcement_starts_at?: string;
      announcement_ends_at?: string;
    }) => {
      setBannersSaveLoading(true);
      setBannersSaveError(null);
      try {
        await workspaceService.updateWorkspace({
          announcement: {
            enabled: bannerValues.announcement_enabled,
            text: bannerValues.announcement_text,
            startsAt: datetimeLocalToIso(bannerValues.announcement_starts_at),
            endsAt: datetimeLocalToIso(bannerValues.announcement_ends_at),
          },
        });
        setBannersEditMode(false);
        toast.success("Announcement banner updated successfully!");
        await fetchWorkspaceData();
      } catch {
        toast.error("Failed to save banner settings.");
      } finally {
        setBannersSaveLoading(false);
      }
    },
    [fetchWorkspaceData]
  );

  const handleContentSave = useCallback(async () => {
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
      toast.success("Story and metrics saved successfully!");
      await fetchWorkspaceData();
    } catch {
      toast.error("Failed to save story & stats.");
    } finally {
      setContentSaveLoading(false);
    }
  }, [contentDraft, fetchWorkspaceData]);

  const handleUpdateBusiness = async (values: BusinessSchemaValues) => {
    try {
      await workspaceService.updateWorkspace({
        business: {
          name: values.business_name,
          phone: values.phone,
          address: values.address,
          websiteUrl: values.website_url,
          socialLinks: values.social_media,
          availability: values.availability,
          gstin: values.gstin || null,
          pincode: values.pincode || null,
          taxInclusive: values.tax_inclusive,
          serviceChargePercent: values.service_charge_percent
            ? Number(values.service_charge_percent)
            : null,
        },
      });
      setBusinessEditMode(false);
      void fetchWorkspaceData();
      toast.success("Business profile updated!");
    } catch (err) {
      console.error("Business update failed", err);
      toast.error("Failed to update business profile.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await menuService.getMenus();
        if (!cancelled) {
          const rawItems: Menu[] = Array.isArray(response.data) ? response.data : [];
          const normalized = rawItems.map((item) => {
            const img =
              item.image_url ||
              item.imageUrl ||
              item.image ||
              (Array.isArray(item.images) && item.images.length > 0
                ? typeof item.images[0] === "string"
                  ? item.images[0]
                  : item.images[0]?.url
                : null) ||
              null;
            return {
              ...item,
              id: Number(item.id),
              image_url: img,
              imageUrl: img,
              image: img,
            };
          });
          setWorkspaceMenuItems(normalized);
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

  const workspaceFormInitialValues = useMemo(
    () => mapWorkspaceSettingToFormValues(workspace),
    [workspace]
  );

  const bannerFormInitialValues = useMemo(() => {
    const v = mapWorkspaceSettingToFormValues(workspace);
    return {
      announcement_enabled: v.announcement_enabled,
      announcement_text: v.announcement_text,
      announcement_starts_at: v.announcement_starts_at,
      announcement_ends_at: v.announcement_ends_at,
    };
  }, [workspace]);

  const savedSlug = workspace?.public_slug?.trim() ?? "";

  const normalizedSlugDraft = normalizeTenantSlug(slugDraft);
  const parsedSlugDraft = tenantSlugSchema.safeParse(normalizedSlugDraft);

  // When the slug inputs change, drop the previous availability result and
  // sync the validation message (adjusted during render, not in an effect).
  const [slugInputs, setSlugInputs] = useState({
    editMode: publicSiteEditMode,
    draft: slugDraft,
    saved: savedSlug,
  });
  if (
    slugInputs.editMode !== publicSiteEditMode ||
    slugInputs.draft !== slugDraft ||
    slugInputs.saved !== savedSlug
  ) {
    setSlugInputs({ editMode: publicSiteEditMode, draft: slugDraft, saved: savedSlug });
    setSlugCheck(null);
    if (!publicSiteEditMode) {
      setSlugError(null);
    } else if (normalizedSlugDraft && normalizedSlugDraft !== savedSlug) {
      setSlugError(
        parsedSlugDraft.success
          ? null
          : parsedSlugDraft.error.issues?.[0]?.message ?? "Invalid slug format"
      );
    }
  }

  const slugAvailability: Availability =
    !publicSiteEditMode || !normalizedSlugDraft
      ? "idle"
      : normalizedSlugDraft === savedSlug
        ? "unchanged"
        : !parsedSlugDraft.success
          ? "invalid"
          : slugCheck?.slug === normalizedSlugDraft
            ? slugCheck.status
            : "checking";

  useEffect(() => {
    if (!publicSiteEditMode) return;
    const normalized = normalizeTenantSlug(slugDraft);
    if (!normalized || normalized === savedSlug) return;
    if (!tenantSlugSchema.safeParse(normalized).success) return;
    const t = window.setTimeout(async () => {
      try {
        const res = await workspaceService.checkSlugAvailability(normalized);
        setSlugCheck({ slug: normalized, status: res.data.available ? "available" : "taken" });
      } catch {
        setSlugCheck({ slug: normalized, status: "error" });
      }
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
        return <span className="text-destructive">Couldn&apos;t check this address right now. You can still save it.</span>;
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
    [workspace?.public_slug]
  );
  const previewMenuUrl = useMemo(
    () => buildPublicMenuUrl(workspace?.public_slug),
    [workspace?.public_slug]
  );
  const previewDefaultView: "landing" | "menu" =
    activeTab === "workspace" && workspaceDesignSection === "menu" ? "menu" : "landing";

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
      logo_url: workspace?.logo_url ?? "",
      banner_url: workspace?.banner_url ?? "",
      timezone: workspace?.timezone ?? "UTC",
      story_headline: contentDraft.storyHeadline,
      story_body: contentDraft.storyBody,
      stats: contentDraft.stats,
    };

    // Read optional camelCase extras without assuming which shape is active.
    const businessFields: Record<string, unknown> | null = effectiveBusiness
      ? { ...effectiveBusiness }
      : null;

    return {
      user_id: workspace?.id ?? 0,
      settings: effectiveSettings,
      business: effectiveBusiness
        ? {
            business_name: effectiveBusiness.business_name,
            industry_id: (businessFields?.industryId as number | null | undefined) ?? null,
            phone: effectiveBusiness.phone,
            address: effectiveBusiness.address,
            business_hours: businessFields?.businessHours ?? null,
            whatsapp_number: businessFields?.whatsappNumber ?? null,
            location_url: businessFields?.locationUrl ?? null,
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
      // Same shape the public page builds from the portal (public-site.service.ts): the admin API
      // returns camelCase `imageUrl`/`discount`, which the templates don't read — the preview used
      // to show no gallery photos or offer images at all.
      gallery: workspaceGallery.map((g) => ({ id: g.id, image_url: g.imageUrl })),
      offers: workspaceOffers
        .filter((o) => o.isActive !== false)
        .map((o) => ({ id: o.id, title: o.title, description: o.description, offer_value: o.discount, image_url: o.imageUrl })),
      menuItems: workspaceMenuItems as unknown as RawPublicSiteData["menuItems"],
      faqs: workspaceFaqs as RawPublicSiteData["faqs"],
      googleReviews: workspaceGoogleReviews.filter(
        (r) => r.isFeatured
      ) as RawPublicSiteData["googleReviews"],
      currency: workspace?.currency ?? null,
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
    workspaceFaqs,
    workspaceGoogleReviews,
    workspacePayment,
    workspaceReview,
    workspaceMenuItems,
  ]);

  const handleSaveSlug = async () => {
    if (!canSaveSlug) return;
    const normalized = normalizeTenantSlug(slugDraft);
    setSlugSaving(true);
    setSlugError(null);
    try {
      await workspaceService.updateSlug(normalized);
      toast.success("Store link updated!");
      setPublicSiteEditMode(false);
      setSlugDraft("");
      await fetchWorkspaceData();
    } catch (err) {
      setSlugError(
        getApiErrorMessage(err, "Failed to update slug. Please try another.")
      );
    } finally {
      setSlugSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    visibleTabs,
    canEdit: canEditWebsite,
    loadError: error,
    // First load still running: show a loading state, never the "create" empty state.
    isInitialLoading: !hasLoaded && !error,
    isRefreshing: refreshing,
    businesses,
    workspace,
    workspaceGallery,
    workspaceOffers,
    workspaceFaqs,
    workspaceGoogleReviews,
    workspacePayment,
    workspaceReview,
    workspaceMenuItems,
    contentDraft,
    setContentDraft,
    savedContentDraft,
    contentEditMode,
    setContentEditMode,
    contentSaveLoading,
    contentSaveError,
    setContentSaveError,
    businessEditMode,
    setBusinessEditMode,
    businessSection,
    setBusinessSection,
    workspaceDesignSection,
    setWorkspaceDesignSection,
    businessFormLoading,
    setBusinessFormLoading,
    publicSiteEditMode,
    setPublicSiteEditMode,
    slugDraft,
    setSlugDraft,
    slugSaving,
    setSlugSaving,
    slugError,
    setSlugError,
    slugAvailability,
    slugAvailabilityLabel,
    canSaveSlug,
    listOffersRef,
    listGalleryRef,
    listFaqsRef,
    addWorkspaceModalOpen,
    setAddWorkspaceModalOpen,
    mobilePreviewOpen,
    setMobilePreviewOpen,
    workspaceEditMode,
    setWorkspaceEditMode,
    workspaceActiveSubSection,
    setWorkspaceActiveSubSection,
    bannersEditMode,
    setBannersEditMode,
    workspaceCurrencies,
    workspaceSaveLoading,
    workspaceSaveError,
    setWorkspaceSaveError,
    bannersSaveLoading,
    bannersSaveError,
    setBannersSaveError,
    refreshing,
    error,
    workspaceDraft,
    setWorkspaceDraft,
    businessDraft,
    setBusinessDraft,
    bannerDraft,
    setBannerDraft,
    workspaceFormInitialValues,
    bannerFormInitialValues,
    savedSlug,
    previewLandingUrl,
    previewMenuUrl,
    previewDefaultView,
    previewData,
    fetchWorkspaceData,
    handleWorkspaceSave,
    handleBannerSave,
    handleContentSave,
    handleUpdateBusiness,
    handleSaveSlug,
    copyToClipboard,
  };
}
