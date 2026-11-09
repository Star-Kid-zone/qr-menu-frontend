'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PiShieldWarningBold, PiSignOutBold } from 'react-icons/pi';
import {
  getRawStorageItem,
  storageKeys,
  clearImpersonationSession,
  setStoredUserRole,
  type ImpersonationSession,
} from '@/utils/storage';
import { authService } from '@/services/auth.service';
import { routes } from '@/config/routes';
import { toast } from '@/components/ui';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}
// Raw string = stable snapshot; the server never has a session.
const getSnapshot = () => getRawStorageItem(storageKeys.impersonation);
const getServerSnapshot = () => null;

function parseSession(raw: string | null): ImpersonationSession | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as ImpersonationSession;
    return value?.isImpersonating ? value : null;
  } catch {
    return null;
  }
}

export function ImpersonationBanner() {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const session = useMemo(() => parseSession(raw), [raw]);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleExit = async () => {
    try {
      setLoading(true);
      await authService.exitImpersonation();
      const targetId = session.targetUserId;
      clearImpersonationSession();
      setStoredUserRole('superadmin');
      toast.success('Superadmin session restored.');
      router.replace(routes.superadmin.userDetail(targetId));
    } catch {
      // Fallback: clear and route back to superadmin
      clearImpersonationSession();
      setStoredUserRole('superadmin');
      router.replace(routes.superadmin.users);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-50 shrink-0 border-b border-warning/40 bg-warning/15 px-4 py-2"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <PiShieldWarningBold className="size-4 shrink-0 text-warning-foreground dark:text-warning" aria-hidden />
            <p className="text-body text-foreground">
              Support mode. You are signed in as <strong className="font-semibold">{session.targetUserName}</strong>{' '}
              <span className="text-muted-foreground">(account {session.targetUserId})</span>. Changes you make are real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleExit}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-warning/50 bg-card px-3 text-body-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:opacity-50"
            >
              <PiSignOutBold className="size-3.5" />
              <span>{loading ? 'Returning…' : 'Back to platform admin'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
