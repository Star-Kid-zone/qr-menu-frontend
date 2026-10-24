'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import {
  PiArrowDownBold,
  PiArrowUpBold,
  PiCheckBold,
  PiTrashBold,
  PiXBold,
} from 'react-icons/pi';
import { cn } from '@/utils/cn';
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

export function TemplateModal({
  isOpen,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
}: TemplateModalProps) {
  const [newItemLabel, setNewItemLabel] = useState('');

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl animate-fade-in-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{form.id ? 'Edit Checklist' : 'New Checklist'}</h2>
          <button type="button" onClick={onClose} className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
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
                  { value: 'opening', label: 'Opening' },
                  { value: 'closing', label: 'Closing' },
                  { value: 'custom', label: 'Custom' },
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
                  'flex h-10 w-full items-center justify-center gap-1.5 rounded-md border text-xs font-bold uppercase tracking-wider transition-colors',
                  form.active ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'border-border bg-muted text-muted-foreground',
                )}
              >
                {form.active ? <PiCheckBold size={12} /> : <PiXBold size={12} />}
                {form.active ? 'Active' : 'Disabled'}
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
                  if (e.key === 'Enter') {
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
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onSubmit} loading={saving}>
            {form.id ? 'Save Changes' : 'Create Checklist'}
          </Button>
        </div>
      </div>
    </div>
  );
}
