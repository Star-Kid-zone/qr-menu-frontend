'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  PiClockCountdownBold,
  PiPlayBold,
  PiArrowsClockwiseBold,
  PiWarningCircleBold,
  PiCheckCircleBold,
  PiXCircleBold,
  PiSpinnerBold,
  PiInstagramLogoBold,
  PiFacebookLogoBold,
  PiArrowSquareOutBold,
  PiShieldCheckBold,
  PiShieldWarningBold,
  PiUserBold,
  PiStorefrontBold,
  PiFunnelBold,
} from 'react-icons/pi';
import {
  superadminService,
  type QueueJob,
  type SocialAccountHealth,
  type JobsAndQueueResponse,
} from '@/services/superadmin.service';
import { Badge, Button, Card, EmptyState, toast } from '@/components/ui';
import type { BadgeTone } from '@/types/components/ui/Badge.types';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';

export default function SuperadminJobsPage() {
  const reduceMotion = useReducedMotion();
  const [data, setData] = useState<JobsAndQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'accounts'>('jobs');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [triggering, setTriggering] = useState(false);
  const [actionJobId, setActionJobId] = useState<number | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superadminService.getJobsAndQueue();
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load queue telemetry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleTriggerRunner = async () => {
    try {
      setTriggering(true);
      const res = await superadminService.triggerQueueRunner();
      toast.success(res.message || 'Queue worker triggered successfully.');
      await fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to trigger queue worker');
    } finally {
      setTriggering(false);
    }
  };

  const handleRetry = async (jobId: number) => {
    try {
      setActionJobId(jobId);
      const res = await superadminService.retryJob(jobId);
      toast.success(res.message || `Job #${jobId} requeued.`);
      await fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to retry job #${jobId}`);
    } finally {
      setActionJobId(null);
    }
  };

  const handleCancel = async (jobId: number) => {
    if (!confirm(`Are you sure you want to cancel job #${jobId}?`)) return;
    try {
      setActionJobId(jobId);
      const res = await superadminService.cancelJob(jobId);
      toast.success(res.message || `Job #${jobId} cancelled.`);
      await fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to cancel job #${jobId}`);
    } finally {
      setActionJobId(null);
    }
  };

  const getJobStatusBadge = (status: QueueJob['status']) => {
    switch (status) {
      case 'queued':
        return <Badge tone="warning">Queued</Badge>;
      case 'running':
        return <Badge tone="primary">Running</Badge>;
      case 'succeeded':
        return <Badge tone="success">Succeeded</Badge>;
      case 'dead_letter':
        return <Badge tone="danger">Dead Letter</Badge>;
      case 'cancelled':
        return <Badge tone="neutral">Cancelled</Badge>;
      default:
        return <Badge tone="neutral">{status}</Badge>;
    }
  };

  const getAccountStatusBadge = (status: SocialAccountHealth['status']) => {
    switch (status) {
      case 'connected':
        return <Badge tone="success">Connected</Badge>;
      case 'expired':
        return <Badge tone="warning">Expired</Badge>;
      case 'revoked':
        return <Badge tone="danger">Revoked</Badge>;
      case 'error':
        return <Badge tone="danger">Auth Error</Badge>;
      default:
        return <Badge tone="neutral">{status}</Badge>;
    }
  };

  const filteredJobs = useMemo(() => {
    if (!data?.recentJobs) return [];
    if (statusFilter === 'all') return data.recentJobs;
    return data.recentJobs.filter((j) => j.status === statusFilter);
  }, [data?.recentJobs, statusFilter]);

  return (
    <motion.div
      className="flex h-full flex-col gap-6 overflow-y-auto pb-10"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge tone="primary">Worker &amp; Queue Fleet</Badge>
            <span className="text-caption uppercase tracking-wide text-muted-foreground">Background Tasks</span>
          </div>
          <h1 className="text-display text-foreground">Background Jobs &amp; Social Queue</h1>
          <p className="text-body max-w-2xl text-muted-foreground">
            Real-time monitor of organic social publishing queues, dead-letter retries, and tenant Meta token health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={fetchJobs}
            loading={loading}
            leftIcon={<PiArrowsClockwiseBold size={16} />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={handleTriggerRunner}
            loading={triggering}
            leftIcon={<PiPlayBold size={16} />}
          >
            Run Queue Now
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="p-4 bg-card/80 border-border">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-caption font-medium">Queued</span>
            <PiClockCountdownBold className="size-4 text-warning" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {data?.stats.queued ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting schedule</p>
        </Card>

        <Card className="p-4 bg-card/80 border-border">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-caption font-medium">Running</span>
            <PiSpinnerBold className="size-4 text-primary animate-spin" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {data?.stats.running ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">In execution</p>
        </Card>

        <Card className="p-4 bg-card/80 border-border">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-caption font-medium">Succeeded</span>
            <PiCheckCircleBold className="size-4 text-success" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {data?.stats.succeeded ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Published posts</p>
        </Card>

        <Card className="p-4 bg-card/80 border-border">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-caption font-medium">Dead Letter</span>
            <PiWarningCircleBold className="size-4 text-destructive" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {data?.stats.deadLetter ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Failed attempts</p>
        </Card>

        <Card className="p-4 bg-card/80 border-border">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-caption font-medium">Active Accounts</span>
            <PiShieldCheckBold className="size-4 text-success" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {data?.stats.connectedAccounts ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Healthy tokens</p>
        </Card>

        <Card className="p-4 bg-card/80 border-border">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-caption font-medium">Account Issues</span>
            <PiShieldWarningBold className="size-4 text-warning" />
          </div>
          <div className="text-2xl font-black text-foreground">
            {data?.stats.errorAccounts ?? 0}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Expired/revoked</p>
        </Card>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'jobs'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Publishing Queue ({data?.recentJobs.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'accounts'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Social Accounts Health ({data?.socialAccountsHealth.length ?? 0})
          </button>
        </div>

        {activeTab === 'jobs' && (
          <div className="flex items-center gap-2">
            <PiFunnelBold className="size-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="queued">Queued</option>
              <option value="running">Running</option>
              <option value="dead_letter">Dead Letter</option>
              <option value="succeeded">Succeeded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Publishing Jobs Queue */}
      {activeTab === 'jobs' && (
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card/60" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon={<PiClockCountdownBold className="size-8 text-muted-foreground" />}
              title="No jobs in this view"
              description="No publishing jobs match the selected filter criteria."
              action={
                statusFilter !== 'all' ? (
                  <Button variant="secondary" onClick={() => setStatusFilter('all')}>
                    Show All Jobs
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <motion.div
              className="space-y-3"
              initial={reduceMotion ? false : 'hidden'}
              animate="visible"
              variants={staggerContainer(0.04)}
            >
              {filteredJobs.map((job) => (
                <motion.div key={job.id} variants={fadeInUp}>
                  <Card className="p-4 sm:p-5 flex flex-col gap-4 bg-card border-border hover:border-primary/40 transition-colors">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            Job #{job.id}
                          </span>
                          {getJobStatusBadge(job.status)}
                          {job.platform === 'instagram' ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-pink-500/10 px-2 py-0.5 text-xs font-medium text-pink-500">
                              <PiInstagramLogoBold /> Instagram
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
                              <PiFacebookLogoBold /> Facebook
                            </span>
                          )}
                          <span className="text-caption text-muted-foreground">
                            Attempts: <strong className="text-foreground">{job.attemptCount}</strong>
                          </span>
                        </div>

                        {/* Tenant Details */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <PiStorefrontBold className="text-primary" />
                            {job.businessName || 'Business N/A'}
                          </span>
                          {job.userId && (
                            <Link
                              href={`/superadmin/users/${job.userId}`}
                              className="flex items-center gap-1 hover:text-primary transition-colors font-mono"
                            >
                              <PiUserBold />
                              {job.userName} ({job.userPhone})
                            </Link>
                          )}
                          {job.accountName && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono">
                              @{job.accountUsername || job.accountName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {job.permalink && (
                          <a
                            href={job.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <PiArrowSquareOutBold /> View Post
                          </a>
                        )}

                        {(job.status === 'dead_letter' || job.status === 'cancelled') && (
                          <Button
                            size="sm"
                            variant="primary"
                            loading={actionJobId === job.id}
                            onClick={() => handleRetry(job.id)}
                            leftIcon={<PiArrowsClockwiseBold size={13} />}
                          >
                            Retry
                          </Button>
                        )}

                        {(job.status === 'queued' || job.status === 'running') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            loading={actionJobId === job.id}
                            onClick={() => handleCancel(job.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Caption Preview */}
                    {job.caption && (
                      <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground font-mono line-clamp-2">
                        {job.caption}
                      </div>
                    )}

                    {/* Error Box if failed */}
                    {(job.lastError || job.lastErrorMessage) && (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <PiWarningCircleBold />
                          <span>Failure trace ({job.lastErrorCode || 'PUBLISH_FAILED'}):</span>
                        </div>
                        <p className="font-mono text-[11px] break-all">
                          {job.lastError || job.lastErrorMessage}
                        </p>
                      </div>
                    )}

                    {/* Timestamps footer */}
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                      <span>Scheduled for: {new Date(job.runAfter).toLocaleString()}</span>
                      {job.finishedAt && (
                        <span>Finished: {new Date(job.finishedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Tab 2: Social Accounts Health */}
      {activeTab === 'accounts' && (
        <Card className="overflow-hidden bg-card border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Tenant &amp; Business</th>
                  <th className="px-4 py-3">Platform &amp; Account</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Token Expiry</th>
                  <th className="px-4 py-3">Last Verified</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {data?.socialAccountsHealth.map((acc) => (
                  <tr key={acc.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-foreground">{acc.businessName || 'Business'}</div>
                      <div className="text-muted-foreground text-[11px]">
                        {acc.userName} ({acc.userPhone})
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {acc.platform === 'instagram' ? (
                          <PiInstagramLogoBold className="size-4 text-pink-500" />
                        ) : (
                          <PiFacebookLogoBold className="size-4 text-blue-500" />
                        )}
                        <div>
                          <div className="font-semibold text-foreground">{acc.displayName}</div>
                          {acc.username && (
                            <div className="text-muted-foreground font-mono text-[11px]">
                              @{acc.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{getAccountStatusBadge(acc.status)}</td>
                    <td className="px-4 py-3.5">
                      {acc.tokenExpiresAt ? (
                        <div className="font-mono text-muted-foreground">
                          {new Date(acc.tokenExpiresAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never expires / N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {acc.lastCheckedAt
                        ? new Date(acc.lastCheckedAt).toLocaleString()
                        : 'Never checked'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {acc.userId && (
                        <Link href={`/superadmin/users/${acc.userId}`}>
                          <Button size="sm" variant="secondary">
                            Inspect Tenant
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
                {(!data?.socialAccountsHealth || data.socialAccountsHealth.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No connected social accounts found across tenants.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
