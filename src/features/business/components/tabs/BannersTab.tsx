"use client";

import React from "react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { PiMegaphoneBold, PiPencilSimpleBold, PiPlusBold } from "react-icons/pi";
import { BannerAnnouncementForm } from "@/features/workspace";
import type { BannerAnnouncementValues } from "@/types/components/admin/workspace/BannerAnnouncementForm.types";
import type { WorkspaceSetting } from "@/types/workspace.types";
import { INLINE_BANNER_FORM_ID } from "../../types";

interface BannersTabProps {
  workspace: WorkspaceSetting | null;
  bannersEditMode: boolean;
  setBannersEditMode: (val: boolean) => void;
  bannersSaveLoading: boolean;
  bannersSaveError: string | null;
  setBannersSaveError: (val: string | null) => void;
  bannerFormInitialValues: BannerAnnouncementValues;
  handleBannerSave: (values: BannerAnnouncementValues) => Promise<void>;
  setBannerDraft: (val: BannerAnnouncementValues | null) => void;
  onOpenAddWorkspaceModal: () => void;
}

export function BannersTab({
  workspace,
  bannersEditMode,
  setBannersEditMode,
  bannersSaveLoading,
  bannersSaveError,
  setBannersSaveError,
  bannerFormInitialValues,
  handleBannerSave,
  setBannerDraft,
  onOpenAddWorkspaceModal,
}: BannersTabProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Banners"
        description="Manage global workspace announcements."
        actions={
          workspace ? (
            bannersEditMode ? (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setBannersEditMode(false);
                    setBannersSaveError(null);
                  }}
                  disabled={bannersSaveLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  form={INLINE_BANNER_FORM_ID}
                  loading={bannersSaveLoading}
                  className="w-full sm:w-auto"
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setBannersSaveError(null);
                  setBannersEditMode(true);
                }}
                startIcon={<PiPencilSimpleBold className="size-4" />}
              >
                Edit
              </Button>
            )
          ) : null
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {workspace ? (
          <BannerAnnouncementForm
            formId={INLINE_BANNER_FORM_ID}
            isOpen={bannersEditMode}
            readOnly={!bannersEditMode}
            compact
            initialValues={bannerFormInitialValues}
            onSubmit={handleBannerSave}
            error={bannersSaveError}
            loading={bannersSaveLoading}
            onValuesChange={setBannerDraft}
          />
        ) : (
          <EmptyState
            icon={<PiMegaphoneBold className="size-8" />}
            title="Create a workspace first"
            description="Banners are tied to a shared workspace configuration."
            action={
              <Button
                onClick={onOpenAddWorkspaceModal}
                startIcon={<PiPlusBold className="size-5" />}
              >
                Create workspace
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
