"use client";

import React from "react";
import Image from "next/image";
import { Card, Select, Badge, EmptyState } from "@/shared/components";
import {
  PiChartLineUpBold,
  PiMagnifyingGlassBold,
  PiSparkleBold,
} from "react-icons/pi";
import type { TenantAnalyticsData, DateRange } from "../types";

interface UserAnalyticsTabProps {
  range: DateRange;
  setRange: (range: DateRange) => void;
  loadingAnalytics: boolean;
  tenantAnalytics: TenantAnalyticsData | null;
  formatDeviceIcon: (ua: string | null) => React.ReactNode;
}

export function UserAnalyticsTab({
  range,
  setRange,
  loadingAnalytics,
  tenantAnalytics,
  formatDeviceIcon,
}: UserAnalyticsTabProps) {
  return (
    <div className="space-y-6 pb-8">
      {/* Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiChartLineUpBold className="size-5" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-foreground">
              Tenant Telemetry & Visitor Activity
            </h2>
            <p className="text-xs text-muted-foreground">
              Performance stats for restaurant visits, scans, searches, and clicks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            className="w-40"
          >
            <option value="today">Today</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="all">All Time</option>
          </Select>
        </div>
      </div>

      {loadingAnalytics ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tenantAnalytics ? (
        <div className="space-y-6">
          {/* Real-time "Today" Snapshot */}
          {tenantAnalytics.today && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Today&apos;s Live Activity Snapshot
                  </h3>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  Calendar Day to Date
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                <div className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Today Visits
                  </p>
                  <p className="mt-1 font-mono text-xl font-extrabold text-foreground">
                    {tenantAnalytics.today.visits}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Today Clicks
                  </p>
                  <p className="mt-1 font-mono text-xl font-extrabold text-foreground">
                    {tenantAnalytics.today.clicks}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Today Searches
                  </p>
                  <p className="mt-1 font-mono text-xl font-extrabold text-foreground">
                    {tenantAnalytics.today.searches}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Unique Visitors
                  </p>
                  <p className="mt-1 font-mono text-xl font-extrabold text-primary">
                    {tenantAnalytics.today.visitors}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                    New Guests
                  </p>
                  <p className="mt-1 font-mono text-xl font-extrabold text-emerald-400">
                    {tenantAnalytics.today.newVisitors}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Returning Guests
                  </p>
                  <p className="mt-1 font-mono text-xl font-extrabold text-blue-400">
                    {tenantAnalytics.today.returningVisitors}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Period Summary KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <p className="text-caption uppercase tracking-wider text-muted-foreground">
                Total Menu Visits
              </p>
              <p className="mt-2 font-mono text-3xl font-extrabold text-foreground">
                {tenantAnalytics.summary?.totalVisits ?? 0}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-caption uppercase tracking-wider text-muted-foreground">
                Total Clicks & Actions
              </p>
              <p className="mt-2 font-mono text-3xl font-extrabold text-primary">
                {tenantAnalytics.summary?.totalClicks ?? 0}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-caption uppercase tracking-wider text-muted-foreground">
                Unique Guests
              </p>
              <p className="mt-2 font-mono text-3xl font-extrabold text-foreground">
                {tenantAnalytics.summary?.uniqueVisitors ?? 0}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-caption uppercase tracking-wider text-muted-foreground">
                Most Viewed Dish
              </p>
              <p className="mt-2 text-lg font-bold text-foreground truncate">
                {tenantAnalytics.summary?.popularItem || "None yet"}
              </p>
            </Card>
          </div>

          {/* Click Destinations & Top Dishes */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Click breakdown */}
            {tenantAnalytics.clickBreakdown && (
              <Card className="p-5">
                <h3 className="text-base font-bold text-foreground mb-4">
                  Action Destination Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(tenantAnalytics.clickBreakdown).map(
                    ([dest, count]) => (
                      <div
                        key={dest}
                        className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-xs"
                      >
                        <span className="font-medium capitalize text-foreground">
                          {dest.replace(/_/g, " ")}
                        </span>
                        <span className="font-mono font-bold text-primary">
                          {count} clicks
                        </span>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}

            {/* Top dishes */}
            {tenantAnalytics.topMenuItems &&
              tenantAnalytics.topMenuItems.length > 0 && (
                <Card className="p-5">
                  <h3 className="text-base font-bold text-foreground mb-4">
                    Top Trending Dishes
                  </h3>
                  <div className="space-y-3">
                    {tenantAnalytics.topMenuItems.map((dish, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                      >
                        <div className="flex items-center gap-3">
                          {dish.imageUrl && (
                            <div className="relative size-10 overflow-hidden rounded-lg">
                              <Image
                                src={dish.imageUrl}
                                alt={dish.item}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {dish.item}
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground">
                              ${Number(dish.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                          {dish.count} views
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
          </div>

          {/* Search Queries & Zero-Result Gap Signals */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Searches */}
            <Card className="p-5">
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <PiMagnifyingGlassBold className="text-primary" />
                Guest Search Inquiries
              </h3>
              {Array.isArray(tenantAnalytics.topSearches) &&
              tenantAnalytics.topSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tenantAnalytics.topSearches.map((s: any, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground"
                    >
                      <span>&quot;{s.query}&quot;</span>
                      <span className="font-mono text-[10px] text-primary">
                        ({s.count})
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No guest search keywords recorded in this period.
                </p>
              )}
            </Card>

            {/* Zero Result Searches */}
            <Card className="p-5">
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <PiSparkleBold className="text-amber-400" />
                Menu Gap Inquiries (Zero Results)
              </h3>
              {Array.isArray(tenantAnalytics.zeroResultSearches) &&
              tenantAnalytics.zeroResultSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tenantAnalytics.zeroResultSearches.map(
                    (s: any, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-950/20 px-3 py-1 text-xs font-semibold text-rose-300"
                      >
                        <span>&quot;{s.query}&quot;</span>
                        <span className="font-mono text-[10px] text-rose-400">
                          ({s.count})
                        </span>
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No missing menu dish queries identified.
                </p>
              )}
            </Card>
          </div>

          {/* REAL VISITOR SESSIONS LOG */}
          {tenantAnalytics.visitorsList?.visitors &&
            tenantAnalytics.visitorsList.visitors.length > 0 && (
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Real Visitor Sessions Log
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Recent guest device connections and interaction telemetry
                    </p>
                  </div>
                  <Badge tone="neutral">
                    {tenantAnalytics.visitorsList.total} Total Devices
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-muted/20 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                      <tr>
                        <th className="px-6 py-3">Device / OS</th>
                        <th className="px-6 py-3">Visitor Token</th>
                        <th className="px-6 py-3">IP Address</th>
                        <th className="px-6 py-3 text-center">Visits</th>
                        <th className="px-6 py-3 text-center">Clicks</th>
                        <th className="px-6 py-3 text-center">Total Events</th>
                        <th className="px-6 py-3">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {tenantAnalytics.visitorsList.visitors.map((v, i) => (
                        <tr
                          key={i}
                          className="transition-colors hover:bg-muted/10"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              {formatDeviceIcon(v.userAgent)}
                              <span className="truncate max-w-[140px] text-muted-foreground">
                                {v.userAgent ? v.userAgent.split(" ")[0] : "Browser"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 font-mono text-foreground font-semibold">
                            {v.visitorId.slice(0, 14)}...
                          </td>
                          <td className="px-6 py-3 font-mono text-muted-foreground">
                            {v.ipAddress || "127.0.0.1"}
                          </td>
                          <td className="px-6 py-3 text-center font-mono font-bold text-foreground">
                            {v.visits}
                          </td>
                          <td className="px-6 py-3 text-center font-mono font-bold text-primary">
                            {v.clicks}
                          </td>
                          <td className="px-6 py-3 text-center font-mono font-bold text-foreground">
                            {v.totalEvents}
                          </td>
                          <td className="px-6 py-3 text-muted-foreground font-mono">
                            {new Date(v.lastSeen).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
        </div>
      ) : (
        <EmptyState
          icon={<PiChartLineUpBold className="size-8" />}
          title="No analytics recorded"
          description="No scan or visit activity has been logged for this tenant in this period."
        />
      )}
    </div>
  );
}
