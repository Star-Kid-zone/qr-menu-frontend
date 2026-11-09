import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Notice } from './Notice';

describe('Notice Component', () => {
  it('renders its message', () => {
    render(<Notice>Your changes were saved.</Notice>);
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();
  });

  it('announces errors as alerts and other tones as status', () => {
    const { rerender } = render(<Notice tone="error">Upload failed.</Notice>);
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed.');

    rerender(<Notice tone="success">Saved.</Notice>);
    expect(screen.getByRole('status')).toHaveTextContent('Saved.');
  });

  it.each([
    ['info', 'border-l-info'],
    ['success', 'border-l-success'],
    ['warning', 'border-l-warning'],
    ['error', 'border-l-destructive'],
  ] as const)('marks the %s tone with a coloured left rule', (tone, cls) => {
    const { container } = render(<Notice tone={tone}>Message</Notice>);
    expect((container.firstChild as HTMLElement).className).toContain(cls);
  });

  it('keeps the message in the body colour for contrast', () => {
    const { container } = render(<Notice tone="warning">Check this</Notice>);
    expect((container.firstChild as HTMLElement).className).toContain('text-foreground');
  });

  it('renders an optional title and action', () => {
    render(
      <Notice tone="error" title="We couldn't load your menu" action={<button>Try again</button>}>
        Check your connection.
      </Notice>
    );
    expect(screen.getByText("We couldn't load your menu")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
