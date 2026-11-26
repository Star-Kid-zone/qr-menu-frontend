import type { PERMISSION_UNITS } from '@/constants/auth.constants';

export type PermissionUnit = (typeof PERMISSION_UNITS)[number];

export type StaffRole = 'manager' | 'staff';

export type UserRole = 'admin' | 'superadmin' | 'user';

export interface LoginFormValues {
  userId?: string;
  email?: string;
  password?: string;
  remember?: boolean;
}

export interface RegisterFormValues {
  name?: string;
  businessName?: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

export interface ImpersonationSession {
  isImpersonating: boolean;
  originalSuperadminId: string;
  targetUserId: string;
  targetUserName: string;
}

/** Which story the sign-in screens' scene tells. */
export type AuthStageVariant = 'signin' | 'register' | 'reset';

/** A product area shown on the sign-in screens. */
export type AuthFeatureKey = 'menu' | 'website' | 'reviews' | 'social' | 'qr';

/** What the register form shares with the scene beside it (live website preview). */
export interface AuthPreviewState {
  businessName: string;
  setBusinessName: (name: string) => void;
}

/** Real address and starter menu returned by POST /auth/register, shown after the code is confirmed. */
export interface RegisterResult {
  slug: string | null;
  businessName: string | null;
  starterDishes: number | null;
}

/** The signed-in person returned by login, staff login, verify-code and profile. */
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
  /** Staff sessions only: the units the staff role may use (null/undefined = owner, full access). */
  permissions?: PermissionUnit[] | null;
  staffId?: string;
  staffRole?: string;
}

/** Body of login / staff login / verify-code / profile responses. */
export interface SessionResponse {
  message?: string;
  user: SessionUser;
}

/** Body of a plain action response (logout, password change, resend code...). */
export interface MessageResponse {
  message?: string;
}
