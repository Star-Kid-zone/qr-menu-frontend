"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiArrowLeft } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { FormField } from "@/components/ui/FormField";
import { Notice } from "@/components/ui/Notice";
import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth.service";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordSchemaValues,
  type ResetPasswordSchemaValues,
} from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/errors";
import { FORGOT_PASSWORD_DEFAULT_VALUES, OTP_RESEND_SECONDS } from "@/constants/auth.constants";
import { maskEmail } from "../lib/authFormat";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const emailForm = useForm<ForgotPasswordSchemaValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: FORGOT_PASSWORD_DEFAULT_VALUES,
  });

  const resetForm = useForm<ResetPasswordSchemaValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const sendCode = async (target: string, again = false) => {
    setFormError(null);
    setResent(false);
    if (again) setIsResending(true);
    try {
      await authService.forgotPassword(target);
      setEmail(target);
      setResendIn(OTP_RESEND_SECONDS);
      setResent(again);
      toast.success(again ? "New code sent" : "Reset code sent");
    } catch (err) {
      const message = getApiErrorMessage(err, "We couldn't send a code. Try again in a moment.");
      setFormError(message);
      toast.error(message);
    } finally {
      if (again) setIsResending(false);
    }
  };

  const resetPassword = async (values: ResetPasswordSchemaValues) => {
    if (!email) return;
    setFormError(null);
    try {
      await authService.resetPassword({ email, otp: values.otp, newPassword: values.newPassword });
      setIsRedirecting(true);
      toast.success("Password changed");
      router.push("/login?reason=password_reset");
    } catch (err) {
      const message = getApiErrorMessage(err, "That code didn't work. Check it, or send a new one.");
      setFormError(message);
      toast.error(message);
    }
  };

  const errs = resetForm.formState.errors;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">{email ? "Set a new password" : "Reset your password"}</h1>
        <p className="mt-2 text-body text-muted-foreground">
          {email
            ? `If ${maskEmail(email)} has an account, we've emailed it a 6-digit code. Enter it below.`
            : "Enter the email you sign in with and we'll send you a 6-digit code."}
        </p>
      </div>

      <div className="mb-6 space-y-3 empty:hidden">
        {formError && <Notice tone="error">{formError}</Notice>}
        {resent && <Notice tone="success">A new code is on its way.</Notice>}
      </div>

      {!email ? (
        <form onSubmit={emailForm.handleSubmit((v) => sendCode(v.email.trim().toLowerCase()))} noValidate className="space-y-4">
          <FormField label="Email" htmlFor="email" error={emailForm.formState.errors.email?.message}>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              invalid={!!emailForm.formState.errors.email}
              {...emailForm.register("email")}
            />
          </FormField>

          <Button type="submit" fullWidth loading={emailForm.formState.isSubmitting}>
            {emailForm.formState.isSubmitting ? "Sending code…" : "Send code"}
          </Button>

          <p className="text-sm text-muted-foreground">Team members: ask the restaurant owner to reset your password from Team members.</p>
        </form>
      ) : (
        <form onSubmit={resetForm.handleSubmit(resetPassword)} noValidate className="space-y-4">
          <FormField label="6-digit code" htmlFor="otp" error={errs.otp?.message}>
            <Controller
              control={resetForm.control}
              name="otp"
              render={({ field }) => (
                <OtpInput
                  id="otp"
                  label="6-digit code"
                  value={field.value}
                  onChange={field.onChange}
                  // Move on to the new password once the code is in.
                  onComplete={() => resetForm.setFocus("newPassword")}
                  invalid={!!errs.otp}
                  autoFocus
                />
              )}
            />
          </FormField>

          <FormField label="New password" htmlFor="newPassword" hint="At least 8 characters, with a letter and a number." error={errs.newPassword?.message}>
            <PasswordInput id="newPassword" autoComplete="new-password" invalid={!!errs.newPassword} {...resetForm.register("newPassword")} />
          </FormField>

          <FormField label="Confirm new password" htmlFor="confirmPassword" error={errs.confirmPassword?.message}>
            <PasswordInput id="confirmPassword" autoComplete="new-password" invalid={!!errs.confirmPassword} {...resetForm.register("confirmPassword")} />
          </FormField>

          <Button type="submit" fullWidth loading={resetForm.formState.isSubmitting || isRedirecting}>
            {isRedirecting ? "Redirecting…" : resetForm.formState.isSubmitting ? "Saving…" : "Reset password"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => sendCode(email, true)}
              disabled={resendIn > 0 || isResending}
              className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {isResending ? "Sending…" : resendIn > 0 ? `Send a new code in ${resendIn}s` : "Send a new code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail(null);
                setFormError(null);
                setResent(false);
                resetForm.reset();
              }}
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Use a different email
            </button>
          </div>
        </form>
      )}

      <Link href="/login" className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <PiArrowLeft size={16} aria-hidden="true" />
        Back to sign in
      </Link>
    </>
  );
}
