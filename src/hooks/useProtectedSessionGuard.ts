import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { isAuthenticated } from '@/utils/storage.utils';

/**
 * Keeps admin/superadmin shell aligned with the session: if the CSRF marker
 * cookie is missing (logout, expired refresh, or bfcache restore), send the
 * user to login instead of showing a stale screen from the back stack. The
 * actual access token lives in an httpOnly cookie the client can't read, so
 * this marker is the best available client-side "am I logged in" signal.
 */
export function useProtectedSessionGuard(): void {
  const router = useRouter();

  useEffect(() => {
    const redirectIfLoggedOut = () => {
      if (!isAuthenticated()) {
        router.replace(routes.public.login);
      }
    };

    redirectIfLoggedOut();

    const onPopState = () => redirectIfLoggedOut();
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        redirectIfLoggedOut();
      }
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('pageshow', onPageShow as EventListener);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pageshow', onPageShow as EventListener);
    };
  }, [router]);
}
