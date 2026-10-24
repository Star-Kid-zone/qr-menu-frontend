"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  Button,
} from "@/shared/components";
import {
  PiSparkleBold,
  PiFilmReelBold,
  PiNotebookBold,
  PiPlusBold,
  PiCameraBold,
  PiUploadSimpleBold,
  PiSpinnerBold,
  PiTextTBold,
  PiCopyBold,
  PiImagesBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
import { routes } from "@/config/routes";
import { PRESET_IMAGE_PROMPTS } from "../constants";

interface AIStudioTabProps {
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
  copyVariants: any[];
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
      <div className="lg:col-span-5 space-y-5">
        <Card className="p-5 space-y-4 border-border">
          {/* Header with Mode Toggle & Prompt Library Quick Access */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <PiSparkleBold className="h-5 w-5 text-purple-500" />
              <h3 className="text-base font-semibold text-foreground">
                AI Synthesis Studio
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
                <button
                  onClick={() => setAiMode("image")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                    aiMode === "image"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  Food Photo
                </button>
                <button
                  onClick={() => setAiMode("video")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-semibold transition-all",
                    aiMode === "video"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  Video Reel
                </button>
              </div>

              <Link href={routes.superadmin.prompts}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs flex items-center gap-1.5 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                  title="Open Prompt Library to browse or pick saved prompts"
                >
                  <PiNotebookBold className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Prompt Library</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Save to Library Banner */}
          {(imagePrompt.trim() || videoPrompt.trim()) && (
            <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2 text-xs">
              <span className="text-foreground/90 font-medium truncate mr-2">
                Liked this prompt? Save it to your library with reference images.
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveToPromptLibrary}
                disabled={savingToLibrary}
                className="h-7 text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:bg-purple-500/15 shrink-0"
              >
                {savingToLibrary ? (
                  <PiSpinnerBold className="h-3 w-3 animate-spin" />
                ) : (
                  <PiPlusBold className="h-3 w-3" />
                )}
                <span>Save to Library</span>
              </Button>
            </div>
          )}

          {aiMode === "image" ? (
            /* Food Image Form */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Visual Prompt
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Sizzling Hyderabadi Mutton Biryani in traditional brass handi with fried onions, hot steam..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Visual Reference Image Section */}
              <div className="space-y-2 rounded-xl border border-border/80 bg-muted/10 p-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <PiCameraBold className="h-3.5 w-3.5 text-amber-500" />
                    <span>Reference Image (Plating & Style Benchmark)</span>
                  </label>
                  {studioRefImage && (
                    <button
                      type="button"
                      onClick={() => setStudioRefImage("")}
                      className="text-[11px] text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {studioRefImage ? (
                  <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <div className="relative h-14 w-14 rounded-md overflow-hidden bg-zinc-950 shrink-0 border border-border">
                      <img src={studioRefImage} alt="Reference" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        Visual Reference Attached
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Guiding plating composition & lighting aesthetic
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => studioRefInputRef.current?.click()}
                      className="text-xs font-medium text-primary hover:underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      ref={studioRefInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleStudioRefUpload(e.target.files?.[0])}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => studioRefInputRef.current?.click()}
                      disabled={uploadingStudioRef}
                      className="h-8 text-xs flex items-center gap-1.5 shrink-0"
                    >
                      {uploadingStudioRef ? (
                        <PiSpinnerBold className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <PiUploadSimpleBold className="h-3.5 w-3.5" />
                      )}
                      <span>Upload File</span>
                    </Button>
                    <input
                      type="text"
                      placeholder="Or paste reference image URL (https://...)"
                      value={studioRefImage}
                      onChange={(e) => setStudioRefImage(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>

              {/* Preset Prompt Badges */}
              <div>
                <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Quick Creative Inspiration:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGE_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setImagePrompt(p)}
                      className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground text-left line-clamp-1"
                    >
                      {p.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Aspect Ratio
                  </label>
                  <select
                    value={imageRatio}
                    onChange={(e: any) => setImageRatio(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="4:5">4:5 (Instagram Portrait)</option>
                    <option value="1:1">1:1 (Square Feed)</option>
                    <option value="9:16">9:16 (Story / Reel)</option>
                    <option value="16:9">16:9 (Landscape Banner)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    AI Provider
                  </label>
                  <select
                    value={imageProvider}
                    onChange={(e: any) => setImageProvider(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="cloudflare">Cloudflare Flux Schnell</option>
                    <option value="pollinations">Pollinations Free Flux</option>
                    <option value="openrouter">OpenRouter Stable</option>
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleGenerateImage}
                disabled={generatingImage || !imagePrompt.trim()}
              >
                {generatingImage ? (
                  <>
                    <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                    Synthesizing Food Picture...
                  </>
                ) : (
                  <>
                    <PiSparkleBold className="h-4 w-4 mr-2" />
                    Generate AI Food Photo
                  </>
                )}
              </Button>
            </div>
          ) : (
            /* Video Reel Form */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Video Motion Prompt
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Slow motion close-up of sizzling grilled tandoori chicken with embers, smoke rising, cinematic 4k..."
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Visual Reference Image for Video Reel */}
              <div className="space-y-2 rounded-xl border border-border/80 bg-muted/10 p-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <PiCameraBold className="h-3.5 w-3.5 text-amber-500" />
                    <span>Starting Frame / Reference Image (Optional)</span>
                  </label>
                  {studioRefImage && (
                    <button
                      type="button"
                      onClick={() => setStudioRefImage("")}
                      className="text-[11px] text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {studioRefImage ? (
                  <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                    <div className="relative h-14 w-14 rounded-md overflow-hidden bg-zinc-950 shrink-0 border border-border">
                      <img src={studioRefImage} alt="Reference" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        Starting Frame Image Attached
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Video will animate directly from this reference image
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => studioRefInputRef.current?.click()}
                      className="text-xs font-medium text-primary hover:underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      ref={studioRefInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleStudioRefUpload(e.target.files?.[0])}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => studioRefInputRef.current?.click()}
                      disabled={uploadingStudioRef}
                      className="h-8 text-xs flex items-center gap-1.5 shrink-0"
                    >
                      {uploadingStudioRef ? (
                        <PiSpinnerBold className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <PiUploadSimpleBold className="h-3.5 w-3.5" />
                      )}
                      <span>Upload Starting Frame</span>
                    </Button>
                    <input
                      type="text"
                      placeholder="Or paste reference image URL (https://...)"
                      value={studioRefImage}
                      onChange={(e) => setStudioRefImage(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Format / Aspect Ratio
                  </label>
                  <select
                    value={videoRatio}
                    onChange={(e: any) => setVideoRatio(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="9:16">9:16 (Instagram Reel / Shorts)</option>
                    <option value="16:9">16:9 (Landscape Display)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Duration
                  </label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={5}>5 Seconds (High Fidelity)</option>
                    <option value={10}>10 Seconds Extended</option>
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleGenerateVideo}
                disabled={generatingVideo || !videoPrompt.trim()}
              >
                {generatingVideo ? (
                  <>
                    <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                    Rendering Video Reel ({videoStatus || "processing"})...
                  </>
                ) : (
                  <>
                    <PiFilmReelBold className="h-4 w-4 mr-2" />
                    Generate AI Video Reel
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Smart Copywriter Card */}
        {(generatedImageUrl || generatedVideoUrl) && (
          <Card className="p-5 space-y-3 border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <PiTextTBold className="h-4 w-4 text-primary" />
                Multi-Lingual Marketing Copy
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateCopy}
                disabled={generatingCopy}
              >
                {generatingCopy ? "Generating..." : "Auto-Generate Captions"}
              </Button>
            </div>

            {copyVariants.length > 0 && (
              <div className="space-y-3 pt-2">
                {copyVariants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                        {variant.language || "English"}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(variant.caption);
                          copySuccessToast("Copied caption to clipboard!");
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <PiCopyBold className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-muted-foreground">{variant.caption}</p>
                    {variant.hashtags && (
                      <p className="text-primary font-mono text-[11px]">
                        {variant.hashtags.join(" ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Output & Vault Save Column */}
      <div className="lg:col-span-7 space-y-5">
        {generatedImageUrl || generatedVideoUrl ? (
          <Card className="p-5 space-y-5 border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-base text-foreground">Synthesis Output</h3>
                <p className="text-xs text-muted-foreground">
                  Ready to be preserved in the Vault or dispatched to restaurant tenants.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/5] max-h-[460px] w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-border">
              {generatedVideoUrl ? (
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={generatedImageUrl!}
                  alt="Generated AI Food"
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* Save to Vault Form */}
            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Save to Superadmin Vault
              </h4>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Asset Title</label>
                <input
                  type="text"
                  value={assetTitleInput}
                  onChange={(e) => setAssetTitleInput(e.target.value)}
                  placeholder="e.g. Signature Hyderabadi Dum Biryani"
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleSaveAiToVault}
                disabled={savingAiAsset}
              >
                {savingAiAsset ? (
                  <>
                    <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                    Saving to Vault...
                  </>
                ) : (
                  <>
                    <PiImagesBold className="h-4 w-4 mr-2" />
                    Commit to Asset Vault
                  </>
                )}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-border">
            <PiSparkleBold className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h4 className="text-base font-semibold text-foreground">Studio Idle</h4>
            <p className="text-caption text-muted-foreground max-w-sm mt-1">
              Choose a prompt on the left and synthesize hyperrealistic pictures or motion reels.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
