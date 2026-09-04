'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  workspaceService,
  type WorkspaceLotteryReward,
  type WorkspaceLotteryEntry,
} from '@/services/workspace.service';
import {
  PiPlusBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiTicketBold,
  PiEyeBold,
  PiEyeSlashBold,
} from 'react-icons/pi';
import { Modal } from '@/components/Modal';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/utils/errors';

export interface ListLotteryHandle {
  openNew: () => void;
}

export interface ListLotteryProps {
  embedded?: boolean;
  initialRewards?: WorkspaceLotteryReward[];
  onChanged?: () => void | Promise<void>;
}

interface RewardFormData {
  label: string;
  emoji: string;
  ratioWins: string;
  ratioPlays: string;
  isActive: boolean;
}

function createDefaultForm(defaultActive: boolean): RewardFormData {
  return { label: '', emoji: '🎁', ratioWins: '1', ratioPlays: '1000', isActive: defaultActive };
}

function RewardFormModal({
  isOpen,
  onClose,
  onSave,
  initial,
  isEdit,
  otherActiveReward,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  initial?: WorkspaceLotteryReward | null;
  isEdit: boolean;
  /** The other reward currently active, if any — only one can be active at a time. */
  otherActiveReward?: WorkspaceLotteryReward | null;
}) {
  // A brand-new reward only defaults to active if nothing else is active yet —
  // avoids an admin accidentally deactivating their live reward by mistake.
  const [form, setForm] = useState<RewardFormData>(createDefaultForm(false));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial && isEdit) {
      setForm({
        label: initial.label || '',
        emoji: initial.emoji || '🎁',
        ratioWins: String(initial.ratioWins ?? 1),
        ratioPlays: String(initial.ratioPlays ?? 1000),
        isActive: initial.isActive ?? true,
      });
    } else {
      setForm(createDefaultForm(!otherActiveReward));
    }
  }, [initial, isEdit, otherActiveReward]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        label: form.label,
        emoji: form.emoji || '🎁',
        ratioWins: Number(form.ratioWins),
        ratioPlays: Number(form.ratioPlays),
        isActive: form.isActive,
      };
      if (!payload.ratioWins || !payload.ratioPlays || payload.ratioWins > payload.ratioPlays) {
        toast.warning('Enter a valid ratio, e.g. 1 winner out of 1000 plays.');
        setSubmitting(false);
        return;
      }
      if (isEdit && initial) {
        await workspaceService.updateLotteryReward(initial.id, payload);
        toast.success("Reward updated successfully!");
      } else {
        await workspaceService.addLotteryReward(payload);
        toast.success("Reward created successfully!");
      }
      await onSave();
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to save reward'));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-border px-5 py-2.5 text-caption font-semibold text-foreground transition-colors hover:bg-muted"
        disabled={submitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="lottery-reward-form"
        className="rounded-lg bg-primary px-8 py-2.5 text-caption font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        disabled={submitting}
      >
        {submitting ? 'Saving...' : isEdit ? 'Update' : 'Add Reward'}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Reward' : 'Add Reward'} maxWidth="max-w-lg" footer={footer}>
      <form id="lottery-reward-form" onSubmit={handleSubmit} className="space-y-6 py-2">
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-[80px_1fr]">
          <div className="space-y-2">
            <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">Emoji</label>
            <input
              type="text"
              value={form.emoji}
              onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
              maxLength={4}
              className="w-full rounded-lg border border-border bg-background p-4 text-center text-xl outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">Reward Label *</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              required
              placeholder="e.g. Free Dessert"
              className="w-full rounded-lg border border-border bg-background p-4 font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Winning Odds — "X winners out of every Y plays"
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min={1}
              value={form.ratioWins}
              onChange={(e) => setForm((f) => ({ ...f, ratioWins: e.target.value }))}
              className="w-24 rounded-lg border border-border bg-background p-4 text-center font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <span className="text-body font-semibold text-muted-foreground">winner(s) out of every</span>
            <input
              type="number"
              min={1}
              value={form.ratioPlays}
              onChange={(e) => setForm((f) => ({ ...f, ratioPlays: e.target.value }))}
              className="w-28 rounded-lg border border-border bg-background p-4 text-center font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <span className="text-body font-semibold text-muted-foreground">plays</span>
          </div>
          <p className="ml-1 text-caption text-muted-foreground">e.g. 1 and 1000 = roughly a 1-in-1000 chance each spin.</p>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-caption font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
            className={`group flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all ${form.isActive ? 'border-primary/20 bg-primary/5' : 'border-border bg-card/50 hover:border-border/80'}`}
          >
            <span className={`text-body font-semibold ${form.isActive ? 'text-primary' : 'text-foreground'}`}>
              {form.isActive ? 'Active — guests can win this' : 'Inactive'}
            </span>
            <div className={`h-6 w-12 rounded-full p-1 transition-all duration-300 ${form.isActive ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-300 ${form.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>
          {form.isActive && otherActiveReward && (
            <p className="ml-1 text-caption text-warning">
              Only one reward can be active at a time — this will turn off &ldquo;{otherActiveReward.label}&rdquo;.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}

function DeleteRewardModal({
  isOpen,
  onClose,
  reward,
  onDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  reward: WorkspaceLotteryReward | null;
  onDeleted: () => void | Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!reward) return;
    setDeleting(true);
    try {
      await workspaceService.removeLotteryReward(reward.id);
      toast.success("Reward removed successfully!");
      await onDeleted();
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete reward"));
    } finally {
      setDeleting(false);
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-border px-5 py-2.5 text-caption font-semibold text-foreground transition-colors hover:bg-muted"
        disabled={deleting}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-lg bg-destructive px-8 py-2.5 text-caption font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-70"
        disabled={deleting}
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Reward" maxWidth="max-w-md" footer={footer}>
      <div className="space-y-4 py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <PiTrashBold className="text-3xl text-destructive" />
        </div>
        <p className="font-semibold text-foreground">Are you sure you want to delete this reward?</p>
        {reward && <p className="text-body text-muted-foreground">&ldquo;{reward.label}&rdquo;</p>}
        <p className="text-caption text-muted-foreground">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}

export const ListLottery = forwardRef<ListLotteryHandle, ListLotteryProps>(({
  embedded = false,
  initialRewards,
  onChanged,
}, ref) => {
  const [rewards, setRewards] = useState<WorkspaceLotteryReward[]>(initialRewards ?? []);
  const [entries, setEntries] = useState<WorkspaceLotteryEntry[]>([]);
  const [entriesLoaded, setEntriesLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<WorkspaceLotteryReward | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceLotteryReward | null>(null);

  useImperativeHandle(ref, () => ({
    openNew: () => setShowForm(true),
  }));

  useEffect(() => {
    if (initialRewards) setRewards(initialRewards);
  }, [initialRewards]);

  useEffect(() => {
    workspaceService.getLotteryEntries(1, 20)
      .then((res) => setEntries(res.data.entries || []))
      .catch(() => {})
      .finally(() => setEntriesLoaded(true));
  }, []);

  const refresh = async () => {
    if (onChanged) await onChanged();
    workspaceService.getLotteryEntries(1, 20).then((res) => setEntries(res.data.entries || [])).catch(() => {});
  };

  const activeReward = rewards.find((r) => r.isActive) ?? null;

  const list = rewards.length === 0 ? (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PiTicketBold className="text-4xl" />
      </div>
      <h3 className="text-h2 text-foreground">No Rewards Yet</h3>
      <p className="mt-2 max-w-md text-body text-muted-foreground">
        Add rewards and set their odds — guests will see them and can spin from the landing page once the Lucky Draw toggle is on.
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add First Reward
      </button>
    </div>
  ) : (
    <div className="space-y-3">
      {rewards.map((r) => (
        <div key={r.id} className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-2xl">{r.emoji}</span>
            <div className="min-w-0">
              <p className="break-words font-bold text-foreground">{r.label}</p>
              <p className="break-words text-caption text-muted-foreground">
                {r.ratioWins} winner{r.ratioWins !== 1 ? 's' : ''} out of every {r.ratioPlays} plays
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                r.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              }`}
            >
              {r.isActive ? 'Live' : 'Inactive'}
            </span>
            <button
              onClick={() => { setEditItem(r); setShowForm(true); }}
              className="rounded-lg border border-border bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-secondary/80"
              title="Edit"
            >
              <PiPencilSimpleBold className="text-lg" />
            </button>
            <button
              onClick={() => setDeleteTarget(r)}
              className="rounded-lg border border-border p-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Delete"
            >
              <PiTrashBold className="text-lg" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={embedded ? 'flex h-full flex-col gap-6' : 'mx-auto max-w-4xl space-y-8'}>
      {!embedded && (
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-h1 text-foreground">Lucky Draw</h1>
            <p className="mt-1 text-body text-muted-foreground">
              Manage rewards, odds, and see who's played and won. Only one reward can be live at a time.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PiPlusBold className="text-xl" /> New Reward
          </button>
        </div>
      )}

      <div className={embedded ? 'min-h-0 flex-1 space-y-8 overflow-y-auto pr-1' : ''}>
        {list}

        <div>
          <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-muted-foreground">Recent Plays</p>
          {!entriesLoaded ? (
            <p className="text-body text-muted-foreground">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-body text-muted-foreground">No plays yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[480px] text-left text-caption">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="p-3 font-semibold text-muted-foreground">Result</th>
                    <th className="p-3 font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="p-3">
                        {e.won ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-success">
                            <PiEyeBold /> {e.rewardEmoji} {e.rewardLabel}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <PiEyeSlashBold /> No win
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">{e.playedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <RewardFormModal
          isOpen={showForm}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={refresh}
          initial={editItem}
          isEdit={!!editItem}
          otherActiveReward={activeReward && activeReward.id !== editItem?.id ? activeReward : null}
        />
      )}
      {deleteTarget && (
        <DeleteRewardModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          reward={deleteTarget}
          onDeleted={refresh}
        />
      )}
    </div>
  );
});

ListLottery.displayName = 'ListLottery';
