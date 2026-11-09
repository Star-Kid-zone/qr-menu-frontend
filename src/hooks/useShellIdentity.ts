"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { workspaceService } from "@/services/workspace.service";
import { buildPublicLandingUrl } from "@/utils/tenantHost";
import { getImpersonationSession } from "@/utils/storage";

export interface ShellIdentity {
  /** The signed-in person, e.g. "Maya Patel". */
  name: string;
  /** Plain role name: Owner, Manager, Staff or Platform admin. */
  roleLabel: string;
  initials: string;
  /** Restaurant shown at the top of the sidebar (restaurant area only). */
  restaurantName: string | null;
  websiteUrl: string | null;
}

interface ProfileUser {
  name?: string;
  role?: string;
  staffRole?: "manager" | "staff";
}

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function roleLabelFor(user: ProfileUser) {
  if (user.role === "superadmin") return "Platform admin";
  if (user.staffRole === "manager") return "Manager";
  if (user.staffRole === "staff") return "Staff";
  return "Owner";
}

// One request per page load and session, shared by the sidebar and mobile top
// bar. Keyed by area + support session so impersonating another restaurant
// (a client-side navigation) never shows the previous identity.
const cache = new Map<string, Promise<ShellIdentity>>();
const cacheKey = (area: string) => `${area}:${JSON.stringify(getImpersonationSession() ?? null)}`;

async function loadIdentity(area: "admin" | "superadmin"): Promise<ShellIdentity> {
  const profileRes = await authService.getProfile().catch(() => null);
  const user = ((profileRes?.data as { user?: ProfileUser } | undefined)?.user ?? {}) as ProfileUser;
  const name = user.name?.trim() || (area === "superadmin" ? "Platform admin" : "Signed in");

  let restaurantName: string | null = null;
  let websiteUrl: string | null = null;
  if (area === "admin") {
    const ws = await workspaceService.getWorkspace().catch(() => null);
    restaurantName = ws?.data?.business?.name?.trim() || null;
    websiteUrl = ws?.data?.publicSlug ? buildPublicLandingUrl(ws.data.publicSlug) : null;
  }

  return { name, roleLabel: roleLabelFor(user), initials: toInitials(name), restaurantName, websiteUrl };
}

export function useShellIdentity(area: "admin" | "superadmin") {
  const [identity, setIdentity] = useState<ShellIdentity | null>(null);

  useEffect(() => {
    let alive = true;
    const key = cacheKey(area);
    if (!cache.has(key)) cache.set(key, loadIdentity(area));
    cache
      .get(key)!
      .then((value) => alive && setIdentity(value))
      .catch(() => cache.delete(key));
    return () => {
      alive = false;
    };
  }, [area]);

  return identity;
}

/** Call on sign-out so the next session doesn't reuse the previous identity. */
export function resetShellIdentity() {
  cache.clear();
}
