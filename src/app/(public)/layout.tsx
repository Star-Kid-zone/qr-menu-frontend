import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No max-width "app preview" frame here — templates (landing and menu) each
  // render their own full-bleed background, matching how the root domain
  // landing route (app/page.tsx) renders TenantLandingPage unwrapped.
  return (
    <div className="min-h-screen font-sans selection:bg-primary/20 selection:text-foreground">
      {children}
    </div>
  );
}
