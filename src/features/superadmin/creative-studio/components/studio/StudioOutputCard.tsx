"use client";

import React from "react";
import { Card, Button } from "@/components/ui";
import { PiSparkleBold, PiImagesBold, PiSpinnerBold } from "react-icons/pi";

export interface StudioOutputCardProps {
  generatedImageUrl: string | null;
  generatedVideoUrl: string | null;
  assetTitleInput: string;
  setAssetTitleInput: (title: string) => void;
  savingAiAsset: boolean;
  handleSaveAiToVault: () => Promise<void>;
}

export function StudioOutputCard({
  generatedImageUrl,
  generatedVideoUrl,
  assetTitleInput,
  setAssetTitleInput,
  savingAiAsset,
  handleSaveAiToVault,
}: StudioOutputCardProps) {
  if (!generatedImageUrl && !generatedVideoUrl) {
    return (
      <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-border">
        <PiSparkleBold className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <h4 className="text-base font-semibold text-foreground">Studio Idle</h4>
        <p className="text-caption text-muted-foreground max-w-sm mt-1">
          Choose a prompt on the left and synthesize hyperrealistic pictures or motion reels.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5 space-y-5 border-border">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">Synthesis Output</h3>
          <p className="text-xs text-muted-foreground">
            Ready to be preserved in the Vault or dispatched to restaurant tenants.
          </p>
        </div>
      </div>

      <div className="relative aspect-[4/5] max-h-[460px] w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-border">
        {generatedVideoUrl ? (
          <video
            src={generatedVideoUrl}
            controls
            autoPlay
            loop
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            src={generatedImageUrl!}
            alt="Generated AI Food"
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {/* Save to Vault Form */}
      <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Save to Superadmin Vault
        </h4>

        <div>
          <label className="text-xs text-muted-foreground block mb-1">Asset Title</label>
          <input
            type="text"
            value={assetTitleInput}
            onChange={(e) => setAssetTitleInput(e.target.value)}
            placeholder="e.g. Signature Hyderabadi Dum Biryani"
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={handleSaveAiToVault}
          disabled={savingAiAsset}
        >
          {savingAiAsset ? (
            <>
              <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
              Saving to Vault...
            </>
          ) : (
            <>
              <PiImagesBold className="h-4 w-4 mr-2" />
              Commit to Asset Vault
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
