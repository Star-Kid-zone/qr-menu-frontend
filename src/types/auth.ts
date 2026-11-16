export type UserRole = 'admin' | 'superadmin' | 'user';

export type AppRole = UserRole | 'guest';

export interface User {
  id: number;
  user_id: string;
  name?: string;
  email?: string | null;
  role: UserRole;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  data: {
    token: string;
    user: User;
    active: boolean;
  };
}

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
