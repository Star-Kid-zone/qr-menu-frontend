import * as z from 'zod';

// Login Schema
export const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginSchemaValues = {
  phone: '',
  password: '',
  remember: false,
};

// Register Schema
export const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
    agreed: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the Terms and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterSchemaValues = z.infer<typeof registerSchema>;

export const registerDefaultValues: RegisterSchemaValues = {
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreed: false,
};

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export type ForgotPasswordSchemaValues = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordDefaultValues: ForgotPasswordSchemaValues = {
  phone: '',
};
