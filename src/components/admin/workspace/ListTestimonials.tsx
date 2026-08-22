'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  workspaceService,
  type WorkspaceTestimonial,
} from '@/services/workspace.service';
import {
  PiPlusBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiChatCircleTextBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiStarFill,
} from 'react-icons/pi';
import { Modal } from '@/components/Modal';
import { getApiErrorMessage } from '@/utils/errors';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/ui/Pagination';

export interface ListTestimonialsHandle {
  openNew: () => void;
}

export interface ListTestimonialsProps {
  embedded?: boolean;
  initialTestimonials?: WorkspaceTestimonial[];
  onChanged?: () => void | Promise<void>;
}

interface TestimonialFormData {
  authorName: string;
  authorRole: string;
  quote: string;
  rating: number | '';
  isVisible: boolean;
}

function createDefaultForm(): TestimonialFormData {
  return { authorName: '', authorRole: '', quote: '', rating: 5, isVisible: true };
}

function TestimonialFormModal({
  isOpen,
  onClose,
  onSave,
  initial,
  isEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  initial?: WorkspaceTestimonial | null;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<TestimonialFormData>(createDefaultForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial && isEdit) {
      setForm({
        authorName: initial.authorName || '',
        authorRole: initial.authorRole || '',
        quote: initial.quote || '',
        rating: initial.rating ?? 5,
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
      const payload = {
        authorName: form.authorName,
        authorRole: form.authorRole || null,
        quote: form.quote,
        rating: form.rating === '' ? undefined : Number(form.rating),
        isVisible: form.isVisible,
      };
      if (isEdit && initial) {
        await workspaceService.updateTestimonial(initial.id, payload);
      } else {
        await workspaceService.addTestimonial(payload);
      }
      await onSave();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save testimonial'));
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
        form="testimonial-form"
        className="rounded-lg bg-primary px-8 py-2.5 text-caption font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        disabled={submitting}
      >
        {submitting ? 'Saving...' : isEdit ? 'Update' : 'Add Testimonial'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
      maxWidth="max-w-2xl"
      footer={footer}
    >
      <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-6 py-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Guest Name *
            </label>
            <input
              type="text"
              value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              required
              placeholder="e.g. Sarah K."
              className="w-full rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Role / Description
            </label>
            <input
              type="text"
              value={form.authorRole}
              onChange={(e) => setForm((f) => ({ ...f, authorRole: e.target.value }))}
              placeholder="e.g. Regular guest"
              className="w-full rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Quote *
          </label>
          <textarea
            value={form.quote}
            onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            required
            rows={3}
            placeholder="What did the guest say?"
            className="w-full resize-none rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Rating
            </label>
            <select
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value ? Number(e.target.value) : '' }))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
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

function DeleteTestimonialModal({
  isOpen,
  onClose,
  testimonial,
  onDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  testimonial: WorkspaceTestimonial | null;
  onDeleted: () => void | Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!testimonial) return;
    setDeleting(true);
    try {
      await workspaceService.removeTestimonial(testimonial.id);
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Testimonial" maxWidth="max-w-md" footer={footer}>
      <div className="space-y-4 py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <PiTrashBold className="text-3xl text-destructive" />
        </div>
        <p className="font-semibold text-foreground">Are you sure you want to delete this testimonial?</p>
        {testimonial && <p className="text-body text-muted-foreground">&ldquo;{testimonial.authorName}&rdquo;</p>}
        <p className="text-caption text-muted-foreground">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}

export const ListTestimonials = forwardRef<ListTestimonialsHandle, ListTestimonialsProps>(({
  embedded = false,
  initialTestimonials,
  onChanged,
}, ref) => {
  const [items, setItems] = useState<WorkspaceTestimonial[]>(initialTestimonials ?? []);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<WorkspaceTestimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceTestimonial | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openNew: () => setShowForm(true),
  }));

  useEffect(() => {
    if (initialTestimonials) setItems(initialTestimonials);
  }, [initialTestimonials]);

  const { page, pageCount, pageItems, pageSize, totalItems, setPage } = usePagination(items, 8);

  const refresh = async () => {
    if (onChanged) await onChanged();
  };

  const handleToggle = async (t: WorkspaceTestimonial) => {
    setToggling(t.id);
    try {
      await workspaceService.toggleTestimonial(t.id);
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
        <PiChatCircleTextBold className="text-4xl" />
      </div>
      <h3 className="text-h2 text-foreground">No Testimonials Yet</h3>
      <p className="mt-2 max-w-md text-body text-muted-foreground">
        Add real guest quotes to show on your landing page. Nothing shows here until you add one.
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add First Testimonial
      </button>
    </div>
  ) : (
    <div className="space-y-4">
      {(embedded ? pageItems : items).map((t) => (
        <div key={t.id} className="overflow-hidden rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <h3 className="min-w-0 break-words text-h3 text-foreground">{t.authorName}</h3>
                {t.authorRole && <span className="text-caption text-muted-foreground">{t.authorRole}</span>}
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-semibold ${t.isVisible ? 'border-success/20 bg-success/15 text-success' : 'border-border bg-muted text-muted-foreground'}`}>
                  {t.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              {t.rating != null && (
                <div className="mb-2 flex gap-0.5 text-warning">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <PiStarFill key={s} className={s <= t.rating! ? 'opacity-100' : 'opacity-20'} />
                  ))}
                </div>
              )}
              <p className="line-clamp-2 break-words text-body text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                onClick={() => handleToggle(t)}
                disabled={toggling === t.id}
                className="rounded-lg border border-border bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
                title={t.isVisible ? 'Hide from landing page' : 'Show on landing page'}
              >
                {t.isVisible ? <PiEyeBold className="text-lg" /> : <PiEyeSlashBold className="text-lg" />}
              </button>
              <button
                onClick={() => { setEditItem(t); setShowForm(true); }}
                className="rounded-lg border border-border bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-secondary/80"
                title="Edit"
              >
                <PiPencilSimpleBold className="text-lg" />
              </button>
              <button
                onClick={() => setDeleteTarget(t)}
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
            <h1 className="text-h1 text-foreground">Testimonials</h1>
            <p className="mt-1 text-body text-muted-foreground">Manage the real guest quotes shown on your landing page.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PiPlusBold className="text-xl" /> New Testimonial
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
        <TestimonialFormModal
          isOpen={showForm}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={refresh}
          initial={editItem}
          isEdit={!!editItem}
        />
      )}
      {deleteTarget && (
        <DeleteTestimonialModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          testimonial={deleteTarget}
          onDeleted={refresh}
        />
      )}
    </div>
  );
});

ListTestimonials.displayName = 'ListTestimonials';
