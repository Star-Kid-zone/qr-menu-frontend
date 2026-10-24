import { RiDeleteBin6Line } from 'react-icons/ri';
import { Modal } from './Modal';
import { Button } from '../ui/button';
import { ModalFooter } from './ModalFooter';
import { ConfirmationDialogProps } from "@/types/components/ui/ConfirmationDialog.types";

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  loading = false,
  icon,
  maxWidth = 'max-w-md',
}: ConfirmationDialogProps) {
  const footer = (
    <ModalFooter>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      footer={footer}
    >
      <div className="flex flex-col items-center space-y-4 py-2 text-center">
        <div className="mb-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:h-16 sm:w-16">
          {icon ?? <RiDeleteBin6Line className="size-6 sm:size-8" />}
        </div>

        <p className="break-words font-medium leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;
