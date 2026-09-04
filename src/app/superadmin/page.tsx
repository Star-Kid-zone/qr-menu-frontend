'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PiUsers,
  PiGlobeBold,
  PiBuildingBold,
  PiArrowRightBold,
  PiChartLineUpBold,
  PiUserListBold,
  PiArrowClockwiseBold
} from 'react-icons/pi';
import {
  superadminService,
  type DateRange,
  type PlatformOverview,
} from '@/services/superadmin.service';
import { Badge, Card, Button } from '@/components/ui';
import { routes } from '@/config/routes';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';
import { getApiErrorMessage } from '@/utils/errors';

export default function SuperadminPage() {
  const [data, setData] = useState<PlatformOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await superadminService.getOverview();
      setData(res);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load platform overview'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return null;
  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <p className="text-body font-semibold text-destructive">{error || 'Unknown error'}</p>
        <Button variant="secondary" size="sm" onClick={fetchData}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-full flex-col gap-4"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge tone="success">Platform Live</Badge>
            <span className="text-caption uppercase tracking-wide text-muted-foreground">Pulse Monitor</span>
          </div>
          <h1 className="text-display text-foreground">
            Infrastructure Overview
          </h1>
          <p className="text-body max-w-2xl text-muted-foreground">
            Real-time telemetry across all tenant workspaces, user accounts, and global traffic patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            onClick={fetchData}
            aria-label="Refresh platform data"
            title="Refresh data"
          >
            <PiArrowClockwiseBold className="size-4" />
          </Button>
          <Link href={routes.superadmin.analytics}>
            <Button>Deep analytics</Button>
          </Link>
        </div>
      </div>

      <motion.div
        className="grid shrink-0 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerContainer(0.05)}
      >
        <motion.div variants={fadeInUp}>
          <PlatformMetric
            title="Total Users"
            value={data.users.total}
            sub={`${data.users.active} active records`}
            details={[
              { label: 'Admins', value: data.users.by_role.admin },
              { label: 'Super', value: data.users.by_role.superadmin }
            ]}
            icon={<PiUsers className="size-5" />}
            highlight
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PlatformMetric
            title="Workspaces"
            value={data.workspaces.total}
            sub="Global deployments"
            details={[
              { label: 'Public slugs', value: data.workspaces.with_public_slug }
            ]}
            icon={<PiGlobeBold className="size-5" />}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PlatformMetric
            title="Businesses"
            value={data.businesses.total}
            sub="Registered entities"
            details={[
              { label: 'Active', value: data.businesses.active }
            ]}
            icon={<PiBuildingBold className="size-5" />}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PlatformMetric
            title="Gross Traffic"
            value={data.analytics_in_period.total_events}
            sub="Activity in period"
            details={[
              { label: 'Visitors', value: data.analytics_in_period.distinct_visitors }
            ]}
            icon={<PiChartLineUpBold className="size-5" />}
          />
        </motion.div>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2">
          <QuickActionCard
            title="Account Directory"
            description="Drill into specific user profiles, manage tenant workspaces, and verify account security status."
            href={routes.superadmin.users}
            icon={<PiUserListBold className="size-5" />}
          />
          <QuickActionCard
            title="Global Analytics"
            description="Visualize cross-tenant performance, identify top-performing accounts, and monitor system-wide conversion trends."
            href={routes.superadmin.analytics}
            icon={<PiChartLineUpBold className="size-5" />}
          />
        </div>
      </div>
    </motion.div>
  );
}

function PlatformMetric({
  title,
  value,
  sub,
  details,
  icon,
  highlight = false,
}: {
  title: string;
  value: number;
  sub: string;
  details: Array<{ label: string; value: number }>;
  icon: ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-caption uppercase tracking-wide text-muted-foreground">{title}</p>
        <div
          className={`flex size-9 items-center justify-center rounded-lg ${
            highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="tabular-figures text-display text-foreground">{value.toLocaleString()}</p>
      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <p className="text-caption text-muted-foreground">{sub}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {details.map((d, i) => (
            <span key={i} className="text-caption text-foreground">
              {d.value.toLocaleString()} {d.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function QuickActionCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: ReactNode }) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col justify-between p-6 transition-colors hover:border-primary/30">
        <div className="space-y-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            {icon}
          </div>
          <div className="space-y-1">
            <h2 className="text-h2 text-foreground">
              {title}
            </h2>
            <p className="text-body text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-caption uppercase tracking-wide text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Access Module <PiArrowRightBold className="size-3" />
        </div>
      </Card>
    </Link>
  );
}
