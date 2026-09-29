"use client";

import { useEffect, useState } from "react";
import {
  PiGoogleLogoBold,
  PiRobotBold,
  PiCheckCircleFill,
  PiArrowsClockwiseBold,
  PiSlidersBold,
  PiSparkleBold,
  PiWarningCircleBold,
  PiXBold,
  PiChatCircleTextBold,
  PiStarFill,
} from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils/errors";
import {
  googleService,
  type GoogleBusinessStatus,
  type AutoReplySettingsInput,
} from "@/services/google.service";

interface GoogleBusinessCardProps {
  onStatusChange?: (status: GoogleBusinessStatus) => void;
}

export function GoogleBusinessCard({ onStatusChange }: GoogleBusinessCardProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [runningBatch, setRunningBatch] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState<GoogleBusinessStatus | null>(null);

  // Auto-reply form state
  const [enabled, setEnabled] = useState(false);
  const [minRating, setMinRating] = useState<number>(3);
  const [aiTone, setAiTone] = useState<string>("warm_professional");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // Disconnect dialog state
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  async function loadStatus() {
    try {
      setLoading(true);
      const data = await googleService.getStatus();
      setStatus(data);
      setEnabled(data.autoReplyEnabled);
      setMinRating(data.autoReplyMinRating);
      setAiTone(data.autoReplyAiTone || "warm_professional");
      setCustomPrompt(data.autoReplyCustomPrompt || "");
      if (onStatusChange) onStatusChange(data);
    } catch (err) {
      console.error("Failed to load Google Business status:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStatus();
  }, []);

  // Connect handler
  const handleConnect = async () => {
    try {
      setConnecting(true);
      const res = await googleService.getOAuthUrl();
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to start Google authentication"));
      setConnecting(false);
    }
  };

  // Disconnect handler
  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await googleService.disconnect();
      toast.success("Google Business profile disconnected");
      setShowDisconnectModal(false);
      await loadStatus();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to disconnect Google Business"));
    } finally {
      setDisconnecting(false);
    }
  };

  // Save auto-reply settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const payload: AutoReplySettingsInput = {
        enabled,
        minRating: Number(minRating),
        aiTone,
        customPrompt: customPrompt.trim() || null,
      };
      const res = await googleService.updateAutoReplySettings(payload);
      setStatus(res.status);
      toast.success("Auto-reply settings saved successfully");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save settings"));
    } finally {
      setSaving(false);
    }
  };

  // Trigger immediate batch auto-reply
  const handleRunBatch = async () => {
    try {
      setRunningBatch(true);
      const res = await googleService.runAutoReply();
      if (res.repliedCount > 0) {
        toast.success(`Successfully replied to ${res.repliedCount} pending reviews with AI!`);
      } else {
        toast.info("No unreplied reviews matching criteria found.");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to run auto-reply batch"));
    } finally {
      setRunningBatch(false);
    }
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-8">
        <Spinner size="md" />
      </Card>
    );
  }

  const isConnected = !!status?.isConnected;

  return (
    <div className="space-y-4">
      {/* 1. Connection Card */}
      <Card className="overflow-hidden border-border bg-card p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
              <PiGoogleLogoBold size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Google My Business & Reviews</h3>
                <Badge tone={isConnected ? "success" : "neutral"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Sync live Google reviews and use Gemini AI to automatically generate personalized, empathetic replies.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isConnected ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                startIcon={<PiXBold className="size-3.5" />}
                onClick={() => setShowDisconnectModal(true)}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                loading={connecting}
                onClick={handleConnect}
                startIcon={<PiGoogleLogoBold className="size-4" />}
                className="bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-semibold shadow-xs"
              >
                Connect Google Account
              </Button>
            )}
          </div>
        </div>

        {isConnected && status && (
          <div className="mt-4 rounded-lg border border-border/70 bg-muted/30 p-3.5">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Account / Profile</span>
                <p className="font-semibold text-foreground">{status.accountName || "Google Business Profile"}</p>
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</span>
                <p className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <PiCheckCircleFill size={14} /> Active & Ready
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 2. Auto-Reply Configuration Card */}
      <Card className="border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PiRobotBold size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">AI Review Auto-Reply Engine</h4>
              <p className="text-xs text-muted-foreground">Powered by Google Gemini 2.5 Flash</p>
            </div>
          </div>

          {/* Master Toggle */}
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
          </label>
        </div>

        <div className="mt-4 space-y-4">
          {/* Rating Threshold */}
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Auto-Reply Threshold
            </label>
            <p className="text-[11px] text-muted-foreground mb-1.5">
              Select which reviews receive an automatic AI response:
            </p>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              disabled={!enabled}
              className="w-full sm:w-72 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value={1}>All reviews (1 to 5 stars)</option>
              <option value={3}>3 stars and above (Neutral & Positive)</option>
              <option value={4}>4 stars and above (Positive only)</option>
              <option value={5}>5 stars only</option>
            </select>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-foreground">
              AI Voice & Tone
            </label>
            <p className="text-[11px] text-muted-foreground mb-1.5">
              Customize the personality of your AI review responses:
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "warm_professional", label: "Warm & Professional", icon: "✨" },
                { id: "friendly", label: "Friendly & Casual", icon: "👋" },
                { id: "enthusiastic", label: "Enthusiastic & Grateful", icon: "🎉" },
                { id: "concise", label: "Concise & Direct", icon: "🎯" },
              ].map((t) => {
                const selected = aiTone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!enabled}
                    onClick={() => setAiTone(t.id)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                      selected
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    } ${!enabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt Instructions */}
          <div>
            <label className="block text-xs font-semibold text-foreground">
              Custom Business Context / Instructions (Optional)
            </label>
            <p className="text-[11px] text-muted-foreground mb-1.5">
              Give Gemini extra context (e.g. key dishes, owner name, manager email for unhappy guests):
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={!enabled}
              rows={2}
              placeholder="e.g. We are known for our wood-fired pizzas and fresh pasta. For complaints, invite guests to email care@ourrestaurant.com."
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={runningBatch}
              onClick={handleRunBatch}
              startIcon={<PiSparkleBold className="size-4 text-primary" />}
              className="text-xs font-semibold"
            >
              Run Auto-Reply on Pending Reviews Now
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSaveSettings}
              className="text-xs font-bold"
            >
              Save Auto-Reply Rules
            </Button>
          </div>
        </div>
      </Card>

      {/* Disconnect Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <PiWarningCircleBold size={24} />
              <h3 className="text-sm font-bold text-foreground">Disconnect Google Account?</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Disconnecting will pause automatic review syncing and AI auto-replies until reconnected.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDisconnectModal(false)}
                disabled={disconnecting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={disconnecting}
                onClick={handleDisconnect}
              >
                Confirm Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
