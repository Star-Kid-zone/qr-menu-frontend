"use client";

import React from "react";
import {
  Card,
  Button,
} from "@/components/ui";
import {
  PiBrowsersBold,
  PiImagesBold,
  PiArrowsClockwiseBold,
  PiCheckCircleBold,
  PiPaperPlaneTiltBold,
  PiSpinnerBold,
  PiLightningBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
import { AUTOMATION_SCRIPTS, PRESET_IMAGE_PROMPTS } from "../constants";
import type { PlatformMarketingAsset, ScriptDownloadItem } from "../types";
import { formatTime } from "@/utils/date";

interface AutomationTabProps {
  automationScript: string;
  setAutomationScript: (script: string) => void;
  automationPrompt: string;
  setAutomationPrompt: (prompt: string) => void;
  automationTitle: string;
  setAutomationTitle: (title: string) => void;
  autoIngest: boolean;
  setAutoIngest: (auto: boolean) => void;
  runningScript: boolean;
  handleRunAutomation: () => Promise<void>;
  scriptDownloads: ScriptDownloadItem[];
  loadingDownloads: boolean;
  loadDownloads: () => Promise<void>;
  handleIngestDownload: (name: string) => Promise<void>;
  ingestingDownload: string | null;
  lastIngestedAsset: PlatformMarketingAsset | null;
  setPublishModalAsset: (asset: PlatformMarketingAsset | null) => void;
  setActiveTab: (tab: "vault" | "decoder" | "aistudio" | "automation") => void;
  scriptLog: string;
}

export function AutomationTab({
  automationScript,
  setAutomationScript,
  automationPrompt,
  setAutomationPrompt,
  automationTitle,
  setAutomationTitle,
  autoIngest,
  setAutoIngest,
  runningScript,
  handleRunAutomation,
  scriptDownloads,
  loadingDownloads,
  loadDownloads,
  handleIngestDownload,
  ingestingDownload,
  lastIngestedAsset,
  setPublishModalAsset,
  setActiveTab,
  scriptLog,
}: AutomationTabProps) {
  return (
    <div className="space-y-6">
      {/* Quick How-It-Works Banner */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info/20 text-info ring-1 ring-info/30">
            <PiBrowsersBold className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Generate with your ChatGPT or Ideogram login</span>
              <span className="rounded bg-success/10 text-success text-caption px-2 py-0.5 font-medium">
                No paid AI keys needed
              </span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Make food photos and posters with your own ChatGPT Plus, Ideogram or Google Gemini
              subscription. It uses your open Chrome window, types your prompt, and saves the result to
              your saved assets.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-caption text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Step 1: Open Chrome and sign in to the site
              </span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Step 2: In Chrome, enable <code>chrome://inspect/#remote-debugging</code>
              </span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Step 3: Click Generate, then &ldquo;Allow&rdquo; in Chrome
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Selection & Config */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4 border-border">
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">
                1. Choose where to generate
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {AUTOMATION_SCRIPTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setAutomationScript(s.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-3 text-left transition-all",
                      automationScript === s.id
                        ? "border-info bg-info/10 shadow-xs"
                        : "border-border bg-card hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{s.name}</span>
                        <span className="rounded bg-muted px-2 py-0.5 text-caption font-semibold text-muted-foreground">
                          {s.badge}
                        </span>
                      </div>
                      <p className="text-caption text-muted-foreground line-clamp-1">{s.desc}</p>
                    </div>
                    <span className="rounded bg-background border border-border px-2 py-0.5 text-caption font-mono text-muted-foreground shrink-0">
                      {s.host}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt textarea */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  2. Describe the food photo or poster
                </label>
              </div>
              <textarea
                rows={4}
                value={automationPrompt}
                onChange={(e) => setAutomationPrompt(e.target.value)}
                placeholder="Describe your dish or flyer..."
                className="w-full rounded-lg border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-info"
              />

              {/* Preset Inspiration Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {PRESET_IMAGE_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAutomationPrompt(p)}
                    className="rounded-full border border-border bg-muted/30 px-3 py-1 text-caption text-muted-foreground hover:bg-muted hover:text-foreground text-left line-clamp-1"
                  >
                    {p.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Title & Auto Ingest */}
            <div className="space-y-3 pt-2 border-t border-border/80">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Title (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biryani weekend offer"
                  value={automationTitle}
                  onChange={(e) => setAutomationTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-info"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground font-medium">
                <input
                  type="checkbox"
                  checked={autoIngest}
                  onChange={(e) => setAutoIngest(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-info focus:ring-info"
                />
                <span>Save the result to saved assets automatically</span>
              </label>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleRunAutomation}
              disabled={runningScript || !automationPrompt.trim()}
            >
              {runningScript ? (
                <>
                  <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                  Generating…
                </>
              ) : (
                <>
                  <PiLightningBold className="h-4 w-4 mr-2" />
                  Generate and save
                </>
              )}
            </Button>
          </Card>

          {/* Local Downloads Drawer */}
          <Card className="p-4 space-y-3 border-border">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <PiImagesBold className="h-4 w-4 text-muted-foreground" />
                <span>Files already downloaded ({scriptDownloads.length})</span>
              </h4>
              <button
                onClick={loadDownloads}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <PiArrowsClockwiseBold className={cn("h-3 w-3", loadingDownloads && "animate-spin")} />
                Refresh
              </button>
            </div>

            {scriptDownloads.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 text-center">
                No downloaded files yet.
              </p>
            ) : (
              <div className="max-h-52 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {scriptDownloads.map((f) => (
                  <div key={f.name} className="flex items-center justify-between p-3 text-xs">
                    <div className="space-y-0.5 truncate pr-2">
                      <p className="font-semibold text-foreground truncate">{f.name}</p>
                      <p className="text-caption text-muted-foreground font-mono">
                        {Math.round(f.sizeBytes / 1024)} KB • {formatTime(f.mtime)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-caption h-7 px-2"
                      onClick={() => handleIngestDownload(f.name)}
                      disabled={ingestingDownload === f.name}
                    >
                      {ingestingDownload === f.name ? "Saving…" : "Save to saved assets"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Live Streaming Terminal & Output */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Ingested Asset Preview */}
          {lastIngestedAsset && (
            <div className="rounded-2xl border border-success/30 bg-success/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-success dark:text-success">
                  <PiCheckCircleBold className="h-4 w-4" />
                  Saved to saved assets (#{lastIngestedAsset.id})
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setPublishModalAsset(lastIngestedAsset);
                    setActiveTab("vault");
                  }}
                >
                  <PiPaperPlaneTiltBold className="h-3.5 w-3.5 mr-1" />
                  Send to restaurants
                </Button>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src={lastIngestedAsset.mediaUrl}
                  alt={lastIngestedAsset.title}
                  className="h-28 w-28 rounded-xl object-cover border border-success/30 shadow-md"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-foreground text-sm">{lastIngestedAsset.title}</p>
                  <p className="text-muted-foreground line-clamp-2">{lastIngestedAsset.captionSuggestion}</p>
                  <p className="text-primary font-mono text-caption">{lastIngestedAsset.hashtags?.join(" ")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Streaming Terminal Window */}
          <Card className="overflow-hidden border-border bg-zinc-950 text-muted-foreground shadow-xl">
            <div className="flex items-center justify-between border-b border-border bg-zinc-900/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-destructive/80" />
                <span className="h-3 w-3 rounded-full bg-warning/80" />
                <span className="h-3 w-3 rounded-full bg-success/80" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  Progress · {automationScript}
                </span>
              </div>

              {runningScript && (
                <span className="flex items-center gap-2 font-mono text-caption text-info animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-info/40" />
                  Generating…
                </span>
              )}
            </div>

            <pre className="max-h-[500px] min-h-[380px] overflow-y-auto p-4 font-mono text-xs leading-relaxed text-success selection:bg-success selection:text-white whitespace-pre-wrap">
              {scriptLog || (
                <span className="text-muted-foreground">
                  Ready.
                  {"\n"}Choose where to generate, describe what you want, and click &ldquo;Generate and save&rdquo;.
                  {"\n"}Progress from your Chrome window will show here as it happens.
                </span>
              )}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
}
