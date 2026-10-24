'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PiShieldWarningBold, PiSignOutBold, PiArrowLeftBold } from 'react-icons/pi';
import {
  getImpersonationSession,
  clearImpersonationSession,
  setStoredUserRole,
  type ImpersonationSession,
} from '@/utils/storage.utils';
import { authService } from '@/services/auth.service';
import { routes } from '@/config/routes';
import { toast } from '@/components/ui';

export function ImpersonationBanner() {
  const router = useRouter();
  const [session, setSession] = useState<ImpersonationSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if an impersonation session is active
    const cur = getImpersonationSession();
    if (cur?.isImpersonating) {
      setSession(cur);
    }
  }, []);

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
        className="relative z-50 shrink-0 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 px-4 py-2.5 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-foreground">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 font-semibold text-amber-700 dark:text-amber-400">
              <PiShieldWarningBold className="size-4 animate-pulse text-amber-600 dark:text-amber-400" />
              SUPPORT MODE
            </span>
            <span className="hidden text-muted-foreground sm:inline">|</span>
            <p className="font-medium text-foreground">
              Acting as tenant:{' '}
              <strong className="text-amber-800 dark:text-amber-300 font-semibold">
                {session.targetUserName}
              </strong>{' '}
              <span className="text-muted-foreground font-mono">(User #{session.targetUserId})</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleExit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 font-medium text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
            >
              <PiSignOutBold className="size-3.5" />
              <span>{loading ? 'Restoring...' : 'Exit to Superadmin'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
