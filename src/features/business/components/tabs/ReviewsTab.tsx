"use client";

import React, { lazy, Suspense } from "react";
import { PageHeader, Spinner } from "@/components/ui";
import type { GoogleReviewRecord } from "@/services/workspace.service";

const ListGoogleReviews = lazy(() =>
  import("@/features/workspace").then((m) => ({
    default: m.ListGoogleReviews,
  }))
);

interface ReviewsTabProps {
  workspaceGoogleReviews: GoogleReviewRecord[];
  onRefreshGoogleReviews: () => Promise<void>;
}

export function ReviewsTab({
  workspaceGoogleReviews,
  onRefreshGoogleReviews,
}: ReviewsTabProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Reviews on your website"
        description="Choose which Google reviews appear on your website."
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-6">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[12rem] items-center justify-center">
              <Spinner size="md" />
            </div>
          }
        >
          <ListGoogleReviews
            embedded
            initialReviews={workspaceGoogleReviews}
            onChanged={() => void onRefreshGoogleReviews()}
          />
        </Suspense>
      </div>
    </div>
  );
}
