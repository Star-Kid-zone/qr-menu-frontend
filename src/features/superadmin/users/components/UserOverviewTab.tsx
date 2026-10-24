"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  Badge,
  Button,
  Input,
  FormField,
  Checkbox,
} from "@/shared/components";
import {
  PiBriefcaseBold,
  PiPencilSimpleBold,
  PiPhoneBold,
  PiWhatsappLogoBold,
  PiClockBold,
  PiMapPinBold,
  PiGlobeBold,
  PiShareNetworkBold,
  PiSparkleBold,
  PiSquaresFourBold,
  PiQrCodeBold,
  PiFloppyDiskBold,
  PiArrowSquareOutBold,
} from "react-icons/pi";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import { getSocialPlatformIcon } from "@/components/templates/core/socialPlatforms";
import type { UserDetailResponse, BusinessFormData, WorkspaceFormData } from "../types";

interface UserOverviewTabProps {
  detail: UserDetailResponse;
  businessForm: BusinessFormData;
  setBusinessForm: React.Dispatch<React.SetStateAction<BusinessFormData>>;
  isEditingBusiness: boolean;
  setIsEditingBusiness: (val: boolean) => void;
  businessSaving: boolean;
  handleSaveBusiness: (e: React.FormEvent) => Promise<void>;
  workspaceForm: WorkspaceFormData;
  setWorkspaceForm: React.Dispatch<React.SetStateAction<WorkspaceFormData>>;
  isEditingWorkspace: boolean;
  setIsEditingWorkspace: (val: boolean) => void;
  workspaceSaving: boolean;
  handleSaveWorkspaceFeatures: (e?: React.FormEvent) => Promise<void>;
}

export function UserOverviewTab({
  detail,
  businessForm,
  setBusinessForm,
  isEditingBusiness,
  setIsEditingBusiness,
  businessSaving,
  handleSaveBusiness,
  workspaceForm,
  setWorkspaceForm,
  isEditingWorkspace,
  setIsEditingWorkspace,
  workspaceSaving,
  handleSaveWorkspaceFeatures,
}: UserOverviewTabProps) {
  const primaryBusiness = detail.businesses?.[0];
  const primaryWorkspace = detail.workspaces?.[0];

  return (
    <div className="space-y-6 pb-8">
      {/* Business Settings Card */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <PiBriefcaseBold className="size-5 text-primary" />
            <h2 className="text-h3 font-bold text-foreground">
              Business Profile & Settings
            </h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditingBusiness(!isEditingBusiness)}
            leftIcon={<PiPencilSimpleBold size={14} />}
          >
            {isEditingBusiness ? "Cancel Editing" : "Edit Business"}
          </Button>
        </div>

        <div className="p-6">
          {isEditingBusiness ? (
            <form onSubmit={handleSaveBusiness} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Business Name">
                  <Input
                    value={businessForm.businessName}
                    onChange={(e) =>
                      setBusinessForm({
                        ...businessForm,
                        businessName: e.target.value,
                      })
                    }
                    required
                  />
                </FormField>
                <FormField label="Contact Phone">
                  <Input
                    value={businessForm.phone}
                    onChange={(e) =>
                      setBusinessForm({
                        ...businessForm,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </FormField>
                <FormField label="WhatsApp Number">
                  <Input
                    value={businessForm.whatsappNumber}
                    onChange={(e) =>
                      setBusinessForm({
                        ...businessForm,
                        whatsappNumber: e.target.value,
                      })
                    }
                    placeholder="+1 555 010 2020"
                  />
                </FormField>
                <FormField label="Website URL">
                  <Input
                    value={businessForm.websiteUrl}
                    onChange={(e) =>
                      setBusinessForm({
                        ...businessForm,
                        websiteUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com"
                  />
                </FormField>
              </div>

              <FormField label="Physical Address">
                <Input
                  value={businessForm.address}
                  onChange={(e) =>
                    setBusinessForm({
                      ...businessForm,
                      address: e.target.value,
                    })
                  }
                  placeholder="123 Gourmet Ave, Food City"
                />
              </FormField>

              <FormField label="Google Maps Location URL">
                <Input
                  value={businessForm.locationUrl}
                  onChange={(e) =>
                    setBusinessForm({
                      ...businessForm,
                      locationUrl: e.target.value,
                    })
                  }
                  placeholder="https://maps.google.com/?q=..."
                />
              </FormField>

              <FormField label="Operating Hours">
                <Input
                  value={businessForm.businessHours}
                  onChange={(e) =>
                    setBusinessForm({
                      ...businessForm,
                      businessHours: e.target.value,
                    })
                  }
                  placeholder="09:00 AM - 10:00 PM"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditingBusiness(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={businessSaving}
                  leftIcon={<PiFloppyDiskBold size={15} />}
                >
                  Save Business Settings
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Entity Name
                    </p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {primaryBusiness?.businessName || "No business name set"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <PiPhoneBold size={12} /> Phone
                      </p>
                      <p className="mt-1 font-mono text-sm text-foreground">
                        {primaryBusiness?.phone || "—"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <PiWhatsappLogoBold size={12} /> WhatsApp
                      </p>
                      <p className="mt-1 font-mono text-sm text-foreground">
                        {primaryBusiness?.whatsappNumber || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <PiClockBold size={12} /> Hours
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {primaryBusiness?.businessHours || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <PiMapPinBold size={12} /> Physical Address
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {primaryBusiness?.address || "No address on record"}
                    </p>
                    {primaryBusiness?.locationUrl && (
                      <a
                        href={primaryBusiness.locationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Open in Google Maps <PiArrowSquareOutBold size={12} />
                      </a>
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <PiGlobeBold size={12} /> Website URL
                    </p>
                    {primaryBusiness?.websiteUrl ? (
                      <a
                        href={primaryBusiness.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-primary hover:underline"
                      >
                        {primaryBusiness.websiteUrl}{" "}
                        <PiArrowSquareOutBold size={12} />
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        No website URL
                      </p>
                    )}
                  </div>

                  {/* Social Media Channels */}
                  <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <PiShareNetworkBold size={12} /> Social Media Channels
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(primaryBusiness?.socialLinks) &&
                      primaryBusiness.socialLinks.length > 0 ? (
                        primaryBusiness.socialLinks.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                          >
                            <span className="text-primary">
                              {getSocialPlatformIcon(s.platform)}
                            </span>
                            <span className="capitalize">{s.platform}</span>
                            <PiArrowSquareOutBold
                              size={11}
                              className="text-muted-foreground"
                            />
                          </a>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No social media links connected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Availability Schedule */}
              {Array.isArray(primaryBusiness?.availability) &&
                primaryBusiness.availability.length > 0 && (
                  <div className="mt-4 rounded-xl border border-border bg-muted/10 p-3.5">
                    <div className="mb-2 flex items-center gap-1.5">
                      <PiClockBold className="size-3.5 text-primary" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Weekly Operating Schedule Breakdown
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
                      {primaryBusiness.availability.map((slot: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-border bg-card p-2 text-center"
                        >
                          <p className="text-[11px] font-bold text-foreground">
                            {slot.day}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </Card>

      {/* Story & Brand Identity Narrative Card */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-6 py-4">
          <PiSparkleBold className="size-5 text-primary" />
          <h2 className="text-h3 font-bold text-foreground">
            Brand Assets & &quot;Our Story&quot; Narrative
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Brand Logo
              </p>
              {primaryWorkspace?.logoUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                    <Image
                      src={String(primaryWorkspace.logoUrl)}
                      alt="Logo"
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {String(primaryWorkspace.logoUrl)}
                    </p>
                    <a
                      href={String(primaryWorkspace.logoUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View Logo <PiArrowSquareOutBold size={12} />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No custom logo uploaded. System uses fallback monogram.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Hero Banner Image
              </p>
              {primaryWorkspace?.bannerUrl ? (
                <div className="relative h-20 w-full overflow-hidden rounded-xl border border-border">
                  <Image
                    src={String(primaryWorkspace.bannerUrl)}
                    alt="Banner"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No hero banner set. System uses theme gradient background.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Story Headline
            </p>
            <p className="text-base font-bold text-foreground">
              {String(primaryWorkspace?.storyHeadline || "Crafting Culinary Memories")}
            </p>

            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pt-2">
              Story Body
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {String(
                primaryWorkspace?.storyBody ||
                  "No personalized story submitted. Default template narrative is displayed to guests."
              )}
            </p>
          </div>

          {Array.isArray(primaryWorkspace?.stats) &&
            primaryWorkspace.stats.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Highlight Stats Counters
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {primaryWorkspace.stats.map((st: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-card p-3 text-center"
                    >
                      <p className="text-xl font-extrabold text-primary font-mono">
                        {st.value}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">
                        {st.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </Card>

      {/* Workspace Architecture & Theme Palettes Card */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-6 py-4">
          <PiSquaresFourBold className="size-5 text-primary" />
          <h2 className="text-h3 font-bold text-foreground">
            Workspace Architecture & Theme Palette
          </h2>
        </div>
        <div className="p-6">
          {detail.workspaces.length === 0 ? (
            <p className="text-body text-muted-foreground">
              No workspace linked to this user.
            </p>
          ) : (
            <div className="space-y-6">
              {detail.workspaces.map((ws) => (
                <div key={ws.id} className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-base font-bold text-foreground">
                        Workspace #{String(ws.id)}
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-0.5 font-mono text-xs font-bold text-primary">
                        Subdomain: {ws.public_slug || "unconfigured"}
                      </span>
                      {Boolean(ws.landingTheme) && (
                        <span className="rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          Landing: {String(ws.landingTheme)}
                        </span>
                      )}
                      {Boolean(ws.menuTheme) && (
                        <span className="rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          Menu: {String(ws.menuTheme)}
                        </span>
                      )}
                    </div>

                    {ws.public_slug && (
                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={buildPublicLandingUrl(ws.public_slug)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          Landing Site <PiArrowSquareOutBold size={13} />
                        </a>
                        <a
                          href={buildPublicMenuUrl(ws.public_slug)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                        >
                          Digital Menu <PiArrowSquareOutBold size={13} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Theme Tokens Swatches */}
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                      <span
                        className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                        style={{
                          backgroundColor: String(ws.primaryColor || "#D35400"),
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">
                          Primary Brand
                        </p>
                        <p className="font-mono text-xs font-bold text-foreground truncate">
                          {String(ws.primaryColor || "#D35400")}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                      <span
                        className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                        style={{
                          backgroundColor: String(ws.secondaryColor || "#E67E22"),
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">
                          Secondary Brand
                        </p>
                        <p className="font-mono text-xs font-bold text-foreground truncate">
                          {String(ws.secondaryColor || "#E67E22")}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                      <span
                        className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                        style={{
                          backgroundColor: String(ws.accentColor || "#F39C12"),
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">
                          Accent Brand
                        </p>
                        <p className="font-mono text-xs font-bold text-foreground truncate">
                          {String(ws.accentColor || "#F39C12")}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center gap-3">
                      <span
                        className="size-8 rounded-lg border border-border shrink-0 shadow-sm"
                        style={{
                          backgroundColor: String(ws.menuPrimaryColor || "#E8500A"),
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">
                          Menu Accent
                        </p>
                        <p className="font-mono text-xs font-bold text-foreground truncate">
                          {String(ws.menuPrimaryColor || "#E8500A")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature Flags & Navigation Controls */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Feature Flags &amp; Navigation Modules
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Control which customer-facing features and actions are active on the visitor landing page
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditingWorkspace(!isEditingWorkspace)}
                        leftIcon={<PiPencilSimpleBold size={13} />}
                      >
                        {isEditingWorkspace ? "Cancel" : "Configure Features"}
                      </Button>
                    </div>

                    {!isEditingWorkspace ? (
                      <>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Badge tone={ws.menubtnStatus ? "success" : "neutral"}>
                            Digital Menu: {ws.menubtnStatus ? "Active" : "Hidden"}
                          </Badge>
                          <Badge tone={ws.paybtnStatus ? "success" : "neutral"}>
                            Pay Bill: {ws.paybtnStatus ? "Active" : "Hidden"}
                          </Badge>
                          <Badge tone={ws.reviewbtnStatus ? "success" : "neutral"}>
                            Review Link: {ws.reviewbtnStatus ? "Active" : "Hidden"}
                          </Badge>
                          <Badge tone={ws.specialOfferStatus ? "success" : "neutral"}>
                            Special Offers: {ws.specialOfferStatus ? "Active" : "Hidden"}
                          </Badge>
                          <Badge tone={ws.socialApprovalRequired ? "warning" : "neutral"}>
                            Staff Post Approval: {ws.socialApprovalRequired ? "Required" : "Not Required"}
                          </Badge>
                        </div>

                        {Boolean(ws.announcementText) && (
                          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              Customer Announcement Banner {ws.announcementEnabled ? "(Active)" : "(Disabled)"}
                            </p>
                            <p className="mt-1 text-xs font-medium text-amber-200">
                              &quot;{String(ws.announcementText)}&quot;
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <form onSubmit={handleSaveWorkspaceFeatures} className="space-y-4 pt-2 border-t border-border">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Checkbox
                            id="flag-menu"
                            label="Digital Menu View"
                            checked={workspaceForm.menubtnStatus}
                            onChange={(e) =>
                              setWorkspaceForm({ ...workspaceForm, menubtnStatus: e.target.checked })
                            }
                          />
                          <Checkbox
                            id="flag-pay"
                            label="Pay Bill Button"
                            checked={workspaceForm.paybtnStatus}
                            onChange={(e) =>
                              setWorkspaceForm({ ...workspaceForm, paybtnStatus: e.target.checked })
                            }
                          />
                          <Checkbox
                            id="flag-review"
                            label="Google Review Button"
                            checked={workspaceForm.reviewbtnStatus}
                            onChange={(e) =>
                              setWorkspaceForm({ ...workspaceForm, reviewbtnStatus: e.target.checked })
                            }
                          />
                          <Checkbox
                            id="flag-offers"
                            label="Special Offers Modal"
                            checked={workspaceForm.specialOfferStatus}
                            onChange={(e) =>
                              setWorkspaceForm({ ...workspaceForm, specialOfferStatus: e.target.checked })
                            }
                          />
                          <Checkbox
                            id="flag-approval"
                            label="Require Approval for Social Media Posts"
                            checked={workspaceForm.socialApprovalRequired}
                            onChange={(e) =>
                              setWorkspaceForm({ ...workspaceForm, socialApprovalRequired: e.target.checked })
                            }
                          />
                        </div>

                        <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
                          <Checkbox
                            id="flag-announcement-enabled"
                            label="Enable Customer Landing Marquee Announcement"
                            checked={workspaceForm.announcementEnabled}
                            onChange={(e) =>
                              setWorkspaceForm({ ...workspaceForm, announcementEnabled: e.target.checked })
                            }
                          />
                          <FormField label="Announcement Marquee Text">
                            <Input
                              value={workspaceForm.announcementText}
                              onChange={(e) =>
                                setWorkspaceForm({ ...workspaceForm, announcementText: e.target.value })
                              }
                              placeholder="e.g. Happy Hour 5PM-7PM • 20% Off All Appetizers!"
                            />
                          </FormField>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsEditingWorkspace(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            loading={workspaceSaving}
                            leftIcon={<PiFloppyDiskBold size={14} />}
                          >
                            Save Features
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Custom QR Code Configuration Card */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-6 py-4">
          <PiQrCodeBold className="size-5 text-primary" />
          <h2 className="text-h3 font-bold text-foreground">
            Custom QR Code Generator Configuration
          </h2>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This tenant has styled their table and promotional QR codes with custom colors and finder pattern styling.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Pattern Style
                  </p>
                  <p className="font-mono text-sm font-bold capitalize text-foreground mt-1">
                    {String(
                      (primaryWorkspace?.qrCodeConfig as any)?.dataPattern || "square"
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Finder Pattern
                  </p>
                  <p className="font-mono text-sm font-bold capitalize text-foreground mt-1">
                    {String(
                      (primaryWorkspace?.qrCodeConfig as any)?.finderPattern || "square"
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    QR Resolution
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground mt-1">
                    {String((primaryWorkspace?.qrCodeConfig as any)?.size || 256)}px
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Data Color:</span>
                  <span
                    className="size-4 rounded-full border border-border inline-block"
                    style={{
                      backgroundColor: String(
                        (primaryWorkspace?.qrCodeConfig as any)?.dataColor || "#000000"
                      ),
                    }}
                  />
                  <span className="font-mono text-foreground font-semibold">
                    {String(
                      (primaryWorkspace?.qrCodeConfig as any)?.dataColor || "#000000"
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Background Fill:</span>
                  <span
                    className="size-4 rounded-full border border-border inline-block"
                    style={{
                      backgroundColor: String(
                        (primaryWorkspace?.qrCodeConfig as any)?.backgroundFill || "#ffffff"
                      ),
                    }}
                  />
                  <span className="font-mono text-foreground font-semibold">
                    {String(
                      (primaryWorkspace?.qrCodeConfig as any)?.backgroundFill || "#ffffff"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-6 text-center">
              <div className="relative flex size-36 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-card p-4 shadow-sm">
                <PiQrCodeBold className="size-24 text-primary" />
              </div>
              <p className="mt-3 font-mono text-xs font-semibold text-muted-foreground">
                Target: {primaryWorkspace?.public_slug ? `${primaryWorkspace.public_slug}.domain/menu` : "/menu"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
