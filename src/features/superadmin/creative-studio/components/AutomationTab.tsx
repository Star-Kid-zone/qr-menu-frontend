"use client";

import React from "react";
import {
  Card,
  Button,
} from "@/shared/components";
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
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent p-5 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-500 ring-1 ring-cyan-500/30">
            <PiBrowsersBold className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Zero-Cost External AI Generator (Playwright Remote Chrome CDP)</span>
              <span className="rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 font-bold uppercase">
                No Paid API Keys Needed
              </span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate food imagery and typography posters using your personal ChatGPT Plus, Ideogram,
              or Google Gemini subscriptions. The script attaches to your running Chrome window, enters
              your prompt, captures the output, and <strong>automatically commits it to your Superadmin Vault</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Step 1: Open Chrome & sign in to target site
              </span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Step 2: In Chrome, enable <code>chrome://inspect/#remote-debugging</code>
              </span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Step 3: Click Run Script & click &ldquo;Allow&rdquo; in Chrome
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Selection & Config */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="p-5 space-y-4 border-border">
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                1. Select Target Automation Script
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
                        ? "border-cyan-500 bg-cyan-500/10 shadow-xs"
                        : "border-border bg-card hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{s.name}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                          {s.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{s.desc}</p>
                    </div>
                    <span className="rounded bg-background border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground shrink-0">
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
                  2. Food / Poster Prompt
                </label>
              </div>
              <textarea
                rows={4}
                value={automationPrompt}
                onChange={(e) => setAutomationPrompt(e.target.value)}
                placeholder="Describe your dish or flyer..."
                className="w-full rounded-lg border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
              />

              {/* Preset Inspiration Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_IMAGE_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAutomationPrompt(p)}
                    className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground text-left line-clamp-1"
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
                  Vault Asset Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biryani Bonanza Promo"
                  value={automationTitle}
                  onChange={(e) => setAutomationTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground font-medium">
                <input
                  type="checkbox"
                  checked={autoIngest}
                  onChange={(e) => setAutoIngest(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500"
                />
                <span>Automatically upload and commit generated image to Superadmin Vault</span>
              </label>
            </div>

            <Button
              variant="primary"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              onClick={handleRunAutomation}
              disabled={runningScript || !automationPrompt.trim()}
            >
              {runningScript ? (
                <>
                  <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                  Executing Playwright CDP Runner...
                </>
              ) : (
                <>
                  <PiLightningBold className="h-4 w-4 mr-2" />
                  Run Automation &amp; Ingest to Vault
                </>
              )}
            </Button>
          </Card>

          {/* Local Downloads Drawer */}
          <Card className="p-4 space-y-3 border-border">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <PiImagesBold className="h-4 w-4 text-muted-foreground" />
                <span>Existing Local Downloads ({scriptDownloads.length})</span>
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
                No files currently in <code>scripts/downloads</code>.
              </p>
            ) : (
              <div className="max-h-52 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {scriptDownloads.map((f) => (
                  <div key={f.name} className="flex items-center justify-between p-2.5 text-xs">
                    <div className="space-y-0.5 truncate pr-2">
                      <p className="font-semibold text-foreground truncate">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {Math.round(f.sizeBytes / 1024)} KB • {new Date(f.mtime).toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-[11px] h-7 px-2"
                      onClick={() => handleIngestDownload(f.name)}
                      disabled={ingestingDownload === f.name}
                    >
                      {ingestingDownload === f.name ? "Importing..." : "Import to Vault"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Live Streaming Terminal & Output */}
        <div className="lg:col-span-7 space-y-5">
          {/* Live Ingested Asset Preview */}
          {lastIngestedAsset && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <PiCheckCircleBold className="h-4 w-4" />
                  Successfully Ingested to Vault (Asset ID #{lastIngestedAsset.id})
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
                  Dispatch to Tenants Now
                </Button>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src={lastIngestedAsset.mediaUrl}
                  alt={lastIngestedAsset.title}
                  className="h-28 w-28 rounded-xl object-cover border border-emerald-500/30 shadow-md"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-foreground text-sm">{lastIngestedAsset.title}</p>
                  <p className="text-muted-foreground line-clamp-2">{lastIngestedAsset.captionSuggestion}</p>
                  <p className="text-primary font-mono text-[11px]">{lastIngestedAsset.hashtags?.join(" ")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Streaming Terminal Window */}
          <Card className="overflow-hidden border-border bg-zinc-950 text-zinc-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-zinc-400">
                  playwright-cdp-console ~ {automationScript}
                </span>
              </div>

              {runningScript && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Streaming Execution Output...
                </span>
              )}
            </div>

            <pre className="max-h-[500px] min-h-[380px] overflow-y-auto p-4 font-mono text-xs leading-relaxed text-emerald-400 selection:bg-emerald-900 selection:text-white whitespace-pre-wrap">
              {scriptLog || (
                <span className="text-zinc-600">
                  Ready to execute automation script.
                  {"\n"}Select an AI engine on the left, type your prompt, and click &ldquo;Run Automation &amp; Ingest to Vault&rdquo;.
                  {"\n"}Logs from your local Chrome CDP session will stream here in real-time.
                </span>
              )}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
}
