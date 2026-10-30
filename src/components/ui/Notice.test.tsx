import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Notice } from './Notice';

describe('Notice Component', () => {
  it('renders children message content properly', () => {
    render(<Notice>Your menu changes have been saved.</Notice>);
    expect(screen.getByText('Your menu changes have been saved.')).toBeInTheDocument();
  });

  it('applies default info tone styling classes', () => {
    const { container } = render(<Notice>Info alert</Notice>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('text-primary');
    expect(el.className).toContain('border-primary/20');
  });

  it('applies error tone styling classes when tone="error"', () => {
    const { container } = render(<Notice tone="error">Failed to upload item</Notice>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('text-destructive');
  });

  it('applies success tone styling classes when tone="success"', () => {
    const { container } = render(<Notice tone="success">Payment processed successfully</Notice>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('text-success');
  });

  it('applies warning tone styling classes when tone="warning"', () => {
    const { container } = render(<Notice tone="warning">QR code download limit reached</Notice>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('text-warning');
  });
});

