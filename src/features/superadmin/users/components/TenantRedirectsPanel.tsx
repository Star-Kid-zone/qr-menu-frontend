"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  EmptyState,
  ConfirmDeleteModal,
  Modal,
  ModalFooter,
  toast,
} from "@/components/ui";
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
export function TenantRedirectsPanel({ userId }: { userId: string }) {
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

  const handleLoadError = useCallback((err: unknown) => {
    setError(getApiErrorMessage(err, "Failed to load redirects."));
  }, []);

  const fetchRedirects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await superadminService.listTenantRedirects(userId);
      setRedirects(rows);
    } catch (err) {
      handleLoadError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, handleLoadError]);

  // Another tenant shows the loading state again (adjusted during render);
  // the effect below then fetches it. `loading` starts true for the first tenant.
  const [loadedUserId, setLoadedUserId] = useState(userId);
  if (!Object.is(loadedUserId, userId)) {
    setLoadedUserId(userId);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    superadminService
      .listTenantRedirects(userId)
      .then(setRedirects)
      .catch(handleLoadError)
      .finally(() => setLoading(false));
  }, [userId, handleLoadError]);

  const resetForm = () => {
    setSourcePath("");
    setTargetType("internal");
    setTarget("");
    setStatusCode("301");
  };

  const handleCreate = async () => {
    const trimmedSource = sourcePath.trim();
    const trimmedTarget = target.trim();
    if (!trimmedSource || !trimmedTarget) {
      toast.error("Source path and target are required.");
      return;
    }
    setSubmitting(true);
    try {
      await superadminService.createTenantRedirect(userId, {
        sourcePath: trimmedSource,
        targetType,
        target: trimmedTarget,
        statusCode: Number(statusCode) as 301 | 302,
      });
      toast.success("Redirect rule created.");
      setCreateOpen(false);
      resetForm();
      fetchRedirects();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create redirect rule."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await superadminService.deleteTenantRedirect(userId, deleteTarget.id);
      setDeleteTarget(null);
      fetchRedirects();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiSignpostBold className="size-5" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-foreground">Custom URL Redirects</h2>
            <p className="text-xs text-muted-foreground">
              Legacy paths, campaign aliases, or cross-domain redirects for this tenant.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          leftIcon={<PiPlusBold className="size-4" />}
        >
          Add Redirect
        </Button>
      </div>

      {loading && (
        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
          Loading redirects...
        </div>
      )}

      {!loading && error && (
        <EmptyState
          title="Could not load redirects"
          description={error}
          action={<Button size="sm" onClick={fetchRedirects}>Retry</Button>}
        />
      )}

      {!loading && !error && (!redirects || redirects.length === 0) && (
        <EmptyState
          title="No custom redirects"
          description="This tenant has no active manual redirect rules. Automatic slug rename redirects are handled separately."
          action={
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              Create the first redirect
            </Button>
          }
        />
      )}

      {!loading && !error && redirects && redirects.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Source Path</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {redirects.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-foreground font-medium">
                    {r.sourcePath}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <PiArrowRightBold className="size-3 text-primary" />
                      {r.target}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-caption font-semibold text-foreground">
                      {r.statusCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {r.targetType}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(r)}
                      aria-label="Delete redirect"
                      leftIcon={<PiTrashBold className="size-3.5 text-danger" />}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => {
          if (!submitting) {
            setCreateOpen(false);
            resetForm();
          }
        }}
        title="Add URL Redirect Rule"
        footer={
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setCreateOpen(false);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              loading={submitting}
            >
              Create Redirect
            </Button>
          </ModalFooter>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Forward visitors who hit a legacy or custom path to a new page or external site.
          </p>

          <div>
            <label className="text-caption text-muted-foreground">
              Source Path
            </label>
            <Input
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="/summer-specials or /old-menu"
              className="mt-1 font-mono text-xs"
            />
            <p className="mt-1 text-caption text-muted-foreground">
              Relative to the tenant domain, must begin with &quot;/&quot;.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-caption text-muted-foreground">
                Target Type
              </label>
              <Select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as "internal" | "external")}
                className="mt-1 text-xs"
              >
                <option value="internal">Internal path (/menu, /contact)</option>
                <option value="external">External absolute URL</option>
              </Select>
            </div>
            <div>
              <label className="text-caption text-muted-foreground">
                Status Code
              </label>
              <Select
                value={statusCode}
                onChange={(e) => setStatusCode(e.target.value as "301" | "302")}
                className="mt-1 text-xs"
              >
                <option value="301">301 Permanent</option>
                <option value="302">302 Temporary</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-caption text-muted-foreground">
              Target Destination
            </label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={targetType === "internal" ? "/menu" : "https://instagram.com/..."}
              className="mt-1 font-mono text-xs"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete redirect rule?"
        description={
          deleteTarget
            ? `Traffic for ${deleteTarget.sourcePath} will no longer be forwarded to ${deleteTarget.target}.`
            : undefined
        }
      />
    </div>
  );
}
