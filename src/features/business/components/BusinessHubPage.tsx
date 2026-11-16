"use client";

import React, { Suspense, useEffect, useState } from "react";
import { categoriesInItemOrder } from "@/components/templates/sections/menu/categories";
import { useRouter, useSearchParams } from "next/navigation";
import { PiDeviceMobileBold, PiWarningCircle } from "react-icons/pi";
import { Modal } from "@/components/Modal";
import { SubTabPills } from "@/components/ui";
import { MOVED_TABS, WEBSITE_SECTIONS } from "../constants";
import type { WorkspaceTabId } from "../types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AddSettingModal,
  PhonePreview,
  LandingPreviewRenderer,
  MenuPreviewRenderer,
} from "@/features/workspace";
import { cn } from "@/utils/cn";
import { resolveMenuPart } from "@/features/workspace/menuParts";
import { resolveLandingPart } from "@/features/workspace/landingParts";
import type { StudioPartFocus } from "@/features/workspace/studio/resolvePart";
import { useBusinessHubState } from "../hooks/useBusinessHubState";
import { WebsiteTab } from "./tabs/WebsiteTab";
import { BusinessesTab } from "./tabs/BusinessesTab";
import { BannersTab } from "./tabs/BannersTab";
import { OffersTab } from "./tabs/OffersTab";
import { GalleryTab } from "./tabs/GalleryTab";
import { ContentTab } from "./tabs/ContentTab";
import { FaqsTab } from "./tabs/FaqsTab";
import { ReviewsTab } from "./tabs/ReviewsTab";

function BusinessHubPageContent() {
  const {
    activeTab,
    setActiveTab,
    visibleTabs,
    businesses,
    workspace,
    workspaceGallery,
    workspaceOffers,
    workspaceFaqs,
    workspaceGoogleReviews,
    contentDraft,
    setContentDraft,
    savedContentDraft,
    contentEditMode,
    setContentEditMode,
    contentSaveLoading,
    setContentSaveError,
    businessEditMode,
    setBusinessEditMode,
    businessSection,
    setBusinessSection,
    workspaceDesignSection,
    setWorkspaceDesignSection,
    businessFormLoading,
    setBusinessFormLoading,
    publicSiteEditMode,
    setPublicSiteEditMode,
    slugDraft,
    setSlugDraft,
    slugSaving,
    setSlugSaving,
    setSlugError,
    canSaveSlug,
    slugAvailabilityLabel,
    listOffersRef,
    listGalleryRef,
    listFaqsRef,
    addWorkspaceModalOpen,
    setAddWorkspaceModalOpen,
    mobilePreviewOpen,
    setMobilePreviewOpen,
    workspaceEditMode,
    setWorkspaceEditMode,
    workspaceActiveSubSection,
    setWorkspaceActiveSubSection,
    bannersEditMode,
    setBannersEditMode,
    workspaceCurrencies,
    workspaceSaveLoading,
    workspaceSaveError,
    setWorkspaceSaveError,
    bannersSaveLoading,
    bannersSaveError,
    setBannersSaveError,
    setWorkspaceDraft,
    setBusinessDraft,
    setBannerDraft,
    workspaceFormInitialValues,
    bannerFormInitialValues,
    previewLandingUrl,
    previewMenuUrl,
    previewDefaultView,
    previewData,
    workspaceMenuItems,
    fetchWorkspaceData,
    handleWorkspaceSave,
    handleBannerSave,
    handleContentSave,
    handleUpdateBusiness,
    copyToClipboard,
    canEdit,
    loadError,
    isInitialLoading,
    isRefreshing,
  } = useBusinessHubState();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Tapping the preview while editing opens the settings for that part of the page.
  const [focusedPart, setFocusedPart] = useState<StudioPartFocus | null>(null);
  const pickEnabled = activeTab === "workspace" && workspaceEditMode;
  const pickPart = (resolve: (t: Element, v: Record<string, unknown>) => string) => (target: Element) =>
    setFocusedPart((prev) => ({
      part: resolve(target, previewData.settings as Record<string, unknown>),
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  const handleMenuPick = pickEnabled && workspaceDesignSection === "menu" ? pickPart(resolveMenuPart) : undefined;
  const handleLandingPick = pickEnabled && workspaceDesignSection === "landing" ? pickPart(resolveLandingPart) : undefined;

  // Panels that moved off this page keep their old links working.
  const requestedTab = searchParams?.get("tab") as WorkspaceTabId | null;
  const movedTo = requestedTab ? MOVED_TABS[requestedTab] : undefined;
  useEffect(() => {
    if (movedTo) router.replace(movedTo);
  }, [movedTo, router]);

  const visibleSections = WEBSITE_SECTIONS.map((section) => ({
    ...section,
    tabs: section.tabs.filter((id) => visibleTabs.some((t) => t.id === id)),
  })).filter((section) => section.tabs.length > 0);
  const activeSection = visibleSections.find((s) => s.tabs.includes(activeTab)) ?? visibleSections[0];

  // A failed load must never fall through to the first-run "create" state,
  // which would invite the owner to create a second website.
  if (loadError && !workspace) {
    return (
      <EmptyState
        icon={<PiWarningCircle className="size-7" />}
        title="We couldn't load your website settings"
        description={loadError}
        action={
          <Button onClick={() => void fetchWorkspaceData()} loading={isRefreshing}>
            Try again
          </Button>
        }
      />
    );
  }

  if (isInitialLoading) {
    return (
      <div className="flex h-full w-full gap-4" aria-busy="true" aria-label="Loading website settings">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Skeleton className="hidden h-[560px] w-[320px] shrink-0 rounded-xl lg:block" />
      </div>
    );
  }

  const renderPanel = () => {
    switch (activeTab) {
      case "workspace":
        return (
          <WebsiteTab
            workspace={workspace}
            workspaceEditMode={workspaceEditMode}
            setWorkspaceEditMode={setWorkspaceEditMode}
            workspaceActiveSubSection={workspaceActiveSubSection}
            setWorkspaceActiveSubSection={setWorkspaceActiveSubSection}
            workspaceSaveLoading={workspaceSaveLoading}
            workspaceSaveError={workspaceSaveError}
            setWorkspaceSaveError={setWorkspaceSaveError}
            workspaceDesignSection={workspaceDesignSection}
            setWorkspaceDesignSection={setWorkspaceDesignSection}
            workspaceFormInitialValues={workspaceFormInitialValues}
            handleWorkspaceSave={handleWorkspaceSave}
            workspaceCurrencies={workspaceCurrencies}
            setWorkspaceDraft={setWorkspaceDraft}
            onOpenAddWorkspaceModal={() => setAddWorkspaceModalOpen(true)}
            focusedPart={focusedPart}
            onSiteRestored={() => fetchWorkspaceData()}
            menuCategories={categoriesInItemOrder(workspaceMenuItems as Array<{ category?: string | null }>)}
          />
        );
      case "businesses":
        return (
          <BusinessesTab
            businesses={businesses}
            businessEditMode={businessEditMode}
            setBusinessEditMode={setBusinessEditMode}
            businessSection={businessSection}
            setBusinessSection={setBusinessSection}
            businessFormLoading={businessFormLoading}
            setBusinessFormLoading={setBusinessFormLoading}
            setBusinessDraft={setBusinessDraft}
            onUpdateBusiness={handleUpdateBusiness}
          />
        );
      case "banners":
        return (
          <BannersTab
            workspace={workspace}
            bannersEditMode={bannersEditMode}
            setBannersEditMode={setBannersEditMode}
            bannersSaveLoading={bannersSaveLoading}
            bannersSaveError={bannersSaveError}
            setBannersSaveError={setBannersSaveError}
            bannerFormInitialValues={bannerFormInitialValues}
            handleBannerSave={handleBannerSave}
            setBannerDraft={setBannerDraft}
            onOpenAddWorkspaceModal={() => setAddWorkspaceModalOpen(true)}
          />
        );
      case "offers":
        return (
          <OffersTab
            listOffersRef={listOffersRef}
            workspaceOffers={workspaceOffers}
            workspace={workspace}
            onRefreshData={fetchWorkspaceData}
          />
        );
      case "gallery":
        return (
          <GalleryTab
            listGalleryRef={listGalleryRef}
            workspaceGallery={workspaceGallery}
            onRefreshData={fetchWorkspaceData}
          />
        );
      case "content":
        return (
          <ContentTab
            workspace={workspace}
            contentDraft={contentDraft}
            setContentDraft={setContentDraft}
            savedContentDraft={savedContentDraft}
            contentEditMode={contentEditMode}
            setContentEditMode={setContentEditMode}
            contentSaveLoading={contentSaveLoading}
            setContentSaveError={setContentSaveError}
            onSaveContent={handleContentSave}
          />
        );
      case "faqs":
        return (
          <FaqsTab
            listFaqsRef={listFaqsRef}
            workspaceFaqs={workspaceFaqs}
            onRefreshData={fetchWorkspaceData}
          />
        );
      case "reviews":
        return (
          <ReviewsTab
            workspaceGoogleReviews={workspaceGoogleReviews}
            onRefreshGoogleReviews={fetchWorkspaceData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full gap-4">
      <div className="flex h-full min-w-0 flex-1 flex-col gap-4">
        <nav aria-label="Website sections" className="shrink-0 space-y-3">
          <div role="tablist" className="flex gap-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-border">
            {visibleSections.map((section) => {
              const selected = section.id === activeSection?.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(section.tabs[0])}
                  className={cn(
                    "-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-body-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    selected
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
          {activeSection && activeSection.tabs.length > 1 ? (
            <SubTabPills
              options={activeSection.tabs
                .map((id) => visibleTabs.find((t) => t.id === id))
                .filter((t): t is NonNullable<typeof t> => Boolean(t))
                .map((t) => ({ id: t.id, label: t.label }))}
              active={activeTab}
              onChange={(id) => setActiveTab(id as WorkspaceTabId)}
            />
          ) : null}
        </nav>
        {!canEdit && (
          <Notice tone="info" className="shrink-0">
            You can view these settings. Only the owner or a manager can change them.
          </Notice>
        )}
        {loadError && (
          <Notice
            tone="error"
            className="shrink-0"
            action={
              <Button size="sm" variant="secondary" onClick={() => void fetchWorkspaceData()} loading={isRefreshing}>
                Try again
              </Button>
            }
          >
            Couldn&apos;t refresh your website settings. You&apos;re seeing the last version that loaded.
          </Notice>
        )}

        <div className="min-h-0 flex-1 overflow-hidden" data-readonly={canEdit ? undefined : ""}>
          {renderPanel()}
        </div>
      </div>

      {/* Desktop Preview Column (the QR section has its own preview) */}
      <aside className={cn("hidden w-[320px] shrink-0", "lg:block")}>
        <PhonePreview
          landingUrl={previewLandingUrl}
          menuUrl={previewMenuUrl}
          defaultView={previewDefaultView}
          renderLanding={() => <LandingPreviewRenderer data={previewData} />}
          renderMenu={() => <MenuPreviewRenderer data={previewData} />}
          onLandingPick={handleLandingPick}
          onMenuPick={handleMenuPick}
        />
      </aside>

      {/* Floating Action Button for Mobile Preview */}
      <button
        type="button"
        onClick={() => setMobilePreviewOpen(true)}
        aria-label="Open live mobile preview"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 lg:hidden cursor-pointer"
      >
        <PiDeviceMobileBold size={17} />
        <span>Preview</span>
      </button>

      {/* Mobile live preview */}
      <Modal
        isOpen={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
        title="Preview"
        maxWidth="max-w-sm"
      >
        <PhonePreview
          landingUrl={previewLandingUrl}
          menuUrl={previewMenuUrl}
          defaultView={previewDefaultView}
          renderLanding={() => <LandingPreviewRenderer data={previewData} />}
          renderMenu={() => <MenuPreviewRenderer data={previewData} />}
          onLandingPick={handleLandingPick}
          onMenuPick={handleMenuPick}
        />
      </Modal>


      {addWorkspaceModalOpen ? (
        <Suspense fallback={null}>
          <AddSettingModal
            isOpen={addWorkspaceModalOpen}
            onClose={() => setAddWorkspaceModalOpen(false)}
            onSettingAdded={fetchWorkspaceData}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

export function BusinessHubPage() {
  return (
    <Suspense fallback={null}>
      <BusinessHubPageContent />
    </Suspense>
  );
}
