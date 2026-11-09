'use client';

import { useId } from 'react';
import { PiMegaphoneBold } from 'react-icons/pi';
import { Modal } from '@/components/Modal';
import { Button, FormField, Input, Textarea } from '@/components/ui';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { Notice } from '@/components/ui/Notice';
import { Select } from '@/components/ui/Select';

export interface AnnouncementFormData {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'feature' | 'promo';
  badgeText: string;
  actionUrl: string;
  actionText: string;
  isActive: boolean;
}

export interface CreateAnnouncementModalProps {
  isOpen: boolean;
  form: AnnouncementFormData;
  setForm: React.Dispatch<React.SetStateAction<AnnouncementFormData>>;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TYPE_OPTIONS: { value: AnnouncementFormData['type']; label: string }[] = [
  { value: 'feature', label: 'New feature' },
  { value: 'info', label: 'General info' },
  { value: 'warning', label: 'Maintenance or warning' },
  { value: 'promo', label: 'Promotion or festival' },
];

export function CreateAnnouncementModal({
  isOpen,
  form,
  setForm,
  submitting,
  onClose,
  onSubmit,
}: CreateAnnouncementModalProps) {
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" form={formId} loading={submitting}>
        Publish announcement
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New announcement" maxWidth="max-w-2xl" footer={footer}>
      <form id={formId} onSubmit={onSubmit} className="space-y-4">
        <Notice tone="warning">
          This announcement appears on every restaurant dashboard as soon as it is published.
        </Notice>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Type" htmlFor={fieldId('type')}>
            <Select
              id={fieldId('type')}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as AnnouncementFormData['type'] })}
              options={TYPE_OPTIONS}
            />
          </FormField>

          <FormField label="Badge label" htmlFor={fieldId('badge')}>
            <Input
              id={fieldId('badge')}
              value={form.badgeText}
              onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
              placeholder="e.g. New feature, Maintenance, Holiday"
            />
          </FormField>
        </div>

        <FormField label="Headline" htmlFor={fieldId('title')} required>
          <Input
            id={fieldId('title')}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Mother's Day poster templates are live"
            required
          />
        </FormField>

        <FormField label="Message" htmlFor={fieldId('content')} required>
          <Textarea
            id={fieldId('content')}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="A clear, short message for restaurant owners"
            rows={3}
            className="min-h-0 resize-none"
            required
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Link" htmlFor={fieldId('url')} hint="Optional, e.g. /admin/social-media">
            <Input
              id={fieldId('url')}
              value={form.actionUrl}
              onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
            />
          </FormField>

          <FormField label="Button label" htmlFor={fieldId('action')} hint="Optional, e.g. View posters">
            <Input
              id={fieldId('action')}
              value={form.actionText}
              onChange={(e) => setForm({ ...form, actionText: e.target.value })}
            />
          </FormField>
        </div>

        <section aria-label="Preview" className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="mb-2 text-caption text-muted-foreground">Preview of the banner at the top of each dashboard</p>

          <div
            className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 ${
              form.type === 'warning'
                ? 'border-destructive/30 bg-destructive/5'
                : form.type === 'feature'
                  ? 'border-success/30 bg-success/5'
                  : 'border-primary/20 bg-primary/5'
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-caption font-medium ${
                  form.type === 'warning'
                    ? 'border-destructive/30 bg-destructive/10 text-destructive'
                    : form.type === 'feature'
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'border-primary/30 bg-primary/10 text-primary'
                }`}
              >
                <PiMegaphoneBold className="size-3" aria-hidden />
                <span>{form.badgeText || 'Update'}</span>
              </span>
              <div className="min-w-0 truncate text-caption">
                <span className="mr-1 font-semibold text-foreground">{form.title || 'Announcement title'}:</span>
                <span className="text-muted-foreground">
                  {form.content || 'Your message will show here for all restaurant owners.'}
                </span>
              </div>
            </div>

            {form.actionText && (
              <span className="shrink-0 rounded-md bg-primary px-3 py-1 text-caption font-medium text-primary-foreground">
                {form.actionText}
              </span>
            )}
          </div>
        </section>
      </form>
    </Modal>
  );
}
