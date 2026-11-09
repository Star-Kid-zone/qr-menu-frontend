"use client";

import React, { lazy, Suspense } from "react";
import { Button, PageHeader, Spinner } from "@/components/ui";
import { PiPlusBold } from "react-icons/pi";
import type { WorkspaceOfferItem } from "@/services/workspace.service";
import type { WorkspaceSetting } from "@/types/workspace.types";
import type { ListOffersHandle } from "@/features/workspace";

const ListOffers = lazy(() =>
  import("@/features/workspace").then((m) => ({
    default: m.ListOffers,
  }))
);

interface OffersTabProps {
  listOffersRef: React.RefObject<ListOffersHandle | null>;
  workspaceOffers: WorkspaceOfferItem[];
  workspace: WorkspaceSetting | null;
  onRefreshData: () => Promise<void>;
}

export function OffersTab({
  listOffersRef,
  workspaceOffers,
  workspace,
  onRefreshData,
}: OffersTabProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Offers"
        description="Deals shown on your website and menu."
        actions={
          <Button
            size="sm"
            onClick={() => listOffersRef.current?.openNewOffer()}
            startIcon={<PiPlusBold className="size-4" />}
          >
            New Offer
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
          <ListOffers
            ref={listOffersRef}
            embedded
            initialOffers={workspaceOffers}
            initialCurrencySymbol={workspace?.currency?.symbol || "Rs"}
            onChanged={() => void onRefreshData()}
          />
        </Suspense>
      </div>
    </div>
  );
}
