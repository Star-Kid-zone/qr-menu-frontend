'use client';

import React, { useMemo, useState } from 'react';
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
  PiEnvelopeSimpleBold,
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
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
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
import { formatDate } from "@/utils/date";

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
  const [confirmSuspend, setConfirmSuspend] = useState(false);

  const formatDeviceIcon = (ua: string | null) => {
    if (!ua) return <PiDesktopBold className="size-4 text-muted-foreground" />;
    const l = ua.toLowerCase();
    if (/ipad|tablet/.test(l))
      return <PiDeviceTabletBold className="size-4 text-warning-foreground" />;
    if (/mobi|android|iphone/.test(l))
      return <PiDeviceMobileBold className="size-4 text-success" />;
    return <PiDesktopBold className="size-4 text-info" />;
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

  // Fallback "joined" date when the account has no createdAt: read the clock once, not on every render.
  const [openedAt] = useState(() => Date.now());

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
  const restaurantName = detail.businesses?.[0]?.businessName || u.name || 'this account';
  const primaryWorkspace = detail.workspaces?.[0];

  const tabOptions = [
    { id: 'overview' as const, label: 'Profile' },
    { id: 'menus' as const, label: `Menu (${detail.menus.length})` },
    { id: 'content' as const, label: 'Website content' },
    { id: 'links' as const, label: 'Payments & links' },
    { id: 'staff' as const, label: `Team (${detail.staff?.length ?? 0})` },
    { id: 'analytics' as const, label: 'Activity' },
  ];

  return (
    <motion.div
      className="flex h-full flex-col gap-4 overflow-hidden"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      {/* Top Header & Identity Card */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={routes.superadmin.users}
            aria-label="Back to Restaurants"
            title="Back to Restaurants"
            className="flex size-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
          >
            <PiArrowLeftBold aria-hidden className="size-5" />
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {primaryWorkspace?.public_slug && (
              <>
                <a
                  href={buildPublicLandingUrl(primaryWorkspace.public_slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
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
              className="border-warning/40 bg-warning/10 text-warning-foreground hover:bg-warning/20 dark:text-warning font-semibold"
              leftIcon={<PiUserSwitchBold size={14} className="text-warning-foreground dark:text-warning" />}
              title="Sign in directly as this tenant to manage or troubleshoot their workspace"
            >
              Sign in as this restaurant
            </Button>

            <Button
              variant={u.active ? 'secondary' : 'primary'}
              size="sm"
              loading={statusUpdating}
              onClick={() => (u.active ? setConfirmSuspend(true) : void handleToggleStatus())}
              leftIcon={
                u.active ? (
                  <PiLockSimpleBold size={14} />
                ) : (
                  <PiLockKeyOpenBold size={14} />
                )
              }
            >
              {u.active ? 'Suspend account' : 'Reactivate account'}
            </Button>
            <ConfirmationDialog
              isOpen={confirmSuspend}
              onClose={() => setConfirmSuspend(false)}
              onConfirm={async () => {
                await handleToggleStatus();
                setConfirmSuspend(false);
              }}
              loading={statusUpdating}
              title={`Suspend ${restaurantName}?`}
              description="The owner and their team are signed out and can't sign in, and the restaurant's website and menu stop working for guests. You can reactivate the account later."
              confirmLabel="Suspend account"
              typeToConfirm={restaurantName}
            />
          </div>
        </div>

        {/* Tenant Profile Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-neu-inset-sm">
              <PiUserBold className="size-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-h1 font-bold text-foreground">
                  {restaurantName}
                </h1>
                <Badge tone={u.active ? 'success' : 'neutral'}>
                  {u.active ? 'Active' : 'Frozen'}
                </Badge>
                <span className="rounded-md bg-accent px-3 py-0.5 font-mono text-caption font-bold text-accent-foreground">
                  {u.role}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted-foreground">
                <span className="flex items-center gap-2 font-medium">
                  <PiEnvelopeSimpleBold className="size-3.5" />
                  {u.email}
                </span>
                <span>•</span>
                <span>ID #{u.id}</span>
                <span>•</span>
                <span>
                  Joined{' '}
                  {formatDate((u.createdAt as string) || openedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-center">
              <p className="text-overline text-muted-foreground">
                Dishes
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                {detail.counts.menus}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-center">
              <p className="text-overline text-muted-foreground">
                Photos
              </p>
              <p className="font-mono text-base font-bold text-primary">
                {detail.counts.gallery ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-center">
              <p className="text-overline text-muted-foreground">
                Offers
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                {detail.counts.offers ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-center">
              <p className="text-overline text-muted-foreground">
                Team
              </p>
              <p className="font-mono text-base font-bold text-foreground">
                {detail.counts.staff_members}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-center">
              <p className="text-overline text-muted-foreground">
                Guest actions
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
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5 pb-6">
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

        {activeTab === 'content' && (
          <UserGalleryTab
            detail={detail}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            copyToClipboard={copyToClipboard}
          />
        )}

        

        {activeTab === 'content' && <div className="mt-8"><UserOffersTab detail={detail} /></div>}

        {activeTab === 'content' && (
          <div className="mt-8"><UserFeedbackTab
            detail={detail}
            feedbackSubTab={feedbackSubTab}
            setFeedbackSubTab={setFeedbackSubTab}
          /></div>
        )}

        {activeTab === 'links' && (
          <UserPaymentsReviewsTab
            detail={detail}
            paymentForm={paymentForm}
            setPaymentForm={setPaymentForm}
            paymentSaving={paymentSaving}
            handleSavePaymentReview={handleSavePaymentReview}
          />
        )}

        {activeTab === 'links' && <div className="mt-8"><TenantRedirectsPanel userId={userId} /></div>}

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
