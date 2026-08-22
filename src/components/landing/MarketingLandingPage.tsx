"use client";

import { SmoothScrollProvider } from "./parallax/SmoothScrollProvider";
import { CustomCursor } from "./parallax/CustomCursor";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Gallery } from "./sections/Gallery";
import { Flagship } from "./sections/Flagship";
import { Features } from "./sections/Features";
import { ThemeShowcase } from "./sections/ThemeShowcase";
import { HowItWorks } from "./sections/HowItWorks";
import { Showcase } from "./sections/Showcase";
import { Pricing } from "./sections/Pricing";
import { Faq } from "./sections/Faq";
import { WaitlistCta } from "./sections/WaitlistCta";
import { Footer } from "./sections/Footer";

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
  return (
    <SmoothScrollProvider>
      <div className="agency-cursor-zone dark relative flex min-h-screen flex-col bg-[#0d0906]">
        <CustomCursor />
        <Header />
        <Hero />
        <Gallery />
        <Flagship />
        <Features />
        <ThemeShowcase />
        <HowItWorks />
        <Showcase />
        <Pricing />
        <Faq />
        <WaitlistCta />
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
