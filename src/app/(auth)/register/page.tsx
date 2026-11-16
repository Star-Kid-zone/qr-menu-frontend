"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth.service";
import { registerSchema, type RegisterSchemaValues } from "@/schemas/auth.schema";
import { setStoredUserRole, setStoredPermissions } from "@/utils/storage";
import { getApiErrorMessage } from "@/utils/errors";
import { fadeInUp } from "@/lib/motion";
import { getLandingRoute } from "@/config/landing";

const RESEND_SECONDS = 60;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Arriving from sign-in with ?verify=<email> means the account exists but its email is unconfirmed.
  const verifyParam = searchParams?.get("verify") ?? "";
  const [step, setStep] = useState<"register" | "otp">(verifyParam ? "otp" : "register");
  const [email, setEmail] = useState(verifyParam);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Coming back from sign-in: send a fresh code right away (the API rate-limits repeats).
  useEffect(() => {
    if (!verifyParam) return;
    authService.resendOtp(verifyParam).then(() => setResendIn(RESEND_SECONDS)).catch(() => undefined);
  }, [verifyParam]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterSchemaValues) => {
    try {
      await authService.register({
        businessName: data.businessName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
      setEmail(data.email.trim().toLowerCase());
      setResendIn(RESEND_SECONDS);
      setStep("otp");
    } catch (err) {
      // Registered earlier but never confirmed: the API already sent a new code, so continue there.
      const body = (err as { response?: { status?: number; data?: { code?: string } } })?.response;
      if (body?.status === 409 && body.data?.code === "ACCOUNT_NOT_VERIFIED") {
        setEmail(data.email.trim().toLowerCase());
        setResendIn(RESEND_SECONDS);
        setStep("otp");
        toast.info("This email is waiting to be verified. We sent you a new code.");
        return;
      }
      toast.error(getApiErrorMessage(err, "Registration failed."));
    }
  };

  const onResend = async () => {
    try {
      await authService.resendOtp(email);
      setResendIn(RESEND_SECONDS);
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "We couldn't send a new code. Try again in a moment."));
    }
  };

  const onVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      const res = await authService.verifyOtp({ email, otp });
      const user = res?.data?.user;

      if (user) {
        setStoredPermissions(null);
        if (user.role) {
          setStoredUserRole(user.role);
        }
      }


      router.push(getLandingRoute(user?.role, null));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "That code didn't work. Check it and try again."));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "otp" ? (
        <motion.div
          key="otp"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-xs">
              QR
            </div>
            <h1 className="text-h1 text-foreground">Verify your email</h1>
          </div>

          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Enter the 6-digit code we emailed to <strong className="text-foreground">{email}</strong> to finish creating your account.
          </p>

          <div className="space-y-4">
            <FormField label="6-digit code" htmlFor="otp">
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="font-mono text-center text-lg tracking-[0.3em]"
              />
            </FormField>

            <Button
              type="button"
              fullWidth
              loading={isVerifying}
              onClick={onVerifyOtp}
              disabled={otp.length !== 6}
            >
              {isVerifying ? "Verifying…" : "Verify email"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={onResend}
                disabled={resendIn > 0}
                className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
              >
                {resendIn > 0 ? `Send a new code in ${resendIn}s` : "Send a new code"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("register"); setOtp(""); }}
                className="font-medium text-muted-foreground hover:text-foreground"
              >
                Wrong email?
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already verified?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary transition-colors duration-150 ease-out hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="register"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-xs">
              QR
            </div>
            <div>
              <h1 className="text-h1 text-foreground">Register your restaurant</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Start your digital menu & ordering in seconds</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Business Name */}
            <FormField
              label="Business / Restaurant Name"
              htmlFor="businessName"
              error={errors.businessName?.message}
              hint="We'll use it to build your public menu link"
            >
              <Input
                id="businessName"
                type="text"
                placeholder="e.g. Cedar & Spice Bistro"
                invalid={!!errors.businessName}
                {...register("businessName")}
              />
            </FormField>

            {/* Email */}
            <FormField
              label="Email"
              htmlFor="email"
              error={errors.email?.message}
              hint="You'll sign in with this. We'll email a code to confirm it."
            >
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@restaurant.com"
                invalid={!!errors.email}
                {...register("email")}
              />
            </FormField>

            {/* Password */}
            <FormField
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
              hint="At least 8 characters with a letter and a number"
            >
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                invalid={!!errors.password}
                {...register("password")}
              />
            </FormField>

            <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
              {isSubmitting ? "Creating store…" : "Register Store"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary transition-colors duration-150 ease-out hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
