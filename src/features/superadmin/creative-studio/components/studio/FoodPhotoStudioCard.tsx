"use client";

import React from "react";
import { Button } from "@/components/ui";
import {
  PiSparkleBold,
  PiCameraBold,
  PiUploadSimpleBold,
  PiSpinnerBold,
} from "react-icons/pi";
import { PRESET_IMAGE_PROMPTS } from "@/constants/studio.constants";

export interface FoodPhotoStudioCardProps {
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
}

export function FoodPhotoStudioCard({
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
}: FoodPhotoStudioCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-foreground block mb-2">
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
          <label className="text-xs font-semibold text-foreground flex items-center gap-2">
            <PiCameraBold className="h-3.5 w-3.5 text-warning-foreground" />
            <span>Reference Image (Plating & Style Benchmark)</span>
          </label>
          {studioRefImage && (
            <button
              type="button"
              onClick={() => setStudioRefImage("")}
              className="text-caption text-destructive hover:underline"
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
              <p className="text-caption text-muted-foreground">
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
              className="h-8 text-xs flex items-center gap-2 shrink-0"
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
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* Preset Prompt Badges */}
      <div>
        <span className="text-caption font-medium text-muted-foreground block mb-1">
          Quick Creative Inspiration:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_IMAGE_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => setImagePrompt(p)}
              className="rounded-full border border-border bg-muted/30 px-3 py-1 text-caption text-muted-foreground hover:bg-muted hover:text-foreground text-left line-clamp-1"
            >
              {p.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            Aspect Ratio
          </label>
          <select
            value={imageRatio}
            onChange={(e) => setImageRatio(e.target.value as FoodPhotoStudioCardProps["imageRatio"])}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="4:5">4:5 (Instagram Portrait)</option>
            <option value="1:1">1:1 (Square Feed)</option>
            <option value="9:16">9:16 (Story / Reel)</option>
            <option value="16:9">16:9 (Landscape Banner)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            AI Provider
          </label>
          <select
            value={imageProvider}
            onChange={(e) => setImageProvider(e.target.value as FoodPhotoStudioCardProps["imageProvider"])}
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
            Generating the photo…
          </>
        ) : (
          <>
            <PiSparkleBold className="h-4 w-4 mr-2" />
            Generate AI Food Photo
          </>
        )}
      </Button>
    </div>
  );
}
