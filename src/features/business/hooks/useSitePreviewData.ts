"use client";

import { useMemo } from "react";
import type { RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";
import { mapWorkspaceSettingToFormValues } from "@/utils/workspace.utils";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import type { SitePreviewInputs, WorkspaceTabId } from "../types";

/**
 * Live preview for the website hub: public URLs plus the RawPublicSiteData the landing and menu
 * templates render, built from saved data overlaid with any open drafts.
 */
export function useSitePreviewData(
  inputs: SitePreviewInputs,
  activeTab: WorkspaceTabId,
  workspaceDesignSection: "landing" | "menu"
) {
  const {
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
  } = inputs;

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
      user_id: workspace?.id ?? "",
      settings: effectiveSettings,
      business: effectiveBusiness
        ? {
            business_name: effectiveBusiness.business_name,
            industry_id: (businessFields?.industryId as string | null | undefined) ?? null,
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

  return { previewLandingUrl, previewMenuUrl, previewDefaultView, previewData };
}
