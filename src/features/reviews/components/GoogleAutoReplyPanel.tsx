"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import {
  type GoogleBusinessStatus,
} from "@/services/google.service";
import { cn } from "@/utils/cn";
import {
  PiCaretDownBold,
  PiCheckCircleFill,
  PiGoogleLogoBold,
  PiRobotBold,
  PiSparkleBold,
  PiXBold,
} from "react-icons/pi";
import { AUTO_REPLY_TONE_OPTIONS } from "../types";

interface GoogleAutoReplyPanelProps {
  googleStatus: GoogleBusinessStatus | null;
  isConnected: boolean;
  showSettingsPanel: boolean;
  setShowSettingsPanel: React.Dispatch<React.SetStateAction<boolean>>;
  connecting: boolean;
  onConnect: () => void;
  onOpenDisconnectModal: () => void;
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  aiTone: string;
  setAiTone: (val: string) => void;
  customPrompt: string;
  setCustomPrompt: (val: string) => void;
  runningAutoReply: boolean;
  onRunAutoReplyBatch: () => void;
  savingSettings: boolean;
  onSaveSettings: () => void;
}

export function GoogleAutoReplyPanel({
  googleStatus,
  isConnected,
  showSettingsPanel,
  setShowSettingsPanel,
  connecting,
  onConnect,
  onOpenDisconnectModal,
  enabled,
  setEnabled,
  minRating,
  setMinRating,
  aiTone,
  setAiTone,
  customPrompt,
  setCustomPrompt,
  runningAutoReply,
  onRunAutoReplyBatch,
  savingSettings,
  onSaveSettings,
}: GoogleAutoReplyPanelProps) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      {/* Panel Header / Toggle row */}
      <button
        type="button"
        onClick={() => setShowSettingsPanel((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-muted/40 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
            <PiGoogleLogoBold size={18} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Google Business &amp; AI Auto-Reply
              </span>
              <Badge tone={isConnected ? "success" : "neutral"}>
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
              {isConnected && googleStatus?.autoReplyEnabled && (
                <Badge tone="primary" className="gap-1">
                  <PiRobotBold size={11} /> Auto-Reply ON
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {isConnected
                ? googleStatus?.autoReplyEnabled
                  ? `AI replies to reviews ≥ ${googleStatus.autoReplyMinRating} stars via Gemini`
                  : `Connected as ${googleStatus?.accountName || "Google Business"} — auto-reply paused`
                : "Connect your Google account to enable AI-powered automated review replies"}
            </p>
          </div>
        </div>
        <PiCaretDownBold
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            showSettingsPanel && "rotate-180"
          )}
        />
      </button>

      {/* Expandable Settings Panel */}
      {showSettingsPanel && (
        <div className="border-t border-border px-4 pb-5 pt-4 space-y-5">
          {/* Connection row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isConnected ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <PiCheckCircleFill size={15} className="text-emerald-500 shrink-0" />
                <span>
                  Signed in as{" "}
                  <span className="font-bold text-foreground">
                    {googleStatus?.accountName || "Google Business Profile"}
                  </span>
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sign in with Google to start auto-replying to reviews.
              </p>
            )}
            <div className="flex items-center gap-2 shrink-0">
              {isConnected ? (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  startIcon={<PiXBold className="size-3.5" />}
                  onClick={onOpenDisconnectModal}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  loading={connecting}
                  onClick={onConnect}
                  startIcon={<PiGoogleLogoBold className="size-4" />}
                  className="bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-semibold"
                >
                  Connect Google Account
                </Button>
              )}
            </div>
          </div>

          {/* AI Auto-Reply settings — only shown when connected */}
          {isConnected && (
            <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
              {/* Header + master toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiRobotBold size={16} className="text-primary" />
                  <span className="text-xs font-bold text-foreground">AI Auto-Reply Engine</span>
                  <span className="text-[11px] text-muted-foreground">Powered by Gemini 2.5 Flash</span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>

              <div
                className={cn(
                  "space-y-4 transition-opacity",
                  !enabled && "opacity-50 pointer-events-none"
                )}
              >
                {/* Rating threshold */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Auto-Reply Threshold
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={1}>All reviews (1 to 5 stars)</option>
                    <option value={3}>3 stars and above</option>
                    <option value={4}>4 stars and above</option>
                    <option value={5}>5 stars only</option>
                  </select>
                </div>

                {/* Tone selector */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    AI Voice &amp; Tone
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {AUTO_REPLY_TONE_OPTIONS.map((t) => {
                      const selected = aiTone === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setAiTone(t.id)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center text-xs font-medium transition-all cursor-pointer",
                            selected
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                              : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          <span className="text-base">{t.icon}</span>
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom prompt */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Custom Business Context{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={2}
                    placeholder="e.g. We are known for our wood-fired pizzas. For complaints, invite guests to email care@restaurant.com."
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Save + Run Now */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={runningAutoReply}
                  onClick={onRunAutoReplyBatch}
                  startIcon={<PiSparkleBold className="size-4 text-primary" />}
                  className="text-xs font-semibold"
                >
                  Run Auto-Reply on Pending Reviews Now
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  loading={savingSettings}
                  onClick={onSaveSettings}
                  className="text-xs font-bold"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
