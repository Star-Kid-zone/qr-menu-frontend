'use client';

import React from 'react';
import type { UserDetailResponse, BusinessFormData, WorkspaceFormData } from '../types';
import {
  BusinessProfileSection,
  BrandNarrativeSection,
  WorkspaceArchitectureSection,
  QrConfigSection,
} from './sections';

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
      {/* 1. Business Profile & Operating Settings */}
      <BusinessProfileSection
        primaryBusiness={primaryBusiness}
        businessForm={businessForm}
        setBusinessForm={setBusinessForm}
        isEditingBusiness={isEditingBusiness}
        setIsEditingBusiness={setIsEditingBusiness}
        businessSaving={businessSaving}
        handleSaveBusiness={handleSaveBusiness}
      />

      {/* 2. Story & Brand Identity Narrative */}
      <BrandNarrativeSection primaryWorkspace={primaryWorkspace} />

      {/* 3. Workspace Architecture & Feature Flags */}
      <WorkspaceArchitectureSection
        workspaces={detail.workspaces}
        workspaceForm={workspaceForm}
        setWorkspaceForm={setWorkspaceForm}
        isEditingWorkspace={isEditingWorkspace}
        setIsEditingWorkspace={setIsEditingWorkspace}
        workspaceSaving={workspaceSaving}
        handleSaveWorkspaceFeatures={handleSaveWorkspaceFeatures}
      />

      {/* 4. Custom QR Code Configuration */}
      <QrConfigSection primaryWorkspace={primaryWorkspace} />
    </div>
  );
}
