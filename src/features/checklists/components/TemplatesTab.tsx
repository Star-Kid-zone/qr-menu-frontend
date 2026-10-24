'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import {
  checklistService,
  type ChecklistTemplate,
} from '@/services/checklist.service';
import { getApiErrorMessage } from '@/utils/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  PiListChecksBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiTrashBold,
} from 'react-icons/pi';
import { cn } from '@/utils/cn';
import type { TemplateFormState } from '../types';
import { TemplateModal } from './TemplateModal';

function emptyTemplateForm(): TemplateFormState {
  return { id: null, name: '', type: 'custom', active: true, items: [] };
}

export function TemplatesTab() {
  const {
    data: templatesData,
    error: templatesError,
    refetch: fetchTemplates,
  } = useAsyncData(
    async () => (await checklistService.listTemplates()).data.templates,
    [],
    'Failed to load checklist templates.',
  );

  useEffect(() => {
    if (templatesError) toast.error(templatesError);
  }, [templatesError]);

  const templates = templatesData ?? [];
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<TemplateFormState>(emptyTemplateForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChecklistTemplate | null>(null);

  const openCreate = () => {
    setForm(emptyTemplateForm());
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
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Template name is required.');
      return;
    }
    try {
      setSaving(true);
      const payload = { name: form.name.trim(), type: form.type, active: form.active, items: form.items };
      if (form.id) {
        await checklistService.updateTemplate(form.id, payload);
        toast.success('Checklist template updated.');
      } else {
        await checklistService.createTemplate(payload);
        toast.success('Checklist template created.');
      }
      setShowModal(false);
      fetchTemplates();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to save checklist template.'));
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
                      'rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      template.active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {template.active ? 'Active' : 'Off'}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{template.items.length} item{template.items.length === 1 ? '' : 's'}</p>
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

      <TemplateModal
        isOpen={showModal}
        form={form}
        setForm={setForm}
        saving={saving}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

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
