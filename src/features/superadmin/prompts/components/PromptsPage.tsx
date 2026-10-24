'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PiNotebookBold,
  PiSparkleBold,
  PiImagesBold,
  PiVideoCameraBold,
  PiStarFill,
  PiPlusBold,
  PiMagnifyingGlassBold,
  PiEyeBold,
  PiArrowsClockwiseBold,
} from 'react-icons/pi';
import {
  Button,
  EmptyState,
  Input,
  Spinner,
  toast,
} from '@/components/ui';
import { cn } from '@/utils/cn';
import {
  superadminService,
  PlatformPrompt,
  PromptCategorySummary,
} from '@/services/superadmin.service';
import { routes } from '@/config/routes';
import { MEDIA_TYPE_TABS } from '../constants';
import type { PromptFormData } from '../types';
import { PromptCard } from './PromptCard';
import { PromptModal } from './PromptModal';
import { PromptLightbox } from './PromptLightbox';

export function PromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<PlatformPrompt[]>([]);
  const [categories, setCategories] = useState<PromptCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Clipboard copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lightbox / Image preview modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PlatformPrompt | null>(null);
  const [modalForm, setModalForm] = useState<PromptFormData>({
    title: '',
    prompt: '',
    negativePrompt: '',
    category: 'Biryani & Rice',
    mediaType: 'image',
    aspectRatio: '1:1',
    recommendedModel: 'Ideogram 2.0 (Typography & Posters)',
    stylePreset: 'Commercial Food Photography',
    referenceImages: [],
    tags: [],
    cameraNotes: '',
    isFavorite: false,
  });

  const [uploadingRefImage, setUploadingRefImage] = useState(false);

  // Load Prompts
  const loadPrompts = async () => {
    try {
      setLoading(true);
      const res: any = await superadminService.listPrompts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        mediaType: selectedMediaType !== 'all' ? selectedMediaType : undefined,
        isFavorite: favoritesOnly ? true : undefined,
        search: searchQuery.trim() || undefined,
      });

      const list: PlatformPrompt[] = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.prompts)
        ? res.prompts
        : [];

      let cats: PromptCategorySummary[] = Array.isArray(res?.categories) ? res.categories : [];
      if (cats.length === 0 && list.length > 0) {
        const catMap = new Map<string, number>();
        list.forEach((p) => {
          if (p.category) {
            catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
          }
        });
        cats = Array.from(catMap.entries()).map(([category, count]) => ({ category, count }));
      }

      // If library is completely empty, auto-seed with curated defaults
      if (
        list.length === 0 &&
        !searchQuery.trim() &&
        selectedCategory === 'all' &&
        selectedMediaType === 'all' &&
        !favoritesOnly
      ) {
        const seeded: any = await superadminService.seedDefaultPrompts();
        const seededList = Array.isArray(seeded)
          ? seeded
          : Array.isArray(seeded?.data)
          ? seeded.data
          : Array.isArray(seeded?.prompts)
          ? seeded.prompts
          : [];

        if (seededList.length > 0) {
          setPrompts(seededList);
          const reloaded: any = await superadminService.listPrompts();
          const reloadedCats = Array.isArray(reloaded?.categories) ? reloaded.categories : [];
          setCategories(reloadedCats);
          setLoading(false);
          return;
        }
      }

      setPrompts(list);
      setCategories(cats);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, [selectedCategory, selectedMediaType, favoritesOnly]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPrompts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    return {
      total: prompts.length,
      photos: prompts.filter((p) => p.mediaType === 'image').length,
      videos: prompts.filter((p) => p.mediaType === 'video').length,
      withRefs: prompts.filter((p) => p.referenceImages && p.referenceImages.length > 0).length,
      favorites: prompts.filter((p) => p.isFavorite).length,
    };
  }, [prompts]);

  // Copy Prompt to Clipboard
  const handleCopyPrompt = (p: PlatformPrompt) => {
    navigator.clipboard.writeText(p.prompt);
    setCopiedId(p.id);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Launch Prompt in AI Studio
  const handleUseInStudio = async (p: PlatformPrompt) => {
    try {
      await superadminService.recordPromptUsage(p.id);
    } catch {}

    const queryParams = new URLSearchParams({
      tab: 'aistudio',
      prompt: p.prompt,
      model: p.recommendedModel || '',
      aspectRatio: p.aspectRatio || '1:1',
      mediaType: p.mediaType || 'image',
    });

    if (p.referenceImages && p.referenceImages.length > 0) {
      queryParams.set('refImg', p.referenceImages[0]);
    }

    router.push(`${routes.superadmin.creativeStudio}?${queryParams.toString()}`);
  };

  // Toggle Favorite
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await superadminService.togglePromptFavorite(id);
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: res.prompt.isFavorite } : p))
      );
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  // Delete Prompt
  const handleDeletePrompt = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this prompt from the library?')) return;
    try {
      await superadminService.deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Prompt deleted from library');
    } catch {
      toast.error('Failed to delete prompt');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPrompt(null);
    setModalForm({
      title: '',
      prompt: '',
      negativePrompt: '',
      category: 'Biryani & Rice',
      mediaType: 'image',
      aspectRatio: '1:1',
      recommendedModel: 'Ideogram 2.0 (Typography & Posters)',
      stylePreset: 'Commercial Food Photography',
      referenceImages: [],
      tags: [],
      cameraNotes: '',
      isFavorite: false,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: PlatformPrompt, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPrompt(p);
    setModalForm({
      title: p.title,
      prompt: p.prompt,
      negativePrompt: p.negativePrompt || '',
      category: p.category || 'General',
      mediaType: p.mediaType || 'image',
      aspectRatio: p.aspectRatio || '1:1',
      recommendedModel: p.recommendedModel || 'Ideogram 2.0 (Typography & Posters)',
      stylePreset: p.stylePreset || 'Commercial Food Photography',
      referenceImages: p.referenceImages || [],
      tags: p.tags || [],
      cameraNotes: p.cameraNotes || '',
      isFavorite: p.isFavorite || false,
    });
    setIsModalOpen(true);
  };

  // Handle Upload Reference Image
  const handleUploadRefImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, or WEBP)');
      return;
    }
    try {
      setUploadingRefImage(true);
      const res = await superadminService.uploadMarketingAsset(file);
      setModalForm((prev) => ({
        ...prev,
        referenceImages: [...prev.referenceImages, res.url],
      }));
      toast.success(`Reference image "${file.name}" uploaded!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload reference image');
    } finally {
      setUploadingRefImage(false);
    }
  };

  // Save Prompt (Create / Update)
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.title.trim()) {
      toast.error('Please provide a prompt title');
      return;
    }
    if (!modalForm.prompt.trim()) {
      toast.error('Please provide prompt text');
      return;
    }

    try {
      setActionLoading(true);
      if (editingPrompt) {
        const res = await superadminService.updatePrompt(editingPrompt.id, modalForm);
        setPrompts((prev) =>
          prev.map((p) => (p.id === editingPrompt.id ? res.prompt : p))
        );
        toast.success('Prompt template updated!');
      } else {
        const res = await superadminService.createPrompt(modalForm);
        setPrompts((prev) => [res.prompt, ...prev]);
        toast.success('New prompt created and saved to library!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save prompt');
    } finally {
      setActionLoading(false);
    }
  };

  // Seed / Reset Defaults
  const handleResetDefaults = async () => {
    if (!confirm('This will load the official curated restaurant culinary prompts and reference images into your library. Proceed?')) return;
    try {
      setActionLoading(true);
      const res: any = await superadminService.seedDefaultPrompts(true);
      toast.success(res?.message || 'Curated default prompts loaded!');
      loadPrompts();
    } catch {
      toast.error('Failed to load default presets');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* Compact Header matching Menu page */}
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">AI Prompt Library</h1>
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {prompts.length} prompt templates across {Math.max(categories.length, 1)} culinary categories
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            disabled={actionLoading}
            className="h-8 gap-1 px-2.5 text-xs sm:h-9 sm:gap-1.5 sm:px-3"
          >
            <PiArrowsClockwiseBold className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Load Presets</span>
          </Button>

          <Link href={routes.superadmin.creativeStudio}>
            <Button variant="outline" size="sm" className="h-8 gap-1 px-2.5 text-xs sm:h-9 sm:gap-1.5 sm:px-3">
              <PiSparkleBold className="h-3.5 w-3.5 text-purple-500" />
              <span className="hidden sm:inline">Go to Studio</span>
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            className="h-8 gap-1 px-3 text-xs sm:h-9 sm:gap-1.5 sm:px-3.5 shadow-sm"
          >
            <PiPlusBold className="h-3.5 w-3.5" />
            <span>New Prompt</span>
          </Button>
        </div>
      </div>

      {/* Sleek Compact Metrics Strip */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-bold text-foreground">{metrics.total}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
          <PiImagesBold className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-muted-foreground">Photos:</span>
          <span className="font-bold text-foreground">{metrics.photos}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
          <PiVideoCameraBold className="h-3.5 w-3.5 text-purple-500" />
          <span className="text-muted-foreground">Reels:</span>
          <span className="font-bold text-foreground">{metrics.videos}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
          <PiEyeBold className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-muted-foreground">With References:</span>
          <span className="font-bold text-foreground">{metrics.withRefs}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs">
          <PiStarFill className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-muted-foreground">Starred:</span>
          <span className="font-bold text-foreground">{metrics.favorites}</span>
        </div>
      </div>

      {/* Search & Horizontally Scrollable Categories */}
      <div className="shrink-0 space-y-2 rounded-xl border border-border bg-card p-2.5 shadow-xs sm:p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {MEDIA_TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const selected = selectedMediaType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedMediaType(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1",
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="h-4 w-px bg-border mx-1" />

            <button
              type="button"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border",
                favoritesOnly
                  ? "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <PiStarFill className={cn("h-3.5 w-3.5", favoritesOnly ? "text-amber-500" : "text-muted-foreground")} />
              <span>Starred</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[240px]">
            <PiMagnifyingGlassBold
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search prompts, dishes, models, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8.5 text-xs sm:h-9 sm:pl-9"
            />
          </div>
        </div>

        {/* Categories Horizontal Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
            )}
          >
            <span>All Categories</span>
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] font-bold",
                selectedCategory === 'all'
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {prompts.length}
            </span>
          </button>

          {categories.map((c) => {
            const selected = selectedCategory === c.category;
            return (
              <button
                key={c.category}
                type="button"
                onClick={() => setSelectedCategory(c.category)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:py-1",
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span>{c.category}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-bold",
                    selected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content View */}
      <div className={cn("min-h-0 flex-1 overflow-hidden", prompts.length === 0 && "flex flex-col")}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <Spinner size="lg" />
            <p className="text-sm">Loading prompt library...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiNotebookBold size={32} />}
              title="No Prompts Found"
              description="Create your first reusable restaurant prompt or load our curated default culinary presets."
              action={
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
                    <PiPlusBold className="h-4 w-4 mr-1.5" />
                    Create New Prompt
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetDefaults}>
                    Load Curated Presets
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-0.5 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {prompts.map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={p}
                  copiedId={copiedId}
                  onCopy={handleCopyPrompt}
                  onUseInStudio={handleUseInStudio}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeletePrompt}
                  onPreviewRef={setPreviewImageUrl}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROMPT MODAL */}
      <PromptModal
        isOpen={isModalOpen}
        editingPrompt={editingPrompt}
        form={modalForm}
        setForm={setModalForm}
        actionLoading={actionLoading}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePrompt}
        onUploadRefImage={handleUploadRefImage}
        uploadingRefImage={uploadingRefImage}
      />

      {/* IMAGE LIGHTBOX MODAL */}
      <PromptLightbox
        imageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />
    </div>
  );
}
