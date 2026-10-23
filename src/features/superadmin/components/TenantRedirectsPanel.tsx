"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { Modal } from "@/components/Modal";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { toast } from "@/components/ui/toast";
import { superadminService, type TenantRedirect } from "@/services/superadmin.service";
import { getApiErrorMessage } from "@/utils/errors";
import { PiPlusBold, PiSignpostBold, PiTrashBold, PiArrowRightBold } from "react-icons/pi";

/**
 * Manual redirect management for one tenant — superadmin-only. A tenant
 * admin who wants a custom redirect (e.g. an old promo path) asks the
 * platform team privately rather than self-serving it; the automatic
 * old-slug -> new-slug redirect created whenever a tenant changes their own
 * site slug is unrelated to this panel and needs no admin action at all.
 */
export function TenantRedirectsPanel({ userId }: { userId: number }) {
  const [redirects, setRedirects] = useState<TenantRedirect[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [sourcePath, setSourcePath] = useState("");
  const [targetType, setTargetType] = useState<"internal" | "external">("internal");
  const [target, setTarget] = useState("");
  const [statusCode, setStatusCode] = useState<"301" | "302">("301");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TenantRedirect | null>(null);

  const fetchRedirects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await superadminService.listTenantRedirects(userId);
      setRedirects(rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load redirects."));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRedirects();
  }, [fetchRedirects]);

  const resetForm = () => {
    setSourcePath("");
    setTargetType("internal");
    setTarget("");
    setStatusCode("301");
  };

  const handleCreate = async () => {
    if (!sourcePath.trim() || !target.trim()) {
      toast.error("Both a source path and a target are required.");
      return;
    }
    setSubmitting(true);
    try {
      await superadminService.createTenantRedirect(userId, {
        sourcePath: sourcePath.trim().replace(/^\/+/, ""),
        targetType,
        target: target.trim(),
        statusCode: Number(statusCode) as 301 | 302,
      });
      toast.success("Redirect created.");
      resetForm();
      setCreateOpen(false);
      fetchRedirects();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create redirect."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await superadminService.deleteTenantRedirect(userId, id);
      toast.success("Redirect deleted.");
      fetchRedirects();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete redirect."));
    }
  };

  const rows = redirects ?? [];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiSignpostBold className="size-5" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-foreground">Redirects</h2>
            <p className="text-xs text-muted-foreground">
              Manual redirects for this tenant — created automatically when they change their site slug, or added here on their behalf.
            </p>
          </div>
        </div>
        <Button size="sm" leftIcon={<PiPlusBold size={14} />} onClick={() => setCreateOpen(true)}>
          Add Redirect
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && rows.length === 0 ? (
        <EmptyState
          icon={<PiSignpostBold className="size-8" />}
          title="No redirects for this tenant"
          description="Redirects appear here automatically when the tenant changes their site slug, or you can add one manually."
          action={
            <Button size="sm" leftIcon={<PiPlusBold size={14} />} onClick={() => setCreateOpen(true)}>
              Add Redirect
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Hits</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">/{r.sourcePath}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-muted-foreground">
                      <PiArrowRightBold size={11} />
                      {r.targetType === "internal" ? `/${r.target}` : r.target}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {r.statusCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-figures text-muted-foreground">{r.hitCount}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(r)}
                      aria-label={`Delete redirect from ${r.sourcePath}`}
                      className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <PiTrashBold size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => { resetForm(); setCreateOpen(false); }}
        title="Add Redirect"
        maxWidth="max-w-md"
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => { resetForm(); setCreateOpen(false); }} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={submitting}>
              Create
            </Button>
          </ModalFooter>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Old path (without leading slash)
            </label>
            <Input placeholder="e.g. old-menu-name" value={sourcePath} onChange={(e) => setSourcePath(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Redirect to</label>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <Select value={targetType} onChange={(e) => setTargetType(e.target.value as "internal" | "external")} className="w-28">
                <option value="internal">This site</option>
                <option value="external">External URL</option>
              </Select>
              <Input
                placeholder={targetType === "internal" ? "new-slug-or-path" : "https://..."}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Redirect type</label>
            <Select value={statusCode} onChange={(e) => setStatusCode(e.target.value as "301" | "302")}>
              <option value="301">301 — Permanent</option>
              <option value="302">302 — Temporary</option>
            </Select>
          </div>
        </div>
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await handleDelete(deleteTarget.id);
        }}
        entityName="redirect"
        description={`Delete the redirect from "/${deleteTarget?.sourcePath}"? Guests visiting that old link will start seeing a 404 instead.`}
      />
    </div>
  );
}
