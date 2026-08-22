'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  workspaceService,
  type WorkspaceFaq,
} from '@/services/workspace.service';
import {
  PiPlusBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiQuestionBold,
  PiEyeBold,
  PiEyeSlashBold,
} from 'react-icons/pi';
import { Modal } from '@/components/Modal';
import { getApiErrorMessage } from '@/utils/errors';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/ui/Pagination';

export interface ListFaqsHandle {
  openNew: () => void;
}

export interface ListFaqsProps {
  embedded?: boolean;
  initialFaqs?: WorkspaceFaq[];
  onChanged?: () => void | Promise<void>;
}

interface FaqFormData {
  question: string;
  answer: string;
  isVisible: boolean;
}

function createDefaultForm(): FaqFormData {
  return { question: '', answer: '', isVisible: true };
}

function FaqFormModal({
  isOpen,
  onClose,
  onSave,
  initial,
  isEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  initial?: WorkspaceFaq | null;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<FaqFormData>(createDefaultForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial && isEdit) {
      setForm({
        question: initial.question || '',
        answer: initial.answer || '',
        isVisible: initial.isVisible ?? true,
      });
    } else {
      setForm(createDefaultForm());
    }
  }, [initial, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = { question: form.question, answer: form.answer, isVisible: form.isVisible };
      if (isEdit && initial) {
        await workspaceService.updateFaq(initial.id, payload);
      } else {
        await workspaceService.addFaq(payload);
      }
      await onSave();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save FAQ'));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-border px-5 py-2.5 text-caption font-semibold text-foreground transition-colors hover:bg-muted"
        disabled={submitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="faq-form"
        className="rounded-lg bg-primary px-8 py-2.5 text-caption font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        disabled={submitting}
      >
        {submitting ? 'Saving...' : isEdit ? 'Update' : 'Add FAQ'}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit FAQ' : 'Add FAQ'} maxWidth="max-w-2xl" footer={footer}>
      <form id="faq-form" onSubmit={handleSubmit} className="space-y-6 py-2">
        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Question *
          </label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            required
            placeholder="e.g. Do you take reservations?"
            className="w-full rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Answer *
          </label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            required
            rows={4}
            placeholder="Answer shown to guests"
            className="w-full resize-none rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Visibility
          </label>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, isVisible: !p.isVisible }))}
            className={`group flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all ${form.isVisible ? 'border-primary/20 bg-primary/5' : 'border-border bg-card/50 hover:border-border/80'}`}
          >
            <span className={`text-body font-semibold ${form.isVisible ? 'text-primary' : 'text-foreground'}`}>
              {form.isVisible ? 'Visible on landing page' : 'Hidden'}
            </span>
            <div className={`h-6 w-12 rounded-full p-1 transition-all duration-300 ${form.isVisible ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-300 ${form.isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-body font-medium text-destructive">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}

function DeleteFaqModal({
  isOpen,
  onClose,
  faq,
  onDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  faq: WorkspaceFaq | null;
  onDeleted: () => void | Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!faq) return;
    setDeleting(true);
    try {
      await workspaceService.removeFaq(faq.id);
      await onDeleted();
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-border px-5 py-2.5 text-caption font-semibold text-foreground transition-colors hover:bg-muted"
        disabled={deleting}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-lg bg-destructive px-8 py-2.5 text-caption font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-70"
        disabled={deleting}
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete FAQ" maxWidth="max-w-md" footer={footer}>
      <div className="space-y-4 py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <PiTrashBold className="text-3xl text-destructive" />
        </div>
        <p className="font-semibold text-foreground">Are you sure you want to delete this FAQ?</p>
        {faq && <p className="text-body text-muted-foreground">&ldquo;{faq.question}&rdquo;</p>}
        <p className="text-caption text-muted-foreground">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}

export const ListFaqs = forwardRef<ListFaqsHandle, ListFaqsProps>(({
  embedded = false,
  initialFaqs,
  onChanged,
}, ref) => {
  const [items, setItems] = useState<WorkspaceFaq[]>(initialFaqs ?? []);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<WorkspaceFaq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceFaq | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openNew: () => setShowForm(true),
  }));

  useEffect(() => {
    if (initialFaqs) setItems(initialFaqs);
  }, [initialFaqs]);

  const { page, pageCount, pageItems, pageSize, totalItems, setPage } = usePagination(items, 8);

  const refresh = async () => {
    if (onChanged) await onChanged();
  };

  const handleToggle = async (f: WorkspaceFaq) => {
    setToggling(f.id);
    try {
      await workspaceService.toggleFaq(f.id);
      await refresh();
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setToggling(null);
    }
  };

  const list = items.length === 0 ? (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PiQuestionBold className="text-4xl" />
      </div>
      <h3 className="text-h2 text-foreground">No FAQs Yet</h3>
      <p className="mt-2 max-w-md text-body text-muted-foreground">
        Add real questions guests actually ask. Nothing shows here until you add one.
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add First FAQ
      </button>
    </div>
  ) : (
    <div className="space-y-4">
      {(embedded ? pageItems : items).map((f) => (
        <div key={f.id} className="overflow-hidden rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <h3 className="min-w-0 break-words text-h3 text-foreground">{f.question}</h3>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-semibold ${f.isVisible ? 'border-success/20 bg-success/15 text-success' : 'border-border bg-muted text-muted-foreground'}`}>
                  {f.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className="line-clamp-2 break-words text-body text-muted-foreground">{f.answer}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                onClick={() => handleToggle(f)}
                disabled={toggling === f.id}
                className="rounded-lg border border-border bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
                title={f.isVisible ? 'Hide from landing page' : 'Show on landing page'}
              >
                {f.isVisible ? <PiEyeBold className="text-lg" /> : <PiEyeSlashBold className="text-lg" />}
              </button>
              <button
                onClick={() => { setEditItem(f); setShowForm(true); }}
                className="rounded-lg border border-border bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-secondary/80"
                title="Edit"
              >
                <PiPencilSimpleBold className="text-lg" />
              </button>
              <button
                onClick={() => setDeleteTarget(f)}
                className="rounded-lg border border-border p-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Delete"
              >
                <PiTrashBold className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={embedded ? 'flex h-full flex-col gap-6' : 'mx-auto max-w-7xl space-y-8'}>
      {!embedded && (
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-h1 text-foreground">FAQs</h1>
            <p className="mt-1 text-body text-muted-foreground">Manage the real questions guests ask.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PiPlusBold className="text-xl" /> New FAQ
          </button>
        </div>
      )}

      <div className={embedded ? 'min-h-0 flex-1 overflow-y-auto pr-1' : ''}>{list}</div>

      {embedded ? (
        <div className="shrink-0">
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
        </div>
      ) : null}

      {showForm && (
        <FaqFormModal
          isOpen={showForm}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={refresh}
          initial={editItem}
          isEdit={!!editItem}
        />
      )}
      {deleteTarget && (
        <DeleteFaqModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          faq={deleteTarget}
          onDeleted={refresh}
        />
      )}
    </div>
  );
});

ListFaqs.displayName = 'ListFaqs';
