"use client";

import React from "react";
import { Button } from "@/components/ui";
import {
  PiFilmReelBold,
  PiCameraBold,
  PiUploadSimpleBold,
  PiSpinnerBold,
} from "react-icons/pi";

export interface VideoReelStudioCardProps {
  videoPrompt: string;
  setVideoPrompt: (prompt: string) => void;
  studioRefImage: string;
  setStudioRefImage: (img: string) => void;
  uploadingStudioRef: boolean;
  handleStudioRefUpload: (file?: File) => Promise<void>;
  studioRefInputRef: React.RefObject<HTMLInputElement | null>;
  videoRatio: "9:16" | "16:9";
  setVideoRatio: (ratio: "9:16" | "16:9") => void;
  videoDuration: number;
  setVideoDuration: (dur: number) => void;
  generatingVideo: boolean;
  handleGenerateVideo: () => Promise<void>;
  videoStatus: string | null;
}

export function VideoReelStudioCard({
  videoPrompt,
  setVideoPrompt,
  studioRefImage,
  setStudioRefImage,
  uploadingStudioRef,
  handleStudioRefUpload,
  studioRefInputRef,
  videoRatio,
  setVideoRatio,
  videoDuration,
  setVideoDuration,
  generatingVideo,
  handleGenerateVideo,
  videoStatus,
}: VideoReelStudioCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-foreground block mb-2">
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
          <label className="text-xs font-semibold text-foreground flex items-center gap-2">
            <PiCameraBold className="h-3.5 w-3.5 text-warning-foreground" />
            <span>Starting Frame / Reference Image (Optional)</span>
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
                Starting Frame Image Attached
              </p>
              <p className="text-caption text-muted-foreground">
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
              className="h-8 text-xs flex items-center gap-2 shrink-0"
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
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            Format / Aspect Ratio
          </label>
          <select
            value={videoRatio}
            onChange={(e) => setVideoRatio(e.target.value as VideoReelStudioCardProps["videoRatio"])}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="9:16">9:16 (Instagram Reel / Shorts)</option>
            <option value="16:9">16:9 (Landscape Display)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
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
  );
}
