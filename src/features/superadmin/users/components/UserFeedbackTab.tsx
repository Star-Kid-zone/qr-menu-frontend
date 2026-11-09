"use client";

import React from "react";
import Image from "next/image";
import { Card, Badge, EmptyState } from "@/components/ui";
import {
  PiStarBold,
  PiStarFill,
  PiQuestionBold,
  PiArrowSquareOutBold,
} from "react-icons/pi";
import type { UserDetailResponse } from "../types";

interface UserFeedbackTabProps {
  detail: UserDetailResponse;
  feedbackSubTab: "google" | "faqs";
  setFeedbackSubTab: (tab: "google" | "faqs") => void;
}

export function UserFeedbackTab({
  detail,
  feedbackSubTab,
  setFeedbackSubTab,
}: UserFeedbackTabProps) {
  const primaryWorkspace = detail.workspaces?.[0];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setFeedbackSubTab("google")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            feedbackSubTab === "google"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          Synced Google Reviews ({detail.googleReviews?.length ?? 0})
        </button>
        <button
          type="button"
          onClick={() => setFeedbackSubTab("faqs")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            feedbackSubTab === "faqs"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          Tenant FAQs ({detail.faqs?.length ?? 0})
        </button>
      </div>

      {/* Synced Google Reviews SubTab */}
      {feedbackSubTab === "google" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-caption font-bold text-muted-foreground">
                Connected Google Place ID
              </p>
              <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                {primaryWorkspace?.googlePlaceId || "Not configured"}
              </p>
            </div>
            {primaryWorkspace?.reviewLink && (
              <a
                href={primaryWorkspace.reviewLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:text-primary"
              >
                Open Google Review Link <PiArrowSquareOutBold size={13} />
              </a>
            )}
          </div>

          {!detail.googleReviews || detail.googleReviews.length === 0 ? (
            <EmptyState
              icon={<PiStarBold className="size-8" />}
              title="No Google Reviews Synced"
              description="No Google Place reviews have been synced to the database yet."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {detail.googleReviews.map((rev) => (
                <Card key={rev.id} className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                        {rev.authorPhotoUrl ? (
                          <Image
                            src={rev.authorPhotoUrl}
                            alt={rev.authorName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
                            {rev.authorName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate">
                          {rev.authorName}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-warning-foreground">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <PiStarFill
                                key={idx}
                                className={`size-3 ${
                                  idx < rev.rating
                                    ? "text-warning-foreground"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-caption text-muted-foreground">
                            {rev.relativePublishDescription || "Verified Review"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-foreground/90 leading-relaxed">
                      {rev.text || "Rated without review text."}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQs SubTab */}
      {feedbackSubTab === "faqs" && (
        <div>
          {!detail.faqs || detail.faqs.length === 0 ? (
            <EmptyState
              icon={<PiQuestionBold className="size-8" />}
              title="No FAQs Configured"
              description="This tenant has not added any questions & answers."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {detail.faqs.map((faq) => (
                <Card key={faq.id} className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-caption font-bold text-primary">
                        Q
                      </span>
                      {faq.question}
                    </h3>
                    <Badge tone={faq.isVisible ? "success" : "neutral"}>
                      {faq.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground pl-8 leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
