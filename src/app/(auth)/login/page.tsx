"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Notice } from "@/components/ui/Notice";
import { authService } from "@/services/auth.service";
import { setStoredUserRole, setStoredPermissions } from "@/utils/storage";
import { loginSchema, toLoginPayload, type LoginSchemaValues } from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/errors";
import { getLandingRoute } from "@/config/landing";
import { HTTP_STATUS } from "@/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSessionExpired = searchParams?.get("reason") === "session_expired";
  const passwordChanged = searchParams?.get("reason") === "password_reset";
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  });

  // One form for owners and team members: the API works out which account
  // the email belongs to.
  const onSubmit = async (data: LoginSchemaValues) => {
    setFormError(null);
    try {
      const res = await authService.login(toLoginPayload(data));
      const user = res?.data?.user;
      const permissions = user?.permissions ?? null;
      setStoredPermissions(permissions);
      if (user?.role) setStoredUserRole(user.role);
      router.push(getLandingRoute(user?.role, permissions));
    } catch (err) {
      // Signed up but never confirmed the emailed code: continue on the code step.
      const body = (err as { response?: { status?: number; data?: { code?: string; email?: string | null } } })?.response;
      if (body?.status === HTTP_STATUS.FORBIDDEN && body.data?.code === "ACCOUNT_INACTIVE" && body.data.email) {
        router.push(`/register?verify=${encodeURIComponent(body.data.email)}`);
        return;
      }
      setFormError(getApiErrorMessage(err, "We couldn't sign you in. Check your email and password."));
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          QR
        </div>
        <h1 className="text-h1 text-foreground">Sign in</h1>
      </div>

      {isSessionExpired && (
        <Notice tone="warning" className="mb-6">
          You were signed out. Sign in again to continue.
        </Notice>
      )}
      {passwordChanged && (
        <Notice tone="success" className="mb-6">
          Password changed. Sign in with your new password.
        </Notice>
      )}
      {formError && (
        <Notice tone="error" className="mb-6">
          {formError}
        </Notice>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField label="Email" htmlFor="identifier" error={errors.identifier?.message}>
          <Input
            id="identifier"
            type="text"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            invalid={!!errors.identifier}
            aria-invalid={!!errors.identifier}
            {...register("identifier")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pr-16"
              invalid={!!errors.password}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 rounded-r-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between">
          <Checkbox id="remember" label="Keep me signed in" {...register("remember")} />
          <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Team members sign in with the email and password the owner set up for them.
      </p>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to QRMenu?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Start a 14-day free trial
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
