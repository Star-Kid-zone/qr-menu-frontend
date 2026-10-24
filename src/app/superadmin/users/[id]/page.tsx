"use client";

import { use } from "react";
import { UserDetailPage } from "@/features/superadmin/users";

export default function SuperadminUserDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <UserDetailPage id={id} />;
}
