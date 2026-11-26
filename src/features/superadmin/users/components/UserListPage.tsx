"use client";

import React, { useEffect, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LoadErrorNotice } from "@/components/feedback/LoadErrorNotice";
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
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
} from "@/components/ui";
import {
  PiUsersBold,
  PiKeyBold,
  PiDownloadSimpleBold,
  PiArrowSquareOutBold,
  PiEnvelopeSimpleBold,
} from "react-icons/pi";
import { downloadCsv } from "@/utils/downloadCsv";
import { fadeIn } from "@/lib/motion";

export function UserListPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState<"admin" | "superadmin" | "">("");
  const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">("all");

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      UI_TIMING.searchDebounceMs
    );
    return () => window.clearTimeout(t);
  }, [search]);

  // Refetches whenever the page or a filter changes.
  const { data, loading, error: loadError, refetch } = useAsyncData(
    () =>
      superadminService.listUsers({
        page,
        page_size: pageSize,
        search: debouncedSearch || undefined,
        role: role || undefined,
        active: activeFilter === "all" ? undefined : activeFilter === "true",
      }),
    [page, pageSize, debouncedSearch, role, activeFilter],
    "Failed to load users.",
  );
  const rows: UserListRow[] = data?.users ?? [];
  const total = data?.total ?? 0;

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
        title="Restaurants"
        description="Every restaurant account on the platform."
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
              className="mb-2 ml-1 block text-caption text-muted-foreground"
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
              placeholder="Name, email or slug…"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[130px]">
              <label
                htmlFor="users-role-filter"
                className="mb-2 ml-1 block text-caption text-muted-foreground"
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
                className="mb-2 ml-1 block text-caption text-muted-foreground"
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

        <TableContainer className="min-h-0 flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Web address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                    Loading user accounts...
                  </TableCell>
                </TableRow>
              ) : loadError ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-8">
                    <LoadErrorNotice title="We couldn't load the user accounts" message={loadError} onRetry={refetch} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-8">
                    <EmptyState
                      icon={<PiUsersBold className="size-8" />}
                      title="No users matching filters"
                      description="Try adjusting your search query or role filter."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((u) => (
                  <TableRow key={u.id}>
                    {/* Identity */}
                    <TableCell>
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
                    </TableCell>

                    {/* Access */}
                    <TableCell>
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
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge tone={u.active ? "success" : "neutral"}>
                        {u.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Email (legacy phone shown until the owner adds one) */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <PiEnvelopeSimpleBold className="size-3.5 text-muted-foreground" />
                        <span>{u.email}</span>
                      </div>
                    </TableCell>

                    {/* Slug Name */}
                    <TableCell>
                      {u.public_slug ? (
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-border bg-muted/50 px-3 py-1 font-mono text-xs font-semibold text-foreground">
                            {u.public_slug}
                          </span>
                          <a
                            href={buildPublicLandingUrl(u.public_slug)}
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
