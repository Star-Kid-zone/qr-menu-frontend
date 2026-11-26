import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthFormFallback, LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormFallback fields={2} />}>
      <LoginForm />
    </Suspense>
  );
}
