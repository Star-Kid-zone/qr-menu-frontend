'use client';

import { Card, Badge } from '@/components/ui';
import { PiSparkleBold, PiMagnifyingGlassBold } from 'react-icons/pi';
import type { SearchDemandTabProps } from '../types';

export function SearchDemandTab({ platform }: SearchDemandTabProps) {
  return (
    <div className="space-y-6">
      {/* Opportunity Banner */}
      <div className="rounded-2xl border border-warning/30 bg-gradient-to-r from-warning/10 via-warning/5 to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/20 text-warning-foreground">
            <PiSparkleBold className="size-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-h2 font-bold text-foreground">Searches with no matching dish</h3>
              <Badge tone="warning">High Commercial Value</Badge>
            </div>
            <p className="text-body text-muted-foreground">
              Zero-result searches reveal dishes and drinks that guests actively searched for but could not find on restaurant menus.
              Superadmins can share these insights with restaurant owners to expand their menus and satisfy unmet customer demand.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Searches */}
        <Card className="flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-h2 text-foreground">Top Guest Searches</h2>
              <p className="text-caption text-muted-foreground">Most frequent search terms entered across all menus</p>
            </div>
            <Badge tone="primary">{(platform.top_searches || []).length} Queries</Badge>
          </div>

          {(platform.top_searches && platform.top_searches.length > 0) ? (
            <div className="space-y-3">
              {platform.top_searches.map((s, idx) => {
                const topCount = platform.top_searches?.[0]?.count || 1;
                const pct = Math.round((s.count / topCount) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-body">
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded bg-muted text-caption font-bold text-muted-foreground">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-foreground capitalize">“{s.query}”</span>
                      </div>
                      <span className="font-mono font-bold text-foreground">{s.count.toLocaleString()} searches</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
                      <div className="h-full rounded-full bg-info" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-1 min-h-[220px] flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
              <PiMagnifyingGlassBold className="size-8 text-muted-foreground mb-2" />
              <p className="text-body font-semibold text-foreground">No searches recorded</p>
              <p className="text-caption text-muted-foreground max-w-sm mt-1">
                Guests have not performed menu searches during the selected period.
              </p>
            </div>
          )}
        </Card>

        {/* Zero Result Searches (Menu Gaps) */}
        <Card className="flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-h2 text-foreground">Unmet Demand (Zero-Results)</h2>
              <p className="text-caption text-muted-foreground">Searches that returned 0 dishes across menus</p>
            </div>
            <Badge tone="warning">Menu Gaps</Badge>
          </div>

          {(platform.zero_result_searches && platform.zero_result_searches.length > 0) ? (
            <div className="space-y-3">
              {platform.zero_result_searches.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-warning/20 bg-warning/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground font-bold text-caption">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground capitalize">“{s.query}”</p>
                      <p className="text-caption text-muted-foreground">0 matches in catalog</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-foreground">{s.count.toLocaleString()}</span>
                    <span className="block text-caption text-warning-foreground font-semibold">Missed orders</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 min-h-[220px] flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
              <PiSparkleBold className="size-8 text-success mb-2" />
              <p className="text-body font-semibold text-foreground">No menu gaps detected</p>
              <p className="text-caption text-muted-foreground max-w-sm mt-1">
                Guests are finding matching items for all searches in the selected period!
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
