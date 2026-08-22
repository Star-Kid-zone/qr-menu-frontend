'use client';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { workspaceService } from '@/services/workspace.service';
import {
  PiPlusBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiTagBold,
  PiCheckCircleBold,
  PiXCircleBold,
  PiUploadSimpleBold,
} from 'react-icons/pi';
import { Modal } from '@/components/Modal';
import { OfferFormData, ListOffersProps, Offer } from "@/types/components/admin/workspace/ListOffers.types";
import { getApiErrorMessage } from "@/utils/errors";
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/ui/Pagination';

function createDefaultOfferForm(): OfferFormData {
  return { title: '', description: '', discount: '', isActive: true };
}

function OfferFormModal({
  isOpen,
  onClose,
  onSave,
  initial,
  isEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  initial?: Offer | null;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<OfferFormData>(createDefaultOfferForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial && isEdit) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        discount: initial.discount || '',
        isActive: initial.isActive ?? true,
      });
    } else {
      setForm(createDefaultOfferForm());
    }
    setImageFile(null);
  }, [initial, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('discount', form.discount);
      fd.append('isActive', String(form.isActive));
      if (imageFile) fd.append('image', imageFile);

      if (isEdit && initial) {
        await workspaceService.updateOfferItem(initial.id, fd);
      } else {
        await workspaceService.addOfferItem(fd);
      }
      await onSave();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save offer'));
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
        form="offer-form"
        className="rounded-lg bg-primary px-8 py-2.5 text-caption font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        disabled={submitting}
      >
        {submitting ? 'Saving...' : isEdit ? 'Update Offer' : 'Create Offer'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Offer' : 'Create New Offer'}
      maxWidth="max-w-2xl"
      footer={footer}
    >
      <form id="offer-form" onSubmit={handleSubmit} className="space-y-6 py-2">
        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Offer Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder='e.g. "20% off on Tuesdays"'
            className="w-full rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Details about this offer..."
            className="w-full resize-none rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Discount Badge
            </label>
            <input
              type="text"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder='e.g. "20% OFF" or "BOGO"'
              className="w-full rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </label>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
              className={`group flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all ${form.isActive ? 'border-primary/20 bg-primary/5' : 'border-border bg-card/50 hover:border-border/80'}`}
            >
              <span
                className={`text-body font-semibold ${form.isActive ? 'text-primary' : 'text-foreground'}`}
              >
                {form.isActive ? 'Active' : 'Inactive'}
              </span>
              <div
                className={`h-6 w-12 rounded-full p-1 transition-all duration-300 ${form.isActive ? 'bg-primary' : 'bg-muted'}`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-300 ${form.isActive ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Image (optional)
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border p-4 text-caption text-muted-foreground hover:border-primary/40">
            <PiUploadSimpleBold className="text-lg" />
            {imageFile ? imageFile.name : initial?.imageUrl ? 'Replace current image' : 'Choose an image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
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

function DeleteOfferModal({
  isOpen,
  onClose,
  offer,
  onDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
  onDeleted: () => void | Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!offer) return;
    setDeleting(true);
    try {
      await workspaceService.removeOfferItem(offer.id);
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
        {deleting ? 'Deleting...' : 'Delete Offer'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Offer"
      maxWidth="max-w-md"
      footer={footer}
    >
      <div className="space-y-4 py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <PiTrashBold className="text-3xl text-destructive" />
        </div>
        <p className="font-semibold text-foreground">Are you sure you want to delete this offer?</p>
        {offer && <p className="text-body text-muted-foreground">&ldquo;{offer.title}&rdquo;</p>}
        <p className="text-caption text-muted-foreground">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}

export interface ListOffersHandle {
  openNewOffer: () => void;
}

export const ListOffers = forwardRef<ListOffersHandle, ListOffersProps>(({
  embedded = false,
  initialOffers,
  onChanged,
}, ref) => {
  const [offers, setOffers] = useState<Offer[]>(initialOffers ?? []);

  const [showForm, setShowForm] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);

  useImperativeHandle(ref, () => ({
    openNewOffer: () => setShowForm(true),
  }));

  useEffect(() => {
    if (initialOffers) setOffers(initialOffers);
  }, [initialOffers]);

  const { page, pageCount, pageItems, pageSize, totalItems, setPage } = usePagination(offers, 8);

  const refresh = async () => {
    if (onChanged) await onChanged();
  };

  const handleEdit = (offer: Offer) => {
    setEditOffer(offer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditOffer(null);
  };

  const header = embedded ? null : (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-h1 text-foreground">Workspace Offers</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Create and manage promotions for your customers.
        </p>
      </div>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <PiPlusBold className="text-xl" /> New Offer
      </button>
    </div>
  );

  const list = offers.length === 0 ? (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PiTagBold className="text-4xl" />
      </div>
      <h3 className="text-h2 text-foreground">No Offers Yet</h3>
      <p className="mt-2 max-w-md text-body text-muted-foreground">
        Create your first special offer to attract more customers.
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Create First Offer
      </button>
    </div>
  ) : (
    <div className="space-y-4">
      {(embedded ? pageItems : offers).map((offer) => (
        <div
          key={offer.id}
          className="overflow-hidden rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                {offer.imageUrl ? (
                  <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
                ) : (
                  <PiTagBold className="text-2xl" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-3">
                  <h3 className="min-w-0 break-words text-h3 text-foreground">
                    {offer.title}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-semibold uppercase tracking-wide ${offer.isActive ? 'bg-success/15 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'}`}
                  >
                    {offer.isActive ? <PiCheckCircleBold /> : <PiXCircleBold />}
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {offer.discount && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-caption font-semibold text-primary">
                      {offer.discount}
                    </span>
                  )}
                </div>
                {offer.description && (
                  <p className="mb-2 line-clamp-1 break-words text-body text-muted-foreground">
                    {offer.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                onClick={() => handleEdit(offer)}
                className="rounded-lg border border-border bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-secondary/80"
                title="Edit"
              >
                <PiPencilSimpleBold className="text-lg" />
              </button>
              <button
                onClick={() => setDeleteTarget(offer)}
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
      <div className={embedded ? 'shrink-0 space-y-6' : 'space-y-8'}>
        {header}
      </div>

      <div className={embedded ? 'min-h-0 flex-1 overflow-y-auto pr-1' : ''}>{list}</div>

      {embedded ? (
        <div className="shrink-0">
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
        </div>
      ) : null}

      {showForm && (
        <OfferFormModal
          isOpen={showForm}
          onClose={handleCloseForm}
          onSave={refresh}
          initial={editOffer}
          isEdit={!!editOffer}
        />
      )}
      {deleteTarget && (
        <DeleteOfferModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          offer={deleteTarget}
          onDeleted={refresh}
        />
      )}
    </div>
  );
});

ListOffers.displayName = 'ListOffers';
