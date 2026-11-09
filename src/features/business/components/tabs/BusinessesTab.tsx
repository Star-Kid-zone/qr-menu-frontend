"use client";

import React from "react";
import { Button, EmptyState, SubTabPills } from "@/components/ui";
import { PiPencilSimpleBold, PiStorefrontBold } from "react-icons/pi";
import {
  BusinessForm,
  editBusinessFormId,
  type BusinessSchemaValues,
} from "../BusinessForm";
import type { WorkspaceBusiness } from "@/types/workspace.types";
import type { Industry } from "@/types";

interface BusinessesTabProps {
  businesses: WorkspaceBusiness[];
  businessEditMode: boolean;
  setBusinessEditMode: (val: boolean) => void;
  businessSection: "profile" | "taxes" | "social" | "hours";
  setBusinessSection: (val: "profile" | "taxes" | "social" | "hours") => void;
  businessFormLoading: boolean;
  setBusinessFormLoading: (val: boolean) => void;
  industries: Industry[];
  setBusinessDraft: (val: BusinessSchemaValues | null) => void;
  onUpdateBusiness: (values: BusinessSchemaValues) => Promise<void>;
}

export function BusinessesTab({
  businesses,
  businessEditMode,
  setBusinessEditMode,
  businessSection,
  setBusinessSection,
  businessFormLoading,
  setBusinessFormLoading,
  industries,
  setBusinessDraft,
  onUpdateBusiness,
}: BusinessesTabProps) {
  const biz = businesses[0] ?? null;

  const panelActions = (() => {
    if (!biz) return null;
    if (businessEditMode) {
      return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => setBusinessEditMode(false)}
            disabled={businessFormLoading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            form={editBusinessFormId(biz.id)}
            loading={businessFormLoading}
            className="w-full sm:w-auto"
          >
            Save
          </Button>
        </div>
      );
    }
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setBusinessEditMode(true)}
        startIcon={<PiPencilSimpleBold className="size-4" />}
      >
        Edit details
      </Button>
    );
  })();

  return (
    <div className="flex flex-col gap-4">
      {biz && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SubTabPills
            options={[
              { id: "profile", label: "Contact & address" },
              { id: "taxes", label: "Taxes & charges" },
              { id: "social", label: "Social links" },
              { id: "hours", label: "Opening hours" },
            ]}
            active={businessSection}
            onChange={setBusinessSection}
          />
          {panelActions}
        </div>
      )}
      <div>
        {biz ? (
          <BusinessForm
            key={`business-${biz.id}-${businessEditMode}`}
            formId={editBusinessFormId(biz.id)}
            industries={industries}
            initialData={biz}
            disabled={!businessEditMode}
            section={businessSection}
            onLoadingChange={setBusinessFormLoading}
            onValuesChange={setBusinessDraft}
            onSubmit={onUpdateBusiness}
          />
        ) : (
          <EmptyState
            icon={<PiStorefrontBold className="size-8" />}
            title="No business profile yet"
            description="Your business profile will appear here once created."
          />
        )}
      </div>
    </div>
  );
}
