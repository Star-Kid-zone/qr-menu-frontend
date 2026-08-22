'use client';

import { useEffect } from 'react';
import { PiWarningCircleBold } from 'react-icons/pi';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[app/error]', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <EmptyState
        icon={<PiWarningCircleBold size={32} />}
        title="Something went wrong"
        description="An unexpected error occurred. You can try again, and if the problem keeps happening, please contact support."
        action={
          <Button onClick={() => reset()}>
            Try again
          </Button>
        }
      />
    </div>
  );
}
