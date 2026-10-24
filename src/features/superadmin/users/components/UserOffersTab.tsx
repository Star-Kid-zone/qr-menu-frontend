"use client";

import React from "react";
import Image from "next/image";
import { Card, Badge, EmptyState } from "@/shared/components";
import { PiTagBold } from "react-icons/pi";
import type { UserDetailResponse } from "../types";

interface UserOffersTabProps {
  detail: UserDetailResponse;
}

export function UserOffersTab({ detail }: UserOffersTabProps) {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiTagBold className="size-5" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-foreground">
              Special Offers & Discount Banners
            </h2>
            <p className="text-xs text-muted-foreground">
              {detail.offers?.length ?? 0} promotional discounts active for this business
            </p>
          </div>
        </div>
      </div>

      {!detail.offers || detail.offers.length === 0 ? (
        <EmptyState
          icon={<PiTagBold className="size-8" />}
          title="No Special Offers"
          description="This tenant has not added any special offers or promotions yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detail.offers.map((offer) => (
            <Card
              key={offer.id}
              className="flex flex-col overflow-hidden transition-all hover:border-primary/30"
            >
              {offer.imageUrl && (
                <div className="relative h-40 w-full bg-muted">
                  <Image
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                      {offer.discount || "SPECIAL OFFER"}
                    </span>
                    <Badge tone={offer.isActive ? "success" : "neutral"}>
                      {offer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-foreground">
                    {offer.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] font-mono text-muted-foreground">
                  <span>Offer #{offer.id}</span>
                  <span>Workspace #{offer.workspaceId}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
