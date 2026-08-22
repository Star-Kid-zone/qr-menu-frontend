"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { MdArrowBack } from "react-icons/md";
import { authService } from "@/services/auth.service";
import { forgotPasswordSchema, type ForgotPasswordSchemaValues } from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/errors";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: ForgotPasswordSchemaValues) => {
    try {
      setError(null);
      await authService.forgotPassword(data.phone);
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Something went wrong. Please try again."));
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-xs">
          QR
        </div>
        <h1 className="text-h1 text-foreground">Forgot your password?</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No worries — enter your phone number and we&rsquo;ll send you a reset link.
        </p>
      </div>

      {sent ? (
        <StatusMessage variant="success">
          If an account exists for that phone number, a reset link is on its way.
        </StatusMessage>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {error && <StatusMessage variant="error">{error}</StatusMessage>}

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

          <Button type="submit" fullWidth loading={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      <Link
        href="/login"
        className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
      >
        <MdArrowBack size={16} aria-hidden="true" />
        Back to login
      </Link>
    </>
  );
}
