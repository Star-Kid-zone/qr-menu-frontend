"use client";

import React, { useState } from "react";
import { Button, EmptyState, PageHeader, SubTabPills } from "@/components/ui";
import { PiClockCounterClockwiseBold, PiPencilSimpleBold, PiPlusBold, PiSwatchesBold } from "react-icons/pi";
import { WorkspaceSettingsForm } from "@/features/workspace";
import { SiteHistoryModal } from "@/features/workspace/components/SiteHistoryModal";
import type { StudioPartFocus } from "@/features/workspace/studio/resolvePart";
import type {
  WorkspaceSetting,
  WorkspaceSettingsFormValues,
} from "@/types/admin/workspace/workspace.types";
import type { Currency } from "@/types";
import { INLINE_WORKSPACE_FORM_ID } from "@/constants/site.constants";

interface WebsiteTabProps {
  workspace: WorkspaceSetting | null;
  workspaceEditMode: boolean;
  setWorkspaceEditMode: (val: boolean) => void;
  workspaceActiveSubSection: string | null;
  setWorkspaceActiveSubSection: (val: string | null) => void;
  workspaceSaveLoading: boolean;
  workspaceSaveError: string | null;
  setWorkspaceSaveError: (val: string | null) => void;
  workspaceDesignSection: "landing" | "menu";
  setWorkspaceDesignSection: (val: "landing" | "menu") => void;
  workspaceFormInitialValues: WorkspaceSettingsFormValues;
  handleWorkspaceSave: (values: WorkspaceSettingsFormValues) => Promise<void>;
  workspaceCurrencies: Currency[];
  setWorkspaceDraft: (val: WorkspaceSettingsFormValues | null) => void;
  onOpenAddWorkspaceModal: () => void;
  focusedPart?: StudioPartFocus | null;
  menuCategories?: readonly string[];
  /** Reload settings after a layout version is restored. */
  onSiteRestored?: () => void | Promise<void>;
}

export function WebsiteTab({
  workspace,
  workspaceEditMode,
  setWorkspaceEditMode,
  workspaceActiveSubSection,
  setWorkspaceActiveSubSection,
  workspaceSaveLoading,
  workspaceSaveError,
  setWorkspaceSaveError,
  workspaceDesignSection,
  setWorkspaceDesignSection,
  workspaceFormInitialValues,
  handleWorkspaceSave,
  workspaceCurrencies,
  setWorkspaceDraft,
  onOpenAddWorkspaceModal,
  focusedPart,
  menuCategories,
  onSiteRestored,
}: WebsiteTabProps) {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <PageHeader
        title="Website"
        className="shrink-0"
        actions={
          workspace ? (
            workspaceEditMode ? (
              // Distinct keys: if React reused the Edit <button> as Save (type="submit"), the click
              // that entered edit mode would also submit the form and save immediately.
              <div key="edit-actions" className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setWorkspaceEditMode(false);
                    setWorkspaceActiveSubSection(null);
                    setWorkspaceSaveError(null);
                  }}
                  disabled={workspaceSaveLoading}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form={INLINE_WORKSPACE_FORM_ID}
                  loading={workspaceSaveLoading}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div key="view-actions" className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setHistoryOpen(true)}
                  startIcon={<PiClockCounterClockwiseBold className="size-4" />}
                  size="sm"
                >
                  History
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setWorkspaceSaveError(null);
                    setWorkspaceActiveSubSection(null);
                    setWorkspaceEditMode(true);
                  }}
                  startIcon={<PiPencilSimpleBold className="size-4" />}
                  size="sm"
                >
                  Edit
                </Button>
              </div>
            )
          ) : null
        }
      />

      {workspace && (
        <SubTabPills
          options={[
            { id: "landing", label: "Landing page" },
            { id: "menu", label: "Menu page" },
          ]}
          active={workspaceDesignSection}
          onChange={setWorkspaceDesignSection}
        />
      )}

      <div className="min-h-0 flex-1">
        {workspace ? (
          <div className="h-full overflow-y-auto rounded-lg border border-border bg-card p-4 pr-3 md:p-6">
            <WorkspaceSettingsForm
              key={`${workspace.id}-${workspaceEditMode}`}
              formId={INLINE_WORKSPACE_FORM_ID}
              isOpen={workspaceEditMode}
              readOnly={!workspaceEditMode}
              compact
              section={workspaceDesignSection}
              initialValues={workspaceFormInitialValues}
              onSubmit={handleWorkspaceSave}
              error={workspaceSaveError}
              loading={workspaceSaveLoading}
              currencies={workspaceCurrencies}
              showPalettePresets={workspaceEditMode}
              onValuesChange={setWorkspaceDraft}
              initialActiveSubSection={workspaceActiveSubSection}
              focusedPart={focusedPart}
              menuCategories={menuCategories}
              onAssetsChanged={onSiteRestored}
              onStartEditing={(subSectionKey) => {
                setWorkspaceSaveError(null);
                setWorkspaceActiveSubSection(subSectionKey || null);
                setWorkspaceEditMode(true);
              }}
            />
          </div>
        ) : (
          <EmptyState
            icon={<PiSwatchesBold className="size-8" />}
            title="Create your workspace"
            description="Set up the shared brand layer."
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
      <SiteHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestored={async () => {
          await onSiteRestored?.();
        }}
      />
    </div>
  );
}
