"use client";

import { QrMenuLandingExperience } from "./QrMenuLandingExperience";

/**
 * The main marketing site's landing page — shown when a request doesn't resolve
 * to a tenant's own custom domain/subdomain (see `app/page.tsx`). Tenant sites
 * render `TenantLandingPage` instead and are unaffected by anything here.
 *
 * Deliberately dark/cinematic — a different register from the light
 * "claymorphism" admin app (this is the marketing billboard, not the product
 * UI) — built on the dark theme tokens already defined in globals.css so the
 * palette still comes from one source of truth.
 *
 * Content is grounded in an actual codebase audit (menu/site theme counts, QR
 * customization options, poster template counts, analytics capabilities,
 * etc.) rather than invented claims — see the section components for the
 * specific numbers and what they're sourced from.
 */
export function MarketingLandingPage() {
  return <QrMenuLandingExperience />;
}
