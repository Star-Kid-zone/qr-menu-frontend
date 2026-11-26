'use client';

import { useEffect } from 'react';
import { Button, Notice } from '@/components/ui';

/**
 * Error boundary for this area: it renders inside the layout, so the sidebar and top bar stay
 * usable and only the page content is replaced.
 */
export default function AreaError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error('[area error]', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Notice
        tone="error"
        title="This page couldn't load"
        action={<Button onClick={() => reset()}>Try again</Button>}
      >
        Something went wrong while showing this page. Try again, or pick another section from the menu.
      </Notice>
    </div>
  );
}
