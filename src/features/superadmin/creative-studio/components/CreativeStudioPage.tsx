'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  PiImagesBold,
  PiSparkleBold,
  PiArrowsClockwiseBold,
  PiEyeBold,
  PiBrowsersBold,
} from 'react-icons/pi';
import { Button, PageHeader, toast } from '@/components/ui';

import type { StudioTab } from '../types';
import { VaultTab } from './VaultTab';
import { DecoderTab } from './DecoderTab';
import { AIStudioTab } from './AIStudioTab';
import { AutomationTab } from './AutomationTab';
import {
  useCreativeVaultState,
  usePosterDecoderState,
  useAiStudioState,
  useStudioAutomationState,
} from '../hooks';

export function CreativeStudioPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<StudioTab>('vault');

  // Domain Hooks
  const vault = useCreativeVaultState();

  const decoder = usePosterDecoderState({
    onSaveSuccess: async () => {
      await vault.loadAssets();
      setActiveTab('vault');
    },
  });

  const studio = useAiStudioState({
    onSaveSuccess: async () => {
      await vault.loadAssets();
      setActiveTab('vault');
    },
  });

  const automation = useStudioAutomationState({
    onIngestSuccess: async () => {
      await vault.loadAssets();
    },
  });

  // Load Prompt / Tab from Query Parameters
  useEffect(() => {
    const tabParam = searchParams.get('tab') as StudioTab | null;
    if (tabParam && ['vault', 'decoder', 'aistudio', 'automation'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-10">
      <PageHeader
        title="Creative Studio & Asset Distribution"
        description="Decode competitor flyers with Vision AI, synthesize hyperrealistic food photos & video reels, and dispatch marketing assets directly to tenant ad inboxes."
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'vault' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-1.5"
          >
            <PiImagesBold className="h-4 w-4" />
            <span>Vault &amp; Asset Distribution</span>
          </Button>

          <Button
            variant={activeTab === 'decoder' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('decoder')}
            className="flex items-center gap-1.5"
          >
            <PiEyeBold className="h-4 w-4 text-amber-500" />
            <span>Reverse-Engineer Flyer (Decoder)</span>
          </Button>

          <Button
            variant={activeTab === 'aistudio' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('aistudio')}
            className="flex items-center gap-1.5"
          >
            <PiSparkleBold className="h-4 w-4 text-purple-500" />
            <span>AI Photo &amp; Video Reel Studio</span>
          </Button>

          <Button
            variant={activeTab === 'automation' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('automation')}
            className="flex items-center gap-1.5"
          >
            <PiBrowsersBold className="h-4 w-4 text-cyan-500" />
            <span>Browser Automation (CDP)</span>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={vault.loadAssets}
          disabled={vault.loadingAssets}
          className="flex items-center gap-1"
        >
          <PiArrowsClockwiseBold className={vault.loadingAssets ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'vault' && (
        <VaultTab
          vaultStats={vault.vaultStats}
          typeFilter={vault.typeFilter}
          setTypeFilter={vault.setTypeFilter}
          publishedFilter={vault.publishedFilter}
          setPublishedFilter={vault.setPublishedFilter}
          searchQuery={vault.searchQuery}
          setSearchQuery={vault.setSearchQuery}
          loadingAssets={vault.loadingAssets}
          filteredAssets={vault.filteredAssets}
          previewAsset={vault.previewAsset}
          setPreviewAsset={vault.setPreviewAsset}
          publishModalAsset={vault.publishModalAsset}
          setPublishModalAsset={vault.setPublishModalAsset}
          publishTarget={vault.publishTarget}
          setPublishTarget={vault.setPublishTarget}
          selectedIndustryId={vault.selectedIndustryId}
          setSelectedIndustryId={vault.setSelectedIndustryId}
          targetWorkspaceIds={vault.targetWorkspaceIds}
          setTargetWorkspaceIds={vault.setTargetWorkspaceIds}
          publishing={vault.publishing}
          handlePublishAsset={vault.handlePublishAsset}
          handleDeleteAsset={vault.handleDeleteAsset}
          industries={vault.industries}
        />
      )}

      {activeTab === 'decoder' && (
        <DecoderTab
          decoderInputMode={decoder.decoderInputMode}
          setDecoderInputMode={decoder.setDecoderInputMode}
          decoderImageUrl={decoder.decoderImageUrl}
          setDecoderImageUrl={decoder.setDecoderImageUrl}
          decoderFile={decoder.decoderFile}
          setDecoderFile={decoder.setDecoderFile}
          uploadingDecoderFile={decoder.uploadingDecoderFile}
          handleDecoderFileUpload={decoder.handleDecoderFileUpload}
          fileInputRef={decoder.fileInputRef}
          decoderModel={decoder.decoderModel}
          setDecoderModel={decoder.setDecoderModel}
          decoderContext={decoder.decoderContext}
          setDecoderContext={decoder.setDecoderContext}
          decoding={decoder.decoding}
          handleDecode={decoder.handleDecode}
          decodedSpec={decoder.decodedSpec}
          setDecodedSpec={decoder.setDecodedSpec}
          refinementPrompt={decoder.refinementPrompt}
          setRefinementPrompt={decoder.setRefinementPrompt}
          refining={decoder.refining}
          handleRefine={decoder.handleRefine}
          savingTemplate={decoder.savingTemplate}
          handleSaveDecodedToVault={decoder.handleSaveDecodedToVault}
        />
      )}

      {activeTab === 'aistudio' && (
        <AIStudioTab
          aiMode={studio.aiMode}
          setAiMode={studio.setAiMode}
          imagePrompt={studio.imagePrompt}
          setImagePrompt={studio.setImagePrompt}
          studioRefImage={studio.studioRefImage}
          setStudioRefImage={studio.setStudioRefImage}
          uploadingStudioRef={studio.uploadingStudioRef}
          handleStudioRefUpload={studio.handleStudioRefUpload}
          studioRefInputRef={studio.studioRefInputRef}
          imageRatio={studio.imageRatio}
          setImageRatio={studio.setImageRatio}
          imageProvider={studio.imageProvider}
          setImageProvider={studio.setImageProvider}
          generatingImage={studio.generatingImage}
          handleGenerateImage={studio.handleGenerateImage}
          generatedImageUrl={studio.generatedImageUrl}
          videoPrompt={studio.videoPrompt}
          setVideoPrompt={studio.setVideoPrompt}
          videoDuration={studio.videoDuration}
          setVideoDuration={studio.setVideoDuration}
          videoRatio={studio.videoRatio}
          setVideoRatio={studio.setVideoRatio}
          generatingVideo={studio.generatingVideo}
          handleGenerateVideo={studio.handleGenerateVideo}
          generatedVideoUrl={studio.generatedVideoUrl}
          videoStatus={studio.videoStatus}
          savingToLibrary={studio.savingToLibrary}
          handleSaveToPromptLibrary={studio.handleSaveToPromptLibrary}
          copyVariants={studio.copyVariants}
          generatingCopy={studio.generatingCopy}
          handleGenerateCopy={studio.handleGenerateCopy}
          assetTitleInput={studio.assetTitleInput}
          setAssetTitleInput={studio.setAssetTitleInput}
          savingAiAsset={studio.savingAiAsset}
          handleSaveAiToVault={studio.handleSaveAiToVault}
          copySuccessToast={(msg) => toast.success(msg)}
        />
      )}

      {activeTab === 'automation' && (
        <AutomationTab
          automationScript={automation.automationScript}
          setAutomationScript={automation.setAutomationScript}
          automationPrompt={automation.automationPrompt}
          setAutomationPrompt={automation.setAutomationPrompt}
          automationTitle={automation.automationTitle}
          setAutomationTitle={automation.setAutomationTitle}
          autoIngest={automation.autoIngest}
          setAutoIngest={automation.setAutoIngest}
          runningScript={automation.runningScript}
          handleRunAutomation={automation.handleRunAutomation}
          scriptDownloads={automation.scriptDownloads}
          loadingDownloads={automation.loadingDownloads}
          loadDownloads={automation.loadDownloads}
          handleIngestDownload={automation.handleIngestDownload}
          ingestingDownload={automation.ingestingDownload}
          lastIngestedAsset={automation.lastIngestedAsset}
          setPublishModalAsset={vault.setPublishModalAsset}
          setActiveTab={setActiveTab}
          scriptLog={automation.scriptLog}
        />
      )}
    </div>
  );
}
