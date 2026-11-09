'use client';

// Recharts injects these props into a custom tooltip `content` element.
interface TimelinePoint {
  date?: string;
  visitors?: number;
  events?: number;
  clicks?: number;
  searches?: number;
}

interface TimelineTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: TimelinePoint }>;
  label?: string | number;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value: number }>;
}

export function CustomTimelineTooltip({ active, payload, label }: TimelineTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-caption">
        <p className="font-bold text-foreground mb-2 border-b border-border pb-1">{data?.date || label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-info font-semibold">
              <span className="size-2 rounded-full bg-info" /> Unique Visitors:
            </span>
            <span className="font-mono font-bold text-foreground">{data?.visitors?.toLocaleString() ?? 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-primary font-semibold">
              <span className="size-2 rounded-full bg-primary" /> Gross Events:
            </span>
            <span className="font-mono font-bold text-foreground">{data?.events?.toLocaleString() ?? 0}</span>
          </div>
          {data?.clicks !== undefined && (
            <div className="flex items-center justify-between gap-4 text-muted-foreground text-caption pt-1 border-t border-border/50">
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

export function CustomPieTooltip({ active, payload }: PieTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-caption font-bold">
        <span className="text-muted-foreground">{data.name}: </span>
        <span className="text-foreground font-mono">{data.value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
}
