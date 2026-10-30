import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { isAuthenticated, getCurrentRole, clearStorage } from '@/utils/storage';

export interface ProtectedGuardOptions {
  requiredRole?: 'superadmin' | 'admin';
}

/**
 * Keeps admin/superadmin shell aligned with the session: if the CSRF marker
 * cookie is missing (logout, expired refresh, or bfcache restore), send the
 * user to login instead of showing a stale screen from the back stack.
 * Also verifies role matches requirements (e.g. non-superadmins redirected away from /superadmin).
 */
export function useProtectedSessionGuard(options?: ProtectedGuardOptions): void {
  const router = useRouter();

  useEffect(() => {
    const validateSession = () => {
      if (!isAuthenticated()) {
        clearStorage();
        router.replace(`${routes.public.login}?reason=session_expired`);
        return;
      }

      if (options?.requiredRole === 'superadmin') {
        const currentRole = getCurrentRole();
        if (currentRole !== 'superadmin') {
          router.replace(routes.admin.home);
          return;
        }
      }
    };

    validateSession();

    const onPopState = () => validateSession();
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        validateSession();
      }
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('pageshow', onPageShow as EventListener);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pageshow', onPageShow as EventListener);
    };
  }, [router, options?.requiredRole]);
}
