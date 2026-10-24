"use client";

import React from "react";
import { type GoogleReviewRecord } from "@/services/workspace.service";
import { Button } from "@/components/ui/button";
import {
  PiChatCircleTextBold,
  PiSparkleBold,
  PiXBold,
} from "react-icons/pi";
import { StarRating } from "./StarRating";
import { AUTO_REPLY_TONE_OPTIONS } from "../types";

interface ReplyModalProps {
  selectedReview: GoogleReviewRecord | null;
  onClose: () => void;
  replyText: string;
  setReplyText: (text: string) => void;
  generatingAi: boolean;
  onGenerateAiReply: (review: GoogleReviewRecord, tone?: string) => void;
  draftTone: string;
  setDraftTone: (tone: string) => void;
  submittingReply: boolean;
  onSubmitReply: () => void;
}

export function ReplyModal({
  selectedReview,
  onClose,
  replyText,
  setReplyText,
  generatingAi,
  onGenerateAiReply,
  draftTone,
  setDraftTone,
  submittingReply,
  onSubmitReply,
}: ReplyModalProps) {
  if (!selectedReview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PiChatCircleTextBold size={16} />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Reply to {selectedReview.authorName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
          >
            <PiXBold size={14} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
          {/* Review summary */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-foreground">{selectedReview.authorName}</span>
              <StarRating rating={selectedReview.rating} />
            </div>
            {selectedReview.text && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                &ldquo;{selectedReview.text}&rdquo;
              </p>
            )}
          </div>

          {/* AI Generate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <PiSparkleBold size={14} className="text-primary" />
                Generate with Gemini AI
              </label>
              <select
                value={draftTone}
                onChange={(e) => setDraftTone(e.target.value)}
                className="rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {AUTO_REPLY_TONE_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={generatingAi}
              onClick={() => onGenerateAiReply(selectedReview, draftTone)}
              className="w-full text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10"
            >
              {replyText ? "Regenerate Draft" : "Generate AI Draft"}
            </Button>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Your Reply
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Write your response to this customer..."
              className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-3.5 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submittingReply}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            loading={submittingReply}
            onClick={onSubmitReply}
            disabled={!replyText.trim()}
          >
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
