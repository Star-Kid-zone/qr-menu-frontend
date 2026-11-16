"use client";

import {
  Suspense,
  useEffect,
} from "react";
import { STRUCTURE_MAP } from "@/components/templates/sections/layouts/structureMap";
import { NextLinkAdapter } from "@/components/next/NextLinkAdapter";
import { PageLoader } from "@/components/ui/PageLoader";
import { landingTemplates } from "@/components/templates/core/landingRegistry";
import { useAnalytics } from "@/hooks/useAnalytics.hook";
import { PUBLIC_MENU_PATH } from "@/components/templates/core/paths";
import { toSafeExternalUrl } from "@/utils/url";
import { SiteStatusBanner } from "@/components/templates/sections/SiteStatusBanner";
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";
import { DEFAULT_TEMPLATE_SLUG } from "@/components/templates/core/defaultTemplate";



function getSafeSlug(raw: unknown): string {
  if (!raw || typeof raw !== "string" || !raw.trim()) return DEFAULT_TEMPLATE_SLUG;
  const clean = raw.toLowerCase().trim();
  return clean;
}

export function TenantLandingPage({
  data,
  routeSlug,
}: {
  data: RawPublicSiteData;
  routeSlug: string | null;
}) {
  const userId = data.user_id;
  const settings = (data.settings ?? {}) as Record<string, unknown>;
  const publicSlug =
    typeof settings.public_slug === "string"
      ? settings.public_slug.trim().toLowerCase()
      : null;
  const paymentLink = toSafeExternalUrl(data.payment?.payment_link as string | undefined);
  const reviewLink = toSafeExternalUrl(data.review?.review_link as string | undefined);

  const { track: trackEvent } = useAnalytics({ userId });
  // Landing structure components accept a loosely-typed `track` prop (plain
  // `string` action types); this narrows to the real hook's stricter union.
  const track = (actionType: string, actionTarget?: string, metadata?: Record<string, unknown>) => {
    trackEvent(actionType as Parameters<typeof trackEvent>[0], actionTarget, metadata);
  };

  useEffect(() => {
    trackEvent('visit', 'landing_page', { page: 'landing', path: window.location.pathname });
  }, [trackEvent]);

  const menuHref = PUBLIC_MENU_PATH;

  const onPay = () => {
    track("click", "payment_button", { destination: "payment" });
    if (paymentLink) window.open(paymentLink, "_blank", "noopener,noreferrer");
  };

  const onReview = () => {
    track("click", "review_button", { destination: "reviews" });
    if (reviewLink) window.open(reviewLink, "_blank", "noopener,noreferrer");
  };

  const structureKey = typeof settings.landing_structure === "string" && settings.landing_structure.trim()
    ? (settings.landing_structure.trim() as string)
    : null;

  const themeSlug = getSafeSlug(settings.landing_theme);
  const LandingTemplate = structureKey && STRUCTURE_MAP[structureKey]
    ? STRUCTURE_MAP[structureKey]
    : landingTemplates[themeSlug as keyof typeof landingTemplates] || landingTemplates[DEFAULT_TEMPLATE_SLUG as keyof typeof landingTemplates];

  return (
    <Suspense fallback={<PageLoader label="Loading your page…" fullScreen />}>
      <SiteStatusBanner settings={settings} />
      <LandingTemplate
        data={data}
        routeSlug={routeSlug}
        themeSlug={themeSlug}
        menuHref={menuHref}
        onPay={onPay}
        onReview={onReview}
        track={track}
        LinkComponent={NextLinkAdapter}
      />
    </Suspense>
  );
}
