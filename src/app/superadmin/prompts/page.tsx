'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PiNotebookBold,
  PiSparkleBold,
  PiImagesBold,
  PiVideoCameraBold,
  PiStarBold,
  PiStarFill,
  PiCopyBold,
  PiCheckBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiPlusBold,
  PiUploadSimpleBold,
  PiMagnifyingGlassBold,
  PiArrowSquareOutBold,
  PiCameraBold,
  PiLightbulbFilamentBold,
  PiSpinnerBold,
  PiEyeBold,
  PiXBold,
  PiTagBold,
  PiArrowsClockwiseBold,
  PiSlidersHorizontalBold,
} from 'react-icons/pi';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageHeader,
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

const MEDIA_TYPE_TABS = [
  { id: 'all', label: 'All Prompts' },
  { id: 'image', label: 'Photo Prompts', icon: PiImagesBold },
  { id: 'video', label: 'Reel Prompts', icon: PiVideoCameraBold },
  { id: 'poster', label: 'Poster Prompts', icon: PiNotebookBold },
];

const PRESET_CATEGORIES = [
  'Biryani & Rice',
  'South Indian & Breakfast',
  'Tandoor & Grills',
  'Burgers & Fast Food',
  'Pizza & Italian',
  'Desserts & Bakery',
  'Beverages & Mocktails',
  'Festivals & Special Offers',
  'Fine Dining & Chef Specials',
  'General',
];

const RECOMMENDED_MODELS = [
  'Ideogram 2.0 (Typography & Posters)',
  'Midjourney v6 (Photorealistic Food)',
  'Flux.1 Dev (Clean Food Plating)',
  'DALL-E 3 (OpenAI Prompt Fidelity)',
  'Google Gemini / Imagen (Natural Lighting)',
  'Grok Imagine Video / Kling AI (Cinematic Reels)',
  'Runway Gen-3 Alpha (Slow-Motion Orbit)',
];

const STYLE_PRESETS = [
  'Commercial Food Photography',
  'Studio Lighting with Rim Glow',
  'Dramatic Culinary Sizzler',
  'Hero Commercial Shot',
  'Dynamic Action Plating',
  'Luxury Fine Dining',
  'Slow Motion Cinematic Video',
  'Festive Commercial Poster',
  'Dark & Moody Rustic Bokeh',
];

export default function SuperadminPromptsPage() {
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
  const [modalForm, setModalForm] = useState<{
    title: string;
    prompt: string;
    negativePrompt: string;
    category: string;
    mediaType: 'image' | 'video' | 'poster';
    aspectRatio: string;
    recommendedModel: string;
    stylePreset: string;
    referenceImages: string[];
    tags: string[];
    cameraNotes: string;
    isFavorite: boolean;
  }>({
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

  const [tagInput, setTagInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadingRefImage, setUploadingRefImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setTagInput('');
    setUrlInput('');
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
    setTagInput('');
    setUrlInput('');
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

  // Add Reference URL
  const handleAddRefUrl = () => {
    if (!urlInput.trim()) return;
    setModalForm((prev) => ({
      ...prev,
      referenceImages: [...prev.referenceImages, urlInput.trim()],
    }));
    setUrlInput('');
  };

  // Remove Reference Image
  const handleRemoveRefImage = (index: number) => {
    setModalForm((prev) => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index),
    }));
  };

  // Add Tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!modalForm.tags.includes(cleanTag)) {
      setModalForm((prev) => ({
        ...prev,
        tags: [...prev.tags, cleanTag],
      }));
    }
    setTagInput('');
  };

  // Remove Tag
  const handleRemoveTag = (tag: string) => {
    setModalForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
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
      {/* ── Compact Header matching Menu page ── */}
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

      {/* ── Sleek Compact Metrics Strip (shrink-0) ── */}
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

      {/* ── Search & Horizontally Scrollable Categories (matching Menu page) ── */}
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

        {/* Categories Horizontal Bar with counts matching listmenu */}
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

      {/* ── Content View matching Menu Page ── */}
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
          {prompts.map((p) => {
            const hasRefs = p.referenceImages && p.referenceImages.length > 0;
            return (
              <Card
                key={p.id}
                className="group relative flex flex-col justify-between overflow-hidden border border-border bg-card hover:border-primary/50 transition-all hover:shadow-md rounded-2xl p-5 space-y-4"
              >
                {/* 1. Header: Badges & Favorite */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge tone="primary" className="text-[11px] font-semibold">
                      {p.category}
                    </Badge>
                    <Badge
                      tone={p.mediaType === 'video' ? 'warning' : 'neutral'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {p.mediaType === 'video' ? '🎬 Reel' : p.mediaType === 'poster' ? '📄 Poster' : '📷 Photo'}
                    </Badge>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/60">
                      {p.aspectRatio}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(p.id, e)}
                    className={cn(
                      'rounded-lg p-1.5 transition-colors',
                      p.isFavorite
                        ? 'text-amber-500 hover:text-amber-600'
                        : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10'
                    )}
                    title={p.isFavorite ? 'Starred' : 'Star this prompt'}
                  >
                    {p.isFavorite ? (
                      <PiStarFill className="h-4 w-4" />
                    ) : (
                      <PiStarBold className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* 2. Title & Recommended Model */}
                <div>
                  <h3 className="font-bold text-foreground text-base tracking-tight" title={p.title}>
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <PiLightbulbFilamentBold className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-foreground/80">{p.recommendedModel}</span>
                    {p.stylePreset && <span>• {p.stylePreset}</span>}
                  </div>
                </div>

                {/* 3. THE PROMPT BOX (HERO OF THE CARD) */}
                <div className="relative rounded-xl border border-border bg-muted/30 p-3.5 group/box hover:bg-muted/40 transition-colors">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <PiNotebookBold className="h-3 w-3 text-primary" />
                      AI Prompt
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(p)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline transition-all"
                      title="Copy full prompt"
                    >
                      {copiedId === p.id ? (
                        <>
                          <PiCheckBold className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <PiCopyBold className="h-3.5 w-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-foreground/95 leading-relaxed font-sans line-clamp-5 select-all">
                    {p.prompt}
                  </p>
                </div>

                {/* 4. Optional Visual Reference Thumbnail & Camera Notes */}
                {(hasRefs || p.cameraNotes) && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border/60">
                    {hasRefs && (
                      <div
                        onClick={() => setPreviewImageUrl(p.referenceImages[0])}
                        className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-950 border border-border shrink-0 cursor-pointer group/ref hover:ring-2 hover:ring-primary transition-all"
                        title="Click to view full reference benchmark"
                      >
                        <img
                          src={p.referenceImages[0]}
                          alt="Ref"
                          className="h-full w-full object-cover transition-transform group-hover/ref:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/ref:opacity-100 transition-opacity">
                          <PiEyeBold className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-[11px]">
                      {p.cameraNotes ? (
                        <div className="flex items-start gap-1 text-muted-foreground">
                          <PiCameraBold className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{p.cameraNotes}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <PiCameraBold className="h-3 w-3 text-amber-500" />
                          <span>Plating Benchmark Attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. Tags */}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    {p.tags.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{p.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* 6. Footer Actions */}
                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUseInStudio(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 font-semibold text-xs"
                  >
                    <PiSparkleBold className="h-3.5 w-3.5" />
                    <span>Use in Studio</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleOpenEditModal(p, e)}
                    className="px-2.5 text-xs"
                    title="Edit Prompt"
                  >
                    <PiPencilSimpleBold className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeletePrompt(p.id, e)}
                    className="px-2.5 text-xs text-destructive hover:bg-destructive/10"
                    title="Delete Prompt"
                  >
                    <PiTrashBold className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>

            );
          })}
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          CREATE / EDIT PROMPT MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <PiNotebookBold className="h-5 w-5 text-primary" />
                  {editingPrompt ? 'Edit Stored Prompt' : 'Create New Prompt Template'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Save culinary image and video prompts along with photographic reference images.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <PiXBold className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePrompt} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Prompt Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Hyderabadi Dum Biryani in Claypot"
                    value={modalForm.title}
                    onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Category *
                  </label>
                  <select
                    value={modalForm.category}
                    onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Media Type, Aspect Ratio, & Recommended Model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Media Target
                  </label>
                  <select
                    value={modalForm.mediaType}
                    onChange={(e) =>
                      setModalForm({
                        ...modalForm,
                        mediaType: e.target.value as any,
                        aspectRatio: e.target.value === 'video' ? '9:16' : modalForm.aspectRatio,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="image">Photo (Still Image)</option>
                    <option value="video">Reel / Video</option>
                    <option value="poster">Poster Layout</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={modalForm.aspectRatio}
                    onChange={(e) => setModalForm({ ...modalForm, aspectRatio: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1:1">1:1 (Square - Feed)</option>
                    <option value="4:5">4:5 (Portrait - Instagram)</option>
                    <option value="9:16">9:16 (Vertical - Stories/Reels)</option>
                    <option value="16:9">16:9 (Landscape - Web Banner)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Recommended Model
                  </label>
                  <select
                    value={modalForm.recommendedModel}
                    onChange={(e) => setModalForm({ ...modalForm, recommendedModel: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                  >
                    {RECOMMENDED_MODELS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Prompt Text */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-foreground block">
                    AI Prompt Text *
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {modalForm.prompt.length} chars
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed culinary prompt describing lighting, plating, texture, dish garnish, background and camera angle..."
                  value={modalForm.prompt}
                  onChange={(e) => setModalForm({ ...modalForm, prompt: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary font-sans leading-relaxed"
                />
              </div>

              {/* Negative Prompt & Camera Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Negative Prompt (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="blurry, oversaturated, artificial look, cartoonish..."
                    value={modalForm.negativePrompt}
                    onChange={(e) => setModalForm({ ...modalForm, negativePrompt: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Camera & Staging Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 45° hero angle, 85mm f/2.2 lens, warm rim lighting..."
                    value={modalForm.cameraNotes}
                    onChange={(e) => setModalForm({ ...modalForm, cameraNotes: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────
                  REFERENCE IMAGES SECTION (Direct File Upload & URL)
              ──────────────────────────────────────────────────────── */}
              <div className="rounded-xl border border-border/80 bg-muted/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <PiCameraBold className="h-4 w-4 text-amber-500" />
                    <span>Reference Images (Style & Plating Benchmarks)</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    {modalForm.referenceImages.length} attached
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Attach real photos of food, lighting, or style references to guide generation or Midjourney / Ideogram / Flux image prompts.
                </p>

                {/* Upload or URL input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleUploadRefImage(e.target.files?.[0])}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingRefImage}
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    {uploadingRefImage ? (
                      <PiSpinnerBold className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <PiUploadSimpleBold className="h-3.5 w-3.5" />
                    )}
                    <span>Upload Image File</span>
                  </Button>

                  <div className="flex-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Or enter image URL (https://...)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddRefUrl}
                      disabled={!urlInput.trim()}
                    >
                      Add URL
                    </Button>
                  </div>
                </div>

                {/* Reference Thumbnails Preview */}
                {modalForm.referenceImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {modalForm.referenceImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-zinc-950"
                      >
                        <img src={imgUrl} alt={`Reference ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveRefImage(idx)}
                          className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove reference image"
                        >
                          <PiTrashBold className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags & Favorite toggle */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">
                  Tags
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. biryani, claypot, steam (press enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                    Add Tag
                  </Button>
                </div>

                {modalForm.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {modalForm.tags.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <PiXBold className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Starred Switch */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modal-fav"
                  checked={modalForm.isFavorite}
                  onChange={(e) => setModalForm({ ...modalForm, isFavorite: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="modal-fav" className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1.5">
                  <PiStarFill className="h-3.5 w-3.5 text-amber-500" />
                  <span>Mark as Starred / Favorite Prompt</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={actionLoading}>
                  {actionLoading ? (
                    <>
                      <PiSpinnerBold className="h-4 w-4 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : editingPrompt ? (
                    'Save Changes'
                  ) : (
                    'Create Prompt'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          IMAGE LIGHTBOX MODAL
      ────────────────────────────────────────────────────────────────────────── */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img
              src={previewImageUrl}
              alt="Reference Preview"
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-all"
            >
              <PiXBold className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
