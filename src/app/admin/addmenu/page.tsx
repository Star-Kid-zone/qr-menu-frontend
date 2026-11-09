"use client";

import { Suspense } from "react";
import { AddMenuPage } from "@/features/menu";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AddMenuPage />
    </Suspense>
  );
}
