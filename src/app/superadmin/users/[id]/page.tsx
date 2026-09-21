"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  PiArrowLeftBold,
  PiArrowSquareOutBold,
  PiUserBold,
  PiUserSwitchBold,
  PiSquaresFourBold,
  PiBriefcaseBold,
  PiChartLineUpBold,
  PiStorefrontBold,
  PiStarBold,
  PiStarFill,
  PiWalletBold,
  PiInfoBold,
  PiUsersBold,
  PiCursorClickBold,
  PiCheckBold,
  PiXBold,
  PiPencilSimpleBold,
  PiPhoneBold,
  PiMapPinBold,
  PiClockBold,
  PiGlobeBold,
  PiWhatsappLogoBold,
  PiLockSimpleBold,
  PiLockKeyOpenBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiFloppyDiskBold,
  PiMagnifyingGlassBold,
  PiShieldCheckBold,
  PiShareNetworkBold,
  PiSparkleBold,
  PiTagBold,
  PiImagesBold,
  PiQuestionBold,
  PiQrCodeBold,
  PiDeviceMobileBold,
  PiDesktopBold,
  PiDeviceTabletBold,
  PiCopyBold,
  PiCalendarBold,
  PiTrendUpBold,
  PiBookBookmarkBold,
} from "react-icons/pi";
import {
  superadminService,
  type DateRange,
  type UserDetailResponse,
  type TenantMenuItem,
  type TenantStaffMember,
  type TenantAnalyticsData,
} from "@/services/superadmin.service";
import { routes } from "@/config/routes";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import { getSocialPlatformIcon } from "@/components/templates/core/socialPlatforms";
import {
  Card,
  Badge,
  Button,
  Select,
  Input,
  Textarea,
  SubTabPills,
  EmptyState,
  FormField,
  Checkbox,
  toast,
} from "@/components/ui";
import { fadeIn, fadeInUp } from "@/lib/motion";
import { setStoredUserRole, setImpersonationSession } from "@/utils/storage.utils";

type TabId =
  | "overview"
  | "menus"
  | "gallery"
  | "offers"
  | "feedback"
  | "payments_reviews"
  | "staff"
  | "analytics";

interface Props {
  id: string;
}

function SuperadminUserDetailContent({ id }: Props) {
  const userId = Number(id);
  const reduceMotion = useReducedMotion();

  const [detail, setDetail] = useState<UserDetailResponse | null>(null);
  const [tenantAnalytics, setTenantAnalytics] = useState<TenantAnalyticsData | null>(null);
  const [range, setRange] = useState<DateRange>("last_7_days");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [feedbackSubTab, setFeedbackSubTab] = useState<"google" | "faqs">("google");
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [impersonating, setImpersonating] = useState(false);

  // Status toggling
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Gallery Lightbox Modal State
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Menu Search & Category Filter
  const [menuSearch, setMenuSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Editing Menu Modal State
  const [editingItem, setEditingItem] = useState<TenantMenuItem | null>(null);
  const [menuSaving, setMenuSaving] = useState(false);

  // Blueprint Seeding Modal
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [availableBlueprints, setAvailableBlueprints] = useState<any[]>([]);
  const [selectedBpId, setSelectedBpId] = useState<string>('cafe_bakery');
  const [bpMode, setBpMode] = useState<'append' | 'replace'>('append');
  const [applyingBp, setApplyingBp] = useState(false);

  // Editing Business Settings State
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    businessName: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    websiteUrl: "",
    locationUrl: "",
    businessHours: "",
  });
  const [businessSaving, setBusinessSaving] = useState(false);

  // Editing Payment & Review Settings State
  const [paymentForm, setPaymentForm] = useState({
    paymentType: "url",
    paymentLink: "",
    reviewLink: "",
  });
  const [paymentSaving, setPaymentSaving] = useState(false);

  // Editing Workspace Feature Flags & Navigation State
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);
  const [workspaceForm, setWorkspaceForm] = useState({
    specialOfferStatus: false,
    menubtnStatus: true,
    paybtnStatus: true,
    reviewbtnStatus: true,
    socialApprovalRequired: false,
    announcementEnabled: false,
    announcementText: "",
  });
  const [workspaceSaving, setWorkspaceSaving] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!Number.isFinite(userId)) {
      setError("Invalid user identification token.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await superadminService.getUser(userId);
      setDetail(res);

      // Seed business edit form
      const primaryBiz = res.businesses?.[0];
      if (primaryBiz) {
        setBusinessForm({
          businessName: primaryBiz.businessName || "",
          phone: primaryBiz.phone || "",
          whatsappNumber: primaryBiz.whatsappNumber || "",
          address: primaryBiz.address || "",
          websiteUrl: primaryBiz.websiteUrl || "",
          locationUrl: primaryBiz.locationUrl || "",
          businessHours: primaryBiz.businessHours || "",
        });
      }

      // Seed payment & review form and workspace features
      const primaryWs = res.workspaces?.[0];
      if (primaryWs) {
        setPaymentForm({
          paymentType: primaryWs.paymentType || "url",
          paymentLink: primaryWs.paymentLink || "",
          reviewLink: primaryWs.reviewLink || "",
        });
        setWorkspaceForm({
          specialOfferStatus: Boolean(primaryWs.specialOfferStatus),
          menubtnStatus: Boolean(primaryWs.menubtnStatus),
          paybtnStatus: Boolean(primaryWs.paybtnStatus),
          reviewbtnStatus: Boolean(primaryWs.reviewbtnStatus),
          socialApprovalRequired: Boolean(primaryWs.socialApprovalRequired),
          announcementEnabled: Boolean(primaryWs.announcementEnabled),
          announcementText: primaryWs.announcementText || "",
        });
      }
    } catch (e) {
      console.error(e);
      setError("Account not found or access restricted.");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadAnalytics = useCallback(async () => {
    if (!Number.isFinite(userId)) return;
    try {
      setLoadingAnalytics(true);
      const res = await superadminService.getTenantAnalytics(userId, range);
      setTenantAnalytics(res);
    } catch (e) {
      console.error(e);
      setTenantAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [userId, range]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (activeTab === "analytics" && detail) {
      loadAnalytics();
    }
  }, [activeTab, detail, loadAnalytics]);

  // Freeze / Unfreeze user account
  const handleToggleStatus = async () => {
    if (!detail) return;
    const newActiveState = !detail.user.active;
    try {
      setStatusUpdating(true);
      await superadminService.toggleUserStatus(userId, newActiveState);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                active: newActiveState,
              },
            }
          : prev
      );
      toast.success(
        `Account has been ${newActiveState ? "activated" : "frozen"} successfully.`
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to change account status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // Impersonate / Login as tenant (Support Mode)
  const handleImpersonate = async () => {
    if (!detail) return;
    try {
      setImpersonating(true);
      const res = await superadminService.impersonateTenant(userId);
      setImpersonationSession(res.impersonation);
      setStoredUserRole("admin");
      toast.success(`Entering ${res.targetUser.name}'s workspace (Support Mode)...`);
      router.push(routes.admin.home);
    } catch (e) {
      console.error(e);
      toast.error("Failed to start impersonation session.");
      setImpersonating(false);
    }
  };

  // Save Workspace Features & Navigation Settings
  const handleSaveWorkspaceFeatures = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) return;
    try {
      setWorkspaceSaving(true);
      await superadminService.updateTenantWorkspace(userId, workspaceForm);
      toast.success("Website features and navigation controls saved.");
      setIsEditingWorkspace(false);
      await loadDetail();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update workspace features.");
    } finally {
      setWorkspaceSaving(false);
    }
  };

  // Toggle menu availability
  const handleToggleMenuAvailability = async (
    menuId: number,
    currentAvailability: boolean
  ) => {
    const newAvailability = !currentAvailability;
    try {
      await superadminService.toggleTenantMenuAvailability(
        userId,
        menuId,
        newAvailability
      );
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              menus: prev.menus.map((m) =>
                m.id === menuId ? { ...m, availability: newAvailability } : m
              ),
            }
          : prev
      );
      toast.success(
        `Dish marked as ${newAvailability ? "Available" : "Unavailable"}.`
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to update dish availability.");
    }
  };

  // Save Menu Item Changes
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setMenuSaving(true);
      await superadminService.updateTenantMenu(userId, editingItem.id, {
        item: editingItem.item,
        price: editingItem.price,
        imageUrl: editingItem.imageUrl,
        description: editingItem.description,
        category: editingItem.category,
        type: editingItem.type,
        popular: editingItem.popular,
        availability: editingItem.availability,
        availabilityTime: editingItem.availabilityTime,
      });

      setDetail((prev) =>
        prev
          ? {
              ...prev,
              menus: prev.menus.map((m) =>
                m.id === editingItem.id ? { ...editingItem } : m
              ),
            }
          : prev
      );

      toast.success("Menu item updated successfully.");
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update menu item.");
    } finally {
      setMenuSaving(false);
    }
  };

  const handleOpenBlueprintModal = async () => {
    setBlueprintModalOpen(true);
    if (availableBlueprints.length === 0) {
      try {
        const bps = await superadminService.getBlueprints();
        setAvailableBlueprints(bps);
        if (bps.length > 0) setSelectedBpId(bps[0].id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleApplyBlueprint = async () => {
    if (!selectedBpId) return;
    try {
      setApplyingBp(true);
      const res = await superadminService.applyBlueprint(userId, selectedBpId, bpMode);
      toast.success(res.message);
      setBlueprintModalOpen(false);
      await loadDetail();
    } catch (e) {
      console.error(e);
      toast.error("Failed to apply blueprint.");
    } finally {
      setApplyingBp(false);
    }
  };

  // Save Business Settings Changes
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBusinessSaving(true);
      await superadminService.updateTenantBusiness(userId, businessForm);
      toast.success("Business profile saved successfully.");
      setIsEditingBusiness(false);
      loadDetail();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save business settings.");
    } finally {
      setBusinessSaving(false);
    }
  };

  // Save Payment & Review Settings Changes
  const handleSavePaymentReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPaymentSaving(true);
      await superadminService.updateTenantPaymentReview(userId, paymentForm);
      toast.success("Payment and review settings saved.");
      loadDetail();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment/review settings.");
    } finally {
      setPaymentSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  const formatDeviceIcon = (ua: string | null) => {
    if (!ua) return <PiDesktopBold className="size-4 text-muted-foreground" />;
    const l = ua.toLowerCase();
    if (/ipad|tablet/.test(l))
      return <PiDeviceTabletBold className="size-4 text-amber-500" />;
    if (/mobi|android|iphone/.test(l))
      return <PiDeviceMobileBold className="size-4 text-emerald-500" />;
    return <PiDesktopBold className="size-4 text-blue-500" />;
  };

  // Categories extraction for filtering
  const categories = useMemo(() => {
    if (!detail?.menus) return [];
    const set = new Set<string>();
    detail.menus.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [detail]);

  // Filtered menus
  const filteredMenus = useMemo(() => {
    if (!detail?.menus) return [];
    return detail.menus.filter((m) => {
      const matchCat =
        selectedCategory === "all" || m.category === selectedCategory;
      const matchSearch =
        !menuSearch ||
        m.item.toLowerCase().includes(menuSearch.toLowerCase()) ||
        (m.description &&
          m.description.toLowerCase().includes(menuSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [detail, selectedCategory, menuSearch]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<PiInfoBold className="size-10" />}
          title="Tenant Details Unavailable"
          description={error || "Could not retrieve tenant account details."}
          action={
            <Button
              variant="secondary"
              onClick={() => (window.location.href = routes.superadmin.users)}
            >
              Return to Users Directory
            </Button>
          }
        />
      </div>
    );
  }

  const u = detail.user;
  const primaryBusiness = detail.businesses?.[0];
  const primaryWorkspace = detail.workspaces?.[0];

  const tabOptions = [
    { id: "overview" as const, label: "Overview & Branding" },
    { id: "menus" as const, label: `Menus (${detail.menus.length})` },
    { id: "gallery" as const, label: `Gallery (${detail.gallery?.length ?? 0})` },
    { id: "offers" as const, label: `Offers (${detail.offers?.length ?? 0})` },
    {
      id: "feedback" as const,
      label: `Reviews & FAQs (${
        (detail.googleReviews?.length ?? 0) +
        (detail.faqs?.length ?? 0)
      })`,
    },
    { id: "payments_reviews" as const, label: "Payments & QR" },
    {
      id: "staff" as const,
      label: `Sub-Users / Staff (${detail.staff?.length ?? 0})`,
    },
    { id: "analytics" as const, label: "Tenant Analytics" },
  ];

  return (
    <motion.div
      className="flex h-full flex-col gap-5 overflow-hidden"
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={fadeIn}
    >
      {/* Top Header & Identity Card */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={routes.superadmin.users}
            className="group inline-flex items-center gap-2 text-caption uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
          >
            <PiArrowLeftBold className="transition-transform group-hover:-translate-x-1" />
            Back to Directory
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            {primaryWorkspace?.public_slug && (
              <>
                <a
                  href={buildPublicLandingUrl(primaryWorkspace.public_slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  title="Open live tenant landing page"
                >
                  <PiGlobeBold className="size-3.5 text-primary" />
                  <span>
                    Landing:{" "}
                    <span className="font-mono font-bold text-primary">
                      {primaryWorkspace.public_slug}
                    </span>
                  </span>
                  <PiArrowSquareOutBold className="size-3" />
                </a>

                <a
                  href={buildPublicMenuUrl(primaryWorkspace.public_slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                  title="Open live digital menu"
                >
                  <PiStorefrontBold className="size-3.5" />
                  <span>Live Menu</span>
                  <PiArrowSquareOutBold className="size-3" />
                </a>
              </>
            )}

            <Button
              variant="secondary"
              size="sm"
              loading={impersonating}
              onClick={handleImpersonate}
              className="border-amber-500/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 dark:text-amber-300 font-semibold"
              leftIcon={<PiUserSwitchBold size={14} className="text-amber-600 dark:text-amber-400" />}
              title="Sign in directly as this tenant to manage or troubleshoot their workspace"
            >
              Login as Tenant
            </Button>

            <Button
              variant={u.active ? "secondary" : "primary"}
              size="sm"
              loading={statusUpdating}
              onClick={handleToggleStatus}
              leftIcon={
                u.active ? (
                  <PiLockSimpleBold size={14} />
                ) : (
                  <PiLockKeyOpenBold size={14} />
                )
              }
            >
              {u.active ? "Freeze Account" : "Activate Account"}
            </Button>
          </div>
        </div>

        {/* Tenant Profile Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-neu-inset-sm">
              <PiUserBold className="size-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-h2 font-bold text-foreground">
                  {u.name || "Untitled User"}
                </h1>
                <Badge tone={u.active ? "success" : "neutral"}>
                  {u.active ? "Active" : "Frozen"}
                </Badge>
                <span className="rounded-md bg-accent px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
                  {u.role}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted-foreground">
                <span className="flex items-center gap-1.5 font-mono font-medium">
                  <PiPhoneBold className="size-3.5" />
                  {u.phone}
                </span>
                <span>•</span>
                <span>ID #{u.id}</span>
                <span>•</span>
                <span>
                  Joined{" "}
                  {new Date((u.createdAt as string) || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
            <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Menu Items
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                {detail.counts.menus}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Gallery
              </p>
              <p className="font-mono text-base font-bold text-primary">
                {detail.counts.gallery ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Offers
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                {detail.counts.offers ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Sub-Users
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                {detail.counts.staff_members}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Events
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                {detail.counts.analytics_events}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center">
          <SubTabPills
            options={tabOptions}
            active={activeTab}
            onChange={(tabId) => setActiveTab(tabId as TabId)}
          />
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & BRANDING */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
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
                            {primaryBusiness.availability.map(
                              (slot: any, idx: number) => (
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
                              )
                            )}
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
                {/* Branding Assets (Logo & Banner) */}
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

                {/* Story Headline & Body */}
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

                {/* Landing Stats Bar */}
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
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MENUS */}
        {/* ========================================================================= */}
        {activeTab === "menus" && (
          <div className="space-y-5 pb-8">
            {/* Search & Filters */}
            {/* Search, Filters & Blueprint Action */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative max-w-sm flex-1">
                  <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search tenant menu items..."
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleOpenBlueprintModal}
                  className="shrink-0 border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 font-semibold"
                  leftIcon={<PiBookBookmarkBold size={14} />}
                >
                  Apply Blueprint
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({detail.menus.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu List */}
            {filteredMenus.length === 0 ? (
              <EmptyState
                icon={<PiStorefrontBold className="size-8" />}
                title="No menu items found"
                description={
                  menuSearch
                    ? "No items match your search filter."
                    : "This tenant has not added any menu items yet."
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMenus.map((item) => (
                  <Card
                    key={item.id}
                    className="flex flex-col overflow-hidden transition-all hover:border-primary/30"
                  >
                    {/* Item Image */}
                    <div className="relative h-44 w-full bg-muted/60">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.item}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <PiStorefrontBold className="size-10 opacity-40" />
                        </div>
                      )}
                      <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            item.type === "Veg"
                              ? "border border-emerald-500/30 bg-emerald-950/80 text-emerald-400"
                              : "border border-rose-500/30 bg-rose-950/80 text-rose-400"
                          }`}
                        >
                          {item.type}
                        </span>
                        {item.popular && (
                          <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            <PiStarBold size={10} /> Popular
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-foreground">
                            {item.item}
                          </h3>
                          <span className="font-mono text-base font-bold text-primary">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {item.category}
                        </p>
                        {item.description && (
                          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleMenuAvailability(
                              item.id,
                              item.availability
                            )
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                            item.availability
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item.availability ? (
                            <>
                              <PiEyeBold size={13} /> Available
                            </>
                          ) : (
                            <>
                              <PiEyeSlashBold size={13} /> Unavailable
                            </>
                          )}
                        </button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingItem({ ...item })}
                          leftIcon={<PiPencilSimpleBold size={13} />}
                        >
                          Edit Item
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Menu Item Modal */}
            <AnimatePresence>
              {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <motion.div
                    className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          Edit Menu Item
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Editing ID #{editingItem.id} for tenant #{userId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingItem(null)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <PiXBold size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveMenuItem} className="mt-4 space-y-4">
                      <FormField label="Item Name">
                        <Input
                          value={editingItem.item}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, item: e.target.value })
                          }
                          required
                        />
                      </FormField>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Price ($)">
                          <Input
                            type="number"
                            step="0.01"
                            value={editingItem.price}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, price: e.target.value })
                            }
                            required
                          />
                        </FormField>
                        <FormField label="Category">
                          <Input
                            value={editingItem.category}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                category: e.target.value,
                              })
                            }
                            required
                          />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Food Type">
                          <Select
                            value={editingItem.type}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, type: e.target.value })
                            }
                          >
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                          </Select>
                        </FormField>
                        <div className="flex items-center pt-6">
                          <Checkbox
                            id="edit-popular"
                            label="Mark as Popular"
                            checked={editingItem.popular}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                popular: e.target.checked,
                              })
                            }
                          />
                        </div>
                      </div>

                      <FormField label="Description">
                        <Textarea
                          value={editingItem.description || ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          placeholder="Ingredients, recipe details, etc."
                        />
                      </FormField>

                      <div className="flex items-center pt-2">
                        <Checkbox
                          id="edit-availability"
                          label="Available for ordering / public viewing"
                          checked={editingItem.availability}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              availability: e.target.checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex justify-end gap-3 border-t border-border pt-4">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setEditingItem(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          loading={menuSaving}
                          leftIcon={<PiFloppyDiskBold size={15} />}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Seed Starter Blueprint Modal */}
            <AnimatePresence>
              {blueprintModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <motion.div
                    className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          Apply Starter Blueprint
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Pre-populate menu items for {detail.user.name} (#{userId})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBlueprintModalOpen(false)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <PiXBold size={16} />
                      </button>
                    </div>

                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Choose Preset Menu Pack
                        </label>
                        <div className="mt-2 space-y-2 max-h-56 overflow-y-auto">
                          {availableBlueprints.map((bp) => (
                            <button
                              key={bp.id}
                              type="button"
                              onClick={() => setSelectedBpId(bp.id)}
                              className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                                selectedBpId === bp.id
                                  ? "border-primary bg-primary/10 text-primary font-semibold"
                                  : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                              }`}
                            >
                              <div>
                                <p className="text-sm font-bold">{bp.name}</p>
                                <p className="text-xs text-muted-foreground">{bp.tagline}</p>
                                <p className="mt-1 text-[11px] font-mono text-muted-foreground">
                                  {bp.items.length} items • {bp.categoryNames.join(", ")}
                                </p>
                              </div>
                              {selectedBpId === bp.id && <PiCheckBold className="size-4 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Seeding Strategy
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setBpMode("append")}
                            className={`rounded-xl border p-2.5 text-left transition ${
                              bpMode === "append"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                            }`}
                          >
                            <p className="text-xs font-bold">Append</p>
                            <p className="text-[10px] text-muted-foreground">Keep existing items</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setBpMode("replace")}
                            className={`rounded-xl border p-2.5 text-left transition ${
                              bpMode === "replace"
                                ? "border-destructive bg-destructive/10 text-destructive font-semibold"
                                : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                            }`}
                          >
                            <p className="text-xs font-bold">Replace</p>
                            <p className="text-[10px] text-muted-foreground">Wipe current menu</p>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                      <Button variant="secondary" onClick={() => setBlueprintModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleApplyBlueprint}
                        loading={applyingBp}
                        variant={bpMode === "replace" ? "destructive" : "primary"}
                      >
                        {bpMode === "replace" ? "Replace & Seed Menu" : "Append Blueprint"}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GALLERY & MEDIA (NEW!) */}
        {/* ========================================================================= */}
        {activeTab === "gallery" && (
          <div className="space-y-6 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PiImagesBold className="size-5" />
                </div>
                <div>
                  <h2 className="text-h3 font-bold text-foreground">
                    Tenant Gallery Showcase
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {detail.gallery?.length ?? 0} photos uploaded by this business
                  </p>
                </div>
              </div>
            </div>

            {(!detail.gallery || detail.gallery.length === 0) ? (
              <EmptyState
                icon={<PiImagesBold className="size-8" />}
                title="No Gallery Images"
                description="This business has not uploaded any photos to their showcase gallery yet."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {detail.gallery.map((img) => (
                  <Card
                    key={img.id}
                    className="group relative flex flex-col overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg"
                  >
                    <div
                      className="relative h-48 w-full cursor-pointer bg-muted overflow-hidden"
                      onClick={() => setPreviewImage(img.imageUrl)}
                    >
                      <Image
                        src={img.imageUrl}
                        alt="Gallery item"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                        <span className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm">
                          <PiEyeBold size={20} />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card border-t border-border">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        Photo #{img.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(img.imageUrl, "Image URL")}
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Copy Image URL"
                        >
                          <PiCopyBold size={13} />
                        </button>
                        <a
                          href={img.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-primary"
                          title="Open original image"
                        >
                          <PiArrowSquareOutBold size={13} />
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
              {previewImage && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                  onClick={() => setPreviewImage(null)}
                >
                  <motion.div
                    className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/20 bg-card shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                    >
                      <PiXBold size={18} />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt="Full preview"
                      className="max-h-[85vh] max-w-[85vw] object-contain"
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: OFFERS & PROMOTIONS (NEW!) */}
        {/* ========================================================================= */}
        {activeTab === "offers" && (
          <div className="space-y-6 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PiTagBold className="size-5" />
                </div>
                <div>
                  <h2 className="text-h3 font-bold text-foreground">
                    Special Offers & Discount Banners
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {detail.offers?.length ?? 0} promotional discounts active for this business
                  </p>
                </div>
              </div>
            </div>

            {(!detail.offers || detail.offers.length === 0) ? (
              <EmptyState
                icon={<PiTagBold className="size-8" />}
                title="No Special Offers"
                description="This tenant has not added any special offers or promotions yet."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {detail.offers.map((offer) => (
                  <Card
                    key={offer.id}
                    className="flex flex-col overflow-hidden transition-all hover:border-primary/30"
                  >
                    {offer.imageUrl && (
                      <div className="relative h-40 w-full bg-muted">
                        <Image
                          src={offer.imageUrl}
                          alt={offer.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                            {offer.discount || "SPECIAL OFFER"}
                          </span>
                          <Badge tone={offer.isActive ? "success" : "neutral"}>
                            {offer.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <h3 className="mt-3 text-base font-bold text-foreground">
                          {offer.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                          {offer.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] font-mono text-muted-foreground">
                        <span>Offer #{offer.id}</span>
                        <span>Workspace #{offer.workspaceId}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: REVIEWS & FAQS */}
        {/* ========================================================================= */}
        {activeTab === "feedback" && (
          <div className="space-y-6 pb-8">
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <button
                type="button"
                onClick={() => setFeedbackSubTab("google")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  feedbackSubTab === "google"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                Synced Google Reviews ({detail.googleReviews?.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setFeedbackSubTab("faqs")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  feedbackSubTab === "faqs"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                Tenant FAQs ({detail.faqs?.length ?? 0})
              </button>
            </div>

            {/* Synced Google Reviews SubTab */}
            {feedbackSubTab === "google" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Connected Google Place ID
                    </p>
                    <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                      {primaryWorkspace?.googlePlaceId || "Not configured"}
                    </p>
                  </div>
                  {primaryWorkspace?.reviewLink && (
                    <a
                      href={primaryWorkspace.reviewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:text-primary"
                    >
                      Open Google Review Link <PiArrowSquareOutBold size={13} />
                    </a>
                  )}
                </div>

                {(!detail.googleReviews || detail.googleReviews.length === 0) ? (
                  <EmptyState
                    icon={<PiStarBold className="size-8" />}
                    title="No Google Reviews Synced"
                    description="No Google Place reviews have been synced to the database yet."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {detail.googleReviews.map((rev) => (
                      <Card key={rev.id} className="p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                              {rev.authorPhotoUrl ? (
                                <Image
                                  src={rev.authorPhotoUrl}
                                  alt={rev.authorName}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
                                  {rev.authorName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-foreground truncate">
                                {rev.authorName}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center text-amber-400">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <PiStarFill
                                      key={idx}
                                      className={`size-3 ${
                                        idx < rev.rating
                                          ? "text-amber-400"
                                          : "text-muted-foreground/30"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {rev.relativePublishDescription || "Verified Review"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 text-xs text-foreground/90 leading-relaxed">
                            {rev.text || "Rated without review text."}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAQs SubTab */}
            {feedbackSubTab === "faqs" && (
              <div>
                {(!detail.faqs || detail.faqs.length === 0) ? (
                  <EmptyState
                    icon={<PiQuestionBold className="size-8" />}
                    title="No FAQs Configured"
                    description="This tenant has not added any questions & answers."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {detail.faqs.map((faq) => (
                      <Card key={faq.id} className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                              Q
                            </span>
                            {faq.question}
                          </h3>
                          <Badge tone={faq.isVisible ? "success" : "neutral"}>
                            {faq.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground pl-7 leading-relaxed">
                          {faq.answer}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PAYMENTS & REVIEWS */}
        {/* ========================================================================= */}
        {activeTab === "payments_reviews" && (
          <div className="space-y-6 pb-8">
            <form onSubmit={handleSavePaymentReview} className="space-y-6">
              {/* Payment Gateway Settings */}
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <PiWalletBold className="size-5 text-primary" />
                    <h2 className="text-h3 font-bold text-foreground">
                      Payment Link & Gateway Setup
                    </h2>
                  </div>
                  <Badge tone={paymentForm.paymentLink ? "success" : "neutral"}>
                    {paymentForm.paymentLink ? "Gateway Configured" : "Unset"}
                  </Badge>
                </div>

                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <FormField label="Payment Method Type">
                        <Select
                          value={paymentForm.paymentType}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              paymentType: e.target.value,
                            })
                          }
                        >
                          <option value="url">Direct Gateway URL</option>
                          <option value="qr_image">Uploaded QR Code Image</option>
                          <option value="both">Both URL & QR Code</option>
                        </Select>
                      </FormField>

                      <FormField label="Payment Gateway Checkout URL">
                        <Input
                          value={paymentForm.paymentLink}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              paymentLink: e.target.value,
                            })
                          }
                          placeholder="https://buy.stripe.com/..."
                        />
                      </FormField>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          loading={paymentSaving}
                          leftIcon={<PiFloppyDiskBold size={15} />}
                        >
                          Save Payment & Review Config
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Payment QR Code Image
                      </p>
                      {primaryWorkspace?.paymentQrImage ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative size-40 overflow-hidden rounded-xl border border-border bg-card p-2">
                            <Image
                              src={primaryWorkspace.paymentQrImage}
                              alt="Payment QR"
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                          </div>
                          <p className="text-xs text-muted-foreground font-mono truncate max-w-full">
                            {primaryWorkspace.paymentQrImage}
                          </p>
                        </div>
                      ) : (
                        <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                          <PiWalletBold className="size-8 text-muted-foreground opacity-50" />
                          <p className="mt-2 text-xs text-muted-foreground">
                            No custom payment QR code image uploaded yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Google Reviews Configuration */}
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <PiStarBold className="size-5 text-primary" />
                    <h2 className="text-h3 font-bold text-foreground">
                      Google Review Direct Redirect
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <FormField label="Google Review / Business Link">
                    <Input
                      value={paymentForm.reviewLink}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          reviewLink: e.target.value,
                        })
                      }
                      placeholder="https://g.page/r/..."
                    />
                  </FormField>

                  {primaryWorkspace?.googlePlaceId && (
                    <p className="text-xs text-muted-foreground">
                      Extracted Google Place ID:{" "}
                      <span className="font-mono text-foreground font-semibold">
                        {primaryWorkspace.googlePlaceId}
                      </span>
                    </p>
                  )}

                  {paymentForm.reviewLink && (
                    <a
                      href={paymentForm.reviewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      Test Google Review Link <PiArrowSquareOutBold size={13} />
                    </a>
                  )}
                </div>
              </Card>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SUB-USERS / STAFF */}
        {/* ========================================================================= */}
        {activeTab === "staff" && (
          <div className="space-y-5 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PiUsersBold className="size-5" />
                </div>
                <div>
                  <h2 className="text-h3 font-bold text-foreground">
                    Delegated Staff & Operators
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Sub-accounts granted access to this restaurant&apos;s admin portal
                  </p>
                </div>
              </div>
              <Badge tone={detail.staff.length > 0 ? "success" : "neutral"}>
                {detail.staff.length} Members
              </Badge>
            </div>

            {detail.staff.length === 0 ? (
              <EmptyState
                icon={<PiUsersBold className="size-8" />}
                title="No Sub-Users Created"
                description="This tenant has not added any staff or manager logins."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {detail.staff.map((member) => (
                  <Card key={member.id} className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted font-bold text-foreground">
                          {member.name ? member.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{member.name}</h3>
                          <p className="font-mono text-xs text-muted-foreground">
                            {member.phone}
                          </p>
                        </div>
                      </div>
                      <Badge tone={member.active ? "success" : "neutral"}>
                        {member.active ? "Active" : "Disabled"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                      <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                        {member.role}
                      </span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: TENANT ANALYTICS (MASSIVELY UPGRADED!) */}
        {/* ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6 pb-8">
            {/* Filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PiChartLineUpBold className="size-5" />
                </div>
                <div>
                  <h2 className="text-h3 font-bold text-foreground">
                    Tenant Telemetry & Visitor Activity
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Performance stats for restaurant visits, scans, searches, and clicks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={range}
                  onChange={(e) => setRange(e.target.value as DateRange)}
                  className="w-40"
                >
                  <option value="today">Today</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="all">All Time</option>
                </Select>
              </div>
            </div>

            {loadingAnalytics ? (
              <div className="flex h-64 items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : tenantAnalytics ? (
              <div className="space-y-6">
                {/* Real-time "Today" Snapshot */}
                {tenantAnalytics.today && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex size-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                        </span>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Today&apos;s Live Activity Snapshot
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        Calendar Day to Date
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                      <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                          Today Visits
                        </p>
                        <p className="mt-1 font-mono text-xl font-extrabold text-foreground">
                          {tenantAnalytics.today.visits}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                          Today Clicks
                        </p>
                        <p className="mt-1 font-mono text-xl font-extrabold text-foreground">
                          {tenantAnalytics.today.clicks}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                          Today Searches
                        </p>
                        <p className="mt-1 font-mono text-xl font-extrabold text-foreground">
                          {tenantAnalytics.today.searches}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                          Unique Visitors
                        </p>
                        <p className="mt-1 font-mono text-xl font-extrabold text-primary">
                          {tenantAnalytics.today.visitors}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                          New Guests
                        </p>
                        <p className="mt-1 font-mono text-xl font-extrabold text-emerald-400">
                          {tenantAnalytics.today.newVisitors}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-card p-3 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                          Returning Guests
                        </p>
                        <p className="mt-1 font-mono text-xl font-extrabold text-blue-400">
                          {tenantAnalytics.today.returningVisitors}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Period Summary KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="p-5">
                    <p className="text-caption uppercase tracking-wider text-muted-foreground">
                      Total Menu Visits
                    </p>
                    <p className="mt-2 font-mono text-3xl font-extrabold text-foreground">
                      {tenantAnalytics.summary?.totalVisits ?? 0}
                    </p>
                  </Card>
                  <Card className="p-5">
                    <p className="text-caption uppercase tracking-wider text-muted-foreground">
                      Total Clicks & Actions
                    </p>
                    <p className="mt-2 font-mono text-3xl font-extrabold text-primary">
                      {tenantAnalytics.summary?.totalClicks ?? 0}
                    </p>
                  </Card>
                  <Card className="p-5">
                    <p className="text-caption uppercase tracking-wider text-muted-foreground">
                      Unique Guests
                    </p>
                    <p className="mt-2 font-mono text-3xl font-extrabold text-foreground">
                      {tenantAnalytics.summary?.uniqueVisitors ?? 0}
                    </p>
                  </Card>
                  <Card className="p-5">
                    <p className="text-caption uppercase tracking-wider text-muted-foreground">
                      Most Viewed Dish
                    </p>
                    <p className="mt-2 text-lg font-bold text-foreground truncate">
                      {tenantAnalytics.summary?.popularItem || "None yet"}
                    </p>
                  </Card>
                </div>

                {/* Click Destinations & Top Dishes */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Click breakdown */}
                  {tenantAnalytics.clickBreakdown && (
                    <Card className="p-5">
                      <h3 className="text-base font-bold text-foreground mb-4">
                        Action Destination Breakdown
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(tenantAnalytics.clickBreakdown).map(
                          ([dest, count]) => (
                            <div
                              key={dest}
                              className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-xs"
                            >
                              <span className="font-medium capitalize text-foreground">
                                {dest.replace(/_/g, " ")}
                              </span>
                              <span className="font-mono font-bold text-primary">
                                {count} clicks
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Top dishes */}
                  {tenantAnalytics.topMenuItems &&
                    tenantAnalytics.topMenuItems.length > 0 && (
                      <Card className="p-5">
                        <h3 className="text-base font-bold text-foreground mb-4">
                          Top Trending Dishes
                        </h3>
                        <div className="space-y-3">
                          {tenantAnalytics.topMenuItems.map((dish, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                            >
                              <div className="flex items-center gap-3">
                                {dish.imageUrl && (
                                  <div className="relative size-10 overflow-hidden rounded-lg">
                                    <Image
                                      src={dish.imageUrl}
                                      alt={dish.item}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs font-bold text-foreground">
                                    {dish.item}
                                  </p>
                                  <p className="font-mono text-[11px] text-muted-foreground">
                                    ${Number(dish.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                                {dish.count} views
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                </div>

                {/* Search Queries & Zero-Result Gap Signals */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Top Searches */}
                  <Card className="p-5">
                    <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                      <PiMagnifyingGlassBold className="text-primary" />
                      Guest Search Inquiries
                    </h3>
                    {Array.isArray(tenantAnalytics.topSearches) &&
                    tenantAnalytics.topSearches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tenantAnalytics.topSearches.map((s: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground"
                          >
                            <span>&quot;{s.query}&quot;</span>
                            <span className="font-mono text-[10px] text-primary">
                              ({s.count})
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No guest search keywords recorded in this period.
                      </p>
                    )}
                  </Card>

                  {/* Zero Result Searches */}
                  <Card className="p-5">
                    <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                      <PiSparkleBold className="text-amber-400" />
                      Menu Gap Inquiries (Zero Results)
                    </h3>
                    {Array.isArray(tenantAnalytics.zeroResultSearches) &&
                    tenantAnalytics.zeroResultSearches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tenantAnalytics.zeroResultSearches.map(
                          (s: any, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-950/20 px-3 py-1 text-xs font-semibold text-rose-300"
                            >
                              <span>&quot;{s.query}&quot;</span>
                              <span className="font-mono text-[10px] text-rose-400">
                                ({s.count})
                              </span>
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No missing menu dish queries identified.
                      </p>
                    )}
                  </Card>
                </div>

                {/* REAL VISITOR SESSIONS LOG (NEW!) */}
                {tenantAnalytics.visitorsList?.visitors &&
                  tenantAnalytics.visitorsList.visitors.length > 0 && (
                    <Card className="overflow-hidden">
                      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            Real Visitor Sessions Log
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Recent guest device connections and interaction telemetry
                          </p>
                        </div>
                        <Badge tone="neutral">
                          {tenantAnalytics.visitorsList.total} Total Devices
                        </Badge>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-border bg-muted/20 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                            <tr>
                              <th className="px-6 py-3">Device / OS</th>
                              <th className="px-6 py-3">Visitor Token</th>
                              <th className="px-6 py-3">IP Address</th>
                              <th className="px-6 py-3 text-center">Visits</th>
                              <th className="px-6 py-3 text-center">Clicks</th>
                              <th className="px-6 py-3 text-center">Total Events</th>
                              <th className="px-6 py-3">Last Active</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {tenantAnalytics.visitorsList.visitors.map((v, i) => (
                              <tr
                                key={i}
                                className="transition-colors hover:bg-muted/10"
                              >
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-2">
                                    {formatDeviceIcon(v.userAgent)}
                                    <span className="truncate max-w-[140px] text-muted-foreground">
                                      {v.userAgent ? v.userAgent.split(" ")[0] : "Browser"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-3 font-mono text-foreground font-semibold">
                                  {v.visitorId.slice(0, 14)}...
                                </td>
                                <td className="px-6 py-3 font-mono text-muted-foreground">
                                  {v.ipAddress || "127.0.0.1"}
                                </td>
                                <td className="px-6 py-3 text-center font-mono font-bold text-foreground">
                                  {v.visits}
                                </td>
                                <td className="px-6 py-3 text-center font-mono font-bold text-primary">
                                  {v.clicks}
                                </td>
                                <td className="px-6 py-3 text-center font-mono font-bold text-foreground">
                                  {v.totalEvents}
                                </td>
                                <td className="px-6 py-3 text-muted-foreground font-mono">
                                  {new Date(v.lastSeen).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
              </div>
            ) : (
              <EmptyState
                icon={<PiChartLineUpBold className="size-8" />}
                title="No analytics recorded"
                description="No scan or visit activity has been logged for this tenant in this period."
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SuperadminUserDetailPageComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  if (!id) return null;
  return <SuperadminUserDetailContent id={id} />;
}
