'use client';

import React from 'react';
import { PiPlusBold, PiTrashBold } from 'react-icons/pi';
import { Button } from '@/components/ui';
import { AMENITY_LABELS } from '@/components/site-system/kit/content';
import type { BlueprintContent, MenuBlueprint } from '@/services/superadmin.service';

const EMPTY: BlueprintContent = { amenities: [], awards: [], team: [], events: [] };
const INPUT = 'w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary';

/**
 * Website content starter template for a blueprint: amenities, awards, team, and events.
 * Enables Superadmins to configure starter sample data that newly registered restaurants receive.
 */
export function BlueprintContentSection({
  content,
  setFormData,
}: {
  content?: BlueprintContent;
  setFormData: React.Dispatch<React.SetStateAction<MenuBlueprint>>;
}) {
  const c = content ?? EMPTY;
  const set = (patch: Partial<BlueprintContent>) =>
    setFormData((prev) => ({ ...prev, content: { ...EMPTY, ...prev.content, ...patch } }));

  const chosenMap = new Map(c.amenities.map((a) => [a.id, a.note ?? '']));

  return (
    <div className="space-y-6">
      {/* Amenities Section */}
      <section className="space-y-3 rounded-xl border border-border bg-muted/10 p-4">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground">Amenities</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Included restaurant amenities shown with icons on the public storefront. Tenants can add, modify, or remove them later.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(AMENITY_LABELS).map(([id, label]) => {
            const isChecked = chosenMap.has(id);
            return (
              <div
                key={id}
                className={`rounded-lg border p-2.5 transition-colors ${
                  isChecked ? 'border-primary/50 bg-primary/5' : 'border-border bg-background'
                }`}
              >
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        set({ amenities: [...c.amenities, { id }] });
                      } else {
                        set({ amenities: c.amenities.filter((a) => a.id !== id) });
                      }
                    }}
                    className="size-3.5 rounded border-border accent-primary"
                  />
                  <span>{label}</span>
                </label>
                {isChecked ? (
                  <input
                    type="text"
                    value={chosenMap.get(id) ?? ''}
                    placeholder="Optional note (e.g. Fridays only)"
                    onChange={(e) => {
                      const noteVal = e.target.value;
                      set({
                        amenities: c.amenities.map((a) => (a.id === id ? { ...a, note: noteVal || undefined } : a)),
                      });
                    }}
                    className={`mt-2 ${INPUT}`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Awards & Press Section */}
      <section className="space-y-3 rounded-xl border border-border bg-muted/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground">Awards & Press</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Preloaded accolades, Michelin mentions, or food critic writeups for this blueprint.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => set({ awards: [...c.awards, { title: '' }] })}
            leftIcon={<PiPlusBold size={12} />}
          >
            Add Award
          </Button>
        </div>

        {c.awards.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No starter awards defined. Tenants will start with an empty awards section.
          </p>
        ) : (
          <div className="space-y-2.5">
            {c.awards.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                {a.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.logoUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-md border border-border bg-muted object-contain p-0.5"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="grid flex-1 gap-2 sm:grid-cols-3">
                  <input
                    placeholder="Award / article title *"
                    value={a.title}
                    onChange={(e) =>
                      set({ awards: c.awards.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)) })
                    }
                    className={INPUT}
                  />
                  <input
                    placeholder="Publisher (e.g. City Food Guide)"
                    value={a.publisher ?? ''}
                    onChange={(e) =>
                      set({
                        awards: c.awards.map((r, j) => (j === i ? { ...r, publisher: e.target.value || undefined } : r)),
                      })
                    }
                    className={INPUT}
                  />
                  <input
                    type="number"
                    placeholder="Year (e.g. 2024)"
                    value={a.year ?? ''}
                    onChange={(e) =>
                      set({
                        awards: c.awards.map((r, j) => (j === i ? { ...r, year: e.target.value ? Number(e.target.value) : undefined } : r)),
                      })
                    }
                    className={INPUT}
                  />
                  <input
                    placeholder="Article link (https://...)"
                    value={a.url ?? ''}
                    onChange={(e) =>
                      set({ awards: c.awards.map((r, j) => (j === i ? { ...r, url: e.target.value || undefined } : r)) })
                    }
                    className={`sm:col-span-2 ${INPUT}`}
                  />
                  <input
                    placeholder="Badge / logo image link (https://...)"
                    value={a.logoUrl ?? ''}
                    onChange={(e) =>
                      set({
                        awards: c.awards.map((r, j) => (j === i ? { ...r, logoUrl: e.target.value || undefined } : r)),
                      })
                    }
                    className={INPUT}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => set({ awards: c.awards.filter((_, j) => j !== i) })}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Remove award"
                >
                  <PiTrashBold size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Team Members Section */}
      <section className="space-y-3 rounded-xl border border-border bg-muted/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground">Team Members</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Preloaded key staff (e.g. Head Chef, Sommelier, Pastry Artisan) demonstrating the team showcase.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => set({ team: [...c.team, { name: '' }] })}
            leftIcon={<PiPlusBold size={12} />}
          >
            Add Person
          </Button>
        </div>

        {c.team.length === 0 ? (
          <p className="rounded-lg border border-border border-dashed p-4 text-center text-xs text-muted-foreground">
            No starter team members defined. Tenants will start with an empty team section.
          </p>
        ) : (
          <div className="space-y-2.5">
            {c.team.map((m, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                {m.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photoUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-full border border-border bg-muted object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="grid flex-1 gap-2 sm:grid-cols-3">
                  <input
                    placeholder="Name *"
                    value={m.name}
                    onChange={(e) =>
                      set({ team: c.team.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)) })
                    }
                    className={INPUT}
                  />
                  <input
                    placeholder="Role (e.g. Executive Chef)"
                    value={m.role ?? ''}
                    onChange={(e) =>
                      set({ team: c.team.map((r, j) => (j === i ? { ...r, role: e.target.value || undefined } : r)) })
                    }
                    className={INPUT}
                  />
                  <input
                    placeholder="Photo link (https://...)"
                    value={m.photoUrl ?? ''}
                    onChange={(e) =>
                      set({ team: c.team.map((r, j) => (j === i ? { ...r, photoUrl: e.target.value || undefined } : r)) })
                    }
                    className={INPUT}
                  />
                  <input
                    placeholder="Short bio or culinary background"
                    value={m.bio ?? ''}
                    onChange={(e) =>
                      set({ team: c.team.map((r, j) => (j === i ? { ...r, bio: e.target.value || undefined } : r)) })
                    }
                    className={`sm:col-span-3 ${INPUT}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => set({ team: c.team.filter((_, j) => j !== i) })}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Remove person"
                >
                  <PiTrashBold size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Events Section */}
      <section className="space-y-3 rounded-xl border border-border bg-muted/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground">Upcoming Events</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Preloaded tasting menus, live music, or workshops. Dated relative to the tenant's registration day at 7 pm.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => set({ events: [...c.events, { title: '', startsInDays: 7, durationHours: 3 }] })}
            leftIcon={<PiPlusBold size={12} />}
          >
            Add Event
          </Button>
        </div>

        {c.events.length === 0 ? (
          <p className="rounded-lg border border-border border-dashed p-4 text-center text-xs text-muted-foreground">
            No starter events defined. Tenants will start with an empty events section.
          </p>
        ) : (
          <div className="space-y-2.5">
            {c.events.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                {ev.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.imageUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-md border border-border bg-muted object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="grid flex-1 gap-2 sm:grid-cols-3">
                  <input
                    placeholder="Event title *"
                    value={ev.title}
                    onChange={(e) =>
                      set({ events: c.events.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)) })
                    }
                    className={INPUT}
                  />
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="number"
                      min={0}
                      max={365}
                      value={ev.startsInDays}
                      onChange={(e) =>
                        set({
                          events: c.events.map((r, j) => (j === i ? { ...r, startsInDays: Number(e.target.value) || 0 } : r)),
                        })
                      }
                      className={`w-20 ${INPUT}`}
                    />
                    <span>days after sign-up</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <input
                      type="number"
                      min={1}
                      max={72}
                      value={ev.durationHours ?? ''}
                      placeholder="3"
                      onChange={(e) =>
                        set({
                          events: c.events.map((r, j) => (j === i ? { ...r, durationHours: e.target.value ? Number(e.target.value) : undefined } : r)),
                        })
                      }
                      className={`w-16 ${INPUT}`}
                    />
                    <span>hours long</span>
                  </label>
                  <input
                    placeholder="Poster / photo image link (https://...)"
                    value={ev.imageUrl ?? ''}
                    onChange={(e) =>
                      set({
                        events: c.events.map((r, j) => (j === i ? { ...r, imageUrl: e.target.value || undefined } : r)),
                      })
                    }
                    className={INPUT}
                  />
                  <input
                    placeholder="Booking / details link (https://...)"
                    value={ev.linkUrl ?? ''}
                    onChange={(e) =>
                      set({
                        events: c.events.map((r, j) => (j === i ? { ...r, linkUrl: e.target.value || undefined } : r)),
                      })
                    }
                    className={`sm:col-span-2 ${INPUT}`}
                  />
                  <input
                    placeholder="Event details / description"
                    value={ev.description ?? ''}
                    onChange={(e) =>
                      set({
                        events: c.events.map((r, j) => (j === i ? { ...r, description: e.target.value || undefined } : r)),
                      })
                    }
                    className={`sm:col-span-3 ${INPUT}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => set({ events: c.events.filter((_, j) => j !== i) })}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Remove event"
                >
                  <PiTrashBold size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
