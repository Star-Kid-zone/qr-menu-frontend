"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthPreviewState } from "@/types";

/** Lets the register form show the typed restaurant name on the scene beside it. */
const AuthPreviewContext = createContext<AuthPreviewState | null>(null);

export function AuthPreviewProvider({ children }: { children: ReactNode }) {
  const [businessName, setBusinessName] = useState("");
  const value = useMemo(() => ({ businessName, setBusinessName }), [businessName]);
  return <AuthPreviewContext.Provider value={value}>{children}</AuthPreviewContext.Provider>;
}

function ignore() {}

/** Works without a provider too (forms rendered on their own, e.g. in tests). */
export function useAuthPreview(): AuthPreviewState {
  return useContext(AuthPreviewContext) ?? { businessName: "", setBusinessName: ignore };
}
