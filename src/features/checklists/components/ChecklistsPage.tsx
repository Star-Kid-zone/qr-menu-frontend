'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PiCheckCircleBold, PiListChecksBold } from 'react-icons/pi';
import { cn } from '@/utils/cn';
import { TodayTab } from './TodayTab';
import { TemplatesTab } from './TemplatesTab';

function ChecklistsPageContent() {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission('dashboard');
  const [tab, setTab] = useState<'today' | 'templates'>('today');

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader title="Checklists" description="Opening, closing, and daily prep tasks." />

      {canManage && (
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
          {(['today', 'templates'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all',
                tab === t ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {t === 'today' ? (
                <span className="inline-flex items-center gap-1.5"><PiCheckCircleBold size={14} /> Today</span>
              ) : (
                <span className="inline-flex items-center gap-1.5"><PiListChecksBold size={14} /> Templates</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
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
