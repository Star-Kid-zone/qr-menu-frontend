import { LoginFormValues, RegisterFormValues } from '@/types';
import api from './api.service';

export const authService = {
  login: (credentials: LoginFormValues) => api.post('/auth/login', credentials),
  staffLogin: (credentials: LoginFormValues) => api.post('/auth/staff/login', credentials),
  register: (data: RegisterFormValues) => api.post('/auth/register', data),
  verifyOtp: (data: Record<string, unknown>) => api.post('/auth/otp', data),
  forgotPassword: (phone: string) => api.post('/auth/forgot-password', { phone }),
  resetPassword: (data: Record<string, unknown>) => api.post('/auth/reset-password', data),
  changePassword: (data: Record<string, unknown>) => api.post('/auth/change-password', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};
