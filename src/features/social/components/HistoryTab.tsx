"use client";

import React from "react";
import {
  PiClockBold,
  PiPaperPlaneTiltBold,
  PiPlusBold,
  PiXBold,
} from "react-icons/pi";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { cn } from "@/utils";
import type { HistoryFilter, SocialPost } from "../types";
import { formatDate } from "@/utils/date";

interface HistoryTabProps {
  posts: SocialPost[];
  loading: boolean;
  historyFilter: HistoryFilter;
  onFilterChange: (filter: HistoryFilter) => void;
  onRefresh: () => void;
  onNewPost: () => void;
  onPublishNow: (id: string) => void;
  onCancelPost: (id: string) => void;
}

export function HistoryTab({
  posts,
  loading,
  historyFilter,
  onFilterChange,
  onRefresh,
  onNewPost,
  onPublishNow,
  onCancelPost,
}: HistoryTabProps) {
  const filteredPosts =
    historyFilter === "all"
      ? posts
      : posts.filter((p) => p.lifecycleStatus.toLowerCase() === historyFilter);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Planned and sent posts"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              startIcon={<PiClockBold className="size-4" />}
            >
              Refresh
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onNewPost}
              startIcon={<PiPlusBold className="size-4" />}
            >
              New Post
            </Button>
          </div>
        }
      />

      {/* Filter Pills */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border pb-2">
        {(["all", "published", "scheduled", "draft"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold capitalize transition",
              historyFilter === filter
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {filteredPosts.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <EmptyState
              icon={<PiClockBold size={32} />}
              title="No posts found"
              action={
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  startIcon={<PiPlusBold className="size-3.5" />}
                  onClick={onNewPost}
                >
                  Compose New Post
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {filteredPosts.map((post) => {
              const isScheduled = post.lifecycleStatus === "scheduled";
              const isPublished = post.lifecycleStatus === "published";
              const isCancelled = post.lifecycleStatus === "cancelled";

              const badgeTone = isPublished
                ? "success"
                : isScheduled
                  ? "primary"
                  : isCancelled
                    ? "danger"
                    : "neutral";

              return (
                <Card key={post.id} className="p-4 transition-all hover:shadow-xs">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{post.id.slice(0, 8)}
                        </span>
                        <p className="font-bold text-foreground text-sm truncate">
                          {post.title || "Untitled Social Post"}
                        </p>
                        <Badge tone={badgeTone} className="text-caption">
                          {post.lifecycleStatus}
                        </Badge>
                      </div>
                      {post.scheduledAtUtc && (
                        <p className="text-xs text-muted-foreground">
                          Scheduled for:{" "}
                          <span className="font-semibold text-foreground">
                            {formatDate(post.scheduledAtUtc, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
                          </span>
                        </p>
                      )}
                      {post.destinations && post.destinations.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-caption text-muted-foreground">Channels:</span>
                          {post.destinations.map((d) => (
                            <Badge key={d.id} tone="neutral" className="text-caption">
                              {d.status}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isScheduled && (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            startIcon={<PiPaperPlaneTiltBold className="size-3.5" />}
                            onClick={() => onPublishNow(post.id)}
                          >
                            Publish Now
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            startIcon={<PiXBold className="size-3.5" />}
                            onClick={() => onCancelPost(post.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
