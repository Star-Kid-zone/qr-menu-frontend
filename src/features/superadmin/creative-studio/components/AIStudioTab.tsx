"use client";

import React from "react";
import Link from "next/link";
import { Card, Button } from "@/components/ui";
import {
  PiSparkleBold,
  PiNotebookBold,
  PiPlusBold,
  PiSpinnerBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
import { routes } from "@/config/routes";
import {
  FoodPhotoStudioCard,
  VideoReelStudioCard,
  SmartCopywriterCard,
  StudioOutputCard,
} from "./studio";
import type { CopyVariant } from "../types";

export interface AIStudioTabProps {
  aiMode: "image" | "video";
  setAiMode: (mode: "image" | "video") => void;
  imagePrompt: string;
  setImagePrompt: (prompt: string) => void;
  studioRefImage: string;
  setStudioRefImage: (img: string) => void;
  uploadingStudioRef: boolean;
  handleStudioRefUpload: (file?: File) => Promise<void>;
  studioRefInputRef: React.RefObject<HTMLInputElement | null>;
  imageRatio: "1:1" | "4:5" | "9:16" | "16:9";
  setImageRatio: (ratio: "1:1" | "4:5" | "9:16" | "16:9") => void;
  imageProvider: "cloudflare" | "pollinations" | "openrouter";
  setImageProvider: (provider: "cloudflare" | "pollinations" | "openrouter") => void;
  generatingImage: boolean;
  handleGenerateImage: () => Promise<void>;
  generatedImageUrl: string | null;
  videoPrompt: string;
  setVideoPrompt: (prompt: string) => void;
  videoDuration: number;
  setVideoDuration: (dur: number) => void;
  videoRatio: "9:16" | "16:9";
  setVideoRatio: (ratio: "9:16" | "16:9") => void;
  generatingVideo: boolean;
  handleGenerateVideo: () => Promise<void>;
  generatedVideoUrl: string | null;
  videoStatus: string | null;
  savingToLibrary: boolean;
  handleSaveToPromptLibrary: () => Promise<void>;
  copyVariants: CopyVariant[];
  generatingCopy: boolean;
  handleGenerateCopy: () => Promise<void>;
  assetTitleInput: string;
  setAssetTitleInput: (title: string) => void;
  savingAiAsset: boolean;
  handleSaveAiToVault: () => Promise<void>;
  copySuccessToast: (msg: string) => void;
}

export function AIStudioTab({
  aiMode,
  setAiMode,
  imagePrompt,
  setImagePrompt,
  studioRefImage,
  setStudioRefImage,
  uploadingStudioRef,
  handleStudioRefUpload,
  studioRefInputRef,
  imageRatio,
  setImageRatio,
  imageProvider,
  setImageProvider,
  generatingImage,
  handleGenerateImage,
  generatedImageUrl,
  videoPrompt,
  setVideoPrompt,
  videoDuration,
  setVideoDuration,
  videoRatio,
  setVideoRatio,
  generatingVideo,
  handleGenerateVideo,
  generatedVideoUrl,
  videoStatus,
  savingToLibrary,
  handleSaveToPromptLibrary,
  copyVariants,
  generatingCopy,
  handleGenerateCopy,
  assetTitleInput,
  setAssetTitleInput,
  savingAiAsset,
  handleSaveAiToVault,
  copySuccessToast,
}: AIStudioTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls Column */}
      <div className="lg:col-span-5 space-y-4">
        <Card className="p-6 space-y-4 border-border">
          {/* Header with Mode Toggle & Prompt Library Quick Access */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <PiSparkleBold className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                Generate an image or video
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
                <button
                  type="button"
                  onClick={() => setAiMode("image")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                    aiMode === "image"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  Food photo
                </button>
                <button
                  type="button"
                  onClick={() => setAiMode("video")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                    aiMode === "video"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  Video reel
                </button>
              </div>

              <Link href={routes.superadmin.prompts}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs flex items-center gap-2 border-primary/30 text-primary dark:text-primary hover:bg-primary/10"
                  title="Open saved prompts"
                >
                  <PiNotebookBold className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Saved prompts</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Save to Library Banner */}
          {(imagePrompt.trim() || videoPrompt.trim()) && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-xs">
              <span className="text-foreground/90 font-medium truncate mr-2">
                Liked this prompt? Save it to your library with reference images.
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveToPromptLibrary}
                disabled={savingToLibrary}
                className="h-7 text-xs flex items-center gap-1 text-primary dark:text-primary hover:bg-primary/15 shrink-0"
              >
                {savingToLibrary ? (
                  <PiSpinnerBold className="h-3 w-3 animate-spin" />
                ) : (
                  <PiPlusBold className="h-3 w-3" />
                )}
                <span>Save prompt</span>
              </Button>
            </div>
          )}

          {aiMode === "image" ? (
            <FoodPhotoStudioCard
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
            />
          ) : (
            <VideoReelStudioCard
              videoPrompt={videoPrompt}
              setVideoPrompt={setVideoPrompt}
              studioRefImage={studioRefImage}
              setStudioRefImage={setStudioRefImage}
              uploadingStudioRef={uploadingStudioRef}
              handleStudioRefUpload={handleStudioRefUpload}
              studioRefInputRef={studioRefInputRef}
              videoRatio={videoRatio}
              setVideoRatio={setVideoRatio}
              videoDuration={videoDuration}
              setVideoDuration={setVideoDuration}
              generatingVideo={generatingVideo}
              handleGenerateVideo={handleGenerateVideo}
              videoStatus={videoStatus}
            />
          )}
        </Card>

        <SmartCopywriterCard
          generatedImageUrl={generatedImageUrl}
          generatedVideoUrl={generatedVideoUrl}
          copyVariants={copyVariants}
          generatingCopy={generatingCopy}
          handleGenerateCopy={handleGenerateCopy}
          copySuccessToast={copySuccessToast}
        />
      </div>

      {/* Output & Vault Save Column */}
      <div className="lg:col-span-7 space-y-4">
        <StudioOutputCard
          generatedImageUrl={generatedImageUrl}
          generatedVideoUrl={generatedVideoUrl}
          assetTitleInput={assetTitleInput}
          setAssetTitleInput={setAssetTitleInput}
          savingAiAsset={savingAiAsset}
          handleSaveAiToVault={handleSaveAiToVault}
        />
      </div>
    </div>
  );
}
