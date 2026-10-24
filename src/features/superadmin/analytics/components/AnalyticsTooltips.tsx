'use client';

export function CustomTimelineTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-caption">
        <p className="font-bold text-foreground mb-1.5 border-b border-border pb-1">{data?.date || label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-cyan-500 font-semibold">
              <span className="size-2 rounded-full bg-cyan-500" /> Unique Visitors:
            </span>
            <span className="font-mono font-bold text-foreground">{data?.visitors?.toLocaleString() ?? 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-violet-500 font-semibold">
              <span className="size-2 rounded-full bg-violet-500" /> Gross Events:
            </span>
            <span className="font-mono font-bold text-foreground">{data?.events?.toLocaleString() ?? 0}</span>
          </div>
          {data?.clicks !== undefined && (
            <div className="flex items-center justify-between gap-4 text-muted-foreground text-[10px] pt-1 border-t border-border/50">
              <span>Clicks: {data?.clicks ?? 0}</span>
              <span>Searches: {data?.searches ?? 0}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-border bg-card p-2.5 shadow-xl text-caption font-bold">
        <span className="text-muted-foreground">{data.name}: </span>
        <span className="text-foreground font-mono">{data.value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
}
