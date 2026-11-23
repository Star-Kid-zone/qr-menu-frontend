import { useId, useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from './button';
import { Input } from './input';
import { ModalFooter } from './ModalFooter';
import { Notice } from './Notice';
import { ConfirmationDialogProps } from "@/types/ui/ConfirmationDialog.types";

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  loading = false,
  error,
  tone = 'destructive',
  typeToConfirm,
  children,
  maxWidth = 'max-w-md',
}: ConfirmationDialogProps) {
  const inputId = useId();
  const [typed, setTyped] = useState('');
  // Clear the typed confirmation whenever the dialog closes (adjusting state
  // during render instead of in an effect avoids an extra render pass).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setTyped('');
  }

  const locked = Boolean(typeToConfirm) && typed.trim() !== typeToConfirm?.trim();

  const footer = (
    <ModalFooter>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        variant={tone === 'destructive' ? 'destructive' : 'primary'}
        onClick={onConfirm}
        loading={loading}
        disabled={locked}
      >
        {confirmLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth} footer={footer}>
      <div className="space-y-4">
        <div className="break-words text-body text-muted-foreground">{description}</div>

        {children}

        {typeToConfirm ? (
          <div className="space-y-2">
            <label htmlFor={inputId} className="block text-body-medium text-foreground">
              Type <span className="font-semibold">{typeToConfirm}</span> to confirm
            </label>
            <Input
              id={inputId}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ) : null}

        {error ? <Notice tone="error">{error}</Notice> : null}
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;
