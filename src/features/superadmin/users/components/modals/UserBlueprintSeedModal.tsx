"use client";

import React from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Notice } from "@/components/ui/Notice";
import type { MenuBlueprint } from "@/services/superadmin.service";

export interface UserBlueprintSeedModalProps {
  blueprintModalOpen: boolean;
  setBlueprintModalOpen: (open: boolean) => void;
  userName: string;
  userId: number;
  availableBlueprints: MenuBlueprint[];
  selectedBpId: string;
  setSelectedBpId: (id: string) => void;
  bpMode: "append" | "replace";
  setBpMode: (mode: "append" | "replace") => void;
  applyingBp: boolean;
  handleApplyBlueprint: () => Promise<void>;
}

const optionClass = (selected: boolean, destructive = false) =>
  `flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
    selected
      ? destructive
        ? "border-destructive bg-destructive/5"
        : "border-primary bg-primary/5"
      : "border-border bg-card hover:bg-muted"
  }`;

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
  const close = () => setBlueprintModalOpen(false);

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={close}>
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleApplyBlueprint}
        loading={applyingBp}
        variant={bpMode === "replace" ? "destructive" : "primary"}
      >
        {bpMode === "replace" ? "Delete current menu and apply" : "Add to current menu"}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={blueprintModalOpen} onClose={close} title="Apply a starter menu" maxWidth="max-w-lg" footer={footer}>
      <div className="space-y-6">
        <p className="text-body text-muted-foreground">
          Add dishes from a starter menu to {userName} (#{userId}).
        </p>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-body-medium text-foreground">Starter menu</legend>
          <div className="max-h-56 space-y-2 overflow-y-auto p-0.5">
            {availableBlueprints.map((bp) => (
              <label key={bp.id} className={optionClass(selectedBpId === bp.id)}>
                <input
                  type="radio"
                  name="seed-blueprint"
                  value={bp.id}
                  checked={selectedBpId === bp.id}
                  onChange={() => setSelectedBpId(bp.id)}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <span className="min-w-0">
                  <span className="block text-body-medium text-foreground">{bp.name}</span>
                  {bp.tagline && <span className="block text-caption text-muted-foreground">{bp.tagline}</span>}
                  <span className="mt-1 block text-caption text-muted-foreground">
                    {bp.items.length} dishes · {bp.categoryNames.join(", ")}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-body-medium text-foreground">What happens to the current menu</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className={optionClass(bpMode === "append")}>
              <input
                type="radio"
                name="seed-mode"
                value="append"
                checked={bpMode === "append"}
                onChange={() => setBpMode("append")}
                className="mt-1 size-4 shrink-0 accent-primary"
              />
              <span>
                <span className="block text-body-medium text-foreground">Keep it</span>
                <span className="block text-caption text-muted-foreground">New dishes are added alongside existing ones.</span>
              </span>
            </label>
            <label className={optionClass(bpMode === "replace", true)}>
              <input
                type="radio"
                name="seed-mode"
                value="replace"
                checked={bpMode === "replace"}
                onChange={() => setBpMode("replace")}
                className="mt-1 size-4 shrink-0 accent-destructive"
              />
              <span>
                <span className="block text-body-medium text-foreground">Replace it</span>
                <span className="block text-caption text-muted-foreground">Deletes every dish on the current menu first.</span>
              </span>
            </label>
          </div>
        </fieldset>

        {bpMode === "replace" && (
          <Notice tone="error" title="The current menu will be deleted">
            All of {userName}&apos;s existing dishes are permanently removed before the starter menu is added. This can&apos;t be undone.
          </Notice>
        )}
      </div>
    </Modal>
  );
}
