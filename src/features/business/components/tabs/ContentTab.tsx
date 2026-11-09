"use client";

import React from "react";
import { Button, FormField, Input, PageHeader, Textarea } from "@/components/ui";
import { PiPencilSimpleBold, PiPlusBold, PiTrashBold } from "react-icons/pi";
import type { WorkspaceSetting } from "@/types/workspace.types";

interface ContentDraft {
  storyHeadline: string;
  storyBody: string;
  stats: Array<{ label: string; value: string }>;
}

interface ContentTabProps {
  workspace: WorkspaceSetting | null;
  contentDraft: ContentDraft;
  setContentDraft: React.Dispatch<React.SetStateAction<ContentDraft>>;
  savedContentDraft: ContentDraft;
  contentEditMode: boolean;
  setContentEditMode: (val: boolean) => void;
  contentSaveLoading: boolean;
  setContentSaveError: (val: string | null) => void;
  onSaveContent: () => Promise<void>;
}

export function ContentTab({
  workspace,
  contentDraft,
  setContentDraft,
  savedContentDraft,
  contentEditMode,
  setContentEditMode,
  contentSaveLoading,
  setContentSaveError,
  onSaveContent,
}: ContentTabProps) {
  const panelActions = (() => {
    if (!workspace) return null;
    if (contentEditMode) {
      return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            disabled={contentSaveLoading}
            onClick={() => {
              setContentEditMode(false);
              setContentSaveError(null);
              setContentDraft(savedContentDraft);
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={() => void onSaveContent()} loading={contentSaveLoading}>
            Save
          </Button>
        </div>
      );
    }
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setContentEditMode(true)}
        startIcon={<PiPencilSimpleBold className="size-4" />}
      >
        Edit
      </Button>
    );
  })();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Our story"
        description="The story and highlight numbers on your website. Leave them blank to hide those sections."
        actions={panelActions}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto rounded-lg border border-border bg-card p-4 md:p-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <FormField label="Story Headline" htmlFor="story-headline">
            <Input
              id="story-headline"
              type="text"
              value={contentDraft.storyHeadline}
              onChange={(e) =>
                setContentDraft((d) => ({ ...d, storyHeadline: e.target.value }))
              }
              placeholder="e.g. Family-run since 2010"
              disabled={!contentEditMode || contentSaveLoading}
            />
          </FormField>
          <FormField label="Story Body" htmlFor="story-body">
            <Textarea
              id="story-body"
              value={contentDraft.storyBody}
              onChange={(e) =>
                setContentDraft((d) => ({ ...d, storyBody: e.target.value }))
              }
              rows={10}
              placeholder="Tell guests the real story behind your business…"
              disabled={!contentEditMode || contentSaveLoading}
            />
          </FormField>
        </div>

        <div className="space-y-3 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex items-center justify-between">
            <span className="text-overline text-muted-foreground">
              Stats Bar (up to 4)
            </span>
            {contentEditMode && contentDraft.stats.length < 4 && (
              <button
                type="button"
                onClick={() =>
                  setContentDraft((d) => ({
                    ...d,
                    stats: [...d.stats, { label: "", value: "" }],
                  }))
                }
                disabled={contentSaveLoading}
                className="flex items-center gap-1 rounded text-caption font-semibold text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 cursor-pointer"
              >
                <PiPlusBold className="size-3.5" /> Add
              </button>
            )}
          </div>
          {contentDraft.stats.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-border bg-background p-6 text-center">
              <p className="text-caption text-muted-foreground">No stats yet.</p>
            </div>
          ) : (
            contentDraft.stats.map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-start gap-2">
                  <div className="grid flex-1 grid-cols-2 gap-2">
                    <Input
                      type="text"
                      aria-label={`Stat ${i + 1} value`}
                      value={s.value}
                      onChange={(e) =>
                        setContentDraft((d) => ({
                          ...d,
                          stats: d.stats.map((row, ri) =>
                            ri === i ? { ...row, value: e.target.value } : row
                          ),
                        }))
                      }
                      placeholder="15+"
                      disabled={!contentEditMode || contentSaveLoading}
                    />
                    <Input
                      type="text"
                      aria-label={`Stat ${i + 1} label`}
                      value={s.label}
                      onChange={(e) =>
                        setContentDraft((d) => ({
                          ...d,
                          stats: d.stats.map((row, ri) =>
                            ri === i ? { ...row, label: e.target.value } : row
                          ),
                        }))
                      }
                      placeholder="Years of craft"
                      disabled={!contentEditMode || contentSaveLoading}
                    />
                  </div>
                  {contentEditMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setContentDraft((d) => ({
                          ...d,
                          stats: d.stats.filter((_, ri) => ri !== i),
                        }))
                      }
                      disabled={contentSaveLoading}
                      aria-label={`Remove stat ${i + 1}`}
                      className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <PiTrashBold className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
