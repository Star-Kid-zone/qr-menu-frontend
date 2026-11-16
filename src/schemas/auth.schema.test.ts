import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  toLoginPayload,
} from './auth.schema';

describe('login identifier', () => {
  it('maps an email to the email field, lowercased', () => {
    expect(toLoginPayload({ identifier: ' Jane@Example.COM ', password: 'x' })).toEqual({ email: 'jane@example.com', password: 'x' });
  });

  it('rejects anything that is not an email, including phone numbers', () => {
    expect(loginSchema.safeParse({ identifier: 'jane', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ identifier: 'jane@example.com', password: 'x' }).success).toBe(true);
    expect(loginSchema.safeParse({ identifier: '9876543210', password: 'x' }).success).toBe(false);
  });
});

describe('register / forgot / reset use email and the 8-character rule', () => {
  const base = { businessName: 'Cafe', password: 'Tulip-Garden9' };

  it('requires a valid email to register', () => {
    expect(registerSchema.safeParse({ ...base, email: 'jane@example.com' }).success).toBe(true);
    expect(registerSchema.safeParse({ ...base, email: 'jane@' }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base }).success).toBe(false);
  });

  it('rejects short passwords', () => {
    expect(registerSchema.safeParse({ ...base, email: 'jane@example.com', password: 'abc123' }).success).toBe(false);
  });

  it('forgot-password takes an email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'jane@example.com' }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: '9876543210' }).success).toBe(false);
  });

  it('reset needs a six-digit code and matching passwords', () => {
    const ok = { otp: '123456', newPassword: 'Tulip-Garden9', confirmPassword: 'Tulip-Garden9' };
    expect(resetPasswordSchema.safeParse(ok).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ ...ok, otp: '12345' }).success).toBe(false);
    expect(resetPasswordSchema.safeParse({ ...ok, confirmPassword: 'different1' }).success).toBe(false);
  });
});
