import type { LoginFormValues, RegisterFormValues } from '@/types';
import api from './api.service';

export const authService = {
  login: (credentials: LoginFormValues) => api.post('/auth/login', credentials),
  staffLogin: (credentials: LoginFormValues) => api.post('/auth/staff/login', credentials),
  register: (data: RegisterFormValues) => api.post('/auth/register', data),
  verifyOtp: (data: { email: string; otp: string }) => api.post('/auth/otp', data),
  resendOtp: (email: string) => api.post('/auth/resend-otp', { email }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: Record<string, unknown>) => api.post('/auth/reset-password', data),
  changePassword: (data: Record<string, unknown>) => api.post('/auth/change-password', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
  exitImpersonation: () =>
    api.post<{ message: string; user: { id: string; name: string; email?: string | null; role: string } }>(
      '/auth/exit-impersonation'
    ),
};
