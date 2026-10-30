'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PiArrowLeftBold,
  PiArrowSquareOutBold,
  PiUserBold,
  PiUserSwitchBold,
  PiStorefrontBold,
  PiInfoBold,
  PiGlobeBold,
  PiLockSimpleBold,
  PiLockKeyOpenBold,
  PiPhoneBold,
  PiDesktopBold,
  PiDeviceMobileBold,
  PiDeviceTabletBold,
} from 'react-icons/pi';
import { routes } from '@/config/routes';
import { buildPublicLandingUrl, buildPublicMenuUrl } from '@/utils/tenantHost';
import {
  Badge,
  Button,
  SubTabPills,
  EmptyState,
} from '@/components/ui';
import { fadeIn } from '@/lib/motion';

import type { UserDetailTabId } from '../types';
import { useUserDetailState } from '../hooks/useUserDetailState';
import { UserOverviewTab } from './UserOverviewTab';
import { UserMenusTab } from './UserMenusTab';
import { UserGalleryTab } from './UserGalleryTab';
import { UserOffersTab } from './UserOffersTab';
import { UserFeedbackTab } from './UserFeedbackTab';
import { UserPaymentsReviewsTab } from './UserPaymentsReviewsTab';
import { UserStaffTab } from './UserStaffTab';
import { UserAnalyticsTab } from './UserAnalyticsTab';
import { TenantRedirectsPanel } from './TenantRedirectsPanel';

export interface UserDetailPageProps {
  id: string;
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const userId = Number(id);
  const reduceMotion = useReducedMotion();

  const {
    detail,
    tenantAnalytics,
    range,
    setRange,
    activeTab,
    setActiveTab,
    feedbackSubTab,
    setFeedbackSubTab,
    loading,
    loadingAnalytics,
    error,
    impersonating,
    statusUpdating,
    previewImage,
    setPreviewImage,
    menuSearch,
    setMenuSearch,
    selectedCategory,
    setSelectedCategory,
    editingItem,
    setEditingItem,
    menuSaving,
    blueprintModalOpen,
    setBlueprintModalOpen,
    availableBlueprints,
    selectedBpId,
    setSelectedBpId,
    bpMode,
    setBpMode,
    applyingBp,
    isEditingBusiness,
    setIsEditingBusiness,
    businessForm,
    setBusinessForm,
    businessSaving,
    paymentForm,
    setPaymentForm,
    paymentSaving,
    isEditingWorkspace,
    setIsEditingWorkspace,
    workspaceForm,
    setWorkspaceForm,
    workspaceSaving,
    handleToggleStatus,
    handleImpersonate,
    handleSaveWorkspaceFeatures,
    handleToggleMenuAvailability,
    handleSaveMenuItem,
    handleOpenBlueprintModal,
    handleApplyBlueprint,
    handleSaveBusiness,
    handleSavePaymentReview,
    copyToClipboard,
  } = useUserDetailState({ userId });

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
        selectedCategory === 'all' || m.category === selectedCategory;
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
          description={error || 'Could not retrieve tenant account details.'}
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
  const primaryWorkspace = detail.workspaces?.[0];

  const tabOptions = [
    { id: 'overview' as const, label: 'Overview & Branding' },
    { id: 'menus' as const, label: `Menus (${detail.menus.length})` },
    { id: 'gallery' as const, label: `Gallery (${detail.gallery?.length ?? 0})` },
    { id: 'offers' as const, label: `Offers (${detail.offers?.length ?? 0})` },
    {
      id: 'feedback' as const,
      label: `Reviews & FAQs (${
        (detail.googleReviews?.length ?? 0) +
        (detail.faqs?.length ?? 0)
      })`,
    },
    { id: 'payments_reviews' as const, label: 'Payments & QR' },
    {
      id: 'staff' as const,
      label: `Sub-Users / Staff (${detail.staff?.length ?? 0})`,
    },
    { id: 'redirects' as const, label: 'Redirects' },
    { id: 'analytics' as const, label: 'Tenant Analytics' },
  ];

  return (
    <motion.div
      className="flex h-full flex-col gap-5 overflow-hidden"
      initial={reduceMotion ? false : 'hidden'}
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
                    Landing:{' '}
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
              variant={u.active ? 'secondary' : 'primary'}
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
              {u.active ? 'Freeze Account' : 'Activate Account'}
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
                  {u.name || 'Untitled User'}
                </h1>
                <Badge tone={u.active ? 'success' : 'neutral'}>
                  {u.active ? 'Active' : 'Frozen'}
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
                  Joined{' '}
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
            onChange={(tabId) => setActiveTab(tabId as UserDetailTabId)}
          />
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {activeTab === 'overview' && (
          <UserOverviewTab
            detail={detail}
            businessForm={businessForm}
            setBusinessForm={setBusinessForm}
            isEditingBusiness={isEditingBusiness}
            setIsEditingBusiness={setIsEditingBusiness}
            businessSaving={businessSaving}
            handleSaveBusiness={handleSaveBusiness}
            workspaceForm={workspaceForm}
            setWorkspaceForm={setWorkspaceForm}
            isEditingWorkspace={isEditingWorkspace}
            setIsEditingWorkspace={setIsEditingWorkspace}
            workspaceSaving={workspaceSaving}
            handleSaveWorkspaceFeatures={handleSaveWorkspaceFeatures}
          />
        )}

        {activeTab === 'menus' && (
          <UserMenusTab
            userId={userId}
            detail={detail}
            filteredMenus={filteredMenus}
            categories={categories}
            menuSearch={menuSearch}
            setMenuSearch={setMenuSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            handleToggleMenuAvailability={handleToggleMenuAvailability}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            menuSaving={menuSaving}
            handleSaveMenuItem={handleSaveMenuItem}
            blueprintModalOpen={blueprintModalOpen}
            setBlueprintModalOpen={setBlueprintModalOpen}
            handleOpenBlueprintModal={handleOpenBlueprintModal}
            availableBlueprints={availableBlueprints}
            selectedBpId={selectedBpId}
            setSelectedBpId={setSelectedBpId}
            bpMode={bpMode}
            setBpMode={setBpMode}
            applyingBp={applyingBp}
            handleApplyBlueprint={handleApplyBlueprint}
          />
        )}

        {activeTab === 'gallery' && (
          <UserGalleryTab
            detail={detail}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            copyToClipboard={copyToClipboard}
          />
        )}

        {activeTab === 'redirects' && <TenantRedirectsPanel userId={userId} />}

        {activeTab === 'offers' && <UserOffersTab detail={detail} />}

        {activeTab === 'feedback' && (
          <UserFeedbackTab
            detail={detail}
            feedbackSubTab={feedbackSubTab}
            setFeedbackSubTab={setFeedbackSubTab}
          />
        )}

        {activeTab === 'payments_reviews' && (
          <UserPaymentsReviewsTab
            detail={detail}
            paymentForm={paymentForm}
            setPaymentForm={setPaymentForm}
            paymentSaving={paymentSaving}
            handleSavePaymentReview={handleSavePaymentReview}
          />
        )}

        {activeTab === 'staff' && <UserStaffTab detail={detail} />}

        {activeTab === 'analytics' && (
          <UserAnalyticsTab
            range={range}
            setRange={setRange}
            loadingAnalytics={loadingAnalytics}
            tenantAnalytics={tenantAnalytics}
            formatDeviceIcon={formatDeviceIcon}
          />
        )}
      </div>
    </motion.div>
  );
}
