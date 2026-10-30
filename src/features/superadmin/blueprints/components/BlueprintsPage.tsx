'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PiSparkleBold,
  PiForkKnifeBold,
  PiStarFill,
  PiPlusBold,
  PiMagnifyingGlassBold,
} from 'react-icons/pi';
import {
  superadminService,
  type MenuBlueprint,
} from '@/services/superadmin.service';
import { Button, EmptyState, toast } from '@/components/ui';
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
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Preview Modal state
  const [previewBlueprint, setPreviewBlueprint] = useState<MenuBlueprint | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<PreviewTab>('dishes');

  // Editor Modal state
  const [editorBlueprint, setEditorBlueprint] = useState<MenuBlueprint | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const res = await superadminService.getOnboardingTemplateConfig();
        setAutoSeedEnabled(res.autoSeedEnabled ?? true);
        setDefaultBlueprintId(res.defaultBlueprintId || 'cafe_bakery');
        setBlueprints(Array.isArray(res.blueprints) ? res.blueprints : []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load onboarding template configuration');
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

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
          ? 'Auto-seeding enabled! New registrations will receive the complete default storefront template.'
          : 'Auto-seeding disabled. New registrations will start with a blank workspace.'
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to update auto-seeding setting');
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
      toast.success(`"${chosen?.name || blueprintId}" is now the active default onboarding template!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to set default template');
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
    if (!window.confirm(`Are you sure you want to delete the custom blueprint "${bp.name}"?`)) {
      return;
    }

    try {
      await superadminService.deleteBlueprint(bp.id);
      setBlueprints((prev) => prev.filter((b) => b.id !== bp.id));
      toast.success(`Blueprint "${bp.name}" deleted.`);
    } catch (err: any) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to delete blueprint'));
    }
  };

  const handleResetBlueprint = async (bp: MenuBlueprint) => {
    if (
      !window.confirm(
        `Reset blueprint "${bp.name}" back to factory default? Any custom modifications will be reverted.`
      )
    ) {
      return;
    }

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
      toast.success(`Blueprint "${bp.name}" reset to factory default.`);
    } catch (err: any) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to reset blueprint'));
    }
  };

  return (
    <motion.div
      className="flex h-full flex-col space-y-6 overflow-y-auto pr-1"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      {/* Top Header */}
      <div className="flex shrink-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="rounded-md bg-primary/10 px-2 py-0.5">Onboarding Automation</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Full Storefront Preloading</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Onboarding Restaurant Blueprints
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control the starter catalog, website branding, story, offers, and FAQs automatically seeded when a new restaurant registers.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card/50 p-2 shadow-2xs backdrop-blur-xs">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <PiForkKnifeBold className="size-5" />
          </div>
          <div>
            <span className="block font-mono text-sm font-bold text-foreground">
              {totalDishes} Dishes in {blueprints.length} Packs
            </span>
            <span className="block text-[11px] text-muted-foreground">
              + Complete Branding, Gallery & FAQs
            </span>
          </div>
        </div>
      </div>

      {/* Control Card: Master Auto-Seed Toggle & Info */}
      <div className="shrink-0 w-full rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="rounded-xl bg-primary p-2.5 text-primary-foreground shadow-sm">
              <PiSparkleBold className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Automatic Storefront Seeding on Signup</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    autoSeedEnabled
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {autoSeedEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                When enabled, newly registered restaurants will instantly have a complete live digital presence — 
                including 8 dishes with photos & tags, curated brand colors, an authentic story, 4 gallery photos, 2 offers, and 3 FAQs.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-xl border border-border bg-card/80 p-3 shadow-2xs">
            <div className="text-right">
              <span className="block text-xs font-semibold text-foreground">
                {autoSeedEnabled ? 'Auto-Seeding Active' : 'Auto-Seeding Disabled'}
              </span>
              <span className="block text-[11px] text-muted-foreground">
                {autoSeedEnabled
                  ? `Default: ${activeBlueprint?.name || 'Cafe & Bakery'}`
                  : 'New signups will start blank'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleAutoSeed}
              disabled={savingConfig || loading}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                autoSeedEnabled ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={autoSeedEnabled}
            >
              <span
                className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  autoSeedEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates by name, cuisine, dish, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <PiStarFill className="size-3.5 text-emerald-500" />
            <span>Active default template</span>
          </div>

          <Button
            onClick={() => handleOpenEditor(null)}
            variant="primary"
            size="sm"
            leftIcon={<PiPlusBold size={15} />}
          >
            Create Blueprint
          </Button>
        </div>
      </div>

      {/* Blueprint Cards Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl border border-border bg-card/60" />
          ))}
        </div>
      ) : filteredBlueprints.length === 0 ? (
        <EmptyState
          title="No templates found"
          description="Try refining your search keyword."
          action={
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Clear Search
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
              onDelete={handleDeleteBlueprint}
              onReset={handleResetBlueprint}
              onSetDefault={handleSetDefault}
            />
          ))}
        </motion.div>
      )}

      {/* Preview Full Package Modal */}
      <BlueprintPreviewModal
        blueprint={previewBlueprint}
        defaultBlueprintId={defaultBlueprintId}
        activeTab={activePreviewTab}
        onTabChange={setActivePreviewTab}
        onClose={() => setPreviewBlueprint(null)}
        onSetDefault={handleSetDefault}
      />

      {/* Create / Edit Blueprint Modal */}
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
