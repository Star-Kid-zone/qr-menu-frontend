'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SubTabPills } from '@/components/ui/SubTabPills';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { TodayTab } from './TodayTab';
import { TemplatesTab } from './TemplatesTab';

type ChecklistTab = 'today' | 'templates';

const TABS: { id: ChecklistTab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'templates', label: 'Edit checklists' },
];

function ChecklistsPageContent() {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission('dashboard');
  const [tab, setTab] = useState<ChecklistTab>('today');

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader title="Checklists" description="Opening, closing, and daily prep tasks." />

      {canManage && (
        <div>
          <SubTabPills options={TABS} active={tab} onChange={setTab} />
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        {tab === 'today' || !canManage ? <TodayTab /> : <TemplatesTab />}
      </div>
    </div>
  );
}

export function ChecklistsPage() {
  return (
    <PermissionGuard requiredUnit="operations">
      <ChecklistsPageContent />
    </PermissionGuard>
  );
}
