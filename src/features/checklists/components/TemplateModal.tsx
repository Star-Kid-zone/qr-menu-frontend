'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { Select } from '@/components/ui/Select';
import { ToggleCard } from '@/components/ui/ToggleCard';
import { PiArrowDownBold, PiArrowUpBold, PiTrashBold } from 'react-icons/pi';
import type { ChecklistTemplateType } from '@/services/checklist.service';
import type { TemplateFormState } from '../types';

export interface TemplateModalProps {
  isOpen: boolean;
  form: TemplateFormState;
  setForm: React.Dispatch<React.SetStateAction<TemplateFormState>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function makeItemId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `item_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const iconButtonClass =
  'flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-30';

export function TemplateModal({
  isOpen,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
}: TemplateModalProps) {
  const [newItemLabel, setNewItemLabel] = useState('');

  const addItem = () => {
    if (!newItemLabel.trim()) return;
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: makeItemId(), label: newItemLabel.trim(), required: false, order: f.items.length }],
    }));
    setNewItemLabel('');
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

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" onClick={onSubmit} loading={saving}>
        {form.id ? 'Save changes' : 'Create checklist'}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={form.id ? 'Edit checklist' : 'New checklist'}
      maxWidth="max-w-lg"
      footer={footer}
    >
      <div className="space-y-4">
        <FormField label="Name" htmlFor="checklist-name" required>
          <Input
            id="checklist-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Opening checklist"
          />
        </FormField>

        <FormField label="Type" htmlFor="checklist-type">
          <Select
            id="checklist-type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ChecklistTemplateType })}
            options={[
              { value: 'opening', label: 'Opening' },
              { value: 'closing', label: 'Closing' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
        </FormField>

        <ToggleCard
          checked={form.active}
          onChange={(active) => setForm({ ...form, active })}
          label="Active"
          description="Only active checklists appear on the Today tab."
        />

        <fieldset className="space-y-2">
          <legend className="text-body-medium text-foreground">Checklist items</legend>
          {form.items.length > 0 ? (
            <ol className="space-y-2">
              {form.items.map((item, idx) => (
                <li key={item.id} className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-2">
                  <span className="w-5 shrink-0 text-center text-caption text-muted-foreground" aria-hidden>
                    {idx + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-body text-foreground">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, -1)}
                    disabled={idx === 0}
                    aria-label={`Move "${item.label}" up`}
                    className={iconButtonClass}
                  >
                    <PiArrowUpBold className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, 1)}
                    disabled={idx === form.items.length - 1}
                    aria-label={`Move "${item.label}" down`}
                    className={iconButtonClass}
                  >
                    <PiArrowDownBold className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove "${item.label}"`}
                    className={`${iconButtonClass} hover:text-destructive`}
                  >
                    <PiTrashBold className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
          <div className="flex gap-2">
            <label htmlFor="checklist-new-item" className="sr-only">
              New checklist item
            </label>
            <Input
              id="checklist-new-item"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem();
                }
              }}
              placeholder="Add a checklist item"
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={addItem}>
              Add
            </Button>
          </div>
        </fieldset>
      </div>
    </Modal>
  );
}
