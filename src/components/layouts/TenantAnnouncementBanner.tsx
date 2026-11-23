'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PiXBold } from 'react-icons/pi';
import {
  superadminService,
  type PlatformAnnouncement,
} from '@/services/superadmin.service';
import { getJsonStorageItem, setJsonStorageItem } from '@/utils/storage';
import { cn } from '@/utils/cn';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { ANNOUNCEMENT_BADGE_TONE } from '@/constants/app.constants';

const DISMISSED_KEY = STORAGE_KEYS.announcementsDismissed;

const BADGE_TONE = ANNOUNCEMENT_BADGE_TONE;

export function TenantAnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[] | null>(null);
  // Nothing renders until announcements arrive, so reading storage here
  // cannot cause a server/client mismatch.
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    const stored = getJsonStorageItem<string[]>(DISMISSED_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    superadminService
      .getActiveAnnouncements()
      .then((list) => setAnnouncements(Array.isArray(list) ? list : []))
      .catch(() => setAnnouncements([])); // background banner: stay quiet on failure
  }, []);

  const handleDismiss = async (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    setJsonStorageItem(DISMISSED_KEY, updated);

    // Also record it on the server so it stays dismissed on other devices.
    try {
      await superadminService.dismissAnnouncement(id);
    } catch (err) {
      console.error('Failed to sync announcement dismissal with server:', err);
    }
  };

  const active = announcements?.find((a) => !dismissedIds.includes(a.id));
  if (!active) return null;

  return (
    <div role="status" className="border-b border-border bg-card px-4 py-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body">
        <span className={cn('rounded-md px-2 py-0.5 text-caption', BADGE_TONE[active.type] ?? 'bg-muted text-foreground')}>
          {active.badgeText || 'Update'}
        </span>
        <p className="min-w-0 flex-1">
          <span className="text-body-medium text-foreground">{active.title}.</span>{' '}
          <span className="text-muted-foreground">{active.content}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1">
          {active.actionUrl && (
            <Link
              href={active.actionUrl}
              className="rounded-md px-3 py-2 text-body-medium text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
            >
              {active.actionText || 'Open'}
            </Link>
          )}
          <button
            type="button"
            onClick={() => handleDismiss(active.id)}
            aria-label="Dismiss announcement"
            className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            <PiXBold className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
