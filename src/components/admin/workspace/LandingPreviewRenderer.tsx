"use client";

import { Suspense, lazy } from "react";
import { Spinner } from "@/components/ui";
import { landingTemplates } from "@/components/templates/core/registry";
import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";

// Mirrors the resolution logic in `src/app/(public)/TenantLandingPage.tsx` so the
// admin preview renders the exact same component the public site would — just fed
// draft (unsaved) data instead of a server fetch, and with no analytics tracking.
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
  split:              StructureSplit,
  minimal:            StructureMinimal,
  magazine:           StructureMagazine,
  cards:              StructureCards,
  dashboard:          StructureDashboard,
  tabs:               StructureTabs,
  story:              StructureStory,
  "sidebar-right":    StructureSidebarRight,
  compact:            StructureCompact,
  "horizontal-split": StructureHorizontalSplit,
} as const;

function getSafeSlug(raw: unknown): string {
  if (!raw || typeof raw !== "string" || !raw.trim()) return "swiss";
  const clean = raw.toLowerCase().trim();
  if (clean === "bentogrid") return "bento-grid";
  return clean;
}

/** No-op stand-in for `NextLinkAdapter` — preview links shouldn't navigate the admin app. */
function PreviewLink({
  className,
  children,
  style,
}: {
  to: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

/**
 * Renders the tenant's real landing page template client-side from in-memory
 * (possibly unsaved) data — used by the admin preview panel so edits show up
 * instantly, without a save + iframe reload round trip.
 */
export function LandingPreviewRenderer({ data }: { data: RawPublicSiteData }) {
  const settings = (data.settings ?? {}) as Record<string, unknown>;

  const structureKey =
    typeof settings.landing_structure === "string" && settings.landing_structure.trim()
      ? (settings.landing_structure.trim() as keyof typeof STRUCTURE_MAP)
      : null;

  const themeSlug = getSafeSlug(settings.landing_theme);
  const LandingTemplate =
    (structureKey && STRUCTURE_MAP[structureKey]) ||
    landingTemplates[themeSlug as keyof typeof landingTemplates] ||
    landingTemplates.swiss;

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Spinner size="md" />
        </div>
      }
    >
      <LandingTemplate
        data={data}
        routeSlug={null}
        themeSlug={themeSlug}
        menuHref="#"
        onPay={() => {}}
        onReview={() => {}}
        track={() => {}}
        LinkComponent={PreviewLink}
        lotteryEnabled={Boolean(settings.lottery_status)}
      />
    </Suspense>
  );
}
