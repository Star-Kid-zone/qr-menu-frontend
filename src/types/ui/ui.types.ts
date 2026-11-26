import type { ReactNode } from 'react';

interface WithClassName {
  className?: string;
}

export interface PageLoaderProps extends WithClassName {
  label?: ReactNode;
  fullScreen?: boolean;
  theme?: string;
  surfaceClassName?: string;
  textClassName?: string;
}

export * from './Button.types';
export * from './Badge.types';
export * from './Card.types';
export * from './Checkbox.types';
export * from './ConfirmationDialog.types';
export * from './ConfirmDeleteModal.types';
export * from './EmptyState.types';
export * from './FormField.types';
export * from './Input.types';
export * from './Modal.types';
export * from './ModalFooter.types';
export * from './Notice.types';
export * from './PageHeader.types';
export * from './PromptDialog.types';
export * from './SearchInput.types';
export * from './Select.types';
export * from './Spinner.types';
export * from './Textarea.types';
export * from './ToggleCard.types';
export * from './NextLinkAdapter.types';
export * from './ActionMenu.types';
export * from './AdminFormPage.types';
export * from './MediaRemoveButton.types';
export * from './PageContainer.types';
export * from './Pagination.types';
export * from './RestaurantLoaderIcon.types';
export * from './ScrollableTabRow.types';
export * from './SectionHeader.types';
export * from './SubTabPills.types';
export * from './Table.types';
export * from './Toast.types';
export * from './Tooltip.types';
