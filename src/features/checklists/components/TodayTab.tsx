'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/toast';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  checklistService,
  type TodayChecklistRun,
} from '@/services/checklist.service';
import { getApiErrorMessage } from '@/utils/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import { PiCheckBold, PiListChecksBold } from 'react-icons/pi';
import { cn } from '@/utils/cn';

export function TodayTab() {
  const { data, error, refetch } = useAsyncData(
    async () => (await checklistService.today()).data,
    [],
    "Failed to load today's checklists.",
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const runs = data?.runs ?? [];
  const [pending, setPending] = useState<string | null>(null);

  const handleToggle = async (run: TodayChecklistRun, itemId: string, completed: boolean) => {
    const key = `${run.run.id}:${itemId}`;
    try {
      setPending(key);
      await checklistService.toggleItem(run.run.id, itemId, completed);
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update checklist item.'));
    } finally {
      setPending(null);
    }
  };

  if (runs.length === 0) {
    return (
      <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
        <EmptyState
          icon={<PiListChecksBold size={32} />}
          title="No active checklists"
          description="Ask a manager to create an Opening or Closing checklist template."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
      {runs.map(({ template, run }) => {
        const total = run.itemStatus.length;
        const done = run.itemStatus.filter((s) => s.completed).length;
        const allDone = total > 0 && done === total;
        return (
          <div key={run.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">{template.name}</h3>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{template.type}</p>
              </div>
              <span
                className={cn(
                  'rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
                  allDone ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-muted text-muted-foreground',
                )}
              >
                {done}/{total}
              </span>
            </div>
            <div className="space-y-1.5">
              {run.itemStatus
                .slice()
                .sort((a, b) => {
                  const ai = template.items.find((i) => i.id === a.itemId)?.order ?? 0;
                  const bi = template.items.find((i) => i.id === b.itemId)?.order ?? 0;
                  return ai - bi;
                })
                .map((status) => {
                  const item = template.items.find((i) => i.id === status.itemId);
                  if (!item) return null;
                  const key = `${run.id}:${status.itemId}`;
                  return (
                    <button
                      key={status.itemId}
                      type="button"
                      disabled={pending === key}
                      onClick={() => handleToggle({ template, run }, status.itemId, !status.completed)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-all disabled:opacity-60',
                        status.completed ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30' : 'border-border bg-muted/30 hover:bg-muted/60',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-md border',
                          status.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-border bg-card',
                        )}
                      >
                        {status.completed && <PiCheckBold size={12} />}
                      </span>
                      <span className={cn('flex-1 text-xs font-medium', status.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                        {item.required && <span className="ml-1 text-destructive">*</span>}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
