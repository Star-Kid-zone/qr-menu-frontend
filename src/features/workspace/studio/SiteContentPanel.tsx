"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { cn } from "@/utils/cn";
import {
  PiCheckBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiTrashBold,
} from "react-icons/pi";
import { Button, Input, Textarea, toast } from "@/components/ui";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { getApiErrorMessage } from "@/utils/errors";
import { datetimeLocalToIso, isoToDatetimeLocal } from "@/utils/workspace.utils";
import { menuService } from "@/services/menu.service";
import { WORKSPACE_CURATED_PICKS } from "@/constants/workspace.constants";
import { SITE_CONTENT_TABS } from "@/constants/site.constants";
import {
  siteContentService,
  type Amenity,
  type Award,
  type AwardInput,
  type SiteEvent,
  type SiteEventInput,
  type TeamMember,
  type TeamMemberInput,
} from "@/services/siteContent.service";
import type { SiteDocument, SectionInstance } from "@/components/templates/sections/types";
import { AMENITY_IDS, type AmenityId } from "@/components/site-system/types";
import { AMENITY_LABELS } from "@/components/site-system/kit/content";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";

/**
 * Owner content for the site-system sections (PLAN §2.9): awards and press,
 * team, events, amenities, and the hand-picked list. The first four save
 * straight away (their own tables); the hand-picked list lives in the site
 * document and saves with the page.
 */

type Tab = "awards" | "team" | "events" | "amenities" | "picks";
const TABS: Array<{ id: Tab; label: string }> = SITE_CONTENT_TABS as unknown as Array<{ id: Tab; label: string }>;

export function SiteContentPanel({ value, disabled, onChange }: { value: SiteDocument | null; disabled: boolean; onChange: (doc: SiteDocument) => void }) {
  const [tab, setTab] = useState<Tab>("awards");
  return (
    <div className="space-y-4">
      <p className="text-caption text-muted-foreground">
        Each of these is its own section on your page. Turn the section on under Sections once you have added something.
      </p>
      <div role="tablist" aria-label="Content" className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium", tab === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "awards" ? <AwardsEditor disabled={disabled} /> : null}
      {tab === "team" ? <TeamEditor disabled={disabled} /> : null}
      {tab === "events" ? <EventsEditor disabled={disabled} /> : null}
      {tab === "amenities" ? <AmenitiesEditor disabled={disabled} /> : null}
      {tab === "picks" ? <PicksEditor value={value} disabled={disabled} onChange={onChange} /> : null}
    </div>
  );
}

/* ───────────────────────── generic list editor ───────────────────────── */

interface Field {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "number" | "url" | "datetime";
  required?: boolean;
  max?: number;
  placeholder?: string;
}

interface RecordEditorProps<T extends { id: string; isVisible: boolean }> {
  noun: string;
  fields: Field[];
  disabled: boolean;
  load: () => Promise<T[]>;
  create: (data: Record<string, unknown>) => Promise<T>;
  update: (id: string, data: Record<string, unknown>) => Promise<T>;
  remove: (id: string) => Promise<unknown>;
  title: (row: T) => string;
  subtitle?: (row: T) => string;
  image?: (row: T) => string | null | undefined;
  /** Row → form values (strings). */
  toForm: (row: T) => Record<string, string>;
  /** Form values → request body. */
  toBody: (form: Record<string, string>) => Record<string, unknown>;
}

function RecordEditor<T extends { id: string; isVisible: boolean }>(props: RecordEditorProps<T>) {
  const { noun, fields, disabled } = props;
  const [rows, setRows] = useState<T[] | null>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const { confirm, confirmDialog } = useConfirmDialog();
  const { load } = props;

  useEffect(() => {
    load()
      .then(setRows)
      .catch((err: unknown) => {
        setRows([]);
        toast.error(getApiErrorMessage(err, `Could not load ${noun}s.`));
      });
  }, [load, noun]);

  const open = (row: T | null) => {
    setEditing(row ? row.id : "new");
    setForm(row ? props.toForm(row) : {});
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !form[f.key]?.trim());
    if (missing) {
      toast.error(`Add the ${missing.label.toLowerCase()}.`);
      return;
    }
    try {
      setBusy(true);
      const body = props.toBody(form);
      if (editing === "new") {
        const created = await props.create(body);
        setRows((r) => [...(r ?? []), created]);
        toast.success(`${noun} added.`);
      } else if (editing) {
        const saved = await props.update(editing, body);
        setRows((r) => (r ?? []).map((x) => (x.id === saved.id ? saved : x)));
        toast.success(`${noun} saved.`);
      }
      setEditing(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, `Could not save the ${noun.toLowerCase()}.`));
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (row: T) => {
    try {
      const saved = await props.update(row.id, { isVisible: !row.isVisible });
      setRows((r) => (r ?? []).map((x) => (x.id === saved.id ? saved : x)));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not change that."));
    }
  };

  const del = async (row: T) => {
    if (!(await confirm({ title: `Remove ${props.title(row)}?`, description: "It disappears from your page straight away.", confirmLabel: "Remove", tone: "destructive" }))) return;
    try {
      await props.remove(row.id);
      setRows((r) => (r ?? []).filter((x) => x.id !== row.id));
      toast.success(`${noun} removed.`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, `Could not remove the ${noun.toLowerCase()}.`));
    }
  };

  return (
    <div className="space-y-4">
      {confirmDialog}
      {rows === null ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-sm text-muted-foreground animate-pulse">Loading {noun.toLowerCase()}s…</p>
        </div>
      ) : rows.length === 0 && editing !== "new" ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="text-sm font-semibold text-foreground">No {noun.toLowerCase()}s added yet</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Add sample items to highlight awards, staff, or upcoming events on your storefront.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={disabled}
            onClick={() => open(null)}
            leftIcon={<PiPlusBold className="size-4" />}
            className="mt-4"
          >
            Add {noun.toLowerCase()}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              {rows.length} {noun.toLowerCase()}{rows.length === 1 ? "" : "s"} listed
            </p>
            {!editing ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={disabled}
                onClick={() => open(null)}
                leftIcon={<PiPlusBold className="size-4" />}
              >
                Add {noun.toLowerCase()}
              </Button>
            ) : null}
          </div>

          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3 p-3 transition-colors hover:bg-muted/10">
                {props.image?.(row) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={props.image(row)!}
                    alt=""
                    className="size-11 shrink-0 rounded-lg object-cover border border-border bg-muted"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-medium", row.isVisible ? "text-foreground" : "text-muted-foreground line-through")}>{props.title(row)}</p>
                  {props.subtitle ? <p className="truncate text-xs text-muted-foreground">{props.subtitle(row)}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => toggle(row)}
                    leftIcon={row.isVisible ? <PiEyeSlashBold className="size-3.5" /> : <PiEyeBold className="size-3.5" />}
                  >
                    {row.isVisible ? "Hide" : "Show"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => open(row)}
                    leftIcon={<PiPencilSimpleBold className="size-3.5" />}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => del(row)}
                    leftIcon={<PiTrashBold className="size-3.5 text-destructive" />}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {editing ? (
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="text-sm font-semibold text-foreground">
              {editing === "new" ? `Add new ${noun.toLowerCase()}` : `Edit ${noun.toLowerCase()}`}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className={cn("space-y-1.5 text-sm", f.kind === "textarea" ? "sm:col-span-2" : "")}>
                <span className="text-xs font-medium text-muted-foreground">
                  {f.label}{f.required ? " *" : " (optional)"}
                </span>
                {f.kind === "textarea" ? (
                  <Textarea value={form[f.key] ?? ""} maxLength={f.max} rows={3} placeholder={f.placeholder} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} />
                ) : (
                  <Input
                    type={f.kind === "number" ? "number" : f.kind === "url" ? "url" : f.kind === "datetime" ? "datetime-local" : "text"}
                    value={form[f.key] ?? ""}
                    maxLength={f.max}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" loading={busy} disabled={disabled} leftIcon={<PiCheckBold className="size-4" />}>
              {editing === "new" ? `Add ${noun.toLowerCase()}` : "Save changes"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const opt = (v: string) => (v.trim() ? v.trim() : null);

function AwardsEditor({ disabled }: { disabled: boolean }) {
  const load = useMemo(() => async () => (await siteContentService.listAwards()).data, []);
  return (
    <RecordEditor<Award>
      noun="Award"
      disabled={disabled}
      fields={[
        { key: "title", label: "Award or article", required: true, max: 120, placeholder: "Best new restaurant" },
        { key: "publisher", label: "Given by", max: 120, placeholder: "City Food Guide" },
        { key: "year", label: "Year", kind: "number" },
        { key: "url", label: "Link", kind: "url", placeholder: "https://" },
        { key: "logoUrl", label: "Logo or badge image link", kind: "url", placeholder: "https://" },
      ]}
      load={load}
      create={async (b) => (await siteContentService.createAward(b as AwardInput & { title: string })).data}
      update={async (id, b) => (await siteContentService.updateAward(id, b)).data}
      remove={(id) => siteContentService.removeAward(id)}
      title={(r) => r.title}
      subtitle={(r) => [r.publisher, r.year].filter(Boolean).join(", ")}
      image={(r) => r.logoUrl}
      toForm={(r) => ({ title: r.title, publisher: s(r.publisher), year: s(r.year), url: s(r.url), logoUrl: s(r.logoUrl) })}
      toBody={(f) => ({ title: f.title.trim(), publisher: opt(f.publisher ?? ""), year: f.year ? Number(f.year) : null, url: f.url?.trim() ?? "", logoUrl: f.logoUrl?.trim() ?? "" })}
    />
  );
}

function TeamEditor({ disabled }: { disabled: boolean }) {
  const load = useMemo(() => async () => (await siteContentService.listTeam()).data, []);
  return (
    <RecordEditor<TeamMember>
      noun="Team member"
      disabled={disabled}
      fields={[
        { key: "name", label: "Name", required: true, max: 80 },
        { key: "role", label: "Role", max: 80, placeholder: "Head chef" },
        { key: "photoUrl", label: "Photo link", kind: "url", placeholder: "https://" },
        { key: "bio", label: "A line or two about them", kind: "textarea", max: 400 },
      ]}
      load={load}
      create={async (b) => (await siteContentService.createTeamMember(b as TeamMemberInput & { name: string })).data}
      update={async (id, b) => (await siteContentService.updateTeamMember(id, b)).data}
      remove={(id) => siteContentService.removeTeamMember(id)}
      title={(r) => r.name}
      subtitle={(r) => s(r.role)}
      image={(r) => r.photoUrl}
      toForm={(r) => ({ name: r.name, role: s(r.role), photoUrl: s(r.photoUrl), bio: s(r.bio) })}
      toBody={(f) => ({ name: f.name.trim(), role: opt(f.role ?? ""), photoUrl: f.photoUrl?.trim() ?? "", bio: opt(f.bio ?? "") })}
    />
  );
}

function EventsEditor({ disabled }: { disabled: boolean }) {
  const load = useMemo(() => async () => (await siteContentService.listEvents()).data, []);
  return (
    <RecordEditor<SiteEvent>
      noun="Event"
      disabled={disabled}
      fields={[
        { key: "title", label: "What's on", required: true, max: 120, placeholder: "Live jazz night" },
        { key: "startsAt", label: "Starts", kind: "datetime", required: true },
        { key: "endsAt", label: "Ends", kind: "datetime" },
        { key: "imageUrl", label: "Event poster or photo link", kind: "url", placeholder: "https://" },
        { key: "linkUrl", label: "Link for details or booking", kind: "url", placeholder: "https://" },
        { key: "description", label: "Details", kind: "textarea", max: 600 },
      ]}
      load={load}
      create={async (b) => (await siteContentService.createEvent(b as SiteEventInput & { title: string; startsAt: string })).data}
      update={async (id, b) => (await siteContentService.updateEvent(id, b)).data}
      remove={(id) => siteContentService.removeEvent(id)}
      title={(r) => r.title}
      subtitle={(r) => new Date(r.startsAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
      image={(r) => r.imageUrl}
      toForm={(r) => ({ title: r.title, startsAt: isoToDatetimeLocal(r.startsAt), endsAt: isoToDatetimeLocal(r.endsAt), imageUrl: s(r.imageUrl), linkUrl: s(r.linkUrl), description: s(r.description) })}
      toBody={(f) => ({
        title: f.title.trim(),
        startsAt: datetimeLocalToIso(f.startsAt),
        endsAt: datetimeLocalToIso(f.endsAt) ?? null,
        imageUrl: f.imageUrl?.trim() ?? "",
        linkUrl: f.linkUrl?.trim() ?? "",
        description: opt(f.description ?? ""),
      })}
    />
  );
}

/* ───────────────────────── amenities ───────────────────────── */

function AmenitiesEditor({ disabled }: { disabled: boolean }) {
  const [list, setList] = useState<Amenity[] | null>(null);
  const [savedList, setSavedList] = useState<Amenity[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<boolean>(false);

  useEffect(() => {
    siteContentService
      .getAmenities()
      .then((r) => {
        const data = Array.isArray(r.data) ? r.data : [];
        setList(data);
        setSavedList(data);
      })
      .catch((err: unknown) => {
        setList([]);
        setSavedList([]);
        toast.error(getApiErrorMessage(err, "Could not load your amenities."));
      });
  }, []);

  if (!list) return <p className="text-sm text-muted-foreground animate-pulse">Loading amenities…</p>;

  const has = (id: AmenityId) => list.some((a) => a.id === id);

  const isDirty = savedList !== null && JSON.stringify(list) !== JSON.stringify(savedList);

  const saveList = async (dataToSave = list) => {
    try {
      setSaving(true);
      const res = await siteContentService.setAmenities(dataToSave);
      const updated = Array.isArray(res.data) ? res.data : dataToSave;
      setList(updated);
      setSavedList(updated);
      setLastSaved(true);
      toast.success("Amenities saved.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not save your amenities."));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id: AmenityId) => {
    const next = has(id) ? (list ?? []).filter((a) => a.id !== id) : [...(list ?? []), { id }];
    setList(next);
    // Instant save on toggle for a frictionless UX
    await saveList(next);
  };

  const note = (id: AmenityId, text: string) => {
    setList((l) => (l ?? []).map((a) => (a.id === id ? { ...a, note: text || undefined } : a)));
  };

  return (
    <div className="space-y-4">
      {/* Amenities Header Bar with Prominent Save Button and Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3 sm:p-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Amenities</h3>
            {saving ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary animate-pulse">
                Saving…
              </span>
            ) : isDirty ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                Unsaved note changes
              </span>
            ) : lastSaved || list.length > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <PiCheckBold className="size-3" />
                {list.length} selected
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Shown with icons on your website footer and details. Checkboxes save automatically, or use the Save button.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => saveList()}
          loading={saving}
          disabled={disabled}
          leftIcon={<PiCheckBold className="size-4" />}
        >
          Save amenities
        </Button>
      </div>

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {AMENITY_IDS.map((id) => {
          const on = has(id);
          return (
            <li
              key={id}
              className={cn(
                "rounded-xl border p-3 transition-colors",
                on ? "border-primary/60 bg-primary/5 shadow-2xs" : "border-border bg-card hover:bg-muted/10"
              )}
            >
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={on}
                  disabled={disabled || saving}
                  onChange={() => toggle(id)}
                  className="size-4 rounded border-border accent-primary"
                />
                <SiteIcon name={id} size={18} iconStyle="line" />
                <span className={on ? "text-foreground font-semibold" : "text-muted-foreground"}>
                  {AMENITY_LABELS[id]}
                </span>
              </label>
              {on ? (
                <div className="mt-2.5 pl-6">
                  <Input
                    className="h-8 text-xs bg-background"
                    maxLength={80}
                    placeholder="A short note (e.g. Free for guests, or Fridays only)"
                    value={list.find((a) => a.id === id)?.note ?? ""}
                    onChange={(e) => note(id, e.target.value)}
                    onBlur={() => saveList()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveList();
                      }
                    }}
                    disabled={disabled}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Footer summary */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          {list.length} of {AMENITY_IDS.length} amenities enabled.
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── hand-picked list ───────────────────────── */

const PICKS_TYPE = WORKSPACE_CURATED_PICKS.TYPE;
const MAX_PICKS = WORKSPACE_CURATED_PICKS.MAX;

interface MenuRow {
  id: number | string;
  item: string;
  category?: string;
  price?: string;
  imageUrl?: string | null;
  image_url?: string | null;
}

/** The curated-list section in the landing page (created hidden-off on first edit). */
export function withPicks(doc: SiteDocument | null, patch: { title?: string; itemIds?: string[] }): SiteDocument {
  const next: SiteDocument = { ...(doc ?? {}), version: 1 };
  const sections: SectionInstance[] = [...(next.landing?.sections ?? [])];
  const i = sections.findIndex((x) => x.type === PICKS_TYPE);
  const current = i >= 0 ? sections[i] : { id: PICKS_TYPE, type: PICKS_TYPE, props: {} };
  const props = { ...(current.props ?? {}), ...patch };
  const updated = { ...current, props };
  if (i >= 0) sections[i] = updated;
  else sections.push(updated);
  next.landing = { ...(next.landing ?? {}), sections };
  return next;
}

function PicksEditor({ value, disabled, onChange }: { value: SiteDocument | null; disabled: boolean; onChange: (doc: SiteDocument) => void }) {
  const [items, setItems] = useState<MenuRow[] | null>(null);
  useEffect(() => {
    menuService
      .getMenus()
      .then((r) => setItems(Array.isArray(r.data) ? (r.data as MenuRow[]) : []))
      .catch((err: unknown) => {
        setItems([]);
        toast.error(getApiErrorMessage(err, "Could not load your menu."));
      });
  }, []);
  const section = value?.landing?.sections.find((x) => x.type === PICKS_TYPE);
  const title = typeof section?.props?.title === "string" ? section.props.title : "";
  const ids = Array.isArray(section?.props?.itemIds) ? (section!.props!.itemIds as unknown[]).map(String) : [];
  const toggle = (id: string) => {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    if (next.length > MAX_PICKS) {
      toast.error(`Pick up to ${MAX_PICKS}.`);
      return;
    }
    onChange(withPicks(value, { itemIds: next }));
  };
  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Title</span>
        <Input value={title} maxLength={60} placeholder="Chef's picks this week" disabled={disabled} onChange={(e) => onChange(withPicks(value, { title: e.target.value }))} />
      </label>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Pick up to {MAX_PICKS}, in the order you want them.</p>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {ids.length} of {MAX_PICKS} picked
        </span>
      </div>
      {items === null ? (
        <p className="text-sm text-muted-foreground">Loading your menu…</p>
      ) : (
        <ul className="max-h-72 divide-y overflow-y-auto rounded-xl border">
          {items.map((m) => {
            const id = String(m.id);
            const n = ids.indexOf(id);
            return (
              <li key={id}>
                <label className="flex items-center gap-3 p-2.5 text-sm">
                  <input type="checkbox" checked={n >= 0} disabled={disabled} onChange={() => toggle(id)} className="size-4" />
                  {m.imageUrl || m.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(m.imageUrl || m.image_url)!}
                      alt=""
                      className="size-8 shrink-0 rounded-md object-cover border border-border bg-muted"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <span className="min-w-0 flex-1 truncate text-foreground">{m.item}</span>
                  {m.category ? <span className="shrink-0 text-xs text-muted-foreground">{m.category}</span> : null}
                  {n >= 0 ? <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{n + 1}</span> : null}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
