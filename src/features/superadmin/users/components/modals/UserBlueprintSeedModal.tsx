"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/shared/components";
import { PiXBold, PiCheckBold } from "react-icons/pi";

export interface UserBlueprintSeedModalProps {
  blueprintModalOpen: boolean;
  setBlueprintModalOpen: (open: boolean) => void;
  userName: string;
  userId: number;
  availableBlueprints: any[];
  selectedBpId: string;
  setSelectedBpId: (id: string) => void;
  bpMode: "append" | "replace";
  setBpMode: (mode: "append" | "replace") => void;
  applyingBp: boolean;
  handleApplyBlueprint: () => Promise<void>;
}

export function UserBlueprintSeedModal({
  blueprintModalOpen,
  setBlueprintModalOpen,
  userName,
  userId,
  availableBlueprints,
  selectedBpId,
  setSelectedBpId,
  bpMode,
  setBpMode,
  applyingBp,
  handleApplyBlueprint,
}: UserBlueprintSeedModalProps) {
  return (
    <AnimatePresence>
      {blueprintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Apply Starter Blueprint
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pre-populate menu items for {userName} (#{userId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBlueprintModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <PiXBold size={16} />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Choose Preset Menu Pack
                </label>
                <div className="mt-2 space-y-2 max-h-56 overflow-y-auto">
                  {availableBlueprints.map((bp) => (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => setSelectedBpId(bp.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                        selectedBpId === bp.id
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold">{bp.name}</p>
                        <p className="text-xs text-muted-foreground">{bp.tagline}</p>
                        <p className="mt-1 text-[11px] font-mono text-muted-foreground">
                          {bp.items.length} items • {bp.categoryNames.join(", ")}
                        </p>
                      </div>
                      {selectedBpId === bp.id && (
                        <PiCheckBold className="size-4 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Seeding Strategy
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBpMode("append")}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      bpMode === "append"
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <p className="text-xs font-bold">Append</p>
                    <p className="text-[10px] text-muted-foreground">
                      Keep existing items
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBpMode("replace")}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      bpMode === "replace"
                        ? "border-destructive bg-destructive/10 text-destructive font-semibold"
                        : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <p className="text-xs font-bold">Replace</p>
                    <p className="text-[10px] text-muted-foreground">
                      Wipe current menu
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <Button
                variant="secondary"
                onClick={() => setBlueprintModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyBlueprint}
                loading={applyingBp}
                variant={bpMode === "replace" ? "destructive" : "primary"}
              >
                {bpMode === "replace"
                  ? "Replace & Seed Menu"
                  : "Append Blueprint"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
