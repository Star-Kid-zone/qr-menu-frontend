"use client";

import { ModernLandingPage } from "./ModernLandingPage";

/**
 * The main marketing site's landing page — shown when a request doesn't resolve
 * to a tenant's own custom domain/subdomain (see `app/page.tsx`). Tenant sites
 * render `TenantLandingPage` instead and are unaffected by anything here.
 *
 * Modern, 21st.dev / Magic UI-inspired 3D parallax experience featuring:
 * - Dynamic spotlight cursor lighting & obsidian-glass depth
 * - Interactive 3D device simulator with live tabs (Menu, QR Studio, Instant Pay, Analytics)
 * - 3D Tilt Bento grid showcasing all core project features
 * - Interactive Restaurant ROI & Turn speed calculator
 * - Infinite testimonial marquee & glassmorphic FAQ accordion
 */
export function MarketingLandingPage() {
  return <ModernLandingPage />;
}

