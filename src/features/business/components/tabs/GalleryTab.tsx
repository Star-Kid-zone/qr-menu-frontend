"use client";

import React, { lazy, Suspense } from "react";
import { Button, PageHeader, Spinner } from "@/components/ui";
import { PiUploadSimpleBold } from "react-icons/pi";
import type { WorkspaceGalleryItem } from "@/services/workspace.service";
import type { ListGalleryHandle } from "@/features/workspace";

const ListGallery = lazy(() =>
  import("@/features/workspace").then((m) => ({
    default: m.ListGallery,
  }))
);

interface GalleryTabProps {
  listGalleryRef: React.RefObject<ListGalleryHandle | null>;
  workspaceGallery: WorkspaceGalleryItem[];
  onRefreshData: () => Promise<void>;
}

export function GalleryTab({
  listGalleryRef,
  workspaceGallery,
  onRefreshData,
}: GalleryTabProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Photos"
        description="Photos of your restaurant and food, shown on your website."
        actions={
          <Button
            size="sm"
            onClick={() => listGalleryRef.current?.openUpload()}
            startIcon={<PiUploadSimpleBold className="size-4" />}
          >
            Upload Image
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-6">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[12rem] items-center justify-center">
              <Spinner size="md" />
            </div>
          }
        >
          <ListGallery
            ref={listGalleryRef}
            embedded
            initialImages={workspaceGallery}
            onChanged={() => void onRefreshData()}
          />
        </Suspense>
      </div>
    </div>
  );
}
