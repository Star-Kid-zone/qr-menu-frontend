"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  PiImagesBold,
  PiSparkleBold,
  PiArrowsClockwiseBold,
  PiEyeBold,
  PiBrowsersBold,
} from "react-icons/pi";
import {
  superadminService,
  type PlatformMarketingAsset,
} from "@/services/superadmin.service";
import { industryService } from "@/services/industry.service";
import {
  Button,
  PageHeader,
  toast,
} from "@/shared/components";

import type { StudioTab, ScriptDownloadItem, IndustryItem } from "../types";
import { VaultTab } from "./VaultTab";
import { DecoderTab } from "./DecoderTab";
import { AIStudioTab } from "./AIStudioTab";
import { AutomationTab } from "./AutomationTab";

export function CreativeStudioPage() {
  const [activeTab, setActiveTab] = useState<StudioTab>("vault");
  const [assets, setAssets] = useState<PlatformMarketingAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [industries, setIndustries] = useState<IndustryItem[]>([]);

  // Vault Filters
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video" | "poster_spec">("all");
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [previewAsset, setPreviewAsset] = useState<PlatformMarketingAsset | null>(null);
  const [publishModalAsset, setPublishModalAsset] = useState<PlatformMarketingAsset | null>(null);
  const [publishTarget, setPublishTarget] = useState<"all" | "industry" | "selected_tenants">("all");
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("");
  const [targetWorkspaceIds, setTargetWorkspaceIds] = useState<string>("");
  const [publishing, setPublishing] = useState(false);

  // Poster Decoder State
  const [decoderImageUrl, setDecoderImageUrl] = useState("");
  const [decoderFile, setDecoderFile] = useState<File | null>(null);
  const [uploadingDecoderFile, setUploadingDecoderFile] = useState(false);
  const [decoderInputMode, setDecoderInputMode] = useState<"upload" | "url">("upload");
  const [decoderContext, setDecoderContext] = useState("");
  const [decoderModel, setDecoderModel] = useState("google/gemini-2.0-flash-exp:free");
  const [decoding, setDecoding] = useState(false);
  const [decodedSpec, setDecodedSpec] = useState<any>(null);
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [refining, setRefining] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Image & Reel Generator State
  const searchParams = useSearchParams();
  const [aiMode, setAiMode] = useState<"image" | "video">("image");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageRatio, setImageRatio] = useState<"1:1" | "4:5" | "9:16" | "16:9">("4:5");
  const [imageProvider, setImageProvider] = useState<"cloudflare" | "pollinations" | "openrouter">("cloudflare");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Visual Reference Image in AI Studio
  const [studioRefImage, setStudioRefImage] = useState<string>("");
  const [uploadingStudioRef, setUploadingStudioRef] = useState(false);
  const studioRefInputRef = useRef<HTMLInputElement>(null);
  const [savingToLibrary, setSavingToLibrary] = useState(false);

  // AI Video Reel
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoRatio, setVideoRatio] = useState<"9:16" | "16:9">("9:16");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoJobId, setVideoJobId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Copywriter State
  const [copyTopic, setCopyTopic] = useState("");
  const [copyVariants, setCopyVariants] = useState<any[]>([]);
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [assetTitleInput, setAssetTitleInput] = useState("");
  const [savingAiAsset, setSavingAiAsset] = useState(false);

  // External Browser Automation State (Playwright CDP)
  const [automationScript, setAutomationScript] = useState("chatgpt-attach.js");
  const [automationPrompt, setAutomationPrompt] = useState(
    "Close-up aesthetic photo of steaming Hyderabadi Dum Biryani in traditional clay pot with fresh mint garnish, warm ambient restaurant lighting"
  );
  const [automationTitle, setAutomationTitle] = useState("");
  const [autoIngest, setAutoIngest] = useState(true);
  const [runningScript, setRunningScript] = useState(false);
  const [scriptLog, setScriptLog] = useState("");
  const [lastIngestedAsset, setLastIngestedAsset] = useState<PlatformMarketingAsset | null>(null);
  const [scriptDownloads, setScriptDownloads] = useState<ScriptDownloadItem[]>([]);
  const [loadingDownloads, setLoadingDownloads] = useState(false);
  const [ingestingDownload, setIngestingDownload] = useState<string | null>(null);

  // Load Assets from Backend
  const loadAssets = useCallback(async () => {
    try {
      setLoadingAssets(true);
      const res = await superadminService.listMarketingAssets();
      setAssets(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load marketing assets from Vault");
    } finally {
      setLoadingAssets(false);
    }
  }, []);

  // Load Industries
  useEffect(() => {
    industryService
      .getIndustries()
      .then((res: any) => {
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        setIndustries(list);
      })
      .catch(() => {});
    loadAssets();
  }, [loadAssets]);

  // Load Prompt / Reference Image from Query Parameters (e.g. from Prompt Library)
  useEffect(() => {
    const tabParam = searchParams.get("tab") as StudioTab | null;
    if (tabParam && ["vault", "decoder", "aistudio", "automation"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const promptParam = searchParams.get("prompt");
    const mediaTypeParam = searchParams.get("mediaType");
    if (promptParam) {
      if (mediaTypeParam === "video") {
        setAiMode("video");
        setVideoPrompt(promptParam);
      } else {
        setAiMode("image");
        setImagePrompt(promptParam);
      }
    }
    const refImgParam = searchParams.get("refImg");
    if (refImgParam) {
      setStudioRefImage(refImgParam);
    }
    const ratioParam = searchParams.get("aspectRatio");
    if (ratioParam && ["1:1", "4:5", "9:16", "16:9"].includes(ratioParam)) {
      if (mediaTypeParam === "video") {
        setVideoRatio(ratioParam === "16:9" ? "16:9" : "9:16");
      } else {
        setImageRatio(ratioParam as any);
      }
    }
  }, [searchParams]);

  // Video Status Polling
  useEffect(() => {
    if (!videoJobId || videoStatus === "completed" || videoStatus === "failed") return;
    const interval = setInterval(async () => {
      try {
        const res = await superadminService.getVideoStatus(videoJobId);
        setVideoStatus(res.status);
        if (res.status === "completed" && res.url) {
          setGeneratedVideoUrl(res.url);
          setGeneratingVideo(false);
          toast.success("AI Video Reel generated successfully!");
          clearInterval(interval);
        } else if (res.status === "failed") {
          setGeneratingVideo(false);
          toast.error(res.error || "Video generation failed");
          clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [videoJobId, videoStatus]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (publishedFilter === "published" && !a.isPublishedToTenants) return false;
      if (publishedFilter === "draft" && a.isPublishedToTenants) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title?.toLowerCase().includes(q);
        const matchesCategory = a.categoryTag?.toLowerCase().includes(q);
        const matchesCaption = a.captionSuggestion?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesCaption) return false;
      }
      return true;
    });
  }, [assets, typeFilter, publishedFilter, searchQuery]);

  // Vault Stats
  const vaultStats = useMemo(() => {
    return {
      total: assets.length,
      published: assets.filter((a) => a.isPublishedToTenants).length,
      images: assets.filter((a) => a.type === "image").length,
      videos: assets.filter((a) => a.type === "video").length,
      specs: assets.filter((a) => a.type === "poster_spec").length,
    };
  }, [assets]);

  // Handle Publish / Dispatch
  const handlePublishAsset = async () => {
    if (!publishModalAsset) return;
    try {
      setPublishing(true);
      const workspaceIds =
        publishTarget === "selected_tenants"
          ? targetWorkspaceIds
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean)
          : undefined;

      await superadminService.publishAssetToTenants(publishModalAsset.id, {
        targetAudience: publishTarget,
        targetIndustryId: publishTarget === "industry" ? selectedIndustryId : undefined,
        workspaceIds,
      });

      toast.success(
        `Asset successfully published to ${
          publishTarget === "all"
            ? "all tenants"
            : publishTarget === "industry"
            ? "targeted industry"
            : "selected tenants"
        }!`
      );
      setPublishModalAsset(null);
      await loadAssets();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to publish asset");
    } finally {
      setPublishing(false);
    }
  };

  // Handle Delete Asset
  const handleDeleteAsset = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this asset from the Vault?")) return;
    try {
      await superadminService.deleteMarketingAsset(String(id));
      toast.success("Asset removed from Vault");
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (previewAsset?.id === id) setPreviewAsset(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete asset");
    }
  };

  // Handle Poster File Upload
  const handleDecoderFileUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WEBP)");
      return;
    }
    setDecoderFile(file);

    // Instant local base64 preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setDecoderImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server storage in background
    try {
      setUploadingDecoderFile(true);
      const res = await superadminService.uploadMarketingAsset(file);
      setDecoderImageUrl(res.url);
      toast.success(`Image "${file.name}" uploaded to storage!`);
    } catch (err: any) {
      console.warn("Storage upload error (using local base64):", err);
    } finally {
      setUploadingDecoderFile(false);
    }
  };

  // Handle Decode Poster
  const handleDecode = async () => {
    if (!decoderImageUrl.trim()) {
      toast.warning("Please upload a poster file or provide an image URL");
      return;
    }
    try {
      setDecoding(true);
      setDecodedSpec(null);
      const res = await superadminService.decodePoster({
        image: decoderImageUrl.trim(),
        hint: decoderContext.trim() || undefined,
        model: decoderModel,
      });
      setDecodedSpec(res.spec);
      toast.success("Poster successfully reverse-engineered into layout blueprint!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Poster decoding failed");
    } finally {
      setDecoding(false);
    }
  };

  // Handle Refine Decoded Poster
  const handleRefine = async () => {
    if (!decodedSpec || !refinementPrompt.trim()) return;
    try {
      setRefining(true);
      const res = await superadminService.decodePoster({
        image: decoderImageUrl.trim(),
        hint: `Refinement Request: ${refinementPrompt.trim()}`,
        spec: decodedSpec,
        model: decoderModel,
      });
      setDecodedSpec(res.spec);
      toast.success("Layout blueprint refined!");
      setRefinementPrompt("");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to refine blueprint");
    } finally {
      setRefining(false);
    }
  };

  // Save Decoded Poster to Vault
  const handleSaveDecodedToVault = async () => {
    if (!decodedSpec) return;
    try {
      setSavingTemplate(true);
      const title =
        decodedSpec.meta?.title ||
        decodedSpec.layers?.find((l: any) => l.role === "headline")?.text ||
        "Decoded Poster Blueprint";

      await superadminService.createMarketingAsset({
        title,
        type: "poster_spec",
        mediaUrl: decoderImageUrl,
        thumbnailUrl: decoderImageUrl,
        spec: decodedSpec,
        aspectRatio: `${decodedSpec.canvas?.width || 1080}:${decodedSpec.canvas?.height || 1350}`,
        captionSuggestion: `✨ ${title}! Freshly crafted for your menu. Order now via our online QR portal.`,
        hashtags: ["#FoodieSpecials", "#RestaurantDeals", "#FreshDaily", "#GourmetExperience"],
        categoryTag: "Blueprint Template",
      });

      toast.success("Saved to Vault as Template!");
      await loadAssets();
      setActiveTab("vault");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save blueprint");
    } finally {
      setSavingTemplate(false);
    }
  };

  // Handle Save Prompt to Prompt Library
  const handleSaveToPromptLibrary = async () => {
    const currentPrompt = aiMode === "image" ? imagePrompt.trim() : videoPrompt.trim();
    if (!currentPrompt) {
      toast.warning("Please enter a prompt first to save it to your library");
      return;
    }
    const defaultTitle = (assetTitleInput || currentPrompt.slice(0, 35) + " Special").trim();
    const title = window.prompt("Enter a title for this prompt template:", defaultTitle);
    if (!title || !title.trim()) return;

    try {
      setSavingToLibrary(true);
      await superadminService.createPrompt({
        title: title.trim(),
        prompt: currentPrompt,
        mediaType: aiMode === "image" ? "image" : "video",
        aspectRatio: aiMode === "image" ? imageRatio : videoRatio,
        referenceImages: studioRefImage ? [studioRefImage] : [],
        category: "General",
        recommendedModel:
          aiMode === "image"
            ? "Ideogram 2.0 (Typography & Posters)"
            : "Grok Imagine Video / Kling AI (Cinematic Reels)",
        stylePreset: "Commercial Food Photography",
      });
      toast.success("Prompt successfully saved to your Prompt Library!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save prompt to library");
    } finally {
      setSavingToLibrary(false);
    }
  };

  // Handle Upload Reference Image in Studio
  const handleStudioRefUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WEBP)");
      return;
    }
    try {
      setUploadingStudioRef(true);
      const res = await superadminService.uploadMarketingAsset(file);
      setStudioRefImage(res.url);
      toast.success(`Reference image "${file.name}" attached!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload reference image");
    } finally {
      setUploadingStudioRef(false);
    }
  };

  // Handle Generate Image
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.warning("Please enter a description for the image");
      return;
    }
    try {
      setGeneratingImage(true);
      setGeneratedImageUrl(null);
      const res = await superadminService.generateAiImage({
        prompt: imagePrompt.trim(),
        aspectRatio: imageRatio,
        provider: imageProvider,
        referenceImageUrl: studioRefImage || undefined,
      });
      setGeneratedImageUrl(res.url);
      setCopyTopic(imagePrompt.trim());
      setAssetTitleInput(imagePrompt.slice(0, 40) + " Special");
      toast.success("AI food image rendered and saved to storage!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "AI image generation failed");
    } finally {
      setGeneratingImage(false);
    }
  };

  // Handle Generate Video Reel
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
      toast.warning("Please enter a prompt for the video reel");
      return;
    }
    try {
      setGeneratingVideo(true);
      setGeneratedVideoUrl(null);
      setVideoStatus("queued");
      const res = await superadminService.generateAiVideo({
        prompt: videoPrompt.trim(),
        duration: videoDuration,
        aspectRatio: videoRatio,
        firstFrameUrl: studioRefImage || undefined,
      });
      if (res.id) {
        setVideoJobId(res.id);
        setVideoStatus(res.status);
        toast.info("Video rendering job dispatched! Polling status...");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Video reel generation failed");
      setGeneratingVideo(false);
    }
  };

  // Generate Multi-Lingual Copy
  const handleGenerateCopy = async () => {
    const topic = copyTopic || imagePrompt || videoPrompt || "Today Chef Special";
    try {
      setGeneratingCopy(true);
      const res = await superadminService.generateMarketingCopy({
        dishName: topic,
        description: topic,
        tone: "energetic",
        languages: ["en", "ta", "hi"],
      });
      setCopyVariants(res.variants || []);
      toast.success("Multilingual marketing copy generated!");
    } catch (err: any) {
      console.error(err);
      toast.error("Copy generation failed");
    } finally {
      setGeneratingCopy(false);
    }
  };

  // Save AI Generated Media to Vault
  const handleSaveAiToVault = async () => {
    const mediaUrl = generatedImageUrl || generatedVideoUrl;
    if (!mediaUrl) return;
    try {
      setSavingAiAsset(true);
      const primaryCopy = copyVariants[0]?.caption || `Special Dish: ${copyTopic || "Chef Signature Creation"}`;
      const hashtags = copyVariants[0]?.hashtags || ["#FoodLovers", "#DailySpecial", "#FreshTaste"];

      await superadminService.createMarketingAsset({
        title: assetTitleInput.trim() || "AI Studio Creation",
        type: generatedVideoUrl ? "video" : "image",
        mediaUrl,
        thumbnailUrl: generatedImageUrl || undefined,
        aspectRatio: generatedVideoUrl ? videoRatio : imageRatio,
        captionSuggestion: primaryCopy,
        hashtags,
        categoryTag: generatedVideoUrl ? "AI Reel" : "AI Food Photo",
      });

      toast.success("Saved to Vault!");
      await loadAssets();
      setActiveTab("vault");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save to Vault");
    } finally {
      setSavingAiAsset(false);
    }
  };

  // Automation Runner Handlers
  const handleRunAutomation = async () => {
    if (!automationPrompt.trim()) {
      toast.warning("Please enter a prompt for the AI image");
      return;
    }
    try {
      setRunningScript(true);
      setScriptLog("Connecting to backend runner...\n");
      setLastIngestedAsset(null);

      const res = await superadminService.runAutomationScript(
        {
          script: automationScript,
          prompt: automationPrompt.trim(),
          title: automationTitle.trim() || undefined,
          autoIngest,
        },
        (chunk) => {
          setScriptLog((prev) => prev + chunk);
        }
      );

      if (res.ingestedAsset) {
        setLastIngestedAsset(res.ingestedAsset);
        toast.success(`Image generated and automatically committed to Vault! (ID #${res.ingestedAsset.id})`);
        await loadAssets();
      } else {
        toast.info("Script execution completed.");
      }
      await loadDownloads();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Script execution failed");
      setScriptLog((prev) => prev + `\n[CLIENT ERROR] ${err.message || String(err)}\n`);
    } finally {
      setRunningScript(false);
    }
  };

  const loadDownloads = useCallback(async () => {
    try {
      setLoadingDownloads(true);
      const res = await superadminService.listScriptDownloads();
      setScriptDownloads(res.files || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDownloads(false);
    }
  }, []);

  const handleIngestDownload = async (filename: string) => {
    try {
      setIngestingDownload(filename);
      await superadminService.ingestScriptDownload({ filename });
      toast.success(`"${filename}" imported into Vault!`);
      await loadAssets();
      await loadDownloads();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to import file");
    } finally {
      setIngestingDownload(null);
    }
  };

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
            variant={activeTab === "vault" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("vault")}
            className="flex items-center gap-1.5"
          >
            <PiImagesBold className="h-4 w-4" />
            <span>Vault &amp; Asset Distribution</span>
          </Button>

          <Button
            variant={activeTab === "decoder" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("decoder")}
            className="flex items-center gap-1.5"
          >
            <PiEyeBold className="h-4 w-4 text-amber-500" />
            <span>Reverse-Engineer Flyer (Decoder)</span>
          </Button>

          <Button
            variant={activeTab === "aistudio" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("aistudio")}
            className="flex items-center gap-1.5"
          >
            <PiSparkleBold className="h-4 w-4 text-purple-500" />
            <span>AI Photo &amp; Video Reel Studio</span>
          </Button>

          <Button
            variant={activeTab === "automation" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("automation")}
            className="flex items-center gap-1.5"
          >
            <PiBrowsersBold className="h-4 w-4 text-cyan-500" />
            <span>Browser Automation (CDP)</span>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadAssets}
          disabled={loadingAssets}
          className="flex items-center gap-1"
        >
          <PiArrowsClockwiseBold className={loadingAssets ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Tab Panels */}
      {activeTab === "vault" && (
        <VaultTab
          vaultStats={vaultStats}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          publishedFilter={publishedFilter}
          setPublishedFilter={setPublishedFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loadingAssets={loadingAssets}
          filteredAssets={filteredAssets}
          previewAsset={previewAsset}
          setPreviewAsset={setPreviewAsset}
          publishModalAsset={publishModalAsset}
          setPublishModalAsset={setPublishModalAsset}
          publishTarget={publishTarget}
          setPublishTarget={setPublishTarget}
          selectedIndustryId={selectedIndustryId}
          setSelectedIndustryId={setSelectedIndustryId}
          targetWorkspaceIds={targetWorkspaceIds}
          setTargetWorkspaceIds={setTargetWorkspaceIds}
          publishing={publishing}
          handlePublishAsset={handlePublishAsset}
          handleDeleteAsset={handleDeleteAsset}
          industries={industries}
        />
      )}

      {activeTab === "decoder" && (
        <DecoderTab
          decoderInputMode={decoderInputMode}
          setDecoderInputMode={setDecoderInputMode}
          decoderImageUrl={decoderImageUrl}
          setDecoderImageUrl={setDecoderImageUrl}
          decoderFile={decoderFile}
          setDecoderFile={setDecoderFile}
          uploadingDecoderFile={uploadingDecoderFile}
          handleDecoderFileUpload={handleDecoderFileUpload}
          fileInputRef={fileInputRef}
          decoderModel={decoderModel}
          setDecoderModel={setDecoderModel}
          decoderContext={decoderContext}
          setDecoderContext={setDecoderContext}
          decoding={decoding}
          handleDecode={handleDecode}
          decodedSpec={decodedSpec}
          setDecodedSpec={setDecodedSpec}
          refinementPrompt={refinementPrompt}
          setRefinementPrompt={setRefinementPrompt}
          refining={refining}
          handleRefine={handleRefine}
          savingTemplate={savingTemplate}
          handleSaveDecodedToVault={handleSaveDecodedToVault}
        />
      )}

      {activeTab === "aistudio" && (
        <AIStudioTab
          aiMode={aiMode}
          setAiMode={setAiMode}
          imagePrompt={imagePrompt}
          setImagePrompt={setImagePrompt}
          studioRefImage={studioRefImage}
          setStudioRefImage={setStudioRefImage}
          uploadingStudioRef={uploadingStudioRef}
          handleStudioRefUpload={handleStudioRefUpload}
          studioRefInputRef={studioRefInputRef}
          imageRatio={imageRatio}
          setImageRatio={setImageRatio}
          imageProvider={imageProvider}
          setImageProvider={setImageProvider}
          generatingImage={generatingImage}
          handleGenerateImage={handleGenerateImage}
          generatedImageUrl={generatedImageUrl}
          videoPrompt={videoPrompt}
          setVideoPrompt={setVideoPrompt}
          videoDuration={videoDuration}
          setVideoDuration={setVideoDuration}
          videoRatio={videoRatio}
          setVideoRatio={setVideoRatio}
          generatingVideo={generatingVideo}
          handleGenerateVideo={handleGenerateVideo}
          generatedVideoUrl={generatedVideoUrl}
          videoStatus={videoStatus}
          savingToLibrary={savingToLibrary}
          handleSaveToPromptLibrary={handleSaveToPromptLibrary}
          copyVariants={copyVariants}
          generatingCopy={generatingCopy}
          handleGenerateCopy={handleGenerateCopy}
          assetTitleInput={assetTitleInput}
          setAssetTitleInput={setAssetTitleInput}
          savingAiAsset={savingAiAsset}
          handleSaveAiToVault={handleSaveAiToVault}
          copySuccessToast={(msg) => toast.success(msg)}
        />
      )}

      {activeTab === "automation" && (
        <AutomationTab
          automationScript={automationScript}
          setAutomationScript={setAutomationScript}
          automationPrompt={automationPrompt}
          setAutomationPrompt={setAutomationPrompt}
          automationTitle={automationTitle}
          setAutomationTitle={setAutomationTitle}
          autoIngest={autoIngest}
          setAutoIngest={setAutoIngest}
          runningScript={runningScript}
          handleRunAutomation={handleRunAutomation}
          scriptDownloads={scriptDownloads}
          loadingDownloads={loadingDownloads}
          loadDownloads={loadDownloads}
          handleIngestDownload={handleIngestDownload}
          ingestingDownload={ingestingDownload}
          lastIngestedAsset={lastIngestedAsset}
          setPublishModalAsset={setPublishModalAsset}
          setActiveTab={setActiveTab}
          scriptLog={scriptLog}
        />
      )}
    </div>
  );
}
