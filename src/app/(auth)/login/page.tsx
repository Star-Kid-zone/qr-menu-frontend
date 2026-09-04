"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiInfoBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth.service";
import { setStoredUserRole, setStoredPermissions } from "@/utils/storage";
import { loginSchema, type LoginSchemaValues } from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/errors";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSessionExpired = searchParams?.get("reason") === "session_expired";
  const [isStaff, setIsStaff] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginSchemaValues) => {
    try {
      const res = isStaff ? await authService.staffLogin(data) : await authService.login(data);
      const user = res?.data?.user;

      toast.success("Signed in successfully! Redirecting...");

      if (user) {
        setStoredPermissions(user.permissions ?? null);
        if (user.role) {
          setStoredUserRole(user.role);
          router.push(user.role === "superadmin" ? "/superadmin" : "/admin/home");
        } else {
          router.push("/admin/home");
        }
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Login failed. Please check your credentials."));
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-xs">
          QR
        </div>
        <h1 className="text-h1 text-foreground">Sign in to your account</h1>
      </div>

      {isSessionExpired && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-700 dark:text-amber-400">
          <PiInfoBold className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Your session has expired. Please sign in again to continue.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField label="Phone number" htmlFor="phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            invalid={!!errors.phone}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={!!errors.password}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <Checkbox id="remember" label="Remember me" {...register("remember")} />
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary transition-colors duration-150 ease-out hover:text-primary/80"
          >
            Forgot password?
          </Link>
        </div>

        <Checkbox
          id="isStaff"
          label="I’m signing in as a staff member"
          checked={isStaff}
          onChange={(e) => setIsStaff(e.target.checked)}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Not a member?{" "}
        <Link href="/register" className="font-semibold text-primary transition-colors duration-150 ease-out hover:text-primary/80">
          Start a 14-day free trial
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading login…</div>}>
      <LoginForm />
    </Suspense>
  );
}
