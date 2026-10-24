"use client";

import React, { Suspense } from "react";
import { PiDeviceMobileBold, PiXBold } from "react-icons/pi";
import { ConfirmDeleteModal, ScrollableTabRow } from "@/shared/components";
import { businessService } from "@/services";
import {
  AddSettingModal,
  PhonePreview,
  LandingPreviewRenderer,
  MenuPreviewRenderer,
} from "@/features/workspace";
import { cn } from "@/utils/cn";
import { useBusinessHubState } from "../hooks/useBusinessHubState";
import { WebsiteTab } from "./tabs/WebsiteTab";
import { BusinessesTab } from "./tabs/BusinessesTab";
import { PublicSiteTab } from "./tabs/PublicSiteTab";
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
    deleteModalOpen,
    setDeleteModalOpen,
    deleteBusinessId,
    setDeleteBusinessId,
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
    industries,
    setWorkspaceDraft,
    setBusinessDraft,
    setBannerDraft,
    workspaceFormInitialValues,
    bannerFormInitialValues,
    previewLandingUrl,
    previewMenuUrl,
    previewDefaultView,
    previewData,
    fetchWorkspaceData,
    handleWorkspaceSave,
    handleBannerSave,
    handleContentSave,
    handleUpdateBusiness,
    copyToClipboard,
  } = useBusinessHubState();

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
            industries={industries}
            setBusinessDraft={setBusinessDraft}
            onUpdateBusiness={handleUpdateBusiness}
          />
        );
      case "public-site":
        return (
          <PublicSiteTab
            workspace={workspace}
            publicSiteEditMode={publicSiteEditMode}
            setPublicSiteEditMode={setPublicSiteEditMode}
            slugDraft={slugDraft}
            setSlugDraft={setSlugDraft}
            slugSaving={slugSaving}
            setSlugSaving={setSlugSaving}
            setSlugError={setSlugError}
            canSaveSlug={canSaveSlug}
            slugAvailabilityLabel={slugAvailabilityLabel}
            onRefreshData={fetchWorkspaceData}
            onOpenAddWorkspaceModal={() => setAddWorkspaceModalOpen(true)}
            copyToClipboard={copyToClipboard}
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
        <div className="shrink-0">
          <div className="w-full rounded-xl border border-border bg-card p-1.5 shadow-sm">
            <ScrollableTabRow
              activeKey={activeTab}
              role="tablist"
              aria-label="Website sections"
              scrollContainerClassName="gap-1"
            >
              {visibleTabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    data-tab-active={selected || undefined}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                      selected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <span className="shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </ScrollableTabRow>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">{renderPanel()}</div>
      </div>

      {/* Desktop Preview Column */}
      <aside className="hidden w-[320px] shrink-0 lg:block">
        <PhonePreview
          landingUrl={previewLandingUrl}
          menuUrl={previewMenuUrl}
          defaultView={previewDefaultView}
          renderLanding={() => <LandingPreviewRenderer data={previewData} />}
          renderMenu={() => <MenuPreviewRenderer data={previewData} />}
        />
      </aside>

      {/* Floating Action Button for Mobile Preview */}
      <button
        type="button"
        onClick={() => setMobilePreviewOpen(true)}
        aria-label="Open live mobile preview"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 lg:hidden cursor-pointer"
      >
        <PiDeviceMobileBold size={17} />
        <span>Preview</span>
      </button>

      {/* Mobile Live Preview Modal Sheet */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs lg:hidden">
          <div className="flex max-h-[92vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <PiDeviceMobileBold size={14} />
                </div>
                <p className="text-xs font-bold text-foreground">Live Mobile Preview</p>
              </div>
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(false)}
                aria-label="Close preview"
                className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <PiXBold size={14} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <PhonePreview
                landingUrl={previewLandingUrl}
                menuUrl={previewMenuUrl}
                defaultView={previewDefaultView}
                renderLanding={() => <LandingPreviewRenderer data={previewData} />}
                renderMenu={() => <MenuPreviewRenderer data={previewData} />}
              />
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && deleteBusinessId && (
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteBusinessId(null);
          }}
          onConfirm={async () => {
            await businessService.deleteBusiness(deleteBusinessId);
          }}
          onSuccess={fetchWorkspaceData}
          entityName="business profile"
          description="Are you sure you want to delete this business profile? This action will permanently remove all associated data and cannot be undone."
        />
      )}

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
