"use client";

import { Suspense } from "react";
import { STRUCTURE_MAP } from "@/components/templates/sections/layouts/structureMap";
import { SiteStatusBanner } from "@/components/templates/sections/SiteStatusBanner";
import { Spinner } from "@/components/ui";
import { landingTemplates } from "@/components/templates/core/landingRegistry";
import type { RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";
import { DEFAULT_TEMPLATE_SLUG } from "@/components/templates/core/defaultTemplate";

// Mirrors the resolution logic in `src/features/public-site/components/TenantLandingPage.tsx` so the
// admin preview renders the exact same component the public site would — just fed
// draft (unsaved) data instead of a server fetch, and with no analytics tracking.


function getSafeSlug(raw: unknown): string {
  if (!raw || typeof raw !== "string" || !raw.trim()) return DEFAULT_TEMPLATE_SLUG;
  const clean = raw.toLowerCase().trim();
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
      ? (settings.landing_structure.trim() as string)
      : null;

  const themeSlug = getSafeSlug(settings.landing_theme);
  const LandingTemplate =
    (structureKey && STRUCTURE_MAP[structureKey]) ||
    landingTemplates[themeSlug as keyof typeof landingTemplates] ||
    landingTemplates[DEFAULT_TEMPLATE_SLUG as keyof typeof landingTemplates];

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Spinner size="md" />
        </div>
      }
    >
      <SiteStatusBanner settings={settings} />
      <LandingTemplate
        data={data}
        routeSlug={null}
        isPreview
        themeSlug={themeSlug}
        menuHref="#"
        onPay={() => {}}
        onReview={() => {}}
        track={() => {}}
        LinkComponent={PreviewLink}
      />
    </Suspense>
  );
}
