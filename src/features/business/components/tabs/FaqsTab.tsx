"use client";

import React, { lazy, Suspense } from "react";
import { Button, PageHeader, Spinner } from "@/components/ui";
import { PiPlusBold } from "react-icons/pi";
import type { WorkspaceFaq } from "@/services/workspace.service";
import type { ListFaqsHandle } from "@/features/workspace";

const ListFaqs = lazy(() =>
  import("@/features/workspace").then((m) => ({
    default: m.ListFaqs,
  }))
);

interface FaqsTabProps {
  listFaqsRef: React.RefObject<ListFaqsHandle | null>;
  workspaceFaqs: WorkspaceFaq[];
  onRefreshData: () => Promise<void>;
}

export function FaqsTab({
  listFaqsRef,
  workspaceFaqs,
  onRefreshData,
}: FaqsTabProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Questions guests ask"
        description="Answers shown on your website. Nothing appears until you add one."
        actions={
          <Button
            size="sm"
            onClick={() => listFaqsRef.current?.openNew()}
            startIcon={<PiPlusBold className="size-4" />}
          >
            New FAQ
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
          <ListFaqs
            ref={listFaqsRef}
            embedded
            initialFaqs={workspaceFaqs}
            onChanged={() => void onRefreshData()}
          />
        </Suspense>
      </div>
    </div>
  );
}
