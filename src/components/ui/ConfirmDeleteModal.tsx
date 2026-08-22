'use client';

import { useState, type ReactNode } from 'react';
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
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      await onConfirm();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(`Error deleting ${entityName || 'item'}:`, err);
      setError(getApiErrorMessage(err, `Failed to delete ${entityName || 'item'}.`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={title}
      confirmLabel={confirmLabel}
      loading={loading}
      error={error}
      description={description}
    />
  );
}
