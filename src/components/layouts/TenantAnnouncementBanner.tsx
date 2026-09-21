'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PiMegaphoneBold, PiXBold, PiSparkleBold, PiInfoBold, PiWarningBold } from 'react-icons/pi';
import {
  superadminService,
  type PlatformAnnouncement,
} from '@/services/superadmin.service';

const DISMISSED_KEY = 'dismissed_announcements';

export function TenantAnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_KEY);
      if (stored) {
        setDismissedIds(JSON.parse(stored));
      }
    } catch {
      // ignore storage error
    }

    async function fetchAnnouncements() {
      try {
        const list = await superadminService.getActiveAnnouncements();
        if (Array.isArray(list)) {
          setAnnouncements(list);
        }
      } catch {
        // fail silently for background banner
      } finally {
        setLoaded(true);
      }
    }

    fetchAnnouncements();
  }, []);

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const activeAnnouncement = announcements.find((a) => !dismissedIds.includes(a.id));

  if (!loaded || !activeAnnouncement) return null;

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-destructive/20 text-destructive dark:text-red-400 border-destructive/30';
      case 'promo':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30';
      case 'feature':
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-40 border-b border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background px-4 py-2"
      >
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex flex-1 items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${getBadgeStyle(
                activeAnnouncement.type
              )}`}
            >
              <PiMegaphoneBold className="size-3.5" />
              <span>{activeAnnouncement.badgeText || 'Update'}</span>
            </span>
            <div className="min-w-0">
              <span className="font-semibold text-foreground mr-1.5">{activeAnnouncement.title}:</span>
              <span className="text-muted-foreground">{activeAnnouncement.content}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {activeAnnouncement.actionUrl && (
              <Link
                href={activeAnnouncement.actionUrl}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                {activeAnnouncement.actionText || 'Explore'}
              </Link>
            )}
            <button
              type="button"
              onClick={() => handleDismiss(activeAnnouncement.id)}
              className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Dismiss announcement"
              aria-label="Dismiss announcement"
            >
              <PiXBold className="size-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
