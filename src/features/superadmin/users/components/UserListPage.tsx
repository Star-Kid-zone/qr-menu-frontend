"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { superadminService, type UserListRow } from "@/services/superadmin.service";
import { routes } from "@/config/routes";
import { buildPublicLandingUrl } from "@/utils/tenantHost";
import { UI_TIMING } from "@/config/app.constants";
import {
  PageHeader,
  Card,
  SearchInput,
  Badge,
  Button,
  Select,
  EmptyState,
  Pagination,
  toast,
} from "@/components/ui";
import {
  PiUsersBold,
  PiKeyBold,
  PiDownloadSimpleBold,
  PiArrowSquareOutBold,
  PiPhoneBold,
} from "react-icons/pi";
import { downloadCsv } from "@/utils/downloadCsv";
import { fadeIn } from "@/lib/motion";

export function UserListPage() {
  const [rows, setRows] = useState<UserListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState<"admin" | "superadmin" | "">("");
  const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      UI_TIMING.searchDebounceMs
    );
    return () => window.clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superadminService.listUsers({
        page,
        page_size: pageSize,
        search: debouncedSearch || undefined,
        role: role || undefined,
        active:
          activeFilter === "all"
            ? undefined
            : activeFilter === "true",
      });
      setRows(res.users);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, role, activeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex h-full flex-col gap-4"
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={fadeIn}
    >
      <PageHeader
        title="Users & Tenants"
        description="Core tenant directory. View access permissions, verification status, and direct slugs."
        eyebrow="System Administration"
        className="shrink-0"
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              downloadCsv("/superadmin/users/export.csv", "tenants.csv").catch(
                () => {}
              )
            }
            leftIcon={<PiDownloadSimpleBold size={16} />}
          >
            Export CSV
          </Button>
        }
      />

      <Card className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
        <div className="mb-4 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md flex-1">
            <label
              htmlFor="users-search"
              className="mb-2 ml-1 block text-caption uppercase tracking-wide text-muted-foreground"
            >
              Search Accounts
            </label>
            <SearchInput
              id="users-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Name, phone number or slug…"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[130px]">
              <label
                htmlFor="users-role-filter"
                className="mb-2 ml-1 block text-caption uppercase tracking-wide text-muted-foreground"
              >
                Access Role
              </label>
              <Select
                id="users-role-filter"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as typeof role);
                  setPage(1);
                }}
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </Select>
            </div>

            <div className="min-w-[130px]">
              <label
                htmlFor="users-status-filter"
                className="mb-2 ml-1 block text-caption uppercase tracking-wide text-muted-foreground"
              >
                Status
              </label>
              <Select
                id="users-status-filter"
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value as typeof activeFilter);
                  setPage(1);
                }}
              >
                <option value="all">All status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-border">
          <div className="h-full overflow-x-auto overflow-y-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-body">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">
                    Identity
                  </th>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">
                    Access
                  </th>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">
                    Phone Num
                  </th>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">
                    Slug Name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="h-48 text-center text-muted-foreground">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8">
                      <EmptyState
                        icon={<PiUsersBold className="size-8" />}
                        title="No users matching filters"
                        description="Try adjusting your search query or role filter."
                      />
                    </td>
                  </tr>
                ) : (
                  rows.map((u) => (
                    <tr
                      key={u.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Identity */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={routes.superadmin.userDetail(u.id)}
                            className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                          >
                            {u.name || "Unnamed Account"}
                          </Link>
                          <span className="font-mono text-caption text-muted-foreground">
                            ID #{u.id}
                          </span>
                        </div>
                      </td>

                      {/* Access */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`rounded-md p-1.5 ${
                              u.role === "superadmin"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <PiKeyBold className="size-4" />
                          </div>
                          <span
                            className={`text-caption uppercase tracking-wide font-medium ${
                              u.role === "superadmin"
                                ? "text-primary font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge tone={u.active ? "success" : "neutral"}>
                          {u.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      {/* Phone Num */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-mono text-sm text-foreground">
                          <PiPhoneBold className="size-3.5 text-muted-foreground" />
                          <span>{u.phone || "—"}</span>
                        </div>
                      </td>

                      {/* Slug Name */}
                      <td className="px-6 py-4">
                        {u.public_slug ? (
                          <div className="flex items-center gap-2">
                            <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-xs font-semibold text-foreground">
                              {u.public_slug}
                            </span>
                            <a
                              href={
                                buildPublicLandingUrl(u.public_slug) ||
                                `/${u.public_slug}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                              title={`Open live tenant landing: ${buildPublicLandingUrl(
                                u.public_slug
                              )}`}
                            >
                              <PiArrowSquareOutBold className="size-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-caption text-muted-foreground italic">
                            No slug configured
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 shrink-0">
          <Pagination
            page={page}
            pageCount={totalPages}
            onPageChange={setPage}
            totalItems={total}
            pageSize={pageSize}
          />
        </div>
      </Card>
    </motion.div>
  );
}
