"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiArrowLeft } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Notice } from "@/components/ui/Notice";
import { authService } from "@/services/auth.service";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordSchemaValues,
  type ResetPasswordSchemaValues,
} from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/errors";

const RESEND_SECONDS = 60;

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}${"•".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const emailForm = useForm<ForgotPasswordSchemaValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordSchemaValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const sendCode = async (target: string) => {
    setFormError(null);
    try {
      await authService.forgotPassword(target);
      setEmail(target);
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "We couldn't send a code. Try again in a moment."));
    }
  };

  const resetPassword = async (values: ResetPasswordSchemaValues) => {
    if (!email) return;
    setFormError(null);
    try {
      await authService.resetPassword({ email, otp: values.otp, newPassword: values.newPassword });
      router.push("/login?reason=password_reset");
    } catch (err) {
      setFormError(getApiErrorMessage(err, "That code didn't work. Check it, or send a new one."));
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          QR
        </div>
        <h1 className="text-h1 text-foreground">{email ? "Set a new password" : "Reset your password"}</h1>
        <p className="mt-2 text-body text-muted-foreground">
          {email
            ? `If ${maskEmail(email)} has an account, we've emailed it a 6-digit code. Enter it below.`
            : "Enter the email you sign in with and we'll send you a 6-digit code."}
        </p>
      </div>

      {formError && (
        <Notice tone="error" className="mb-6">
          {formError}
        </Notice>
      )}

      {!email ? (
        <form onSubmit={emailForm.handleSubmit((v) => sendCode(v.email))} noValidate className="space-y-4">
          <FormField label="Email" htmlFor="email" error={emailForm.formState.errors.email?.message}>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              invalid={!!emailForm.formState.errors.email}
              aria-invalid={!!emailForm.formState.errors.email}
              {...emailForm.register("email")}
            />
          </FormField>

          <Button type="submit" fullWidth loading={emailForm.formState.isSubmitting}>
            {emailForm.formState.isSubmitting ? "Sending code…" : "Send code"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Team members: ask the restaurant owner to reset your password from Team members.
          </p>
        </form>
      ) : (
        <form onSubmit={resetForm.handleSubmit(resetPassword)} noValidate className="space-y-4">
          <FormField label="6-digit code" htmlFor="otp" error={resetForm.formState.errors.otp?.message}>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="tracking-[0.3em]"
              invalid={!!resetForm.formState.errors.otp}
              aria-invalid={!!resetForm.formState.errors.otp}
              {...resetForm.register("otp")}
            />
          </FormField>

          <FormField
            label="New password"
            htmlFor="newPassword"
            hint="At least 8 characters, with a letter and a number."
            error={resetForm.formState.errors.newPassword?.message}
          >
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              invalid={!!resetForm.formState.errors.newPassword}
              aria-invalid={!!resetForm.formState.errors.newPassword}
              {...resetForm.register("newPassword")}
            />
          </FormField>

          <FormField label="Confirm new password" htmlFor="confirmPassword" error={resetForm.formState.errors.confirmPassword?.message}>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              invalid={!!resetForm.formState.errors.confirmPassword}
              aria-invalid={!!resetForm.formState.errors.confirmPassword}
              {...resetForm.register("confirmPassword")}
            />
          </FormField>

          <Button type="submit" fullWidth loading={resetForm.formState.isSubmitting}>
            {resetForm.formState.isSubmitting ? "Saving…" : "Reset password"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => sendCode(email)}
              disabled={resendIn > 0}
              className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {resendIn > 0 ? `Send a new code in ${resendIn}s` : "Send a new code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail(null);
                setFormError(null);
                resetForm.reset();
              }}
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Use a different email
            </button>
          </div>
        </form>
      )}

      <Link
        href="/login"
        className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <PiArrowLeft size={16} aria-hidden="true" />
        Back to sign in
      </Link>
    </>
  );
}
