"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Notice } from "@/components/ui/Notice";
import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth.service";
import { setStoredUserRole, setStoredPermissions } from "@/utils/storage";
import { loginSchema, toLoginPayload, type LoginSchemaValues } from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/errors";
import { getLandingRoute } from "@/config/landing";
import { HTTP_STATUS } from "@/constants";
import { APP_NAME } from "@/constants/app.constants";
import { LOGIN_DEFAULT_VALUES } from "@/constants/auth.constants";

const REASON_NOTICES: Record<string, { tone: "warning" | "info" | "success"; text: string }> = {
  session_expired: { tone: "warning", text: "You were signed out. Sign in again to continue." },
  logged_out: { tone: "info", text: "You signed out." },
  password_reset: { tone: "success", text: "Password changed. Sign in with your new password." },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason");
  const [formError, setFormError] = useState<string | null>(null);
  const [dismissedReason, setDismissedReason] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaValues>({ resolver: zodResolver(loginSchema), defaultValues: LOGIN_DEFAULT_VALUES });

  const isBusy = isSubmitting || isRedirecting;

  // One form for owners and team members: the API works out which account the email belongs to.
  const onSubmit = async (data: LoginSchemaValues) => {
    setDismissedReason(true);
    setFormError(null);
    try {
      const res = await authService.login(toLoginPayload(data));
      const user = res?.data?.user;
      const permissions = user?.permissions ?? null;
      setStoredPermissions(permissions);
      if (user?.role) setStoredUserRole(user.role);
      setIsRedirecting(true);
      toast.success("Signed in");
      router.push(getLandingRoute(user?.role, permissions));
    } catch (err) {
      // Signed up but never confirmed the emailed code: continue on the code step.
      const body = (err as { response?: { status?: number; data?: { code?: string; details?: { email?: string | null } } } })?.response;
      const unverifiedEmail = body?.data?.details?.email;
      if (body?.status === HTTP_STATUS.FORBIDDEN && body.data?.code === "ACCOUNT_INACTIVE" && unverifiedEmail) {
        setIsRedirecting(true);
        toast.info("Confirm your email to continue.");
        router.push(`/register?verify=${encodeURIComponent(unverifiedEmail)}`);
        return;
      }
      const message = getApiErrorMessage(err, "We couldn't sign you in. Check your email and password.");
      setFormError(message);
      toast.error(message);
    }
  };

  const activeNotice = formError
    ? { tone: "error" as const, text: formError }
    : !dismissedReason && reason
      ? REASON_NOTICES[reason] ?? null
      : null;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Sign in</h1>
        <p className="mt-2 text-body text-muted-foreground">Welcome back to {APP_NAME}.</p>
      </div>

      <div className="mb-6 empty:hidden">
        {activeNotice && <Notice tone={activeNotice.tone}>{activeNotice.text}</Notice>}
      </div>

      {/* "Continue with Google" goes here, followed by an "or" divider, once Google sign-in exists. */}

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isBusy} className="space-y-4">
        <FormField label="Email" htmlFor="identifier" error={errors.identifier?.message}>
          <Input
            id="identifier"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            invalid={!!errors.identifier}
            {...register("identifier")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} />
        </FormField>

        <div className="flex items-center justify-between gap-3">
          <Checkbox id="remember" label="Keep me signed in" {...register("remember")} />
          <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isBusy}>
          {isRedirecting ? "Redirecting…" : isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">Team members sign in with the email and password the owner set up for them.</p>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to {APP_NAME}?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Start your 14-day free trial
        </Link>
      </p>
    </>
  );
}
