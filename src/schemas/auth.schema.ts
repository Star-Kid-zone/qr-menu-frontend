import * as z from 'zod';

const emailField = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .max(254, 'That email is too long')
  .pipe(z.email('Enter a valid email address'));

const passwordRule = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Use 72 characters or fewer')
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Include at least one letter and one number');

// Login Schema.
// `identifier` is the account email (the only sign-in identifier).
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'Enter your email address')
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginSchemaValues = {
  identifier: '',
  password: '',
  remember: false,
};

/** Maps the email input onto the API payload. */
export function toLoginPayload(values: LoginSchemaValues): { email: string; password: string } {
  return { email: values.identifier.trim().toLowerCase(), password: values.password };
}

// Register Schema
export const registerSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Store URL slug is required')
    .max(191, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and single hyphens (e.g. bistro-hub)'),
  email: emailField,
  password: passwordRule,
  blueprintId: z.string().optional(),
});

export type RegisterSchemaValues = z.infer<typeof registerSchema>;

export const registerDefaultValues: RegisterSchemaValues = {
  businessName: '',
  slug: '',
  email: '',
  password: '',
  blueprintId: '',
};

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordSchemaValues = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordDefaultValues: ForgotPasswordSchemaValues = {
  email: '',
};

// Reset Password Schema (step 2 of forgot password)
export const resetPasswordSchema = z
  .object({
    otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "The passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordSchemaValues = z.infer<typeof resetPasswordSchema>;

