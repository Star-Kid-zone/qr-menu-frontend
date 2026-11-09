"use client";

import React from "react";
import Link from "next/link";
import {
  PiNotebookBold,
  PiSparkleBold,
  PiPlusBold,
  PiArrowsClockwiseBold,
} from "react-icons/pi";
import { Button, EmptyState, PageHeader, Spinner } from "@/components/ui";
import { cn } from "@/utils/cn";
import { routes } from "@/config/routes";
import { PromptCard } from "./PromptCard";
import { PromptModal } from "./PromptModal";
import { PromptLightbox } from "./PromptLightbox";
import { usePromptsState } from "../hooks/usePromptsState";
import {
  PromptMetricsBar,
  PromptFiltersBar,
  PromptCategoriesBar,
} from "./sections";

export function PromptsPage() {
  const {
    prompts,
    categories,
    loading,
    actionLoading,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    favoritesOnly,
    setFavoritesOnly,
    copiedId,
    previewImageUrl,
    setPreviewImageUrl,
    isModalOpen,
    setIsModalOpen,
    editingPrompt,
    modalForm,
    setModalForm,
    uploadingRefImage,
    metrics,
    handleCopyPrompt,
    handleUseInStudio,
    handleToggleFavorite,
    handleDeletePrompt,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleUploadRefImage,
    handleSavePrompt,
    handleResetDefaults,
    confirmDialog,
  } = usePromptsState();

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <PageHeader
        title="Prompt library"
        description={`${prompts.length} prompt templates across ${Math.max(categories.length, 1)} culinary categories`}
        actions={
          <div className="flex items-center gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              disabled={actionLoading}
              leftIcon={<PiArrowsClockwiseBold className="h-3.5 w-3.5" />}
            >
              <span className="hidden sm:inline">Load Presets</span>
            </Button>

            <Link href={routes.superadmin.creativeStudio}>
              <Button variant="outline" size="sm" leftIcon={<PiSparkleBold className="h-3.5 w-3.5 text-primary" />}>
                <span className="hidden sm:inline">Go to Studio</span>
              </Button>
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateModal}
              leftIcon={<PiPlusBold className="h-3.5 w-3.5" />}
            >
              <span>New Prompt</span>
            </Button>
          </div>
        }
      />

      {/* Metrics Strip */}
      <PromptMetricsBar metrics={metrics} />

      {/* Search & Categories */}
      <div className="shrink-0 space-y-2 rounded-xl border border-border bg-card p-3 shadow-xs sm:p-3">
        <PromptFiltersBar
          selectedMediaType={selectedMediaType}
          setSelectedMediaType={setSelectedMediaType}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <PromptCategoriesBar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalPrompts={prompts.length}
        />
      </div>

      {/* Content View */}
      <div className={cn("min-h-0 flex-1 overflow-hidden", prompts.length === 0 && "flex flex-col")}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Spinner size="lg" />
            <p className="text-sm">Loading prompt library...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiNotebookBold size={32} />}
              title="No Prompts Found"
              description="Create your first reusable restaurant prompt or load our curated default culinary presets."
              action={
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
                    <PiPlusBold className="h-4 w-4 mr-2" />
                    Create New Prompt
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetDefaults}>
                    Load Curated Presets
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-0.5 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {prompts.map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={p}
                  copiedId={copiedId}
                  onCopy={handleCopyPrompt}
                  onUseInStudio={handleUseInStudio}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeletePrompt}
                  onPreviewRef={setPreviewImageUrl}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROMPT MODAL */}
      <PromptModal
        isOpen={isModalOpen}
        editingPrompt={editingPrompt}
        form={modalForm}
        setForm={setModalForm}
        actionLoading={actionLoading}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePrompt}
        onUploadRefImage={handleUploadRefImage}
        uploadingRefImage={uploadingRefImage}
      />

      {/* IMAGE LIGHTBOX MODAL */}
      <PromptLightbox
        imageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />
      {confirmDialog}
    </div>
  );
}
