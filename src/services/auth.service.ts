import type { LoginFormValues, RegisterFormValues } from '@/types';
import type { MessageResponse, SessionResponse } from '@/types/auth/auth.types';
import api from './api.service';

export const authService = {
  login: (credentials: LoginFormValues) => api.post<SessionResponse>('/auth/login', credentials),
  staffLogin: (credentials: LoginFormValues) => api.post<SessionResponse>('/auth/staff/login', credentials),
  register: (data: RegisterFormValues) => api.post<MessageResponse & Record<string, unknown>>('/auth/register', data),
  verifyOtp: (data: { email: string; otp: string }) => api.post<SessionResponse>('/auth/otp', data),
  resendOtp: (email: string) => api.post<MessageResponse>('/auth/resend-otp', { email }),
  forgotPassword: (email: string) => api.post<MessageResponse>('/auth/forgot-password', { email }),
  resetPassword: (data: Record<string, unknown>) => api.post<MessageResponse>('/auth/reset-password', data),
  changePassword: (data: Record<string, unknown>) => api.post<MessageResponse>('/auth/change-password', data),
  getProfile: () => api.get<SessionResponse>('/auth/profile'),
  logout: () => api.post<MessageResponse>('/auth/logout'),
  exitImpersonation: () =>
    api.post<{ message: string; user: { id: string; name: string; email?: string | null; role: string } }>(
      '/auth/exit-impersonation'
    ),
};
