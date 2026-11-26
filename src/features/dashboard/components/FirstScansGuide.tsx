'use client';

import Link from 'next/link';
import { PiQrCodeBold } from 'react-icons/pi';
import { Button, buttonVariants } from '@/components/ui/button';
import type { RangeKey } from '../types';

export interface FirstScansGuideProps {
  range: RangeKey;
  onShowAllTime?: () => void;
}

/** Shown instead of empty charts when the selected period has no guest activity. */
export function FirstScansGuide({ range, onShowAllTime }: FirstScansGuideProps) {
  const isAllTime = range === 'all';
  const title = isAllTime
    ? 'No visits yet'
    : `No visits in the last ${range === '7d' ? '7' : '30'} days`;
  const description = isAllTime
    ? 'Print your QR code for tables or counters. Visits, popular dishes, and searches will appear here.'
    : 'No scans recorded in this period. Switch to All time or share your QR code with guests.';

  return (
    <section
      aria-labelledby="first-scans-heading"
      className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center"
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <PiQrCodeBold size={22} aria-hidden />
      </div>
      <h3 id="first-scans-heading" className="text-h3 text-foreground">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-body text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Link href="/admin/qr-menu" className={buttonVariants({ variant: 'primary' })}>
          Get QR codes
        </Link>
        {onShowAllTime ? (
          <Button type="button" variant="secondary" onClick={onShowAllTime}>
            Show all time
          </Button>
        ) : null}
      </div>
    </section>
  );
}
