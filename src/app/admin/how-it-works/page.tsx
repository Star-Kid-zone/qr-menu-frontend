"use client";

import Link from "next/link";
import {
  PiStorefrontBold,
  PiForkKnifeBold,
  PiQrCodeBold,
  PiWalletBold,
  PiStarBold,
  PiMegaphoneBold,
  PiChartLineUpBold,
  PiUsersThreeBold,
  PiArrowRightBold,
  PiEyeBold,
  PiCheckCircleBold,
  PiQuestionBold,
  PiDeviceMobileBold,
  PiPrinterBold,
  PiLightbulbBold,
} from "react-icons/pi";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";

export default function HowItWorksPage() {
  return (
    <div className="h-full overflow-y-auto pr-1 pb-16 space-y-8">
      {/* 1. Header */}
      <PageHeader
        eyebrow="Quick Guide"
        title="How It Works"
        description="A simple, step-by-step guide to setting up your digital QR menu and managing your restaurant."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={routes.admin.listBusiness}
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              <PiStorefrontBold className="mr-1.5 text-base" />
              Start Setup (Website)
            </Link>
          </div>
        }
      />

      {/* 2. The Big Picture (How it works in 3 steps) */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground">The Big Picture</h2>
          <p className="text-xs text-muted-foreground">How the system works in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl">
              <PiForkKnifeBold />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-primary uppercase tracking-wider">Step 1</div>
              <h3 className="text-sm font-bold text-foreground">Build Your Menu</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add your restaurant name, logo, categories, and dishes with prices and photos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl">
              <PiPrinterBold />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-primary uppercase tracking-wider">Step 2</div>
              <h3 className="text-sm font-bold text-foreground">Print Table QR Codes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download your high-resolution QR standees and place them on your dining tables.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl">
              <PiDeviceMobileBold />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-primary uppercase tracking-wider">Step 3</div>
              <h3 className="text-sm font-bold text-foreground">Guests Scan & Pay</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Diners scan with any phone camera, view the menu, settle bills via UPI, and rate you on Google.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Setup Order: What to do first */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Setup Order: What to do first</h2>
          <p className="text-xs text-muted-foreground">Follow these 4 steps in order to get up and running smoothly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">Start Here</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">Set Up Restaurant Profile & Look</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add your restaurant name, custom website link (slug), phone number, address, and upload your logo and theme colors.
              </p>
            </div>
            <Link
              href={routes.admin.listBusiness}
              className={buttonVariants({ variant: "primary", size: "sm", className: "w-full justify-between" })}
            >
              <span>Open Website Settings</span>
              <PiArrowRightBold className="text-xs" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">Core Content</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">Add Categories, then Dishes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                First create categories (e.g. Starters, Main Course, Drinks). Then add your food items with prices, descriptions, and veg/non-veg tags.
              </p>
            </div>
            <Link
              href={routes.admin.listMenu}
              className={buttonVariants({ variant: "primary", size: "sm", className: "w-full justify-between" })}
            >
              <span>Open Menu Builder</span>
              <PiArrowRightBold className="text-xs" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">Payments & Reviews</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">Configure UPI & Google Reviews</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add your UPI ID so guests can pay directly from their phone, and link your Google Maps to automatically collect 5-star reviews.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={routes.admin.listPayment}
                className={buttonVariants({ variant: "secondary", size: "sm", className: "flex-1 justify-between" })}
              >
                <span>Payments</span>
                <PiArrowRightBold className="text-xs" />
              </Link>
              <Link
                href={routes.admin.listReview}
                className={buttonVariants({ variant: "secondary", size: "sm", className: "flex-1 justify-between" })}
              >
                <span>Reviews</span>
                <PiArrowRightBold className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  4
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">Launch Diners</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">Generate & Print Table QR Codes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create table-specific QR codes (Table 1, 2, 3...) or a master venue code. Download high-res files and print tabletop standees.
              </p>
            </div>
            <Link
              href={routes.admin.addQrCode}
              className={buttonVariants({ variant: "primary", size: "sm", className: "w-full justify-between" })}
            >
              <span>Download Table QR Codes</span>
              <PiArrowRightBold className="text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Sidebar Cheatsheet: What each section does */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Sidebar Guide: What does each section do?</h2>
          <p className="text-xs text-muted-foreground">Quick 1-sentence explanations for every section in the sidebar.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Website */}
          <Link
            href={routes.admin.listBusiness}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 text-base">
                  <PiStorefrontBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  Website
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Edit restaurant name, logo, theme colors, banners, and opening hours.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open Website &rarr;
            </span>
          </Link>

          {/* Menu */}
          <Link
            href={routes.admin.listMenu}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 text-base">
                  <PiForkKnifeBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  Menu
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Add dishes, prices, photos, and flip switches to turn off sold-out items instantly.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open Menu &rarr;
            </span>
          </Link>

          {/* QR Assets */}
          <Link
            href={routes.admin.addQrCode}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 text-base">
                  <PiQrCodeBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  QR Assets
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Generate custom table QR codes and download printable standee templates.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open QR Assets &rarr;
            </span>
          </Link>

          {/* Payments */}
          <Link
            href={routes.admin.listPayment}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 text-base">
                  <PiWalletBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  Payments
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Add your UPI ID or payment QR so guests can pay directly to your bank.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open Payments &rarr;
            </span>
          </Link>

          {/* Reviews */}
          <Link
            href={routes.admin.listReview}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-500 text-base">
                  <PiStarBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  Reviews
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Collect diner feedback and redirect 4-5 star ratings directly to Google Maps.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open Reviews &rarr;
            </span>
          </Link>

          {/* Marketing */}
          <Link
            href={routes.admin.socialMedia}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 text-base">
                  <PiMegaphoneBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  Marketing
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Connect your Instagram and generate ready-made weekly promotional food posters.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open Marketing &rarr;
            </span>
          </Link>

          {/* Analytics */}
          <Link
            href={routes.admin.home}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 text-base">
                  <PiChartLineUpBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  Analytics
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                See total QR scans, popular dishes, and peak dining hours for lunch and dinner.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open Analytics &rarr;
            </span>
          </Link>

          {/* Staff */}
          <Link
            href={routes.admin.staff}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 text-base">
                  <PiUsersThreeBold />
                </div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                  Staff
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Create accounts for managers and kitchen staff to manage daily item stock safely.
              </p>
            </div>
            <span className="pt-2 text-[10px] font-bold text-primary flex items-center gap-1">
              Open Staff &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* 5. Frequently Asked Questions (Quick 3 Q&As) */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PiLightbulbBold className="text-primary text-lg" />
          <h2 className="text-sm font-bold text-foreground">Common Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5 rounded-xl border border-border/70 bg-muted/20 p-4">
            <h3 className="text-xs font-bold text-foreground">Do diners need to download an app?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No. Diners point their smartphone camera at the QR code and it opens directly in Safari or Chrome in under 1 second.
            </p>
          </div>

          <div className="space-y-1.5 rounded-xl border border-border/70 bg-muted/20 p-4">
            <h3 className="text-xs font-bold text-foreground">What if a dish runs out of stock?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Go to <strong>Menu</strong> and flip the availability toggle for that dish to Off. It immediately hides on all diners&apos; phones.
            </p>
          </div>

          <div className="space-y-1.5 rounded-xl border border-border/70 bg-muted/20 p-4">
            <h3 className="text-xs font-bold text-foreground">How do table numbers work?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              In <strong>QR Assets</strong>, generate QR codes with table numbers (e.g. Table 1, Table 2) so orders and payments show which table they came from.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
