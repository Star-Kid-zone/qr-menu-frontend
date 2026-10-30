'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from './button';
import { Input } from './input';
import { ModalFooter } from './ModalFooter';
import { PromptDialogProps } from '@/types/components/ui/PromptDialog.types';

export function PromptDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  placeholder,
  confirmLabel = 'Create',
  cancelLabel = 'Cancel',
  loading = false,
}: PromptDialogProps) {
  const [value, setValue] = useState('');
  // Reset the input the moment the dialog transitions to open, without an
  // effect (react-hooks/set-state-in-effect) — see "adjusting state when a
  // prop changes" in the React docs.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setValue('');
  }

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const footer = (
    <ModalFooter>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button onClick={handleSubmit} loading={loading} disabled={!value.trim()}>
        {confirmLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md" footer={footer}>
      <div className="flex flex-col gap-4">
        {label ? (
          <label htmlFor="prompt-dialog-input" className="mb-1.5 block break-words text-caption font-semibold text-muted-foreground">
            {label}
          </label>
        ) : null}
        <Input
          id="prompt-dialog-input"
          autoFocus
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>
    </Modal>
  );
}
