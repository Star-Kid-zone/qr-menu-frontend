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
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth.service";
import { registerSchema, type RegisterSchemaValues } from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/errors";
import { fadeInUp } from "@/lib/motion";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
  });

  const onSubmit = async (data: RegisterSchemaValues) => {
    try {
      await authService.register({
        name: data.name,
        phone: data.phone,
        password: data.password,
      });
      setPhone(data.phone);
      setStep("otp");
      toast.success("Account created! Verification code sent.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Registration failed."));
    }
  };

  const onVerifyOtp = async () => {
    try {
      setIsVerifying(true);
      await authService.verifyOtp({ phone, otp });
      toast.success("Phone verified successfully! Please sign in.");
      router.push("/login");
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
            <h1 className="text-h1 text-foreground">Verify your account</h1>
          </div>

          <p className="mb-6 text-sm leading-6 text-muted-foreground">
            Check your backend terminal for the 6-digit OTP code.
          </p>


          <div className="space-y-5">
            <FormField label="OTP code" htmlFor="otp">
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </FormField>
            <Button
              type="button"
              fullWidth
              loading={isVerifying}
              onClick={onVerifyOtp}
              disabled={otp.length !== 6}
            >
              {isVerifying ? "Verifying…" : "Verify OTP"}
            </Button>
          </div>
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
            <h1 className="text-h1 text-foreground">Create your account</h1>
          </div>



          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                invalid={!!errors.name}
                {...register("name")}
              />
            </FormField>

            <FormField label="Phone number" htmlFor="phone" error={errors.phone?.message}>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                invalid={!!errors.phone}
                {...register("phone")}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                invalid={!!errors.password}
                {...register("password")}
              />
            </FormField>

            <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
            </FormField>

            <div className="pt-1">
              <Checkbox
                id="agreed"
                label={
                  <>
                    I agree to the{" "}
                    <Link href="/terms" className="font-semibold text-primary hover:text-primary/80">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-semibold text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>
                  </>
                }
                invalid={!!errors.agreed}
                {...register("agreed")}
              />
              {errors.agreed && (
                <p className="mt-1.5 text-caption text-destructive">{errors.agreed.message}</p>
              )}
            </div>

            <Button type="submit" fullWidth loading={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
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
