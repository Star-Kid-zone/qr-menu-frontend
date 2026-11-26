"use client";

import { useEffect, useState } from "react";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import { Button, Modal, Notice, Spinner, toast } from "@/components/ui";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { workspaceService, type SiteVersion } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";

const WHEN = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export interface SiteHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after a version is put back, so the page can reload the settings. */
  onRestored: () => void | Promise<void>;
}

/**
 * Earlier versions of the website layout — section order and visibility, menu
 * categories, and the open/closed notice — with one-click restore. A restore is
 * itself saved as a new version, so it can be undone the same way.
 */
export function SiteHistoryModal({ isOpen, onClose, onRestored }: SiteHistoryModalProps) {
  const [versions, setVersions] = useState<SiteVersion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const { confirm, confirmDialog } = useConfirmDialog();

  // Each time the dialog opens, start from a loading state (adjusted during render, not in an effect).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setVersions(null);
      setError(null);
    }
  }

  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    workspaceService
      .listSiteVersions()
      .then((res) => {
        if (!cancelled) setVersions(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Couldn't load the history."));
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, reloadKey]);

  const restore = async (v: SiteVersion) => {
    const ok = await confirm({
      title: "Restore this version?",
      description: `Your website goes back to the layout from ${WHEN.format(new Date(v.createdAt))} (${v.summary}). The current layout stays in the history, so you can switch back.`,
      confirmLabel: "Restore",
    });
    if (!ok) return;
    setRestoring(v.id);
    try {
      await workspaceService.restoreSiteVersion(v.id);
      toast.success("Website layout restored.");
      await onRestored();
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't restore that version."));
    } finally {
      setRestoring(null);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Website history">
        <p className="mb-4 text-caption text-muted-foreground">
          Every time you save changes to your sections, menu categories or open/closed notice, a copy is kept here. Colours and
          fonts aren&apos;t included.
        </p>

        {error ? (
          <Notice
            tone="error"
            action={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setError(null);
                  setVersions(null);
                  setReloadKey((k) => k + 1);
                }}
              >
                Try again
              </Button>
            }
          >
            {error}
          </Notice>
        ) : versions === null ? (
          <div className="flex justify-center py-8" aria-busy="true">
            <Spinner size="md" />
          </div>
        ) : versions.length === 0 ? (
          <p className="text-body text-muted-foreground">No history yet. It starts the first time you save your sections, categories or open/closed notice.</p>
        ) : (
          <ol aria-label="Saved versions" className="divide-y divide-border rounded-lg border border-border">
            {versions.map((v) => (
              <li key={v.id} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-body-medium text-foreground">
                    {WHEN.format(new Date(v.createdAt))}
                    {v.isCurrent ? (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-caption text-primary">Live now</span>
                    ) : null}
                  </p>
                  <p className="truncate text-caption text-muted-foreground">
                    {v.summary}
                    {v.createdByName ? ` · ${v.createdByName}` : ""}
                  </p>
                </div>
                {v.isCurrent ? null : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={restoring === v.id}
                    disabled={restoring !== null}
                    onClick={() => void restore(v)}
                    startIcon={<PiArrowCounterClockwiseBold className="size-4" />}
                    aria-label={`Restore version from ${WHEN.format(new Date(v.createdAt))}`}
                  >
                    Restore
                  </Button>
                )}
              </li>
            ))}
          </ol>
        )}
      </Modal>
      {confirmDialog}
    </>
  );
}
