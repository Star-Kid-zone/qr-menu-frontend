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

  it('keeps the confirm button locked until the confirmation text is typed', () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Suspend account?"
        description="The restaurant's website goes offline."
        confirmLabel="Suspend account"
        typeToConfirm="Admin Business"
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />
    );

    const confirm = screen.getByRole('button', { name: 'Suspend account' });
    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/to confirm/i), { target: { value: 'Admin Business' } });
    expect(confirm).not.toBeDisabled();
    fireEvent.click(confirm);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows an inline error when the action fails', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Post now?"
        description="This posts to Instagram."
        confirmLabel="Post now"
        tone="default"
        error="Instagram rejected the post."
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Instagram rejected the post.');
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

