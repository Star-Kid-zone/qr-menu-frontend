'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui';
import { PiSparkleBold, PiArrowSquareOutBold } from 'react-icons/pi';
import type { UserDetailResponse } from '../../types';

interface BrandNarrativeSectionProps {
  primaryWorkspace: UserDetailResponse['workspaces'][0] | undefined;
}

export function BrandNarrativeSection({ primaryWorkspace }: BrandNarrativeSectionProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-6 py-4">
        <PiSparkleBold className="size-5 text-primary" />
        <h2 className="text-h3 font-bold text-foreground">
          Brand Assets &amp; &quot;Our Story&quot; Narrative
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Brand Logo
            </p>
            {primaryWorkspace?.logoUrl ? (
              <div className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                  <Image
                    src={String(primaryWorkspace.logoUrl)}
                    alt="Logo"
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {String(primaryWorkspace.logoUrl)}
                  </p>
                  <a
                    href={String(primaryWorkspace.logoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View Logo <PiArrowSquareOutBold size={12} />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                No custom logo uploaded. System uses fallback monogram.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Hero Banner Image
            </p>
            {primaryWorkspace?.bannerUrl ? (
              <div className="relative h-20 w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={String(primaryWorkspace.bannerUrl)}
                  alt="Banner"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                No hero banner set. System uses theme gradient background.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Story Headline
          </p>
          <p className="text-base font-bold text-foreground">
            {String(primaryWorkspace?.storyHeadline || 'Crafting Culinary Memories')}
          </p>

          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pt-2">
            Story Body
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {String(
              primaryWorkspace?.storyBody ||
                'No personalized story submitted. Default template narrative is displayed to guests.'
            )}
          </p>
        </div>

        {Array.isArray(primaryWorkspace?.stats) &&
          primaryWorkspace.stats.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Highlight Stats Counters
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {primaryWorkspace.stats.map((st: { label: string; value: string }, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-card p-3 text-center"
                  >
                    <p className="text-xl font-extrabold text-primary font-mono">
                      {st.value}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </Card>
  );
}
