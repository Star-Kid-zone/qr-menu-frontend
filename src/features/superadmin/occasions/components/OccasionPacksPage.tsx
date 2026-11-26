'use client';

import { useState } from 'react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { LoadErrorNotice } from '@/components/feedback/LoadErrorNotice';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, Input, toast } from '@/components/ui';
import { superadminService, type OccasionPackWording } from '@/services/superadmin.service';
import { getApiErrorMessage } from '@/utils/errors';
import { OCCASION_REGIONS, occasionsByRegion } from '@/components/site-system/occasions/definitions';
import { SiteIcon } from '@/components/site-system/icons/SiteIcon';
import { OCCASION_REGION_LABELS } from '@/constants/workspace.constants';

type Packs = Record<string, OccasionPackWording>;

const REGION_LABEL = OCCASION_REGION_LABELS;

/**
 * Superadmin: the wording each occasion suggests to owners — the banner and
 * the name of a specials category. Empty fields use the shipped wording
 * (shown as the placeholder). Colours and decorations are fixed: they are
 * checked for readability.
 */
export function OccasionPacksPage() {
  const [saved, setSaved] = useState<Packs>({});
  const [draft, setDraft] = useState<Packs>({});
  const [saving, setSaving] = useState(false);
  const groups = occasionsByRegion();

  // The page edits a draft afterwards, so the load copies the saved wording into local state.
  const { loading, error: loadError, refetch } = useAsyncData(
    async () => {
      const p = await superadminService.getOccasionPacks();
      const packs = p && typeof p === 'object' ? p : {};
      setSaved(packs);
      setDraft(packs);
      return packs;
    },
    [],
    'Could not load the occasion wording.',
  );

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const setField = (id: string, field: keyof OccasionPackWording, value: string) =>
    setDraft((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));

  const save = async () => {
    try {
      setSaving(true);
      const result = await superadminService.saveOccasionPacks(draft);
      setSaved(result);
      setDraft(result);
      toast.success('Occasion wording saved.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save the occasion wording.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Occasion wording"
        description="The banner and specials category each festival suggests to owners. Leave a field empty to use the wording shown in grey. Owners can still change it for their own site."
        actions={
          <Button onClick={save} disabled={!dirty || saving} loading={saving}>
            Save wording
          </Button>
        }
      />

      {loadError && !loading ? (
        <LoadErrorNotice title="We couldn't load the occasion wording" message={loadError} onRetry={refetch} />
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Loading wording…</p>
      ) : (
        OCCASION_REGIONS.map((region) => (
          <section key={region} aria-labelledby={`region-${region}`} className="space-y-3">
            <h2 id={`region-${region}`} className="text-body-medium text-foreground">{REGION_LABEL[region]}</h2>
            <ul className="space-y-3">
              {groups[region].map((occ) => (
                <li key={occ.id} className="rounded-xl border bg-card p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full" style={{ background: occ.tints[0], color: occ.ink }}>
                      <SiteIcon name={occ.badgeIcon} size={18} iconStyle="line" />
                    </span>
                    <p className="font-medium text-foreground">{occ.label}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-sm">
                      <span className="text-muted-foreground">Suggested banner</span>
                      <Input value={draft[occ.id]?.banner ?? ''} maxLength={120} placeholder={occ.bannerSuggestion} onChange={(e) => setField(occ.id, 'banner', e.target.value)} />
                    </label>
                    <label className="space-y-1 text-sm">
                      <span className="text-muted-foreground">Suggested specials category</span>
                      <Input value={draft[occ.id]?.specialsCategory ?? ''} maxLength={60} placeholder={occ.specialsCategorySuggestion} onChange={(e) => setField(occ.id, 'specialsCategory', e.target.value)} />
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
