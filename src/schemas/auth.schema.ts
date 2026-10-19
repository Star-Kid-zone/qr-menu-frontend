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
export const registerSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Store URL slug is required')
    .max(191, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and single hyphens (e.g. bistro-hub)'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must contain at least one letter and one number'),
  blueprintId: z.string().optional(),
});

export type RegisterSchemaValues = z.infer<typeof registerSchema>;

export const registerDefaultValues: RegisterSchemaValues = {
  businessName: '',
  slug: '',
  phone: '',
  password: '',
  blueprintId: '',
};

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export type ForgotPasswordSchemaValues = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordDefaultValues: ForgotPasswordSchemaValues = {
  phone: '',
};
