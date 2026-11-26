'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useMemo } from 'react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { LoadErrorNotice } from '@/components/feedback/LoadErrorNotice';
import { motion, useReducedMotion } from 'framer-motion';
import { PiPlusBold } from 'react-icons/pi';
import {
  superadminService,
  type MenuBlueprint,
} from '@/services/superadmin.service';
import { Button, EmptyState, toast } from '@/components/ui';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { SearchInput } from '@/components/ui/SearchInput';
import { getApiErrorMessage } from '@/utils/errors';
import { fadeIn, staggerContainer } from '@/lib/motion';
import { BlueprintCard } from './BlueprintCard';
import { BlueprintPreviewModal } from './BlueprintPreviewModal';
import { BlueprintEditorModal } from './BlueprintEditorModal';
import type { PreviewTab } from '../types';

export function BlueprintsPage() {
  const reduceMotion = useReducedMotion();
  const [blueprints, setBlueprints] = useState<MenuBlueprint[]>([]);
  const [autoSeedEnabled, setAutoSeedEnabled] = useState(true);
  const [defaultBlueprintId, setDefaultBlueprintId] = useState('cafe_bakery');
  const [savingConfig, setSavingConfig] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Preview Modal state
  const [previewBlueprint, setPreviewBlueprint] = useState<MenuBlueprint | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<PreviewTab>('dishes');

  // Editor Modal state
  const [editorBlueprint, setEditorBlueprint] = useState<MenuBlueprint | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Confirmation state for delete / restore
  const [pendingAction, setPendingAction] = useState<{ kind: 'delete' | 'reset'; blueprint: MenuBlueprint } | null>(null);
  const [confirming, setConfirming] = useState(false);

  // The page edits these lists in place afterwards, so the load copies them into local state.
  const { loading, error: loadError, refetch } = useAsyncData(
    async () => {
      const res = await superadminService.getOnboardingTemplateConfig();
      setAutoSeedEnabled(res.autoSeedEnabled ?? true);
      setDefaultBlueprintId(res.defaultBlueprintId || 'cafe_bakery');
      setBlueprints(Array.isArray(res.blueprints) ? res.blueprints : []);
      return res;
    },
    [],
    "We couldn't load the starter menus",
  );

  const handleToggleAutoSeed = async () => {
    const nextVal = !autoSeedEnabled;
    try {
      setSavingConfig(true);
      await superadminService.updateOnboardingTemplateConfig({
        autoSeedEnabled: nextVal,
        defaultBlueprintId,
      });
      setAutoSeedEnabled(nextVal);
      toast.success(
        nextVal
          ? 'New sign-ups will start with the chosen starter menu.'
          : 'New sign-ups will start with an empty menu.'
      );
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "We couldn't save this setting"));
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSetDefault = async (blueprintId: string) => {
    if (blueprintId === defaultBlueprintId) return;
    try {
      setSavingConfig(true);
      await superadminService.updateOnboardingTemplateConfig({
        autoSeedEnabled,
        defaultBlueprintId: blueprintId,
      });
      setDefaultBlueprintId(blueprintId);
      const chosen = blueprints.find((b) => b.id === blueprintId);
      toast.success(`New sign-ups will now get "${chosen?.name || blueprintId}".`);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "We couldn't change the starter menu for new sign-ups"));
    } finally {
      setSavingConfig(false);
    }
  };

  const filteredBlueprints = useMemo(() => {
    if (!searchQuery.trim()) return blueprints;
    const q = searchQuery.toLowerCase();
    return blueprints.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.categoryNames.some((c) => c.toLowerCase().includes(q)) ||
        b.items.some((item) => item.item.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
    );
  }, [blueprints, searchQuery]);

  const activeBlueprint = blueprints.find((b) => b.id === defaultBlueprintId);
  const totalDishes = blueprints.reduce((acc, b) => acc + (b.items?.length || 0), 0);

  const openPreview = (bp: MenuBlueprint, initialTab: PreviewTab = 'dishes') => {
    setPreviewBlueprint(bp);
    setActivePreviewTab(initialTab);
  };

  const handleOpenEditor = (bp: MenuBlueprint | null) => {
    setEditorBlueprint(bp);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditorBlueprint(null);
  };

  const handleBlueprintSaved = (savedBp: MenuBlueprint) => {
    setBlueprints((prev) => {
      const idx = prev.findIndex((b) => b.id === savedBp.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedBp;
        return next;
      }
      return [...prev, savedBp];
    });
  };

  const handleDeleteBlueprint = async (bp: MenuBlueprint) => {
    try {
      await superadminService.deleteBlueprint(bp.id);
      setBlueprints((prev) => prev.filter((b) => b.id !== bp.id));
      toast.success(`Starter menu "${bp.name}" deleted.`);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "We couldn't delete this starter menu"));
    }
  };

  const handleResetBlueprint = async (bp: MenuBlueprint) => {
    try {
      const res = await superadminService.resetBlueprint(bp.id);
      setBlueprints((prev) => {
        const idx = prev.findIndex((b) => b.id === bp.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = res.blueprint;
          return next;
        }
        return prev;
      });
      toast.success(`Starter menu "${bp.name}" restored to the original.`);
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, "We couldn't restore this starter menu"));
    }
  };

  const handleConfirmPending = async () => {
    if (!pendingAction) return;
    setConfirming(true);
    try {
      if (pendingAction.kind === 'delete') {
        await handleDeleteBlueprint(pendingAction.blueprint);
      } else {
        await handleResetBlueprint(pendingAction.blueprint);
      }
    } finally {
      setConfirming(false);
      setPendingAction(null);
    }
  };

  return (
    <motion.div
      className="flex h-full flex-col space-y-6 overflow-y-auto pr-1"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      <PageHeader
        title="Starter menus"
        description={`Menus, branding and content a new restaurant can start with at sign-up. ${blueprints.length} starter menus, ${totalDishes} dishes.`}
      />
      <section className="shrink-0 rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 id="auto-seed-title" className="text-h3 text-foreground">Use a starter menu for new sign-ups</h2>
            <p id="auto-seed-desc" className="max-w-2xl text-body text-muted-foreground">
              {autoSeedEnabled
                ? `New restaurants start with "${activeBlueprint?.name || 'Cafe & Bakery'}" instead of an empty menu.`
                : 'New restaurants start with an empty menu.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAutoSeed}
            disabled={savingConfig || loading}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              autoSeedEnabled ? 'bg-primary' : 'bg-muted'
            }`}
            role="switch"
            aria-checked={autoSeedEnabled}
            aria-labelledby="auto-seed-title"
            aria-describedby="auto-seed-desc"
          >
            <span
              className={`pointer-events-none inline-block size-6 transform rounded-full bg-card shadow-sm ring-0 transition duration-200 ease-in-out ${
                autoSeedEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <SearchInput
          aria-label="Search starter menus"
          placeholder="Search by name, cuisine, dish or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button
          onClick={() => handleOpenEditor(null)}
          variant="primary"
          size="sm"
          leftIcon={<PiPlusBold size={15} aria-hidden />}
        >
          Add starter menu
        </Button>
      </div>

      {/* Blueprint Cards Grid */}
      {loadError && !loading ? (
        <LoadErrorNotice title="We couldn't load the starter menus" message={loadError} onRetry={refetch} />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl border border-border bg-card/60" />
          ))}
        </div>
      ) : filteredBlueprints.length === 0 ? (
        <EmptyState
          title="No starter menus found"
          description="Try a different search."
          action={
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          }
        />
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2"
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={staggerContainer(0.08)}
        >
          {filteredBlueprints.map((bp) => (
            <BlueprintCard
              key={bp.id}
              blueprint={bp}
              isDefault={bp.id === defaultBlueprintId}
              savingConfig={savingConfig}
              onPreview={openPreview}
              onEdit={handleOpenEditor}
              onDelete={(bp) => setPendingAction({ kind: 'delete', blueprint: bp })}
              onReset={(bp) => setPendingAction({ kind: 'reset', blueprint: bp })}
              onSetDefault={handleSetDefault}
            />
          ))}
        </motion.div>
      )}

      <ConfirmationDialog
        isOpen={pendingAction !== null}
        onClose={() => {
          if (!confirming) setPendingAction(null);
        }}
        onConfirm={handleConfirmPending}
        loading={confirming}
        tone={pendingAction?.kind === 'reset' ? 'default' : 'destructive'}
        title={
          pendingAction?.kind === 'reset'
            ? `Restore "${pendingAction.blueprint.name}"?`
            : `Delete "${pendingAction?.blueprint.name ?? ''}"?`
        }
        description={
          pendingAction?.kind === 'reset'
            ? 'This starter menu goes back to its original dishes, look and content. Your changes to it will be lost.'
            : "This starter menu will be removed. This can't be undone."
        }
        confirmLabel={pendingAction?.kind === 'reset' ? 'Restore original' : 'Delete starter menu'}
      />

      {/* Preview Full Package Modal */}
      <BlueprintPreviewModal
        blueprint={previewBlueprint}
        defaultBlueprintId={defaultBlueprintId}
        activeTab={activePreviewTab}
        onTabChange={setActivePreviewTab}
        onClose={() => setPreviewBlueprint(null)}
        onSetDefault={handleSetDefault}
      />

      {/* Create / Edit starter menu modal */}
      {isEditorOpen && (
        <BlueprintEditorModal
          blueprint={editorBlueprint}
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSaved={handleBlueprintSaved}
        />
      )}
    </motion.div>
  );
}
