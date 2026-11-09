"use client";

import React, { useId, useState } from "react";
import { type GoogleReviewRecord } from "@/services/workspace.service";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Notice } from "@/components/ui/Notice";
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
  const replyId = useId();
  const toneId = useId();
  // Replies are public on Google, so sending takes a second, explicit click.
  const [confirming, setConfirming] = useState(false);

  // A different review starts back at the editing step (adjusted during render).
  const reviewId = selectedReview?.id;
  const [confirmingFor, setConfirmingFor] = useState(reviewId);
  if (confirmingFor !== reviewId) {
    setConfirmingFor(reviewId);
    setConfirming(false);
  }

  if (!selectedReview) return null;

  const footer = confirming ? (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={() => setConfirming(false)} disabled={submittingReply}>
        Back
      </Button>
      <Button type="button" variant="primary" loading={submittingReply} onClick={onSubmitReply}>
        Post reply
      </Button>
    </ModalFooter>
  ) : (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" variant="primary" onClick={() => setConfirming(true)} disabled={!replyText.trim()}>
        Send reply
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen onClose={onClose} title={`Reply to ${selectedReview.authorName}`} maxWidth="max-w-lg" footer={footer}>
      <div className="space-y-4">
        <figure className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <figcaption className="text-body-medium text-foreground">{selectedReview.authorName}</figcaption>
            <StarRating rating={selectedReview.rating} />
          </div>
          {selectedReview.text && (
            <blockquote className="mt-2 text-body text-muted-foreground">{selectedReview.text}</blockquote>
          )}
        </figure>

        {confirming ? (
          <Notice tone="info" title="This reply will be public on Google">
            Anyone who reads this review will see it. You can edit or delete it later from your Google Business profile.
          </Notice>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <label htmlFor={toneId} className="block text-body-medium text-foreground">
                  Tone for a suggested reply
                </label>
                <select
                  id={toneId}
                  value={draftTone}
                  onChange={(e) => setDraftTone(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                variant="secondary"
                loading={generatingAi}
                onClick={() => onGenerateAiReply(selectedReview, draftTone)}
              >
                {replyText ? "Suggest another" : "Suggest a reply"}
              </Button>
            </div>

            <div className="space-y-2">
              <label htmlFor={replyId} className="block text-body-medium text-foreground">
                Your reply
              </label>
              <textarea
                id={replyId}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                className="w-full rounded-md border border-input bg-background p-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <p className="text-caption text-muted-foreground">Edit the suggestion as much as you like before sending.</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
