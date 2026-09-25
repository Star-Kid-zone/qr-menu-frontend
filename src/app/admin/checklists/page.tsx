"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  checklistService,
  type ChecklistItem,
  type ChecklistTemplate,
  type ChecklistTemplateType,
  type TodayChecklistRun,
} from "@/services/checklist.service";
import { getApiErrorMessage } from "@/utils/errors";
import { useAsyncData } from "@/hooks/useAsyncData";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
  PiArrowDownBold,
  PiArrowUpBold,
  PiCheckBold,
  PiCheckCircleBold,
  PiListChecksBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiTrashBold,
  PiXBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";

function makeItemId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `item_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

interface TemplateFormState {
  id: string | null;
  name: string;
  type: ChecklistTemplateType;
  active: boolean;
  items: ChecklistItem[];
}

function emptyTemplateForm(): TemplateFormState {
  return { id: null, name: "", type: "custom", active: true, items: [] };
}

function TodayTab() {
  const { data, error, refetch } = useAsyncData(
    async () => (await checklistService.today()).data,
    [],
    "Failed to load today's checklists.",
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const runs = data?.runs ?? [];
  const [pending, setPending] = useState<string | null>(null);

  const handleToggle = async (run: TodayChecklistRun, itemId: string, completed: boolean) => {
    const key = `${run.run.id}:${itemId}`;
    try {
      setPending(key);
      await checklistService.toggleItem(run.run.id, itemId, completed);
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update checklist item."));
    } finally {
      setPending(null);
    }
  };

  if (runs.length === 0) {
    return (
      <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
        <EmptyState
          icon={<PiListChecksBold size={32} />}
          title="No active checklists"
          description="Ask a manager to create an Opening or Closing checklist template."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
      {runs.map(({ template, run }) => {
        const total = run.itemStatus.length;
        const done = run.itemStatus.filter((s) => s.completed).length;
        const allDone = total > 0 && done === total;
        return (
          <div key={run.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">{template.name}</h3>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{template.type}</p>
              </div>
              <span
                className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                  allDone ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-muted text-muted-foreground",
                )}
              >
                {done}/{total}
              </span>
            </div>
            <div className="space-y-1.5">
              {run.itemStatus
                .slice()
                .sort((a, b) => {
                  const ai = template.items.find((i) => i.id === a.itemId)?.order ?? 0;
                  const bi = template.items.find((i) => i.id === b.itemId)?.order ?? 0;
                  return ai - bi;
                })
                .map((status) => {
                  const item = template.items.find((i) => i.id === status.itemId);
                  if (!item) return null;
                  const key = `${run.id}:${status.itemId}`;
                  return (
                    <button
                      key={status.itemId}
                      type="button"
                      disabled={pending === key}
                      onClick={() => handleToggle({ template, run }, status.itemId, !status.completed)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-all disabled:opacity-60",
                        status.completed ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30" : "border-border bg-muted/30 hover:bg-muted/60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border",
                          status.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-card",
                        )}
                      >
                        {status.completed && <PiCheckBold size={12} />}
                      </span>
                      <span className={cn("flex-1 text-xs font-medium", status.completed ? "text-muted-foreground line-through" : "text-foreground")}>
                        {item.label}
                        {item.required && <span className="ml-1 text-destructive">*</span>}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TemplatesTab() {
  const {
    data: templatesData,
    error: templatesError,
    refetch: fetchTemplates,
  } = useAsyncData(
    async () => (await checklistService.listTemplates()).data.templates,
    [],
    "Failed to load checklist templates.",
  );

  useEffect(() => {
    if (templatesError) toast.error(templatesError);
  }, [templatesError]);

  const templates = templatesData ?? [];
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<TemplateFormState>(emptyTemplateForm);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChecklistTemplate | null>(null);

  const openCreate = () => {
    setForm(emptyTemplateForm());
    setNewItemLabel("");
    setShowModal(true);
  };

  const openEdit = (template: ChecklistTemplate) => {
    setForm({
      id: template.id,
      name: template.name,
      type: template.type,
      active: template.active,
      items: template.items.slice().sort((a, b) => a.order - b.order),
    });
    setNewItemLabel("");
    setShowModal(true);
  };

  const addItem = () => {
    if (!newItemLabel.trim()) return;
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: makeItemId(), label: newItemLabel.trim(), required: false, order: f.items.length }],
    }));
    setNewItemLabel("");
  };

  const removeItem = (id: string) => {
    setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id).map((item, idx) => ({ ...item, order: idx })) }));
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    setForm((f) => {
      const items = f.items.slice();
      const index = items.findIndex((i) => i.id === id);
      const target = index + direction;
      if (target < 0 || target >= items.length) return f;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...f, items: items.map((item, idx) => ({ ...item, order: idx })) };
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Template name is required.");
      return;
    }
    try {
      setSaving(true);
      const payload = { name: form.name.trim(), type: form.type, active: form.active, items: form.items };
      if (form.id) {
        await checklistService.updateTemplate(form.id, payload);
        toast.success("Checklist template updated.");
      } else {
        await checklistService.createTemplate(payload);
        toast.success("Checklist template created.");
      }
      setShowModal(false);
      fetchTemplates();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save checklist template."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} size="sm" leftIcon={<PiPlusBold size={14} />}>
          New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <EmptyState
            icon={<PiListChecksBold size={32} />}
            title="No checklist templates yet"
            description="Create an Opening or Closing checklist so staff can tick it off every day."
            action={<Button onClick={openCreate} size="sm" leftIcon={<PiPlusBold size={13} />}>New Template</Button>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div key={template.id} className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{template.name}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{template.type}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      template.active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {template.active ? "Active" : "Off"}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{template.items.length} item{template.items.length === 1 ? "" : "s"}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-[10px] text-muted-foreground">Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(template)}
                    aria-label={`Edit ${template.name}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <PiPencilSimpleBold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(template)}
                    aria-label={`Delete ${template.name}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <PiTrashBold size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">{form.id ? "Edit Checklist" : "New Checklist"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                <PiXBold size={15} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Opening Checklist" className="h-10 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Type</label>
                  <Select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as ChecklistTemplateType })}
                    options={[
                      { value: "opening", label: "Opening" },
                      { value: "closing", label: "Closing" },
                      { value: "custom", label: "Custom" },
                    ]}
                    className="h-10 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Status</label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.active}
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={cn(
                      "flex h-10 w-full items-center justify-center gap-1.5 rounded-md border text-xs font-bold uppercase tracking-wider transition-colors",
                      form.active ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {form.active ? <PiCheckBold size={12} /> : <PiXBold size={12} />}
                    {form.active ? "Active" : "Disabled"}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Checklist Items</label>
                <div className="space-y-1.5">
                  {form.items.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
                      <span className="w-4 shrink-0 text-center text-[10px] font-bold text-muted-foreground">{idx + 1}</span>
                      <span className="flex-1 truncate text-xs text-foreground">{item.label}</span>
                      <button type="button" onClick={() => moveItem(item.id, -1)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <PiArrowUpBold size={12} />
                      </button>
                      <button type="button" onClick={() => moveItem(item.id, 1)} disabled={idx === form.items.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <PiArrowDownBold size={12} />
                      </button>
                      <button type="button" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                        <PiTrashBold size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem();
                      }
                    }}
                    placeholder="Add a checklist item..."
                    className="h-9 flex-1 text-xs"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={addItem}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSubmit} loading={saving}>
                {form.id ? "Save Changes" : "Create Checklist"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await checklistService.removeTemplate(deleteTarget.id);
        }}
        onSuccess={fetchTemplates}
        entityName="checklist template"
        description={`This will permanently delete "${deleteTarget?.name}" and its history.`}
      />
    </div>
  );
}

function ChecklistsPageContent() {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission("dashboard");
  const [tab, setTab] = useState<"today" | "templates">("today");

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader title="Checklists" description="Opening, closing, and daily prep tasks." />

      {canManage && (
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
          {(["today", "templates"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t === "today" ? (
                <span className="inline-flex items-center gap-1.5"><PiCheckCircleBold size={14} /> Today</span>
              ) : (
                <span className="inline-flex items-center gap-1.5"><PiListChecksBold size={14} /> Templates</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        {tab === "today" || !canManage ? <TodayTab /> : <TemplatesTab />}
      </div>
    </div>
  );
}

export default function ChecklistsPage() {
  return (
    <PermissionGuard requiredUnit="operations">
      <ChecklistsPageContent />
    </PermissionGuard>
  );
}
