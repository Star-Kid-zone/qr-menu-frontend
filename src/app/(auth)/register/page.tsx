"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { PiLinkBold, PiSparkleFill } from "react-icons/pi";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("000000");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessName: "",
      slug: "",
      phone: "",
      password: "",
    },
  });

  const slugValue = watch("slug");

  const onBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("businessName", val, { shouldValidate: true });
    if (!isManualSlug) {
      setValue("slug", toSlug(val), { shouldValidate: true });
    }
  };

  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManualSlug(true);
    setValue("slug", toSlug(e.target.value), { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterSchemaValues) => {
    try {
      await authService.register({
        businessName: data.businessName.trim(),
        slug: data.slug.trim(),
        phone: data.phone.trim(),
        password: data.password,
      });
      setPhone(data.phone.trim());
      setStep("otp");
      toast.success("Account created! Verification code is 000000.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Registration failed."));
    }
  };

  const onVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      const res = await authService.verifyOtp({ phone, otp });
      const user = res?.data?.user;

      if (user) {
        setStoredPermissions(null);
        if (user.role) {
          setStoredUserRole(user.role);
        }
      }

      toast.success("Account verified! Redirecting to your workspace…");
      router.push("/admin/home");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "OTP verification failed."));
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
            <h1 className="text-h1 text-foreground">Verify your store</h1>
          </div>

          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Enter the 6-digit verification code to activate your account and start setting up your digital menu.
          </p>

          <div className="mb-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <PiSparkleFill className="h-4 w-4 text-primary" />
              <span>Verification code is: <strong className="font-mono text-sm tracking-widest text-primary">000000</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setOtp("000000")}
              className="font-bold text-primary hover:underline"
            >
              Fill Code
            </button>
          </div>

          <div className="space-y-5">
            <FormField label="6-Digit OTP Code" htmlFor="otp">
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
              {isVerifying ? "Verifying…" : "Verify & Open Workspace"}
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already verified?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary transition-colors duration-150 ease-out hover:text-primary/80"
            >
              Sign in directly
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
            >
              <Input
                id="businessName"
                type="text"
                placeholder="e.g. Cedar & Spice Bistro"
                invalid={!!errors.businessName}
                {...register("businessName")}
                onChange={onBusinessNameChange}
              />
            </FormField>

            {/* Dynamic Slug */}
            <FormField
              label="Store URL Slug"
              htmlFor="slug"
              error={errors.slug?.message}
              hint="Your public QR menu web link"
            >
              <div className="relative">
                <Input
                  id="slug"
                  type="text"
                  placeholder="e.g. cedar-and-spice"
                  invalid={!!errors.slug}
                  {...register("slug")}
                  onChange={onSlugChange}
                />
              </div>
              {slugValue && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <PiLinkBold className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">Preview: <strong className="text-foreground">/{slugValue}</strong></span>
                </div>
              )}
            </FormField>

            {/* Phone Number */}
            <FormField
              label="Phone Number"
              htmlFor="phone"
              error={errors.phone?.message}
              hint="Used as your login username"
            >
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                invalid={!!errors.phone}
                {...register("phone")}
              />
            </FormField>

            {/* Password */}
            <FormField
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
              hint="At least 6 characters with a letter and a number"
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

          <p className="mt-7 text-center text-sm text-muted-foreground">
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
