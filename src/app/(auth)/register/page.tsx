import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthFormFallback, RegisterForm } from "@/features/auth";

export const metadata: Metadata = { title: "Create your account" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormFallback fields={3} />}>
      <RegisterForm />
    </Suspense>
  );
}
