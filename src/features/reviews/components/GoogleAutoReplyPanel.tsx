"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { type GoogleBusinessStatus } from "@/services/google.service";
import { cn } from "@/utils/cn";
import { PiCheckCircleFill, PiGoogleLogoBold, PiSparkleBold, PiXBold } from "react-icons/pi";
import { AUTO_REPLY_TONE_OPTIONS } from "@/constants/reviews.constants";

interface AutoReplySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleStatus: GoogleBusinessStatus | null;
  isConnected: boolean;
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

/** Google connection and automatic-reply settings, kept out of the main page. */
export function AutoReplySettingsModal({
  isOpen,
  onClose,
  googleStatus,
  isConnected,
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
}: AutoReplySettingsModalProps) {
  const footer = isConnected ? (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button type="button" variant="primary" loading={savingSettings} onClick={onSaveSettings}>
        Save settings
      </Button>
    </ModalFooter>
  ) : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Automatic replies" maxWidth="max-w-xl" footer={footer}>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2 text-body text-muted-foreground">
                <PiCheckCircleFill size={16} className="shrink-0 text-success" aria-hidden />
                <span>
                  Connected as{" "}
                  <span className="font-medium text-foreground">
                    {googleStatus?.accountName || "your Google Business account"}
                  </span>
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                startIcon={<PiXBold className="size-3.5" />}
                onClick={onOpenDisconnectModal}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <>
              <p className="text-body text-muted-foreground">Connect Google to reply to reviews and turn this on.</p>
              <Button
                type="button"
                size="sm"
                loading={connecting}
                onClick={onConnect}
                startIcon={<PiGoogleLogoBold className="size-4" />}
              >
                Connect Google
              </Button>
            </>
          )}
        </div>

        {isConnected ? (
          <>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-3">
              <span>
                <span className="block text-body-medium text-foreground">Reply automatically</span>
                <span className="block text-caption text-muted-foreground">
                  New reviews get a written reply, posted to Google straight away.
                </span>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="relative h-6 w-11 shrink-0 rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary after:absolute after:start-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-5"
              />
            </label>

            <div className={cn("space-y-4 transition-opacity", !enabled && "pointer-events-none opacity-50")}>
              <div>
                <label htmlFor="auto-reply-threshold" className="mb-1 block text-body-medium text-foreground">
                  Which reviews
                </label>
                <select
                  id="auto-reply-threshold"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <option value={1}>All reviews (1 to 5 stars)</option>
                  <option value={3}>3 stars and above</option>
                  <option value={4}>4 stars and above</option>
                  <option value={5}>5 stars only</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-body-medium text-foreground">Tone</p>
                <div className="grid grid-cols-2 gap-2">
                  {AUTO_REPLY_TONE_OPTIONS.map((t) => {
                    const selected = aiTone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setAiTone(t.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-body transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          selected
                            ? "border-primary bg-primary/10 font-medium text-foreground"
                            : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <span aria-hidden>{t.icon}</span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="auto-reply-context" className="mb-1 block text-body-medium text-foreground">
                  About your business <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="auto-reply-context"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g. We're known for wood-fired pizza. For complaints, invite guests to email care@restaurant.com."
                  className="w-full rounded-md border border-input bg-background p-3 text-body text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={runningAutoReply}
                onClick={onRunAutoReplyBatch}
                startIcon={<PiSparkleBold className="size-4 text-primary" />}
              >
                Reply to all waiting reviews now
              </Button>
              <p className="mt-1.5 text-caption text-muted-foreground">
                Posts replies without a preview. To check each one first, use “Draft replies” on the page.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
