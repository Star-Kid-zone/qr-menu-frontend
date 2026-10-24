'use client';

import React from 'react';
import { Card } from '@/shared/components';
import { PiQrCodeBold } from 'react-icons/pi';
import type { UserDetailResponse } from '../../types';

interface QrConfigSectionProps {
  primaryWorkspace: UserDetailResponse['workspaces'][0] | undefined;
}

export function QrConfigSection({ primaryWorkspace }: QrConfigSectionProps) {
  const qrConfig = (primaryWorkspace?.qrCodeConfig as Record<string, unknown>) || {};

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-6 py-4">
        <PiQrCodeBold className="size-5 text-primary" />
        <h2 className="text-h3 font-bold text-foreground">
          Custom QR Code Generator Configuration
        </h2>
      </div>
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This tenant has styled their table and promotional QR codes with custom colors and finder pattern styling.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">
                  Pattern Style
                </p>
                <p className="font-mono text-sm font-bold capitalize text-foreground mt-1">
                  {String(qrConfig.dataPattern || 'square')}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">
                  Finder Pattern
                </p>
                <p className="font-mono text-sm font-bold capitalize text-foreground mt-1">
                  {String(qrConfig.finderPattern || 'square')}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">
                  QR Resolution
                </p>
                <p className="font-mono text-sm font-bold text-foreground mt-1">
                  {String(qrConfig.size || 256)}px
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Data Color:</span>
                <span
                  className="size-4 rounded-full border border-border inline-block"
                  style={{
                    backgroundColor: String(qrConfig.dataColor || '#000000'),
                  }}
                />
                <span className="font-mono text-foreground font-semibold">
                  {String(qrConfig.dataColor || '#000000')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Background Fill:</span>
                <span
                  className="size-4 rounded-full border border-border inline-block"
                  style={{
                    backgroundColor: String(qrConfig.backgroundFill || '#ffffff'),
                  }}
                />
                <span className="font-mono text-foreground font-semibold">
                  {String(qrConfig.backgroundFill || '#ffffff')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 p-6 text-center">
            <div className="relative flex size-36 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-card p-4 shadow-sm">
              <PiQrCodeBold className="size-24 text-primary" />
            </div>
            <p className="mt-3 font-mono text-xs font-semibold text-muted-foreground">
              Target: {primaryWorkspace?.public_slug ? `${primaryWorkspace.public_slug}.domain/menu` : '/menu'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
