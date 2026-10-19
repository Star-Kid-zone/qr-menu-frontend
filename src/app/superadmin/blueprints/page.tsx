'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  PiBookBookmarkBold,
  PiSparkleBold,
  PiCheckBold,
  PiWarningBold,
  PiMagnifyingGlassBold,
  PiXBold,
  PiForkKnifeBold,
  PiStarFill,
  PiCheckCircleFill,
  PiSlidersHorizontalBold,
  PiEyeBold,
  PiPaintBrushBold,
  PiImageBold,
  PiTagBold,
  PiQuestionBold,
  PiClockBold,
  PiArticleBold,
  PiStorefrontBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiArrowCounterClockwiseBold,
  PiPlusBold,
} from 'react-icons/pi';
import {
  superadminService,
  type MenuBlueprint,
  type BlueprintMenuItem,
} from '@/services/superadmin.service';
import { Badge, Button, Card, EmptyState, toast } from '@/components/ui';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';
import { BlueprintEditorModal } from './BlueprintEditorModal';

type PreviewTab = 'dishes' | 'branding' | 'story' | 'offers' | 'gallery_faqs';

export default function SuperadminBlueprintsPage() {
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
      toast.error(err?.response?.data?.error || err?.message || 'Failed to delete blueprint');
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
      toast.error(err?.response?.data?.error || err?.message || 'Failed to reset blueprint');
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

      {/* Blueprint Cards */}
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
          {filteredBlueprints.map((bp) => {
            const isDefault = bp.id === defaultBlueprintId;

            return (
              <motion.div key={bp.id} variants={fadeInUp}>
                <Card
                  className={`flex h-full flex-col overflow-hidden border transition-all ${
                    isDefault
                      ? 'border-emerald-500/80 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-border hover:border-primary/40 hover:shadow-lg'
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`flex items-start justify-between border-b border-border p-5 ${
                      isDefault ? 'bg-emerald-500/10' : 'bg-muted/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg p-1.5 ${
                            isDefault ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <PiBookBookmarkBold className="size-5" />
                        </span>
                        <h2 className="text-h3 font-bold text-foreground">{bp.name}</h2>
                      </div>
                      <p className="text-caption text-muted-foreground">{bp.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDefault && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <PiCheckCircleFill className="size-3.5" />
                          Registration Default
                        </span>
                      )}
                      <Badge tone={bp.badge === 'Most Popular' ? 'success' : 'primary'}>{bp.badge}</Badge>
                    </div>
                  </div>

                  {/* Preloaded Storefront Modules Bar */}
                  <div className="border-b border-border bg-primary/5 px-5 py-2.5">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Full Storefront Preloaded Package
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
                        <PiForkKnifeBold className="size-3.5 text-primary" />
                        {bp.items.length} Dishes
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
                        <PiPaintBrushBold className="size-3.5 text-amber-500" />
                        Branding Palette
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
                        <PiArticleBold className="size-3.5 text-blue-500" />
                        Story & 4 Stats
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
                        <PiTagBold className="size-3.5 text-rose-500" />
                        {bp.offers?.length || 2} Offers
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
                        <PiImageBold className="size-3.5 text-indigo-500" />
                        {bp.gallery?.length || 4} Photos
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
                        <PiQuestionBold className="size-3.5 text-emerald-500" />
                        {bp.faqs?.length || 3} FAQs
                      </span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="border-b border-border px-5 py-3 bg-card">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Categories Included
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {bp.categoryNames.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sample Dishes Grid */}
                  <div className="flex-1 p-5">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Sample Dishes ({bp.items.length} Total)
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {bp.items.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/10 p-2.5 transition hover:bg-muted/30"
                        >
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.imageUrl}
                              alt={item.item}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-foreground">{item.item}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <span className="font-mono font-bold text-primary">${item.price}</span>
                              <span>•</span>
                              <span
                                className={
                                  item.type === 'Veg'
                                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                    : 'text-amber-600 font-medium'
                                }
                              >
                                {item.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {bp.items.length > 4 && (
                      <p className="mt-2.5 text-center text-caption text-muted-foreground">
                        + {bp.items.length - 4} more dishes with full dietary tags & photos
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/10 p-4">
                    <div className="flex items-center gap-1.5">
                      <Button
                        onClick={() => openPreview(bp, 'dishes')}
                        variant="secondary"
                        size="sm"
                        leftIcon={<PiEyeBold size={14} />}
                      >
                        Preview
                      </Button>
                      <Button
                        onClick={() => handleOpenEditor(bp)}
                        variant="secondary"
                        size="sm"
                        leftIcon={<PiPencilSimpleBold size={14} />}
                      >
                        Edit
                      </Button>
                      {bp.isCustom ? (
                        !isDefault && (
                          <Button
                            onClick={() => handleDeleteBlueprint(bp)}
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete custom blueprint"
                            leftIcon={<PiTrashBold size={14} />}
                          >
                            Delete
                          </Button>
                        )
                      ) : (
                        <Button
                          onClick={() => handleResetBlueprint(bp)}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                          title="Reset to factory default"
                          leftIcon={<PiArrowCounterClockwiseBold size={14} />}
                        >
                          Reset
                        </Button>
                      )}
                    </div>

                    {isDefault ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <PiCheckBold className="size-4" />
                        <span>Active Signup Default</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSetDefault(bp.id)}
                        disabled={savingConfig}
                        variant="primary"
                        size="sm"
                        leftIcon={<PiStarFill size={14} />}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Preview Full Package Modal */}
      <AnimatePresence>
        {previewBlueprint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setPreviewBlueprint(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-border p-5 bg-card">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{previewBlueprint.name}</h3>
                    {previewBlueprint.id === defaultBlueprintId && (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        Active Default for Signups
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{previewBlueprint.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewBlueprint(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <PiXBold className="size-5" />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex border-b border-border bg-muted/20 px-5 pt-2 gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('dishes')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                    activePreviewTab === 'dishes'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <PiForkKnifeBold className="size-4" />
                  <span>Menu Dishes ({previewBlueprint.items.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('branding')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                    activePreviewTab === 'branding'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <PiPaintBrushBold className="size-4" />
                  <span>Theme & Branding</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('story')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                    activePreviewTab === 'story'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <PiArticleBold className="size-4" />
                  <span>Our Story & Stats</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('offers')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                    activePreviewTab === 'offers'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <PiTagBold className="size-4" />
                  <span>Special Offers ({previewBlueprint.offers?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('gallery_faqs')}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                    activePreviewTab === 'gallery_faqs'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <PiImageBold className="size-4" />
                  <span>Gallery ({previewBlueprint.gallery?.length || 0}) & FAQs ({previewBlueprint.faqs?.length || 0})</span>
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* 1. DISHES TAB */}
                {activePreviewTab === 'dishes' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Preloaded Menu Catalog ({previewBlueprint.items.length} Items)
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {previewBlueprint.categoryNames.map((cat) => (
                          <span key={cat} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {previewBlueprint.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs transition hover:border-primary/40"
                        >
                          <div className="relative size-18 shrink-0 overflow-hidden rounded-xl bg-muted">
                            <Image
                              src={item.imageUrl}
                              alt={item.item}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <p className="truncate text-xs font-bold text-foreground">{item.item}</p>
                              <span className="font-mono text-xs font-bold text-primary">${item.price}</span>
                            </div>
                            <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                              <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-foreground">
                                {item.category}
                              </span>
                              <span
                                className={
                                  item.type === 'Veg'
                                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                    : 'text-amber-600 font-semibold'
                                }
                              >
                                {item.type}
                              </span>
                              {item.popular && (
                                <span className="text-primary font-semibold">★ Popular</span>
                              )}
                              {item.calories && (
                                <span className="text-muted-foreground">{item.calories} kcal</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. THEME & BRANDING TAB */}
                {activePreviewTab === 'branding' && previewBlueprint.theme && (
                  <div className="space-y-6">
                    {/* Hero Banner Banner Preview */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Preloaded Hero Banner Image
                      </p>
                      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-border">
                        <Image
                          src={previewBlueprint.theme.bannerUrl}
                          alt="Hero Banner"
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 flex flex-col justify-end p-4 text-white"
                          style={{ background: previewBlueprint.theme.heroOverlay }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                            {previewBlueprint.theme.themeBadge}
                          </span>
                          <h4 className="text-lg font-bold">{previewBlueprint.name}</h4>
                          <p className="text-xs text-white/90">{previewBlueprint.theme.heroTagline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Color Palette Chips */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Branding Colors & Visual Tokens
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                          <span
                            className="size-7 rounded-lg border shadow-xs"
                            style={{ backgroundColor: previewBlueprint.theme.primaryColor }}
                          />
                          <div>
                            <span className="block text-[11px] font-bold text-foreground">Primary</span>
                            <span className="block font-mono text-[10px] text-muted-foreground">
                              {previewBlueprint.theme.primaryColor}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                          <span
                            className="size-7 rounded-lg border shadow-xs"
                            style={{ backgroundColor: previewBlueprint.theme.secondaryColor }}
                          />
                          <div>
                            <span className="block text-[11px] font-bold text-foreground">Secondary</span>
                            <span className="block font-mono text-[10px] text-muted-foreground">
                              {previewBlueprint.theme.secondaryColor}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                          <span
                            className="size-7 rounded-lg border shadow-xs"
                            style={{ backgroundColor: previewBlueprint.theme.accentColor }}
                          />
                          <div>
                            <span className="block text-[11px] font-bold text-foreground">Accent / Canvas</span>
                            <span className="block font-mono text-[10px] text-muted-foreground">
                              {previewBlueprint.theme.accentColor}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                          <span
                            className="size-7 rounded-lg border shadow-xs"
                            style={{ backgroundColor: previewBlueprint.theme.footerBgColor }}
                          />
                          <div>
                            <span className="block text-[11px] font-bold text-foreground">Footer Dark</span>
                            <span className="block font-mono text-[10px] text-muted-foreground">
                              {previewBlueprint.theme.footerBgColor}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Typography & Marquee */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Typography System
                        </span>
                        <p className="text-xs font-semibold text-foreground">{previewBlueprint.theme.fontFamily}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Card Styling: <span className="font-mono text-primary">{previewBlueprint.theme.cardStyle}</span>
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Announcement Banner
                        </span>
                        <p className="text-xs font-semibold text-foreground">
                          {previewBlueprint.theme.announcementText}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. OUR STORY & STATS TAB */}
                {activePreviewTab === 'story' && previewBlueprint.story && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Preloaded Story Narrative
                      </span>
                      <h4 className="text-lg font-bold text-foreground">{previewBlueprint.story.headline}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{previewBlueprint.story.body}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Preloaded Proof Stats
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {previewBlueprint.story.stats.map((s, idx) => (
                          <div key={idx} className="rounded-xl border border-border bg-card p-4 text-center">
                            <span className="block text-2xl font-bold text-primary">{s.value}</span>
                            <span className="block text-[11px] font-medium text-muted-foreground">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {previewBlueprint.business && (
                      <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PiClockBold className="size-5 text-primary" />
                          <div>
                            <span className="block text-xs font-bold text-foreground">Operating Schedule</span>
                            <span className="block text-xs text-muted-foreground">
                              {previewBlueprint.business.businessHours}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          7-Day Hours Configured
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SPECIAL OFFERS TAB */}
                {activePreviewTab === 'offers' && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Preloaded Promotional Deals ({previewBlueprint.offers?.length || 0})
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(previewBlueprint.offers || []).map((offer, idx) => (
                        <div
                          key={idx}
                          className="flex overflow-hidden rounded-xl border border-border bg-card shadow-2xs"
                        >
                          <div className="relative size-28 shrink-0 bg-muted">
                            <Image
                              src={offer.imageUrl}
                              alt={offer.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3.5 flex flex-col justify-between flex-1">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="text-xs font-bold text-foreground">{offer.title}</h5>
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                  {offer.discount}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                                {offer.description}
                              </p>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                              ✓ Auto-Active on Guest Portal
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. GALLERY & FAQS TAB */}
                {activePreviewTab === 'gallery_faqs' && (
                  <div className="space-y-6">
                    {/* Gallery photos */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Preloaded Atmosphere Photo Gallery ({previewBlueprint.gallery?.length || 0} Photos)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(previewBlueprint.gallery || []).map((g, idx) => (
                          <div key={idx} className="relative h-28 overflow-hidden rounded-xl border border-border">
                            <Image
                              src={g.imageUrl}
                              alt={`Gallery photo ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FAQs */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Preloaded Guest FAQs ({previewBlueprint.faqs?.length || 0} Questions)
                      </p>
                      <div className="space-y-2.5">
                        {(previewBlueprint.faqs || []).map((faq, idx) => (
                          <div key={idx} className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                            <p className="text-xs font-bold text-foreground flex items-center gap-2">
                              <PiQuestionBold className="size-3.5 text-primary shrink-0" />
                              {faq.question}
                            </p>
                            <p className="text-xs text-muted-foreground pl-5.5 leading-relaxed">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-border bg-muted/10 p-4">
                <Button variant="secondary" onClick={() => setPreviewBlueprint(null)}>
                  Close Preview
                </Button>

                {previewBlueprint.id !== defaultBlueprintId ? (
                  <Button
                    onClick={() => {
                      handleSetDefault(previewBlueprint.id);
                      setPreviewBlueprint(null);
                    }}
                    variant="primary"
                    leftIcon={<PiStarFill size={14} />}
                  >
                    Set as Registration Default
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Currently Selected as Default
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
