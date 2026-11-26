"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FeastOwlLogo } from "@/components/brand";
import { GlobalLoaderOverlay } from "@/components/layouts/GlobalLoaderOverlay";
import { GlobalProgressBar } from "@/components/layouts/GlobalProgressBar";
import { springDefault } from "@/lib/motion";
import { APP_NAME } from "@/constants/app.constants";
import { AUTH_STAGE_BY_PATH } from "@/constants/auth.constants";
import { AuthPreviewProvider } from "../context/AuthPreviewContext";
import { AuthStage } from "./stage/AuthStage";
import { FeatureStrip } from "./FeatureStrip";

/**
 * Layout for sign in, register and password reset: the form on the left,
 * the 3D product scene on the right (desktop), and a swipeable feature strip
 * under the form on smaller screens.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const variant = AUTH_STAGE_BY_PATH[pathname] ?? "signin";
  const reduce = useReducedMotion();

  return (
    <AuthPreviewProvider>
      <GlobalProgressBar />
      <GlobalLoaderOverlay />
      <div className="flex min-h-dvh bg-background">
        <div className="flex min-w-0 flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 lg:w-[30rem] lg:flex-none lg:px-14 xl:w-[34rem] xl:px-20">
          <header className="lg:hidden">
            <Link href="/" className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <FeastOwlLogo tone="auto" className="text-2xl" markClassName="size-9" />
            </Link>
          </header>

          <main className="flex flex-1 flex-col justify-center py-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springDefault}
              className="mx-auto w-full max-w-sm"
            >
              {children}
            </motion.div>
          </main>

          {variant === "reset" ? null : <FeatureStrip className="mx-auto w-full max-w-xl lg:hidden" />}

          <p className="mt-6 text-center text-caption text-muted-foreground lg:text-left">
            &copy; {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>

        <AuthStage variant={variant} className="sticky top-0 hidden h-dvh flex-1 lg:flex" />
      </div>
    </AuthPreviewProvider>
  );
}
