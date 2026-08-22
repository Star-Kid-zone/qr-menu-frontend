'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { superadminService, type UserListRow } from '@/services/superadmin.service';
import { routes } from '@/config/routes';
import { UI_TIMING } from '@/config/app.constants';
import { PageHeader, Card, SearchInput, Badge, Button, Select, Spinner, EmptyState } from '@/components/ui';
import { Pagination } from '@/components/ui/Pagination';
import { PiUsersBold, PiKeyBold, PiXCircleBold, PiDownloadSimpleBold } from 'react-icons/pi';
import { downloadCsv } from '@/utils/downloadCsv';
import { fadeIn } from '@/lib/motion';

export default function SuperadminUsersPage() {
  const [rows, setRows] = useState<UserListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin' | ''>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search.trim()), UI_TIMING.searchDebounceMs);
    return () => window.clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await superadminService.listUsers({
        page,
        page_size: pageSize,
        search: debouncedSearch || undefined,
        role: role || undefined,
        active:
          activeFilter === 'all' ? undefined : activeFilter === 'true' ? true : false,
      });
      setRows(res.users);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
      setError('Failed to load users.');
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
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      <PageHeader
        title="Users & Tenants"
        description="Search accounts and drill into workspaces, businesses, and public URLs."
        eyebrow="System Administration"
        className="shrink-0"
        actions={
          <Button
            variant="secondary"
            onClick={() => downloadCsv('/superadmin/users/export.csv', 'tenants.csv').catch(() => {})}
            leftIcon={<PiDownloadSimpleBold size={16} />}
          >
            Export CSV
          </Button>
        }
      />

      <Card className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
        <div className="mb-4 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md flex-1">
            <label htmlFor="users-search" className="mb-2 ml-1 block text-caption uppercase tracking-wide text-muted-foreground">
              Search Accounts
            </label>
            <SearchInput
              id="users-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Name, phone or email…"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[120px]">
              <label htmlFor="users-role-filter" className="mb-2 ml-1 block text-caption uppercase tracking-wide text-muted-foreground">
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

            <div className="min-w-[120px]">
              <label htmlFor="users-status-filter" className="mb-2 ml-1 block text-caption uppercase tracking-wide text-muted-foreground">
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

        {error && (
          <div className="mb-4 flex shrink-0 items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-body font-medium text-destructive">
            <PiXCircleBold className="size-4" />
            {error}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-border">
          <div className="h-full overflow-x-auto overflow-y-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-body">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">Identity</th>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">Access</th>
                  <th className="px-6 py-4 text-center text-caption uppercase tracking-wide text-muted-foreground">Workspaces</th>
                  <th className="px-6 py-4 text-center text-caption uppercase tracking-wide text-muted-foreground">Businesses</th>
                  <th className="px-6 py-4 text-center text-caption uppercase tracking-wide text-muted-foreground">Menu Items</th>
                  <th className="px-6 py-4 text-caption uppercase tracking-wide text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <Spinner label="Fetching account records…" />
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8">
                      <EmptyState
                        icon={<PiUsersBold className="size-8" />}
                        title="No users matching filters"
                        description="Try adjusting your search criteria or role filters."
                      />
                    </td>
                  </tr>
                ) : (
                  rows.map((u) => (
                    <tr key={u.id} className="group transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={routes.superadmin.userDetail(u.id)}
                            className="font-semibold text-primary transition-all hover:underline"
                          >
                            {u.name}
                          </Link>
                          <span className="mt-0.5 font-mono text-caption text-muted-foreground">{u.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-md p-1.5 ${u.role === 'superadmin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <PiKeyBold className="size-4" />
                          </div>
                          <span className={`text-caption uppercase tracking-wide ${u.role === 'superadmin' ? 'text-primary' : 'text-muted-foreground'}`}>
                            {u.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent font-mono text-caption font-semibold text-foreground">
                          {u.workspace_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent font-mono text-caption font-semibold text-foreground">
                          {u.business_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent font-mono text-caption font-semibold text-foreground">
                          {u.menu_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge tone={u.active ? 'success' : 'neutral'}>
                          {u.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 shrink-0">
          <Pagination page={page} pageCount={totalPages} onPageChange={setPage} totalItems={total} pageSize={pageSize} />
        </div>
      </Card>
    </motion.div>
  );
}
