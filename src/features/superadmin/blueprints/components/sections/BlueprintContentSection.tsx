'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { AMENITY_LABELS } from '@/components/site-system/kit/content';
import type { BlueprintContent, MenuBlueprint } from '@/services/superadmin.service';

const EMPTY: BlueprintContent = { amenities: [], awards: [], team: [], events: [] };
const INPUT = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground';

/** One editable row list (awards, team, events) with add and remove. */
function Rows<T>({
  title,
  hint,
  rows,
  blank,
  addLabel,
  render,
  onChange,
}: {
  title: string;
  hint: string;
  rows: T[];
  blank: T;
  addLabel: string;
  render: (row: T, set: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  onChange: (rows: T[]) => void;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-muted/10 p-4">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="grid flex-1 gap-2 sm:grid-cols-3">{render(row, (patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r))), i)}</div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...rows, blank])}>
        {addLabel}
      </Button>
    </section>
  );
}

/**
 * Website content a new restaurant starts with: amenities, and optionally
 * awards, team and events. Only add press or people that are true for every
 * restaurant that will use this starter menu.
 */
export function BlueprintContentSection({
  content,
  setFormData,
}: {
  content?: BlueprintContent;
  setFormData: React.Dispatch<React.SetStateAction<MenuBlueprint>>;
}) {
  const c = content ?? EMPTY;
  const set = (patch: Partial<BlueprintContent>) => setFormData((prev) => ({ ...prev, content: { ...EMPTY, ...prev.content, ...patch } }));
  const chosen = new Set(c.amenities.map((a) => a.id));

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-xl border border-border bg-muted/10 p-4">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground">Amenities</h3>
          <p className="mt-1 text-xs text-muted-foreground">Shown with icons on the website. The owner can change them later.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {Object.entries(AMENITY_LABELS).map(([id, label]) => (
            <label key={id} className="flex items-center gap-2 text-xs text-foreground">
              <input
                type="checkbox"
                checked={chosen.has(id)}
                onChange={(e) => set({ amenities: e.target.checked ? [...c.amenities, { id }] : c.amenities.filter((a) => a.id !== id) })}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <Rows
        title="Awards and press"
        hint="Leave empty unless every restaurant using this starter menu really has it."
        rows={c.awards}
        blank={{ title: '' }}
        addLabel="Add award"
        onChange={(awards) => set({ awards })}
        render={(a, setRow) => (
          <>
            <input aria-label="Award title" placeholder="Title" value={a.title} onChange={(e) => setRow({ title: e.target.value })} className={INPUT} />
            <input aria-label="Publisher" placeholder="Publisher" value={a.publisher ?? ''} onChange={(e) => setRow({ publisher: e.target.value || undefined })} className={INPUT} />
            <input aria-label="Year" type="number" placeholder="Year" value={a.year ?? ''} onChange={(e) => setRow({ year: e.target.value ? Number(e.target.value) : undefined })} className={INPUT} />
          </>
        )}
      />

      <Rows
        title="Team"
        hint="Usually left empty: owners add their own people."
        rows={c.team}
        blank={{ name: '' }}
        addLabel="Add person"
        onChange={(team) => set({ team })}
        render={(m, setRow) => (
          <>
            <input aria-label="Name" placeholder="Name" value={m.name} onChange={(e) => setRow({ name: e.target.value })} className={INPUT} />
            <input aria-label="Role" placeholder="Role" value={m.role ?? ''} onChange={(e) => setRow({ role: e.target.value || undefined })} className={INPUT} />
            <input aria-label="Photo link" placeholder="Photo link (https://…)" value={m.photoUrl ?? ''} onChange={(e) => setRow({ photoUrl: e.target.value || undefined })} className={INPUT} />
          </>
        )}
      />

      <Rows
        title="Events"
        hint="Dated from the day the restaurant signs up, at 7 pm."
        rows={c.events}
        blank={{ title: '', startsInDays: 7 }}
        addLabel="Add event"
        onChange={(events) => set({ events })}
        render={(ev, setRow) => (
          <>
            <input aria-label="Event title" placeholder="Title" value={ev.title} onChange={(e) => setRow({ title: e.target.value })} className={INPUT} />
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input aria-label="Days after sign-up" type="number" min={0} max={365} value={ev.startsInDays} onChange={(e) => setRow({ startsInDays: Number(e.target.value) || 0 })} className={INPUT} />
              days after sign-up
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input aria-label="Length in hours" type="number" min={1} max={72} value={ev.durationHours ?? ''} onChange={(e) => setRow({ durationHours: e.target.value ? Number(e.target.value) : undefined })} className={INPUT} />
              hours
            </label>
          </>
        )}
      />
    </div>
  );
}
