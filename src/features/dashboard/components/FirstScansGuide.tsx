'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

/** Shown instead of empty charts when a restaurant has no visits yet. */
export function FirstScansGuide() {
  return (
    <section aria-labelledby="first-scans-heading" className="rounded-lg border border-dashed border-border bg-card p-6 text-center">
      <h2 id="first-scans-heading" className="text-h3 text-foreground">Your first guests will show up here</h2>
      <p className="mx-auto mt-1 max-w-md text-body text-muted-foreground">
        Print your QR code and put it on tables or at the counter. As soon as someone scans it, you&apos;ll see visits, popular dishes and searches.
      </p>
      <Link href="/admin/qr-menu" className={`${buttonVariants({ variant: 'secondary' })} mt-4`}>
        Get your QR codes
      </Link>
    </section>
  );
}
