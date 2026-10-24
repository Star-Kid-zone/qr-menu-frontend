"use client";

import React from "react";
import {
  Card,
  Button,
} from "@/shared/components";
import {
  PiEyeBold,
  PiUploadSimpleBold,
  PiSpinnerBold,
  PiTrashBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
import { SAMPLE_DECODER_CONTEXTS } from "../constants";

interface DecoderTabProps {
  decoderInputMode: "upload" | "url";
  setDecoderInputMode: (mode: "upload" | "url") => void;
  decoderImageUrl: string;
  setDecoderImageUrl: (url: string) => void;
  decoderFile: File | null;
  setDecoderFile: (file: File | null) => void;
  uploadingDecoderFile: boolean;
  handleDecoderFileUpload: (file?: File) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  decoderModel: string;
  setDecoderModel: (model: string) => void;
  decoderContext: string;
  setDecoderContext: (context: string) => void;
  decoding: boolean;
  handleDecode: () => Promise<void>;
  decodedSpec: any;
  setDecodedSpec: (spec: any) => void;
  refinementPrompt: string;
  setRefinementPrompt: (prompt: string) => void;
  refining: boolean;
  handleRefine: () => Promise<void>;
  savingTemplate: boolean;
  handleSaveDecodedToVault: () => Promise<void>;
}

export function DecoderTab({
  decoderInputMode,
  setDecoderInputMode,
  decoderImageUrl,
  setDecoderImageUrl,
  decoderFile,
  setDecoderFile,
  uploadingDecoderFile,
  handleDecoderFileUpload,
  fileInputRef,
  decoderModel,
  setDecoderModel,
  decoderContext,
  setDecoderContext,
  decoding,
  handleDecode,
  decodedSpec,
  setDecodedSpec,
  refinementPrompt,
  setRefinementPrompt,
  refining,
  handleRefine,
  savingTemplate,
  handleSaveDecodedToVault,
}: DecoderTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Image Input & Config */}
      <div className="lg:col-span-5 space-y-5">
        <Card className="p-5 space-y-4 border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <PiEyeBold className="h-5 w-5 text-amber-500" />
              Poster Vision Reverse-Engineer
            </h3>
            <p className="text-caption text-muted-foreground mt-1">
              Upload competitor or promotional flyers. Vision AI extracts typography, colors, headline,
              and layout layers into an editable, reusable layout blueprint.
            </p>
          </div>

          {/* Source Image: File Upload or Image URL */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Poster / Flyer Image
              </label>
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/40 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDecoderInputMode("upload")}
                  className={cn(
                    "px-2.5 py-0.5 rounded font-medium transition-all",
                    decoderInputMode === "upload"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setDecoderInputMode("url")}
                  className={cn(
                    "px-2.5 py-0.5 rounded font-medium transition-all",
                    decoderInputMode === "url"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Image URL
                </button>
              </div>
            </div>

            {decoderInputMode === "upload" ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleDecoderFileUpload(e.target.files?.[0])}
                />

                {!decoderImageUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files?.[0]) handleDecoderFileUpload(e.dataTransfer.files[0]);
                    }}
                    className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 p-6 text-center cursor-pointer transition-all hover:border-primary/60 hover:bg-primary/5 active:scale-[0.99]"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-4 ring-amber-500/5 transition-transform group-hover:scale-110">
                      {uploadingDecoderFile ? (
                        <PiSpinnerBold className="h-6 w-6 animate-spin" />
                      ) : (
                        <PiUploadSimpleBold className="h-6 w-6" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {uploadingDecoderFile ? "Uploading to storage..." : "Click to select flyer or drag & drop"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, or WEBP (up to 15MB)
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-3 space-y-3">
                    <div className="relative aspect-[4/5] max-h-[300px] w-full overflow-hidden rounded-xl border border-border bg-zinc-950 flex items-center justify-center">
                      <img
                        src={decoderImageUrl}
                        alt="Uploaded Target Poster"
                        className="h-full w-full object-contain"
                      />
                      {uploadingDecoderFile && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2">
                          <PiSpinnerBold className="h-4 w-4 animate-spin" />
                          <span>Uploading to storage...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="truncate max-w-[200px]">
                        <p className="font-medium text-foreground truncate">
                          {decoderFile?.name || "Selected Poster Image"}
                        </p>
                        {decoderFile && (
                          <p className="text-[10px] text-muted-foreground">
                            {(decoderFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change File
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDecoderImageUrl("");
                            setDecoderFile(null);
                            setDecodedSpec(null);
                          }}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <PiTrashBold className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://example.com/competitor-flyer.jpg"
                  value={decoderImageUrl}
                  onChange={(e) => {
                    setDecoderImageUrl(e.target.value);
                    setDecoderFile(null);
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                {decoderImageUrl && (
                  <div className="relative aspect-[4/5] w-full max-h-[280px] rounded-xl overflow-hidden border border-border bg-zinc-950 flex items-center justify-center">
                    <img
                      src={decoderImageUrl}
                      alt="Target Poster"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              AI Vision Model
            </label>
            <select
              value={decoderModel}
              onChange={(e) => setDecoderModel(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Fast & Free)</option>
              <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Ultra Crisp Layouts)</option>
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Maximum Spatial Accuracy)</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground block">
                Context / Special Instructions
              </label>
              <span className="text-[11px] text-muted-foreground">Click a sample to fill</span>
            </div>

            {/* Sample Context Chips */}
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_DECODER_CONTEXTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDecoderContext(sample.text)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] transition-all border",
                    decoderContext === sample.text
                      ? "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                      : "border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {sample.title}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="e.g. South Indian restaurant weekend festival flyer, extract pricing badges and Tamil font hierarchy..."
              value={decoderContext}
              onChange={(e) => setDecoderContext(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleDecode}
            disabled={decoding || !decoderImageUrl.trim()}
          >
            {decoding ? (
              <>
                <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                Reverse-Engineering Blueprint...
              </>
            ) : (
              <>
                <PiEyeBold className="h-4 w-4 mr-2" />
                Decode Poster Blueprint
              </>
            )}
          </Button>
        </Card>

        {/* Refinement Panel */}
        {decodedSpec && (
          <Card className="p-5 space-y-3 border-amber-500/20 bg-amber-500/5">
            <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Refine Layout Blueprint
            </h4>
            <p className="text-caption text-muted-foreground">
              Give instructions to adjust colors, translate text to Tamil/Hindi, or modify discount tags.
            </p>
            <textarea
              rows={2}
              placeholder="e.g. Change primary color to luxury royal crimson and translate headline to Tamil..."
              value={refinementPrompt}
              onChange={(e) => setRefinementPrompt(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefine}
              disabled={refining || !refinementPrompt.trim()}
              className="w-full"
            >
              {refining ? "Refining..." : "Apply AI Refinement"}
            </Button>
          </Card>
        )}
      </div>

      {/* Right Column: Decoded Blueprint, Render & Save */}
      <div className="lg:col-span-7 space-y-5">
        {decodedSpec ? (
          <Card className="p-5 space-y-5 border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-base text-foreground">
                  Extracted Blueprint Layers
                </h3>
                <p className="text-xs text-muted-foreground">
                  Canvas: {decodedSpec.canvas?.width}x{decodedSpec.canvas?.height}px •{" "}
                  {decodedSpec.layers?.length || 0} layout layers identified
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveDecodedToVault}
                  disabled={savingTemplate}
                >
                  {savingTemplate ? "Saving..." : "Save to Vault & Templates"}
                </Button>
              </div>
            </div>

            {/* Layer Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Layer Hierarchy
              </h4>
              <div className="divide-y divide-border rounded-lg border border-border bg-muted/20">
                {decodedSpec.layers?.map((layer: any, idx: number) => (
                  <div key={layer.id || idx} className="p-3 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground capitalize">
                          {layer.role || "Layer"}
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {layer.fontFamily || "Default Font"} ({layer.fontSize || 24}px)
                        </span>
                      </div>
                      <p className="text-muted-foreground font-mono text-[11px] line-clamp-1">
                        &ldquo;{layer.text || "Graphic/Badge"}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {layer.fill && (
                        <span
                          className="h-5 w-5 rounded-full border border-border shadow-inner"
                          style={{ backgroundColor: layer.fill }}
                          title={`Fill: ${layer.fill}`}
                        />
                      )}
                      <span className="text-muted-foreground font-mono text-[10px]">
                        ({layer.x}, {layer.y})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw JSON Spec Drawer */}
            <details className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
              <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                Inspect Raw PosterSpec JSON
              </summary>
              <pre className="mt-2 max-h-60 overflow-y-auto rounded bg-zinc-950 p-3 text-[11px] text-zinc-300 font-mono">
                {JSON.stringify(decodedSpec, null, 2)}
              </pre>
            </details>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-border">
            <PiEyeBold className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h4 className="text-base font-semibold text-foreground">No Poster Decoded Yet</h4>
            <p className="text-caption text-muted-foreground max-w-sm mt-1">
              Upload a poster file or enter an image URL on the left and click &ldquo;Decode Poster Blueprint&rdquo;
              to extract the design hierarchy.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
