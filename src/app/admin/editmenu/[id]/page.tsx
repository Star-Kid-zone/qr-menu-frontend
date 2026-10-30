"use client";

import { use } from "react";
import { EditMenuPage } from "@/features/menu";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  return <EditMenuPage menuId={resolved.id} />;
}
