"use client";

import {
  Suspense,
  lazy,
  useEffect,
} from "react";
import { NextLinkAdapter } from "@/components/next/NextLinkAdapter";
import { PageLoader } from "@/components/ui/PageLoader";
import { landingTemplates } from "@/components/templates/core/registry";
import { useAnalytics } from "@/hooks/useAnalytics.hook";
import { toSafeExternalUrl } from "@/utils/url";
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";

const StructureSplit           = lazy(() => import("@/components/templates/landing/_shared/structures/StructureSplit"));
const StructureMinimal         = lazy(() => import("@/components/templates/landing/_shared/structures/StructureMinimal"));
const StructureMagazine        = lazy(() => import("@/components/templates/landing/_shared/structures/StructureMagazine"));
const StructureCards           = lazy(() => import("@/components/templates/landing/_shared/structures/StructureCards"));
const StructureDashboard       = lazy(() => import("@/components/templates/landing/_shared/structures/StructureDashboard"));
const StructureTabs            = lazy(() => import("@/components/templates/landing/_shared/structures/StructureTabs"));
const StructureStory           = lazy(() => import("@/components/templates/landing/_shared/structures/StructureStory"));
const StructureSidebarRight    = lazy(() => import("@/components/templates/landing/_shared/structures/StructureSidebarRight"));
const StructureCompact         = lazy(() => import("@/components/templates/landing/_shared/structures/StructureCompact"));
const StructureHorizontalSplit = lazy(() => import("@/components/templates/landing/_shared/structures/StructureHorizontalSplit"));

const STRUCTURE_MAP = {
  split:             StructureSplit,
  minimal:           StructureMinimal,
  magazine:          StructureMagazine,
  cards:             StructureCards,
  dashboard:         StructureDashboard,
  tabs:              StructureTabs,
  story:             StructureStory,
  "sidebar-right":   StructureSidebarRight,
  compact:           StructureCompact,
  "horizontal-split": StructureHorizontalSplit,
} as const;

function getSafeSlug(raw: unknown): string {
  if (!raw || typeof raw !== "string" || !raw.trim()) return "swiss";
  const clean = raw.toLowerCase().trim();
  if (clean === "bentogrid") return "bento-grid";
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
  const paymentLink = toSafeExternalUrl((data.payment as any)?.payment_link);
  const reviewLink = toSafeExternalUrl((data.review as any)?.review_link);

  const { track: trackEvent } = useAnalytics({ userId });
  // Landing structure components accept a loosely-typed `track` prop (plain
  // `string` action types); this narrows to the real hook's stricter union.
  const track = (actionType: string, actionTarget?: string, metadata?: Record<string, any>) => {
    trackEvent(actionType as Parameters<typeof trackEvent>[0], actionTarget, metadata);
  };

  useEffect(() => {
    trackEvent('visit', 'landing_page', { page: 'landing', path: window.location.pathname });
  }, [trackEvent]);

  // On multi-tenant sites the menu lives at /menu on tenant subdomain, or /<slug>/menu on path routing
  const isPathRouting = typeof window !== 'undefined' && Boolean(routeSlug) && window.location.pathname.startsWith('/' + routeSlug);
  const menuHref = isPathRouting ? '/' + routeSlug + '/menu' : '/menu';

  const onPay = () => {
    track("click", "payment_button", { destination: "payment" });
    if (paymentLink) window.open(paymentLink, "_blank", "noopener,noreferrer");
  };

  const onReview = () => {
    track("click", "review_button", { destination: "reviews" });
    if (reviewLink) window.open(reviewLink, "_blank", "noopener,noreferrer");
  };

  const structureKey = typeof settings.landing_structure === "string" && settings.landing_structure.trim()
    ? (settings.landing_structure.trim() as keyof typeof STRUCTURE_MAP)
    : null;

  const themeSlug = getSafeSlug(settings.landing_theme);
  const LandingTemplate = structureKey && STRUCTURE_MAP[structureKey]
    ? STRUCTURE_MAP[structureKey]
    : landingTemplates[themeSlug as keyof typeof landingTemplates] || landingTemplates.swiss;

  return (
    <Suspense fallback={<PageLoader label="Loading your page…" fullScreen />}>
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
