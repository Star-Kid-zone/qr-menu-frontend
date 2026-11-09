'use client';

import { useState } from 'react';
import { toast } from './toast';
import { ConfirmationDialog } from './ConfirmationDialog';
import { ConfirmDeleteModalProps } from "@/types/components/ui/ConfirmDeleteModal.types";
import { getApiErrorMessage } from "@/utils/errors";

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  onSuccess,
  title = 'Confirm Deletion',
  description,
  confirmLabel = 'Delete',
  entityName,
  successMessage,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // This dialog owns the feedback for the delete: one success toast, or an
  // inline error that keeps the dialog open. Callers must not toast, and must
  // let request errors propagate (not swallow them) so failures show here.
  const handleDelete = async () => {
    try {
      setError(undefined);
      setLoading(true);
      await onConfirm();
      toast.success(successMessage ?? `${entityName || 'Item'} deleted`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, `Couldn't delete ${entityName || 'this item'}. Try again.`));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(undefined);
    onClose();
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleDelete}
      title={title}
      confirmLabel={confirmLabel}
      loading={loading}
      error={error}
      description={description}
    />
  );
}

export default ConfirmDeleteModal;
