'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PiUsers,
  PiGlobeBold,
  PiBuildingBold,
  PiChartLineUpBold,
  PiUserListBold,
} from 'react-icons/pi';
import {
  superadminService,
  type PlatformOverview,
} from '@/services/superadmin.service';
import { Button, buttonVariants } from '@/components/ui';
import { routes } from '@/config/routes';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';
import { getApiErrorMessage } from '@/utils/errors';
import { PlatformMetric } from './PlatformMetric';
import { QuickActionCard } from './QuickActionCard';

export function SuperadminDashboardPage() {
  const [data, setData] = useState<PlatformOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const handleLoadError = useCallback((err: unknown) => {
    setError(getApiErrorMessage(err, 'Failed to load platform overview'));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await superadminService.getOverview();
      setData(res);
    } catch (err) {
      handleLoadError(err);
    } finally {
      setLoading(false);
    }
  }, [handleLoadError]);

  // Initial load (`loading` starts true, `error` null); fetchData handles "Try again".
  useEffect(() => {
    superadminService
      .getOverview()
      .then(setData)
      .catch(handleLoadError)
      .finally(() => setLoading(false));
  }, [handleLoadError]);

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
      <PageHeader
        title="Platform overview"
        description="How many restaurants, websites and guest visits the platform has."
        actions={
          <>
            <Button variant="secondary" onClick={fetchData}>
              Refresh
            </Button>
            <Link href={routes.superadmin.analytics} className={buttonVariants({ variant: "primary" })}>
              Open analytics
            </Link>
          </>
        }
      />
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
              { label: 'Super', value: data.users.by_role.superadmin },
            ]}
            icon={<PiUsers className="size-5" />}
            highlight
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PlatformMetric
            title="Websites"
            value={data.workspaces.total}
            sub="Restaurant websites"
            details={[
              { label: 'With a web address', value: data.workspaces.with_public_slug },
            ]}
            icon={<PiGlobeBold className="size-5" />}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PlatformMetric
            title="Businesses"
            value={data.businesses.total}
            sub="Restaurant businesses"
            details={[
              { label: 'Active', value: data.businesses.active },
            ]}
            icon={<PiBuildingBold className="size-5" />}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PlatformMetric
            title="Guest visits"
            value={data.analytics_in_period.total_events}
            sub="Activity in period"
            details={[
              { label: 'Visitors', value: data.analytics_in_period.distinct_visitors },
            ]}
            icon={<PiChartLineUpBold className="size-5" />}
          />
        </motion.div>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2">
          <QuickActionCard
            title="Restaurants"
            description="Drill into specific user profiles, manage tenant workspaces, and verify account security status."
            href={routes.superadmin.users}
            icon={<PiUserListBold className="size-5" />}
          />
          <QuickActionCard
            title="Analytics"
            description="Visualize cross-tenant performance, identify top-performing accounts, and monitor system-wide conversion trends."
            href={routes.superadmin.analytics}
            icon={<PiChartLineUpBold className="size-5" />}
          />
        </div>
      </div>
    </motion.div>
  );
}
