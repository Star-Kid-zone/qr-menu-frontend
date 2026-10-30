import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationDialog } from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmationDialog
        isOpen={false}
        title="Delete Item"
        description="Are you sure you want to delete this?"
        confirmLabel="Delete"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders title, description, and button labels when open', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Delete Item"
        description="This action cannot be undone."
        confirmLabel="Confirm Delete"
        cancelLabel="Discard"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Discard')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Confirm Action"
        description="Proceed with operation?"
        confirmLabel="Yes"
        cancelLabel="Cancel"
        onClose={handleClose}
        onConfirm={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Confirm Action"
        description="Proceed with operation?"
        confirmLabel="Yes, Continue"
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />
    );

    fireEvent.click(screen.getByText('Yes, Continue'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables cancel button and shows loading state on confirm button when loading', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Processing"
        description="Please wait..."
        confirmLabel="Submit"
        cancelLabel="Cancel"
        loading={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeDisabled();

    // Confirm button should have disabled or aria-busy or loading indicator
    const confirmButton = screen.getByRole('button', { name: /Submit/i });
    expect(confirmButton).toBeDisabled();
  });
});

