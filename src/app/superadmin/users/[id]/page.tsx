"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  PiArrowLeftBold,
  PiArrowSquareOutBold,
  PiUserBold,
  PiSquaresFourBold,
  PiBriefcaseBold,
  PiChartLineUpBold,
  PiStorefrontBold,
  PiStarBold,
  PiWalletBold,
  PiInfoBold,
  PiUsers,
  PiCursorClick,
} from "react-icons/pi";
import {
  superadminService,
  type DateRange,
  type UserDetailResponse,
} from "@/services/superadmin.service";
import type { DashboardData } from "@/services/analytics.service";
import { routes } from "@/config/routes";
import { PageLoader, Card, Badge, Button, Select, Spinner, buttonVariants } from "@/components/ui";
import { Props } from "@/types/app/superadmin/users/[id]/page.types";
import { fadeIn } from "@/lib/motion";

function SuperadminUserDetailContent({ id }: Props) {
  const userId = Number(id);
  const reduceMotion = useReducedMotion();
  const [detail, setDetail] = useState<UserDetailResponse | null>(null);
  const [tenantAnalytics, setTenantAnalytics] = useState<DashboardData | null>(
    null,
  );
  const [range, setRange] = useState<DateRange>("last_7_days");
  const [loading, setLoading] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!Number.isFinite(userId)) {
      setError("Invalid user identification token.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await superadminService.getUser(userId);
      setDetail(res);
    } catch (e) {
      console.error(e);
      setError("Account not found or system access restricted.");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadAnalytics = useCallback(async () => {
    if (!Number.isFinite(userId)) return;
    try {
      setLoadingAnalytics(true);
      const res = await superadminService.getTenantAnalytics(userId, range);
      setTenantAnalytics(res);
    } catch (e) {
      console.error(e);
      setTenantAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [userId, range]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (detail) loadAnalytics();
  }, [detail, loadAnalytics]);

  if (!Number.isFinite(userId)) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-6 text-center font-medium text-destructive">
        Invalid user ID provided.
      </div>
    );
  }

  if (loading) {
    return <PageLoader label="Loading account profile…" />;
  }

  if (error || !detail) {
    return (
      <div className="mx-auto mt-20 max-w-2xl">
        <Card className="flex flex-col items-center gap-6 border-destructive/20 bg-destructive/5 p-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <PiInfoBold className="size-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-h1 text-foreground">
              User Not Found
            </h3>
            <p className="text-body text-muted-foreground">
              {error ??
                "The requested account could not be retrieved from the database."}
            </p>
          </div>
          <Link href={routes.superadmin.users}>
            <Button
              variant="secondary"
              leftIcon={<PiArrowLeftBold className="size-4" />}
            >
              Return to User Directory
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const u = detail.user;

  return (
    <motion.div
      className="flex h-full flex-col gap-4"
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={fadeIn}
    >
      <div className="shrink-0">
        <Link
          href={routes.superadmin.users}
          className="group mb-4 inline-flex items-center gap-2 text-caption uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
        >
          <PiArrowLeftBold className="transition-transform group-hover:-translate-x-1" />
          Back to Directory
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <PiUserBold className="size-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-display text-foreground">
                  {(u.name as string) ?? "Untitled User"}
                </h1>
                <Badge tone={u.active ? "success" : "neutral"}>
                  {u.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="mt-1 text-body text-muted-foreground">
                {(u.phone as string) ?? "No phone recorded"} &bull;{" "}
                <span className="rounded-md bg-accent px-2 py-0.5 text-caption uppercase tracking-wide">
                  {(u.role as string) ?? "user"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailMetric
            label="Menu Items"
            value={detail.counts.menus}
            icon={<PiStorefrontBold className="size-5" />}
            highlight
          />
          <DetailMetric
            label="User Reviews"
            value={detail.counts.reviews}
            icon={<PiStarBold className="size-5" />}
          />
          <DetailMetric
            label="Payment History"
            value={detail.counts.payments}
            icon={<PiWalletBold className="size-5" />}
          />
          <DetailMetric
            label="Gross Activity"
            value={detail.counts.analytics_events}
            icon={<PiChartLineUpBold className="size-5" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-6 py-4">
                <PiSquaresFourBold className="size-5 text-primary" />
                <h2 className="text-h3 text-foreground">
                  Authorized Workspaces
                </h2>
              </div>
              <div className="p-6">
                {detail.workspaces.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                    <PiSquaresFourBold className="size-10" />
                    <p className="text-body">
                      No active workspaces linked to this account.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detail.workspaces.map((w) => (
                      <div
                        key={String(w.id)}
                        className="flex flex-col gap-4 rounded-md border border-border bg-muted/30 p-5 transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-caption uppercase tracking-wide text-muted-foreground">
                              Workspace ID
                            </span>
                            <span className="font-mono font-semibold text-primary">
                              #{String(w.id)}
                            </span>
                          </div>
                          <p className="text-body">
                            Slug:{" "}
                            <span className="text-muted-foreground">
                              {(w.public_slug as string) ?? "unconfigured"}
                            </span>
                          </p>
                        </div>

                        {w.public_site_url ? (
                          <a
                            href={w.public_site_url}
                            target="_blank"
                            rel="noreferrer"
                            className={buttonVariants({ variant: "primary", size: "sm" })}
                          >
                            Visit Live Site{" "}
                            <PiArrowSquareOutBold className="size-4" />
                          </a>
                        ) : (
                          <Badge tone="neutral">
                            Draft State
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-6 py-4">
                <PiBriefcaseBold className="size-5 text-primary" />
                <h2 className="text-h3 text-foreground">
                  Business Entities
                </h2>
              </div>
              <div className="p-0">
                {detail.businesses.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-6 py-16 text-muted-foreground">
                    <PiBriefcaseBold className="size-10" />
                    <p className="text-body">
                      No business entities registered.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] text-left text-body">
                      <thead className="border-b border-border bg-muted/30">
                        <tr>
                          <th className="px-6 py-3 text-caption uppercase tracking-wide text-muted-foreground">
                            Business Name
                          </th>
                          <th className="px-6 py-3 text-caption uppercase tracking-wide text-muted-foreground">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-caption uppercase tracking-wide text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {detail.businesses.map((b) => (
                          <tr
                            key={String(b.id)}
                            className="transition-colors hover:bg-muted/30"
                          >
                            <td className="px-6 py-4 font-semibold text-foreground">
                              {String(b.business_name ?? "Untitled")}
                            </td>
                            <td className="px-6 py-4 font-mono text-caption text-muted-foreground">
                              {String(b.phone ?? "N/A")}
                            </td>
                            <td className="px-6 py-4">
                              <Badge tone={b.active ? "success" : "neutral"}>
                                {b.active ? "Active" : "Offline"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PiChartLineUpBold className="size-5 text-primary" />
                  <h2 className="text-h3 text-foreground">
                    Tenant Analytics
                  </h2>
                </div>
                <Select
                  aria-label="Analytics period"
                  value={range}
                  onChange={(e) => setRange(e.target.value as DateRange)}
                  className="h-8 max-w-full py-1.5 text-caption uppercase tracking-wide"
                >
                  <option value="today">Today</option>
                  <option value="last_7_days">7 days</option>
                  <option value="last_30_days">30 days</option>
                  <option value="last_90_days">90 days</option>
                </Select>
              </div>

              {loadingAnalytics ? (
                <div className="py-10">
                  <Spinner label="Processing data…" />
                </div>
              ) : tenantAnalytics ? (
                <div className="space-y-3">
                  <MetricRow
                    label="Visitors"
                    value={tenantAnalytics.summary?.uniqueVisitors || 0}
                    icon={<PiUsers className="size-4" />}
                  />
                  <MetricRow
                    label="Views"
                    value={tenantAnalytics.summary?.totalVisits || 0}
                    icon={<PiChartLineUpBold className="size-4" />}
                  />
                  <MetricRow
                    label="Clicks"
                    value={tenantAnalytics.summary?.totalClicks || 0}
                    icon={<PiCursorClick className="size-4" />}
                  />
                </div>
              ) : (
                <div className="py-10 text-center text-body text-muted-foreground">
                  No activity records found.
                </div>
              )}
            </Card>

            <Card className="border-dashed p-6">
              <h3 className="mb-4 text-caption uppercase tracking-wide text-muted-foreground">
                Account Integrity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                  <span className="text-body text-foreground">2FA Security</span>
                  <Badge tone="neutral">
                    Disabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                  <span className="text-body text-foreground">Verification</span>
                  <Badge tone="success">
                    Verified
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailMetric({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex size-9 items-center justify-center rounded-lg ${
            highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {icon}
        </div>
        <p className="text-caption uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="tabular-figures text-h1 text-foreground">
        {value.toLocaleString()}
      </p>
    </Card>
  );
}

function MetricRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <span className="text-caption uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <span className="tabular-figures font-mono text-h3 text-foreground">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function SuperadminUserDetailPageComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  if (!id) return <PageLoader />;
  return <SuperadminUserDetailContent id={id} />;
}

export default SuperadminUserDetailPageComponent;
