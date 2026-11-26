"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { PiCheckBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { FormField } from "@/components/ui/FormField";
import { Notice } from "@/components/ui/Notice";
import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth.service";
import { registerSchema, type RegisterSchemaValues } from "@/schemas/auth.schema";
import { setStoredUserRole, setStoredPermissions } from "@/utils/storage";
import { getApiErrorMessage } from "@/utils/errors";
import { fadeInUp } from "@/lib/motion";
import { getLandingRoute } from "@/config/landing";
import { routes } from "@/config/routes";
import { getTenantPublicUrl, TENANT_ROOT_DOMAIN } from "@/config/app.constants";
import { HTTP_STATUS, OTP_RESEND_SECONDS } from "@/constants";
import { REGISTER_DEFAULT_VALUES } from "@/constants/auth.constants";
import type { RegisterResult } from "@/types";
import { useAuthPreview } from "../context/AuthPreviewContext";
import { maskEmail, slugPreview } from "../lib/authFormat";

type Step = "register" | "otp" | "done";

/** Reads the address and starter menu from POST /auth/register (enveloped or not). */
function readRegisterResult(data: unknown): RegisterResult {
  const d = (data ?? {}) as { slug?: unknown; businessName?: unknown; templateSeeded?: { itemsCount?: unknown } | null };
  return {
    slug: typeof d.slug === "string" ? d.slug : null,
    businessName: typeof d.businessName === "string" ? d.businessName : null,
    starterDishes: typeof d.templateSeeded?.itemsCount === "number" ? d.templateSeeded.itemsCount : null,
  };
}

function errorCode(err: unknown): { status?: number; code?: string } {
  const r = (err as { response?: { status?: number; data?: { code?: string } } })?.response;
  return { status: r?.status, code: r?.data?.code };
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setBusinessName } = useAuthPreview();
  // Arriving from sign-in with ?verify=<email> means the account exists but its email is unconfirmed.
  const verifyParam = searchParams?.get("verify") ?? "";
  const [step, setStep] = useState<Step>(verifyParam ? "otp" : "register");
  const [email, setEmail] = useState(verifyParam);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [notice, setNotice] = useState<{ tone: "error" | "info" | "success"; text: string; action?: ReactNode } | null>(null);
  const [result, setResult] = useState<RegisterResult>({ slug: null, businessName: null, starterDishes: null });
  const [landing, setLanding] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaValues>({ resolver: zodResolver(registerSchema), defaultValues: REGISTER_DEFAULT_VALUES });

  const typedName = useWatch({ control, name: "businessName" }) ?? "";
  const preview = slugPreview(typedName);

  // Show the name on the website card in the scene beside the form.
  useEffect(() => {
    setBusinessName(typedName);
  }, [typedName, setBusinessName]);
  useEffect(() => () => setBusinessName(""), [setBusinessName]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Coming back from sign-in: send a fresh code right away (the API rate-limits repeats).
  useEffect(() => {
    if (!verifyParam) return;
    let active = true;
    authService
      .resendOtp(verifyParam)
      .then(() => {
        if (!active) return;
        setResendIn(OTP_RESEND_SECONDS);
        setNotice({ tone: "info", text: "Your email isn't confirmed yet. We sent you a new code." });
      })
      .catch((err) => {
        if (!active) return;
        const message = getApiErrorMessage(err, "We couldn't send a verification code. Try again in a moment.");
        setNotice({ tone: "error", text: message });
        toast.error(message);
      });
    return () => {
      active = false;
    };
  }, [verifyParam]);

  const toOtp = (address: string) => {
    setEmail(address);
    setOtp("");
    setResendIn(OTP_RESEND_SECONDS);
    setStep("otp");
  };

  const onSubmit = async (data: RegisterSchemaValues) => {
    setNotice(null);
    const address = data.email.trim().toLowerCase();
    try {
      const res = await authService.register({ businessName: data.businessName.trim(), email: address, password: data.password });
      setResult(readRegisterResult(res?.data));
      toOtp(address);
      toast.success("Verification code sent to your email");
    } catch (err) {
      const { status, code } = errorCode(err);
      // Registered earlier but never confirmed: the API already sent a new code, so continue there.
      if (status === HTTP_STATUS.CONFLICT && code === "ACCOUNT_NOT_VERIFIED") {
        toOtp(address);
        const infoText = "This email is waiting to be confirmed. We sent you a new code.";
        setNotice({ tone: "info", text: infoText });
        toast.info(infoText);
        return;
      }
      if (code === "EMAIL_ALREADY_REGISTERED") {
        setNotice({
          tone: "error",
          text: "An account already uses this email.",
          action: (
            <Link href="/login" className="font-semibold underline">
              Sign in instead
            </Link>
          ),
        });
        toast.error("An account already uses this email.");
        return;
      }
      const message = getApiErrorMessage(err, "We couldn't create your account. Try again in a moment.");
      setNotice({ tone: "error", text: message });
      toast.error(message);
    }
  };

  const onResend = async () => {
    if (isResending) return;
    setNotice(null);
    setIsResending(true);
    try {
      await authService.resendOtp(email);
      setResendIn(OTP_RESEND_SECONDS);
      setNotice({ tone: "success", text: "A new code is on its way." });
      toast.success("A new code is on its way.");
    } catch (err) {
      const message = getApiErrorMessage(err, "We couldn't send a new code. Try again in a moment.");
      setNotice({ tone: "error", text: message });
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const onVerify = async (code: string = otp) => {
    if (code.length !== 6 || isVerifying) return;
    setNotice(null);
    setIsVerifying(true);
    try {
      const res = await authService.verifyOtp({ email, otp: code });
      const user = res?.data?.user;
      setStoredPermissions(null);
      if (user?.role) setStoredUserRole(user.role);
      setLanding(getLandingRoute(user?.role, null));
      setStep("done");
      toast.success("Email confirmed");
    } catch (err) {
      const message = getApiErrorMessage(err, "That code didn't work. Check it and try again.");
      setNotice({ tone: "error", text: message });
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const noticeBox = notice ? (
    <Notice tone={notice.tone} action={notice.action} className="mb-6">
      {notice.text}
    </Notice>
  ) : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "done" ? (
        <motion.div key="done" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <span className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
            <PiCheckBold className="size-6" aria-hidden />
          </span>
          <h1 className="mt-6 text-h1 text-foreground">You’re all set</h1>
          <p className="mt-2 text-body text-muted-foreground">
            {result.businessName ? `${result.businessName} is on FeastOwl.` : "Your account is ready."}
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {result.slug ? (
              <li className="rounded-lg border border-border bg-card p-3">
                <span className="block text-caption text-muted-foreground">Your website</span>
                <a
                  href={getTenantPublicUrl(result.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-semibold text-primary hover:underline"
                >
                  {result.slug}.{TENANT_ROOT_DOMAIN}
                </a>
                <span className="mt-1 block text-caption text-muted-foreground">You can change this address later in QR menu.</span>
              </li>
            ) : null}
            {result.starterDishes ? (
              <li className="rounded-lg border border-border bg-card p-3">
                We added a starter menu with {result.starterDishes} dishes. Edit or replace them any time.
              </li>
            ) : null}
          </ul>
          <Button
            type="button"
            fullWidth
            className="mt-6"
            loading={isRedirecting}
            onClick={() => {
              setIsRedirecting(true);
              router.push(landing ?? "/admin/home");
            }}
          >
            {isRedirecting ? "Opening dashboard…" : "Go to your dashboard"}
          </Button>
        </motion.div>
      ) : step === "otp" ? (
        <motion.div key="otp" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <div className="mb-8">
            <h1 className="text-h1 text-foreground">Check your email</h1>
            <p className="mt-2 text-body text-muted-foreground">
              Enter the 6-digit code we sent to <strong className="text-foreground">{maskEmail(email)}</strong>.
            </p>
          </div>

          {noticeBox}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onVerify();
            }}
            noValidate
            className="space-y-4"
          >
            <FormField label="6-digit code" htmlFor="otp">
              <OtpInput id="otp" label="6-digit code" value={otp} onChange={setOtp} onComplete={(c) => void onVerify(c)} disabled={isVerifying} autoFocus />
            </FormField>

            <Button type="submit" fullWidth loading={isVerifying} disabled={otp.length !== 6}>
              {isVerifying ? "Checking…" : "Confirm email"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={onResend}
                disabled={resendIn > 0 || isResending}
                className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
              >
                {isResending ? "Sending…" : resendIn > 0 ? `Send a new code in ${resendIn}s` : "Send a new code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("register");
                  setOtp("");
                  setNotice(null);
                }}
                className="font-medium text-muted-foreground hover:text-foreground"
              >
                Wrong email?
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already confirmed?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.div key="register" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
          <div className="mb-8">
            <h1 className="text-h1 text-foreground">Create your account</h1>
            <p className="mt-2 text-body text-muted-foreground">Start your 14-day free trial.</p>
          </div>

          {noticeBox}

          {/* "Continue with Google" goes here, followed by an "or" divider, once Google sign-in exists. */}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              label="Restaurant name"
              htmlFor="businessName"
              error={errors.businessName?.message}
              hint={
                <>
                  Your website:{" "}
                  <span className="font-medium text-foreground">
                    {preview.base}
                    <span className="text-muted-foreground">-{preview.suffix}</span>.{TENANT_ROOT_DOMAIN}
                  </span>
                  . We add 6 characters to keep it unique; you can change it later.
                </>
              }
            >
              <Input
                id="businessName"
                type="text"
                autoComplete="organization"
                placeholder="e.g. Annapoorna Kitchen"
                invalid={!!errors.businessName}
                {...register("businessName")}
              />
            </FormField>

            <FormField label="Email" htmlFor="email" error={errors.email?.message} hint="You’ll sign in with this. We’ll email a code to confirm it.">
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@restaurant.com"
                invalid={!!errors.email}
                {...register("email")}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters, with a letter and a number.">
              <PasswordInput id="password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
            </FormField>

            <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
              {isSubmitting ? "Creating your account…" : "Create account"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By creating an account you agree to our{" "}
              <Link href={routes.public.terms} target="_blank" className="font-medium text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href={routes.public.privacy} target="_blank" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
