import { routes } from '@/config/routes';
import { clearStoredUserRole, clearStoredPermissions } from '@/utils/storage';
import { authService } from '@/services/auth.service';
import { sessionChanged } from '@/services/workspaceEvents';

/**
 * Ends the client session and replaces the current history entry so the
 * previous authenticated screen is not reachable via the back button. Calls
 * the backend to clear the httpOnly auth cookies — the frontend has no way
 * to clear those itself — but still redirects even if that call fails, since
 * the local session markers are cleared either way.
 */
export function logoutSession(): void {
  clearStoredUserRole();
  clearStoredPermissions();
  sessionChanged();
  const target = `${window.location.origin}${routes.public.login}?reason=logged_out`;
  authService
    .logout()
    .catch(() => {})
    .finally(() => window.location.replace(target));
}
