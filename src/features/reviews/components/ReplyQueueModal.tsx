"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { type GoogleReviewRecord } from "@/services/workspace.service";
import { googleService } from "@/services/google.service";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Notice } from "@/components/ui/Notice";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils/errors";
import { StarRating } from "./StarRating";
import { AUTO_REPLY_TONE_OPTIONS } from "../types";

interface ReplyQueueModalProps {
  /** Unreplied reviews, already in the order they should be shown. */
  reviews: GoogleReviewRecord[];
  initialTone: string;
  onClose: () => void;
  /** Called with the updated record after each reply is posted. */
  onPosted: (review: GoogleReviewRecord) => void;
}

type DraftStatus = "loading" | "ready" | "error" | "posted" | "skipped";
interface Draft {
  text: string;
  status: DraftStatus;
}

/**
 * Review-and-approve queue: drafts are written one review ahead, and nothing
 * is posted to Google until the owner approves it.
 */
export function ReplyQueueModal({ reviews, initialTone, onClose, onPosted }: ReplyQueueModalProps) {
  const replyId = useId();
  const toneId = useId();
  const [index, setIndex] = useState(0);
  const [tone, setTone] = useState(initialTone);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [posting, setPosting] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const requested = useRef(new Set<string>());
  const toneRef = useRef(initialTone);

  const patch = (id: string, next: Partial<Draft>) =>
    setDrafts((prev) => {
      const current: Draft = prev[id] ?? { text: "", status: "loading" };
      return { ...prev, [id]: { ...current, ...next } };
    });

  const generate = async (review: GoogleReviewRecord) => {
    patch(review.id, { status: "loading" });
    try {
      const res = await googleService.generateAiReply(review.id, { tone: toneRef.current });
      patch(review.id, { text: res.reply, status: "ready" });
    } catch (error) {
      patch(review.id, { status: "error" });
      toast.error(getApiErrorMessage(error, "Couldn't write a draft for that review."));
    }
  };

  // Write the draft for the current review and the next one, so "next" feels instant.
  useEffect(() => {
    for (const review of reviews.slice(index, index + 2)) {
      if (requested.current.has(review.id)) continue;
      requested.current.add(review.id);
      void generate(review);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reviews]);

  const done = index >= reviews.length;
  const review = done ? null : reviews[index];
  const draft = review ? drafts[review.id] : undefined;
  const postedCount = Object.values(drafts).filter((d) => d.status === "posted").length;
  const skippedCount = Object.values(drafts).filter((d) => d.status === "skipped").length;
  const readyAhead = reviews.slice(index).filter((r) => drafts[r.id]?.status === "ready");

  const postOne = async (target: GoogleReviewRecord): Promise<boolean> => {
    const text = drafts[target.id]?.text.trim();
    if (!text) return false;
    try {
      const res = await googleService.replyToReview(target.id, text);
      onPosted(res.review);
      patch(target.id, { status: "posted" });
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, `Couldn't post the reply to ${target.authorName}.`));
      return false;
    }
  };

  const handlePostAndNext = async () => {
    if (!review) return;
    setPosting(true);
    const ok = await postOne(review);
    setPosting(false);
    if (ok) setIndex((i) => i + 1);
  };

  const handleSkip = () => {
    if (!review) return;
    patch(review.id, { status: "skipped" });
    setIndex((i) => i + 1);
  };

  const handleApproveAll = async () => {
    setConfirmAll(false);
    setPosting(true);
    let posted = 0;
    for (const target of readyAhead) {
      if (await postOne(target)) posted += 1;
    }
    setPosting(false);
    if (posted > 0) toast.success(`Posted ${posted} repl${posted === 1 ? "y" : "ies"} on Google`);
    setIndex(reviews.length);
  };

  const handleRewrite = () => {
    if (review) void generate(review);
  };

  let footer: React.ReactNode;
  if (done) {
    footer = (
      <ModalFooter>
        <Button type="button" variant="primary" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    );
  } else if (confirmAll) {
    footer = (
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={() => setConfirmAll(false)} disabled={posting}>
          Back
        </Button>
        <Button type="button" variant="primary" loading={posting} onClick={() => void handleApproveAll()}>
          Post {readyAhead.length} repl{readyAhead.length === 1 ? "y" : "ies"}
        </Button>
      </ModalFooter>
    );
  } else {
    footer = (
      <ModalFooter>
        {readyAhead.length > 1 ? (
          <Button type="button" variant="outline" disabled={posting} onClick={() => setConfirmAll(true)}>
            Approve all {readyAhead.length} drafts
          </Button>
        ) : null}
        <Button type="button" variant="secondary" disabled={posting} onClick={handleSkip}>
          Skip
        </Button>
        <Button
          type="button"
          variant="primary"
          loading={posting}
          disabled={draft?.status !== "ready" || !draft.text.trim()}
          onClick={() => void handlePostAndNext()}
        >
          Post &amp; next
        </Button>
      </ModalFooter>
    );
  }

  const title = done ? "All caught up" : `Review ${index + 1} of ${reviews.length}`;

  return (
    <Modal isOpen onClose={onClose} title={title} maxWidth="max-w-lg" footer={footer}>
      {done || !review ? (
        <p className="text-body text-foreground" role="status">
          {postedCount > 0 ? `Posted ${postedCount} repl${postedCount === 1 ? "y" : "ies"} on Google.` : "No replies were posted."}
          {skippedCount > 0 ? ` Skipped ${skippedCount}.` : ""}
        </p>
      ) : (
        <div className="space-y-4">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={reviews.length}
            aria-valuenow={index}
            aria-label="Queue progress"
            className="h-1 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full bg-primary transition-[width]" style={{ width: `${(index / reviews.length) * 100}%` }} />
          </div>

          <figure className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <figcaption className="text-body-medium text-foreground">{review.authorName}</figcaption>
              <StarRating rating={review.rating} />
            </div>
            {review.text ? (
              <blockquote className="mt-2 max-h-40 overflow-y-auto text-body text-muted-foreground">{review.text}</blockquote>
            ) : (
              <p className="mt-2 text-body text-muted-foreground">No written review.</p>
            )}
          </figure>

          {confirmAll ? (
            <Notice tone="info" title="These replies will be public on Google">
              Every approved draft is posted straight away, using the text as it is now.
            </Notice>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <label htmlFor={toneId} className="block text-body-medium text-foreground">
                    Tone
                  </label>
                  <select
                    id={toneId}
                    value={tone}
                    onChange={(e) => {
                      toneRef.current = e.target.value;
                      setTone(e.target.value);
                    }}
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
                  loading={draft?.status === "loading"}
                  disabled={posting}
                  onClick={handleRewrite}
                >
                  Rewrite
                </Button>
              </div>

              <div className="space-y-2">
                <label htmlFor={replyId} className="block text-body-medium text-foreground">
                  Draft reply
                </label>
                <textarea
                  id={replyId}
                  value={draft?.text ?? ""}
                  disabled={draft?.status === "loading"}
                  placeholder={draft?.status === "loading" ? "Writing a draft…" : undefined}
                  onChange={(e) => patch(review.id, { text: e.target.value, status: "ready" })}
                  rows={5}
                  className="w-full rounded-md border border-input bg-background p-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
                />
                {draft?.status === "error" ? (
                  <p className="text-caption text-destructive">The draft failed. Press Rewrite to try again, or write your own.</p>
                ) : (
                  <p className="text-caption text-muted-foreground">Nothing is posted until you press Post &amp; next.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
