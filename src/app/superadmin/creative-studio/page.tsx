'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  PiImagesBold,
  PiSparkleBold,
  PiFilmReelBold,
  PiEyeBold,
  PiTrashBold,
  PiPaperPlaneTiltBold,
  PiArrowsClockwiseBold,
  PiCheckCircleBold,
  PiDownloadSimpleBold,
  PiCopyBold,
  PiMagnifyingGlassBold,
  PiSpinnerBold,
  PiPlayBold,
  PiTextTBold,
  PiWarningCircleBold,
  PiCheckBold,
  PiFunnelBold,
  PiUploadSimpleBold,
  PiTagBold,
  PiXBold,
  PiTerminalBold,
  PiBrowsersBold,
  PiLightningBold,
  PiNotebookBold,
  PiCameraBold,
  PiPlusBold,
} from 'react-icons/pi';
import { routes } from '@/config/routes';
import {
  superadminService,
  type PlatformMarketingAsset,
} from '@/services/superadmin.service';
import { industryService } from '@/services/industry.service';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  ScrollableTabRow,
  Spinner,
  toast,
} from '@/components/ui';
import { cn } from '@/utils/cn';


type StudioTab = 'vault' | 'decoder' | 'aistudio' | 'automation';

const SAMPLE_DECODER_CONTEXTS = [
  {
    title: '🍛 South Indian Festival',
    text: 'South Indian festival offer poster. Extract bold Tamil typography (Noto Sans Tamil) and English subtitles, festival discount badge (FLAT 25% OFF), and authentic banana leaf meal presentation.',
  },
  {
    title: '🍗 Weekend Biryani Special',
    text: 'Weekend Biryani special flyer. Focus on rich royal color palette (dark brown, amber/gold), prominent price badge (₹299), Dum cooking tagline, and weekend limited-time offer sticker.',
  },
  {
    title: '🍷 Luxury Fine Dining',
    text: 'Modern fine-dining chef special menu card. Minimalist aesthetic, high-contrast Playfair Display serif fonts, muted gold accents, and multi-course tasting menu layout.',
  },
  {
    title: '🍔 Fast Food Combo',
    text: 'High-energy fast-food combo promotion. Punchy condensed display typography (Bebas Neue/Anton), bright yellow/crimson palette, Buy 1 Get 1 Free sticker, and QR order badge.',
  },
  {
    title: '☕ Cafe & Desserts',
    text: 'Cozy cafe and artisanal dessert promo. Casual script font highlights (Caveat/Pacifico), pastel background, happy hour timings (4 PM - 7 PM), and signature beverage spotlight.',
  },
  {
    title: '🌙 Midnight Delivery Deal',
    text: 'Late-night delivery promotional banner. Dark neon theme with electric violet/cyan accents, bold discount code tag (LATEBITE), and fast 30-min delivery guarantee line.',
  },
];

const AUTOMATION_SCRIPTS = [
  {
    id: 'chatgpt-attach.js',
    name: 'ChatGPT (GPT-4o / DALL-E 3)',
    host: 'chatgpt.com',
    desc: 'High realism, prompt fidelity & appetizing food lighting',
    badge: 'OpenAI',
  },
  {
    id: 'ideogram-attach.js',
    name: 'Ideogram AI (Poster Typography)',
    host: 'ideogram.ai',
    desc: 'World-class restaurant lettering, offers & typography hierarchy',
    badge: 'Typography',
  },
  {
    id: 'gemini-attach.js',
    name: 'Google Gemini Web App',
    host: 'gemini.google.com',
    desc: 'Fast generation with crisp food details and authentic plating',
    badge: 'Google',
  },
  {
    id: 'leonardo-attach.js',
    name: 'Leonardo AI',
    host: 'leonardo.ai',
    desc: 'Artistic culinary atmosphere & cinematic food photography',
    badge: 'Artistic',
  },
  {
    id: 'meta-attach.js',
    name: 'Meta Imagine AI',
    host: 'imagine.meta.com',
    desc: 'Instant vibrant social media graphic styles & bold colors',
    badge: 'Meta',
  },
  {
    id: 'bing-attach.js',
    name: 'Bing / Copilot Designer',
    host: 'copilot.microsoft.com',
    desc: 'Photorealistic food textures & authentic bokeh depth of field',
    badge: 'Microsoft',
  },
];

const PRESET_IMAGE_PROMPTS = [
  'Hyperrealistic Hyderabadi Dum Biryani in traditional clay pot with fresh mint garnish, warm ambient lighting, 4k food photography',
  'Artisanal Italian sourdough pizza with bubbling mozzarella, fresh basil and charred crust on rustic wooden board',
  'South Indian crispy masala dosa served with trio of colorful chutneys and hot sambar in brass bowls, steam rising',
  'Decadent chocolate lava cake with molten center, vanilla bean ice cream scoop and raspberry coulis drip, luxury restaurant',
  'Vibrant fresh sushi platter with salmon nigiri and spicy tuna rolls, slate board, minimalist modern aesthetic',
];

export default function SuperadminCreativeStudioPage() {
  const [activeTab, setActiveTab] = useState<StudioTab>('vault');
  const [assets, setAssets] = useState<PlatformMarketingAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [industries, setIndustries] = useState<any[]>([]);

  // Vault Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'poster_spec'>('all');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewAsset, setPreviewAsset] = useState<PlatformMarketingAsset | null>(null);
  const [publishModalAsset, setPublishModalAsset] = useState<PlatformMarketingAsset | null>(null);
  const [publishTarget, setPublishTarget] = useState<'all' | 'industry' | 'selected_tenants'>('all');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');
  const [targetWorkspaceIds, setTargetWorkspaceIds] = useState<string>('');
  const [publishing, setPublishing] = useState(false);

  // Poster Decoder State
  const [decoderImageUrl, setDecoderImageUrl] = useState('');
  const [decoderFile, setDecoderFile] = useState<File | null>(null);
  const [uploadingDecoderFile, setUploadingDecoderFile] = useState(false);
  const [decoderInputMode, setDecoderInputMode] = useState<'upload' | 'url'>('upload');
  const [decoderContext, setDecoderContext] = useState('');
  const [decoderModel, setDecoderModel] = useState('google/gemini-2.0-flash-exp:free');
  const [decoding, setDecoding] = useState(false);
  const [decodedSpec, setDecodedSpec] = useState<any>(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [refining, setRefining] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Image & Reel Generator State
  const searchParams = useSearchParams();
  const [aiMode, setAiMode] = useState<'image' | 'video'>('image');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageRatio, setImageRatio] = useState<'1:1' | '4:5' | '9:16' | '16:9'>('4:5');
  const [imageProvider, setImageProvider] = useState<'cloudflare' | 'pollinations' | 'openrouter'>('cloudflare');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Visual Reference Image in AI Studio
  const [studioRefImage, setStudioRefImage] = useState<string>('');
  const [uploadingStudioRef, setUploadingStudioRef] = useState(false);
  const studioRefInputRef = useRef<HTMLInputElement>(null);
  const [savingToLibrary, setSavingToLibrary] = useState(false);


  // AI Video Reel
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoRatio, setVideoRatio] = useState<'9:16' | '16:9'>('9:16');
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoJobId, setVideoJobId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Copywriter State
  const [copyTopic, setCopyTopic] = useState('');
  const [copyVariants, setCopyVariants] = useState<any[]>([]);
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [assetTitleInput, setAssetTitleInput] = useState('');
  const [savingAiAsset, setSavingAiAsset] = useState(false);

  // Module F: External Browser Automation State (Playwright CDP)
  const [automationScript, setAutomationScript] = useState('chatgpt-attach.js');
  const [automationPrompt, setAutomationPrompt] = useState(
    'Close-up aesthetic photo of steaming Hyderabadi Dum Biryani in traditional clay pot with fresh mint garnish, warm ambient restaurant lighting'
  );
  const [automationTitle, setAutomationTitle] = useState('');
  const [autoIngest, setAutoIngest] = useState(true);
  const [runningScript, setRunningScript] = useState(false);
  const [scriptLog, setScriptLog] = useState('');
  const [lastIngestedAsset, setLastIngestedAsset] = useState<PlatformMarketingAsset | null>(null);
  const [scriptDownloads, setScriptDownloads] = useState<Array<{ name: string; sizeBytes: number; mtime: number; kind: 'image' | 'video' }>>([]);
  const [loadingDownloads, setLoadingDownloads] = useState(false);
  const [ingestingDownload, setIngestingDownload] = useState<string | null>(null);

  // Load Assets from Backend
  const loadAssets = useCallback(async () => {
    try {
      setLoadingAssets(true);
      const res = await superadminService.listMarketingAssets();
      setAssets(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load marketing assets from Vault');
    } finally {
      setLoadingAssets(false);
    }
  }, []);

  // Load Industries
  useEffect(() => {
    industryService
      .getIndustries()
      .then((res: any) => {
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        setIndustries(list);
      })
      .catch(() => {});
    loadAssets();
  }, [loadAssets]);

  // Load Prompt / Reference Image from Query Parameters (e.g. from Prompt Library)
  useEffect(() => {
    const tabParam = searchParams.get('tab') as StudioTab | null;
    if (tabParam && ['vault', 'decoder', 'aistudio', 'automation'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const promptParam = searchParams.get('prompt');
    const mediaTypeParam = searchParams.get('mediaType');
    if (promptParam) {
      if (mediaTypeParam === 'video') {
        setAiMode('video');
        setVideoPrompt(promptParam);
      } else {
        setAiMode('image');
        setImagePrompt(promptParam);
      }
    }
    const refImgParam = searchParams.get('refImg');
    if (refImgParam) {
      setStudioRefImage(refImgParam);
    }
    const ratioParam = searchParams.get('aspectRatio');
    if (ratioParam && ['1:1', '4:5', '9:16', '16:9'].includes(ratioParam)) {
      if (mediaTypeParam === 'video') {
        setVideoRatio(ratioParam === '16:9' ? '16:9' : '9:16');
      } else {
        setImageRatio(ratioParam as any);
      }
    }
  }, [searchParams]);

  // Video Status Polling

  useEffect(() => {
    if (!videoJobId || videoStatus === 'completed' || videoStatus === 'failed') return;
    const interval = setInterval(async () => {
      try {
        const res = await superadminService.getVideoStatus(videoJobId);
        setVideoStatus(res.status);
        if (res.status === 'completed' && res.url) {
          setGeneratedVideoUrl(res.url);
          setGeneratingVideo(false);
          toast.success('AI Video Reel generated successfully!');
          clearInterval(interval);
        } else if (res.status === 'failed') {
          setGeneratingVideo(false);
          toast.error(res.error || 'Video generation failed');
          clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [videoJobId, videoStatus]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (publishedFilter === 'published' && !a.isPublishedToTenants) return false;
      if (publishedFilter === 'draft' && a.isPublishedToTenants) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title?.toLowerCase().includes(q);
        const matchesCategory = a.categoryTag?.toLowerCase().includes(q);
        const matchesCaption = a.captionSuggestion?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesCaption) return false;
      }
      return true;
    });
  }, [assets, typeFilter, publishedFilter, searchQuery]);

  // Vault Stats
  const vaultStats = useMemo(() => {
    return {
      total: assets.length,
      published: assets.filter((a) => a.isPublishedToTenants).length,
      images: assets.filter((a) => a.type === 'image').length,
      videos: assets.filter((a) => a.type === 'video').length,
      specs: assets.filter((a) => a.type === 'poster_spec').length,
    };
  }, [assets]);

  // Handle Publish / Dispatch
  const handlePublishAsset = async () => {
    if (!publishModalAsset) return;
    try {
      setPublishing(true);
      const workspaceIds =
        publishTarget === 'selected_tenants'
          ? targetWorkspaceIds
              .split(',')
              .map((id) => id.trim())
              .filter(Boolean)
          : undefined;

      await superadminService.publishAssetToTenants(publishModalAsset.id, {
        targetAudience: publishTarget,
        targetIndustryId: publishTarget === 'industry' ? selectedIndustryId : undefined,
        workspaceIds,
      });

      toast.success(
        `Asset successfully published to ${
          publishTarget === 'all'
            ? 'all tenants'
            : publishTarget === 'industry'
            ? 'targeted industry'
            : 'selected tenants'
        }!`
      );
      setPublishModalAsset(null);
      await loadAssets();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to publish asset');
    } finally {
      setPublishing(false);
    }
  };

  // Handle Delete Asset
  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to remove this asset from the Vault?')) return;
    try {
      await superadminService.deleteMarketingAsset(id);
      toast.success('Asset removed from Vault');
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (previewAsset?.id === id) setPreviewAsset(null);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete asset');
    }
  };

  // Handle Poster File Upload
  const handleDecoderFileUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, or WEBP)');
      return;
    }
    setDecoderFile(file);

    // Instant local base64 preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setDecoderImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server storage in background
    try {
      setUploadingDecoderFile(true);
      const res = await superadminService.uploadMarketingAsset(file);
      setDecoderImageUrl(res.url);
      toast.success(`Image "${file.name}" uploaded to storage!`);
    } catch (err: any) {
      console.warn('Storage upload error (using local base64):', err);
    } finally {
      setUploadingDecoderFile(false);
    }
  };

  // Handle Decode Poster
  const handleDecode = async () => {
    if (!decoderImageUrl.trim()) {
      toast.warning('Please upload a poster file or provide an image URL');
      return;
    }
    try {
      setDecoding(true);
      setDecodedSpec(null);
      const res = await superadminService.decodePoster({
        image: decoderImageUrl.trim(),
        hint: decoderContext.trim() || undefined,
        model: decoderModel,
      });
      setDecodedSpec(res.spec);
      toast.success('Poster successfully reverse-engineered into layout blueprint!');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Poster decoding failed');
    } finally {
      setDecoding(false);
    }
  };

  // Handle Refine Decoded Poster
  const handleRefine = async () => {
    if (!decodedSpec || !refinementPrompt.trim()) return;
    try {
      setRefining(true);
      const res = await superadminService.decodePoster({
        image: decoderImageUrl.trim(),
        hint: `Refinement Request: ${refinementPrompt.trim()}`,
        spec: decodedSpec,
        model: decoderModel,
      });
      setDecodedSpec(res.spec);
      toast.success('Layout blueprint refined!');
      setRefinementPrompt('');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to refine blueprint');
    } finally {
      setRefining(false);
    }
  };

  // Save Decoded Poster to Vault
  const handleSaveDecodedToVault = async () => {
    if (!decodedSpec) return;
    try {
      setSavingTemplate(true);
      const title =
        decodedSpec.meta?.title ||
        decodedSpec.layers?.find((l: any) => l.role === 'headline')?.text ||
        'Decoded Poster Blueprint';

      await superadminService.createMarketingAsset({
        title,
        type: 'poster_spec',
        mediaUrl: decoderImageUrl,
        thumbnailUrl: decoderImageUrl,
        spec: decodedSpec,
        aspectRatio: `${decodedSpec.canvas?.width || 1080}:${decodedSpec.canvas?.height || 1350}`,
        captionSuggestion: `✨ ${title}! Freshly crafted for your menu. Order now via our online QR portal.`,
        hashtags: ['#FoodieSpecials', '#RestaurantDeals', '#FreshDaily', '#GourmetExperience'],
        categoryTag: 'Blueprint Template',
      });

      toast.success('Saved to Vault as Template!');
      await loadAssets();
      setActiveTab('vault');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save blueprint');
    } finally {
      setSavingTemplate(false);
    }
  };

  // Handle Save Prompt to Prompt Library
  const handleSaveToPromptLibrary = async () => {
    const currentPrompt = aiMode === 'image' ? imagePrompt.trim() : videoPrompt.trim();
    if (!currentPrompt) {
      toast.warning('Please enter a prompt first to save it to your library');
      return;
    }
    const defaultTitle = (assetTitleInput || currentPrompt.slice(0, 35) + ' Special').trim();
    const title = window.prompt('Enter a title for this prompt template:', defaultTitle);
    if (!title || !title.trim()) return;

    try {
      setSavingToLibrary(true);
      await superadminService.createPrompt({
        title: title.trim(),
        prompt: currentPrompt,
        mediaType: aiMode === 'image' ? 'image' : 'video',
        aspectRatio: aiMode === 'image' ? imageRatio : videoRatio,
        referenceImages: studioRefImage ? [studioRefImage] : [],
        category: 'General',
        recommendedModel:
          aiMode === 'image'
            ? 'Ideogram 2.0 (Typography & Posters)'
            : 'Grok Imagine Video / Kling AI (Cinematic Reels)',
        stylePreset: 'Commercial Food Photography',
      });
      toast.success('Prompt successfully saved to your Prompt Library!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save prompt to library');
    } finally {
      setSavingToLibrary(false);
    }
  };

  // Handle Upload Reference Image in Studio
  const handleStudioRefUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, or WEBP)');
      return;
    }
    try {
      setUploadingStudioRef(true);
      const res = await superadminService.uploadMarketingAsset(file);
      setStudioRefImage(res.url);
      toast.success(`Reference image "${file.name}" attached!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload reference image');
    } finally {
      setUploadingStudioRef(false);
    }
  };

  // Handle Generate Image
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.warning('Please enter a description for the image');
      return;
    }
    try {
      setGeneratingImage(true);
      setGeneratedImageUrl(null);
      const res = await superadminService.generateAiImage({
        prompt: imagePrompt.trim(),
        aspectRatio: imageRatio,
        provider: imageProvider,
        referenceImageUrl: studioRefImage || undefined,
      });
      setGeneratedImageUrl(res.url);
      setCopyTopic(imagePrompt.trim());
      setAssetTitleInput(imagePrompt.slice(0, 40) + ' Special');
      toast.success('AI food image rendered and saved to storage!');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'AI image generation failed');
    } finally {
      setGeneratingImage(false);
    }
  };

  // Handle Generate Video Reel
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
      toast.warning('Please enter a prompt for the video reel');
      return;
    }
    try {
      setGeneratingVideo(true);
      setGeneratedVideoUrl(null);
      setVideoStatus('queued');
      const res = await superadminService.generateAiVideo({
        prompt: videoPrompt.trim(),
        duration: videoDuration,
        aspectRatio: videoRatio,
        firstFrameUrl: studioRefImage || undefined,
      });
      if (res.id) {
        setVideoJobId(res.id);
        setVideoStatus(res.status);
        toast.info('Video rendering job dispatched! Polling status...');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Video reel generation failed');

      setGeneratingVideo(false);
    }
  };

  // Generate Multi-Lingual Copy
  const handleGenerateCopy = async () => {
    const topic = copyTopic || imagePrompt || videoPrompt || 'Today Chef Special';
    try {
      setGeneratingCopy(true);
      const res = await superadminService.generateMarketingCopy({
        dishName: topic,
        description: topic,
        tone: 'energetic',
        languages: ['en', 'ta', 'hi'],
      });
      setCopyVariants(res.variants || []);
      toast.success('Multilingual marketing copy generated!');
    } catch (err: any) {
      console.error(err);
      toast.error('Copy generation failed');
    } finally {
      setGeneratingCopy(false);
    }
  };

  // Save AI Generated Media to Vault
  const handleSaveAiToVault = async () => {
    const mediaUrl = generatedImageUrl || generatedVideoUrl;
    if (!mediaUrl) return;
    try {
      setSavingAiAsset(true);
      const primaryCopy = copyVariants[0]?.caption || `Special Dish: ${copyTopic || 'Chef Signature Creation'}`;
      const hashtags = copyVariants[0]?.hashtags || ['#FoodLovers', '#DailySpecial', '#FreshTaste'];

      await superadminService.createMarketingAsset({
        title: assetTitleInput.trim() || 'AI Studio Creation',
        type: generatedVideoUrl ? 'video' : 'image',
        mediaUrl,
        thumbnailUrl: generatedImageUrl || undefined,
        aspectRatio: generatedVideoUrl ? videoRatio : imageRatio,
        captionSuggestion: primaryCopy,
        hashtags,
        categoryTag: generatedVideoUrl ? 'AI Reel' : 'AI Food Photo',
      });

      toast.success('Saved to Vault!');
      await loadAssets();
      setActiveTab('vault');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save to Vault');
    } finally {
      setSavingAiAsset(false);
    }
  };


  // Module F: Automation Runner Handlers
  const handleRunAutomation = async () => {
    if (!automationPrompt.trim()) {
      toast.warning('Please enter a prompt for the AI image');
      return;
    }
    try {
      setRunningScript(true);
      setScriptLog('Connecting to backend runner...\n');
      setLastIngestedAsset(null);

      const res = await superadminService.runAutomationScript(
        {
          script: automationScript,
          prompt: automationPrompt.trim(),
          title: automationTitle.trim() || undefined,
          autoIngest,
        },
        (chunk) => {
          setScriptLog((prev) => prev + chunk);
        }
      );

      if (res.ingestedAsset) {
        setLastIngestedAsset(res.ingestedAsset);
        toast.success(`Image generated and automatically committed to Vault! (ID #${res.ingestedAsset.id})`);
        await loadAssets();
      } else {
        toast.info('Script execution completed.');
      }
      await loadDownloads();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Script execution failed');
      setScriptLog((prev) => prev + `\n[CLIENT ERROR] ${err.message || String(err)}\n`);
    } finally {
      setRunningScript(false);
    }
  };

  const loadDownloads = useCallback(async () => {
    try {
      setLoadingDownloads(true);
      const res = await superadminService.listScriptDownloads();
      setScriptDownloads(res.files || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDownloads(false);
    }
  }, []);

  const handleIngestDownload = async (filename: string) => {
    try {
      setIngestingDownload(filename);
      const res = await superadminService.ingestScriptDownload({ filename });
      toast.success(`"${filename}" imported into Vault!`);
      await loadAssets();
      await loadDownloads();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to import file');
    } finally {
      setIngestingDownload(null);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-10">
      <PageHeader
        title="Creative Studio & Asset Distribution"
        description="Decode competitor flyers with Vision AI, synthesize hyperrealistic food photos & video reels, and dispatch marketing assets directly to tenant ad inboxes."
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'vault' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-2"
          >
            <PiImagesBold className="h-4 w-4" />
            <span>Vault & Dispatch Hub</span>
            <Badge tone="neutral" className="ml-1 text-xs">
              {assets.length}
            </Badge>
          </Button>

          <Button
            variant={activeTab === 'decoder' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('decoder')}
            className="flex items-center gap-2"
          >
            <PiEyeBold className="h-4 w-4 text-amber-500" />
            <span>Poster Reverse-Engineer</span>
            <Badge tone="warning" className="ml-1 text-[10px]">
              Vision AI
            </Badge>
          </Button>

          <Button
            variant={activeTab === 'aistudio' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('aistudio')}
            className="flex items-center gap-2"
          >
            <PiSparkleBold className="h-4 w-4 text-purple-500" />
            <span>AI Photo & Reel Studio</span>
          </Button>


          <Button
            variant={activeTab === 'automation' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTab('automation');
              loadDownloads();
            }}
            className="flex items-center gap-2"
          >
            <PiTerminalBold className="h-4 w-4 text-cyan-400" />
            <span>Browser Automator</span>
            <Badge tone="success" className="ml-1 text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none font-bold">
              Playwright CDP
            </Badge>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadAssets}
          disabled={loadingAssets}
          className="flex items-center gap-1.5"
        >
          <PiArrowsClockwiseBold className={cn('h-3.5 w-3.5', loadingAssets && 'animate-spin')} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 1: VAULT & DISPATCH HUB
      ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <Card className="p-4 bg-card/60 backdrop-blur-sm border-border">
              <div className="text-caption text-muted-foreground">Total Assets</div>
              <div className="text-2xl font-bold mt-1 text-foreground">{vaultStats.total}</div>
            </Card>
            <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
              <div className="text-caption text-emerald-600 dark:text-emerald-400 font-medium">Published to Tenants</div>
              <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {vaultStats.published}
              </div>
            </Card>
            <Card className="p-4 bg-card/60 border-border">
              <div className="text-caption text-muted-foreground">Photos & Graphics</div>
              <div className="text-2xl font-bold mt-1 text-foreground">{vaultStats.images}</div>
            </Card>
            <Card className="p-4 bg-purple-500/5 border-purple-500/20">
              <div className="text-caption text-purple-600 dark:text-purple-400 font-medium">Video Reels</div>
              <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">{vaultStats.videos}</div>
            </Card>
            <Card className="p-4 bg-amber-500/5 border-amber-500/20">
              <div className="text-caption text-amber-600 dark:text-amber-400 font-medium">Layout Blueprints</div>
              <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{vaultStats.specs}</div>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button
                variant={typeFilter === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('all')}
              >
                All Types
              </Button>
              <Button
                variant={typeFilter === 'image' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('image')}
              >
                Images ({vaultStats.images})
              </Button>
              <Button
                variant={typeFilter === 'video' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('video')}
              >
                Reels ({vaultStats.videos})
              </Button>
              <Button
                variant={typeFilter === 'poster_spec' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter('poster_spec')}
              >
                Specs ({vaultStats.specs})
              </Button>

              <div className="h-4 w-px bg-border mx-1" />

              <Button
                variant={publishedFilter === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPublishedFilter('all')}
              >
                Status: All
              </Button>
              <Button
                variant={publishedFilter === 'published' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPublishedFilter('published')}
              >
                Published
              </Button>
              <Button
                variant={publishedFilter === 'draft' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPublishedFilter('draft')}
              >
                Drafts
              </Button>
            </div>

            <div className="relative min-w-[220px]">
              <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search vault..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Assets Grid */}
          {loadingAssets ? (
            <div className="flex items-center justify-center py-24">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <EmptyState
              icon={<PiImagesBold className="h-10 w-10 text-muted-foreground" />}
              title="No assets found"
              description="Generate AI pictures, decode flyers, or run browser automation to populate your Vault."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className="group relative flex flex-col overflow-hidden border-border bg-card transition-all hover:shadow-lg hover:border-primary/40"
                >
                  {/* Media Preview Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                    {asset.type === 'video' ? (
                      <video
                        src={asset.mediaUrl}
                        className="h-full w-full object-cover"
                        controls={false}
                        muted
                        loop
                        playsInline
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                    ) : (
                      <img
                        src={asset.thumbnailUrl || asset.mediaUrl}
                        alt={asset.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    {/* Top Floating Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white uppercase backdrop-blur-md">
                        {asset.type === 'poster_spec' ? 'Blueprint' : asset.type}
                      </span>
                      <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-300 backdrop-blur-md">
                        {asset.aspectRatio || '4:5'}
                      </span>
                    </div>

                    {/* Published Status Pill */}
                    <div className="absolute top-2.5 right-2.5">
                      {asset.isPublishedToTenants ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm backdrop-blur-md">
                          <PiCheckCircleBold className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-md">
                          Vault Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-body line-clamp-1 text-foreground" title={asset.title}>
                      {asset.title}
                    </h3>

                    {asset.captionSuggestion && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                        {asset.captionSuggestion}
                      </p>
                    )}

                    <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Target:{' '}
                        <strong className="text-foreground capitalize font-medium">
                          {asset.targetAudience === 'selected_tenants'
                            ? 'Custom Tenants'
                            : asset.targetAudience === 'industry'
                            ? 'Industry'
                            : 'All Tenants'}
                        </strong>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewAsset(asset)}
                          className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Preview details"
                        >
                          <PiEyeBold className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPublishModalAsset(asset);
                            setPublishTarget(asset.targetAudience || 'all');
                            setSelectedIndustryId(asset.targetIndustryId || '');
                          }}
                          className="rounded-lg p-1.5 hover:bg-primary/10 text-primary transition-colors"
                          title="Publish / Dispatch to Tenants"
                        >
                          <PiPaperPlaneTiltBold className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="rounded-lg p-1.5 hover:bg-destructive/10 text-destructive transition-colors"
                          title="Delete"
                        >
                          <PiTrashBold className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 2: POSTER REVERSE-ENGINEER (DECODER)
      ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'decoder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Input & Config */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="p-5 space-y-4 border-border">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <PiEyeBold className="h-5 w-5 text-amber-500" />
                  Poster Vision Reverse-Engineer
                </h3>
                <p className="text-caption text-muted-foreground mt-1">
                  Upload competitor or promotional flyers. Vision AI extracts typography, colors, headline,
                  and layout layers into an editable, reusable layout blueprint.
                </p>
              </div>

              {/* Source Image: File Upload or Image URL */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Poster / Flyer Image
                  </label>
                  <div className="flex rounded-lg border border-border p-0.5 bg-muted/40 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDecoderInputMode('upload')}
                      className={cn(
                        'px-2.5 py-0.5 rounded font-medium transition-all',
                        decoderInputMode === 'upload' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecoderInputMode('url')}
                      className={cn(
                        'px-2.5 py-0.5 rounded font-medium transition-all',
                        decoderInputMode === 'url' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {decoderInputMode === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleDecoderFileUpload(e.target.files?.[0])}
                    />

                    {!decoderImageUrl ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.dataTransfer.files?.[0]) handleDecoderFileUpload(e.dataTransfer.files[0]);
                        }}
                        className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 p-6 text-center cursor-pointer transition-all hover:border-primary/60 hover:bg-primary/5 active:scale-[0.99]"
                      >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-4 ring-amber-500/5 transition-transform group-hover:scale-110">
                          {uploadingDecoderFile ? (
                            <PiSpinnerBold className="h-6 w-6 animate-spin" />
                          ) : (
                            <PiUploadSimpleBold className="h-6 w-6" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {uploadingDecoderFile ? 'Uploading to storage...' : 'Click to select flyer or drag & drop'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          PNG, JPG, or WEBP (up to 15MB)
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-border bg-card p-3 space-y-3">
                        <div className="relative aspect-[4/5] max-h-[300px] w-full overflow-hidden rounded-xl border border-border bg-zinc-950 flex items-center justify-center">
                          <img
                            src={decoderImageUrl}
                            alt="Uploaded Target Poster"
                            className="h-full w-full object-contain"
                          />
                          {uploadingDecoderFile && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2">
                              <PiSpinnerBold className="h-4 w-4 animate-spin" />
                              <span>Uploading to storage...</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="truncate max-w-[200px]">
                            <p className="font-medium text-foreground truncate">
                              {decoderFile?.name || 'Selected Poster Image'}
                            </p>
                            {decoderFile && (
                              <p className="text-[10px] text-muted-foreground">
                                {(decoderFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Change File
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDecoderImageUrl('');
                                setDecoderFile(null);
                                setDecodedSpec(null);
                              }}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <PiTrashBold className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="https://example.com/competitor-flyer.jpg"
                      value={decoderImageUrl}
                      onChange={(e) => {
                        setDecoderImageUrl(e.target.value);
                        setDecoderFile(null);
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    {decoderImageUrl && (
                      <div className="relative aspect-[4/5] w-full max-h-[280px] rounded-xl overflow-hidden border border-border bg-zinc-950 flex items-center justify-center">
                        <img
                          src={decoderImageUrl}
                          alt="Target Poster"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  AI Vision Model
                </label>
                <select
                  value={decoderModel}
                  onChange={(e) => setDecoderModel(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Fast & Free)</option>
                  <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Ultra Crisp Layouts)</option>
                  <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Maximum Spatial Accuracy)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground block">
                    Context / Special Instructions
                  </label>
                  <span className="text-[11px] text-muted-foreground">Click a sample to fill</span>
                </div>

                {/* Sample Context Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_DECODER_CONTEXTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDecoderContext(sample.text)}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] transition-all border',
                        decoderContext === sample.text
                          ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs'
                          : 'border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  placeholder="e.g. South Indian restaurant weekend festival flyer, extract pricing badges and Tamil font hierarchy..."
                  value={decoderContext}
                  onChange={(e) => setDecoderContext(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleDecode}
                disabled={decoding || !decoderImageUrl.trim()}
              >
                {decoding ? (
                  <>
                    <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                    Reverse-Engineering Blueprint...
                  </>
                ) : (
                  <>
                    <PiEyeBold className="h-4 w-4 mr-2" />
                    Decode Poster Blueprint
                  </>
                )}
              </Button>
            </Card>

            {/* Refinement Panel */}
            {decodedSpec && (
              <Card className="p-5 space-y-3 border-amber-500/20 bg-amber-500/5">
                <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Refine Layout Blueprint
                </h4>
                <p className="text-caption text-muted-foreground">
                  Give instructions to adjust colors, translate text to Tamil/Hindi, or modify discount tags.
                </p>
                <textarea
                  rows={2}
                  placeholder="e.g. Change primary color to luxury royal crimson and translate headline to Tamil..."
                  value={refinementPrompt}
                  onChange={(e) => setRefinementPrompt(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefine}
                  disabled={refining || !refinementPrompt.trim()}
                  className="w-full"
                >
                  {refining ? 'Refining...' : 'Apply AI Refinement'}
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column: Decoded Blueprint, Render & Save */}
          <div className="lg:col-span-7 space-y-5">
            {decodedSpec ? (
              <Card className="p-5 space-y-5 border-border">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-semibold text-base text-foreground">
                      Extracted Blueprint Layers
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Canvas: {decodedSpec.canvas?.width}x{decodedSpec.canvas?.height}px •{' '}
                      {decodedSpec.layers?.length || 0} layout layers identified
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveDecodedToVault}
                      disabled={savingTemplate}
                    >
                      {savingTemplate ? 'Saving...' : 'Save to Vault & Templates'}
                    </Button>
                  </div>
                </div>

                {/* Layer Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Layer Hierarchy
                  </h4>
                  <div className="divide-y divide-border rounded-lg border border-border bg-muted/20">
                    {decodedSpec.layers?.map((layer: any, idx: number) => (
                      <div key={layer.id || idx} className="p-3 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground capitalize">
                              {layer.role || 'Layer'}
                            </span>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {layer.fontFamily || 'Default Font'} ({layer.fontSize || 24}px)
                            </span>
                          </div>
                          <p className="text-muted-foreground font-mono text-[11px] line-clamp-1">
                            &ldquo;{layer.text || 'Graphic/Badge'}&rdquo;
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {layer.fill && (
                            <span
                              className="h-5 w-5 rounded-full border border-border shadow-inner"
                              style={{ backgroundColor: layer.fill }}
                              title={`Fill: ${layer.fill}`}
                            />
                          )}
                          <span className="text-muted-foreground font-mono text-[10px]">
                            ({layer.x}, {layer.y})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw JSON Spec Drawer */}
                <details className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
                  <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                    Inspect Raw PosterSpec JSON
                  </summary>
                  <pre className="mt-2 max-h-60 overflow-y-auto rounded bg-zinc-950 p-3 text-[11px] text-zinc-300 font-mono">
                    {JSON.stringify(decodedSpec, null, 2)}
                  </pre>
                </details>
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-border">
                <PiEyeBold className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h4 className="text-base font-semibold text-foreground">No Poster Decoded Yet</h4>
                <p className="text-caption text-muted-foreground max-w-sm mt-1">
                  Upload a poster file or enter an image URL on the left and click &ldquo;Decode Poster Blueprint&rdquo;
                  to extract the design hierarchy.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 3: AI PHOTO & VIDEO REEL STUDIO
      ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'aistudio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="p-5 space-y-4 border-border">
              {/* Header with Mode Toggle & Prompt Library Quick Access */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <PiSparkleBold className="h-5 w-5 text-purple-500" />
                  <h3 className="text-base font-semibold text-foreground">
                    AI Synthesis Studio
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
                    <button
                      onClick={() => setAiMode('image')}
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-semibold transition-all',
                        aiMode === 'image' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                      )}
                    >
                      Food Photo
                    </button>
                    <button
                      onClick={() => setAiMode('video')}
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-semibold transition-all',
                        aiMode === 'video' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                      )}
                    >
                      Video Reel
                    </button>
                  </div>

                  <Link href={routes.superadmin.prompts}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs flex items-center gap-1.5 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                      title="Open Prompt Library to browse or pick saved prompts"
                    >
                      <PiNotebookBold className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Prompt Library</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Save to Library Banner */}
              {(imagePrompt.trim() || videoPrompt.trim()) && (
                <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2 text-xs">
                  <span className="text-foreground/90 font-medium truncate mr-2">
                    Liked this prompt? Save it to your library with reference images.
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveToPromptLibrary}
                    disabled={savingToLibrary}
                    className="h-7 text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:bg-purple-500/15 shrink-0"
                  >
                    {savingToLibrary ? (
                      <PiSpinnerBold className="h-3 w-3 animate-spin" />
                    ) : (
                      <PiPlusBold className="h-3 w-3" />
                    )}
                    <span>Save to Library</span>
                  </Button>
                </div>
              )}

              {aiMode === 'image' ? (
                /* Food Image Form */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      Visual Prompt
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Sizzling Hyderabadi Mutton Biryani in traditional brass handi with fried onions, hot steam..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Visual Reference Image Section */}
                  <div className="space-y-2 rounded-xl border border-border/80 bg-muted/10 p-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <PiCameraBold className="h-3.5 w-3.5 text-amber-500" />
                        <span>Reference Image (Plating & Style Benchmark)</span>
                      </label>
                      {studioRefImage && (
                        <button
                          type="button"
                          onClick={() => setStudioRefImage('')}
                          className="text-[11px] text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {studioRefImage ? (
                      <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                        <div className="relative h-14 w-14 rounded-md overflow-hidden bg-zinc-950 shrink-0 border border-border">
                          <img src={studioRefImage} alt="Reference" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            Visual Reference Attached
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Guiding plating composition & lighting aesthetic
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => studioRefInputRef.current?.click()}
                          className="text-xs font-medium text-primary hover:underline shrink-0"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          ref={studioRefInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => handleStudioRefUpload(e.target.files?.[0])}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => studioRefInputRef.current?.click()}
                          disabled={uploadingStudioRef}
                          className="h-8 text-xs flex items-center gap-1.5 shrink-0"
                        >
                          {uploadingStudioRef ? (
                            <PiSpinnerBold className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <PiUploadSimpleBold className="h-3.5 w-3.5" />
                          )}
                          <span>Upload File</span>
                        </Button>
                        <input
                          type="text"
                          placeholder="Or paste reference image URL (https://...)"
                          value={studioRefImage}
                          onChange={(e) => setStudioRefImage(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    )}
                  </div>

                  {/* Preset Prompt Badges */}
                  <div>
                    <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Quick Creative Inspiration:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGE_PROMPTS.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setImagePrompt(p)}
                          className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground text-left line-clamp-1"
                        >
                          {p.slice(0, 32)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">
                        Aspect Ratio
                      </label>
                      <select
                        value={imageRatio}
                        onChange={(e: any) => setImageRatio(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="4:5">4:5 (Instagram Portrait)</option>
                        <option value="1:1">1:1 (Square Feed)</option>
                        <option value="9:16">9:16 (Story / Reel)</option>
                        <option value="16:9">16:9 (Landscape Banner)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">
                        AI Provider
                      </label>
                      <select
                        value={imageProvider}
                        onChange={(e: any) => setImageProvider(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="cloudflare">Cloudflare Flux Schnell</option>
                        <option value="pollinations">Pollinations Free Flux</option>
                        <option value="openrouter">OpenRouter Stable</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleGenerateImage}
                    disabled={generatingImage || !imagePrompt.trim()}
                  >
                    {generatingImage ? (
                      <>
                        <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                        Synthesizing Food Picture...
                      </>
                    ) : (
                      <>
                        <PiSparkleBold className="h-4 w-4 mr-2" />
                        Generate AI Food Photo
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                /* Video Reel Form */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      Video Motion Prompt
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Slow motion close-up of sizzling grilled tandoori chicken with embers, smoke rising, cinematic 4k..."
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Visual Reference Image for Video Reel */}
                  <div className="space-y-2 rounded-xl border border-border/80 bg-muted/10 p-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <PiCameraBold className="h-3.5 w-3.5 text-amber-500" />
                        <span>Starting Frame / Reference Image (Optional)</span>
                      </label>
                      {studioRefImage && (
                        <button
                          type="button"
                          onClick={() => setStudioRefImage('')}
                          className="text-[11px] text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {studioRefImage ? (
                      <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
                        <div className="relative h-14 w-14 rounded-md overflow-hidden bg-zinc-950 shrink-0 border border-border">
                          <img src={studioRefImage} alt="Reference" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            Starting Frame Image Attached
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Video will animate directly from this reference image
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => studioRefInputRef.current?.click()}
                          className="text-xs font-medium text-primary hover:underline shrink-0"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          ref={studioRefInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => handleStudioRefUpload(e.target.files?.[0])}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => studioRefInputRef.current?.click()}
                          disabled={uploadingStudioRef}
                          className="h-8 text-xs flex items-center gap-1.5 shrink-0"
                        >
                          {uploadingStudioRef ? (
                            <PiSpinnerBold className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <PiUploadSimpleBold className="h-3.5 w-3.5" />
                          )}
                          <span>Upload Starting Frame</span>
                        </Button>
                        <input
                          type="text"
                          placeholder="Or paste reference image URL (https://...)"
                          value={studioRefImage}
                          onChange={(e) => setStudioRefImage(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">
                        Format / Aspect Ratio
                      </label>
                      <select
                        value={videoRatio}
                        onChange={(e: any) => setVideoRatio(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="9:16">9:16 (Instagram Reel / Shorts)</option>
                        <option value="16:9">16:9 (Landscape Display)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">
                        Duration
                      </label>
                      <select
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={5}>5 Seconds (High Fidelity)</option>
                        <option value={10}>10 Seconds Extended</option>
                      </select>
                    </div>
                  </div>


                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleGenerateVideo}
                    disabled={generatingVideo || !videoPrompt.trim()}
                  >
                    {generatingVideo ? (
                      <>
                        <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                        Rendering Video Reel ({videoStatus || 'processing'})...
                      </>
                    ) : (
                      <>
                        <PiFilmReelBold className="h-4 w-4 mr-2" />
                        Generate AI Video Reel
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>

            {/* Smart Copywriter Card */}
            {(generatedImageUrl || generatedVideoUrl) && (
              <Card className="p-5 space-y-3 border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <PiTextTBold className="h-4 w-4 text-primary" />
                    Multi-Lingual Marketing Copy
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateCopy}
                    disabled={generatingCopy}
                  >
                    {generatingCopy ? 'Generating...' : 'Auto-Generate Captions'}
                  </Button>
                </div>

                {copyVariants.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {copyVariants.map((variant, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                            {variant.language || 'English'}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(variant.caption);
                              toast.success('Copied caption to clipboard!');
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <PiCopyBold className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-muted-foreground">{variant.caption}</p>
                        {variant.hashtags && (
                          <p className="text-primary font-mono text-[11px]">
                            {variant.hashtags.join(' ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Output & Vault Save Column */}
          <div className="lg:col-span-7 space-y-5">
            {generatedImageUrl || generatedVideoUrl ? (
              <Card className="p-5 space-y-5 border-border">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-semibold text-base text-foreground">Synthesis Output</h3>
                    <p className="text-xs text-muted-foreground">
                      Ready to be preserved in the Vault or dispatched to restaurant tenants.
                    </p>
                  </div>
                </div>

                <div className="relative aspect-[4/5] max-h-[460px] w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-border">
                  {generatedVideoUrl ? (
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <img
                      src={generatedImageUrl!}
                      alt="Generated AI Food"
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>

                {/* Save to Vault Form */}
                <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Save to Superadmin Vault
                  </h4>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Asset Title</label>
                    <input
                      type="text"
                      value={assetTitleInput}
                      onChange={(e) => setAssetTitleInput(e.target.value)}
                      placeholder="e.g. Signature Hyderabadi Dum Biryani"
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSaveAiToVault}
                    disabled={savingAiAsset}
                  >
                    {savingAiAsset ? (
                      <>
                        <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                        Saving to Vault...
                      </>
                    ) : (
                      <>
                        <PiImagesBold className="h-4 w-4 mr-2" />
                        Commit to Asset Vault
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-border">
                <PiSparkleBold className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h4 className="text-base font-semibold text-foreground">Studio Idle</h4>
                <p className="text-caption text-muted-foreground max-w-sm mt-1">
                  Choose a prompt on the left and synthesize hyperrealistic pictures or motion reels.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 5: MODULE F - EXTERNAL BROWSER AUTOMATION (PLAYWRIGHT CDP)
      ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          {/* Quick How-It-Works Banner */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent p-5 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-500 ring-1 ring-cyan-500/30">
                <PiBrowsersBold className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>Zero-Cost External AI Generator (Playwright Remote Chrome CDP)</span>
                  <span className="rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 font-bold uppercase">
                    No Paid API Keys Needed
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generate food imagery and typography posters using your personal ChatGPT Plus, Ideogram,
                  or Google Gemini subscriptions. The script attaches to your running Chrome window, enters
                  your prompt, captures the output, and <strong>automatically commits it to your Superadmin Vault</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Step 1: Open Chrome & sign in to target site
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Step 2: In Chrome, enable <code>chrome://inspect/#remote-debugging</code>
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Step 3: Click Run Script & click &ldquo;Allow&rdquo; in Chrome
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Script Selection & Config */}
            <div className="lg:col-span-5 space-y-5">
              <Card className="p-5 space-y-4 border-border">
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    1. Select Target Automation Script
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {AUTOMATION_SCRIPTS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setAutomationScript(s.id)}
                        className={cn(
                          'flex items-center justify-between rounded-xl border p-3 text-left transition-all',
                          automationScript === s.id
                            ? 'border-cyan-500 bg-cyan-500/10 shadow-xs'
                            : 'border-border bg-card hover:bg-muted text-muted-foreground'
                        )}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{s.name}</span>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                              {s.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{s.desc}</p>
                        </div>
                        <span className="rounded bg-background border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground shrink-0">
                          {s.host}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt textarea */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      2. Food / Poster Prompt
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={automationPrompt}
                    onChange={(e) => setAutomationPrompt(e.target.value)}
                    placeholder="Describe your dish or flyer..."
                    className="w-full rounded-lg border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                  />

                  {/* Preset Inspiration Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PRESET_IMAGE_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAutomationPrompt(p)}
                        className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground text-left line-clamp-1"
                      >
                        {p.slice(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Title & Auto Ingest */}
                <div className="space-y-3 pt-2 border-t border-border/80">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Vault Asset Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Biryani Bonanza Promo"
                      value={automationTitle}
                      onChange={(e) => setAutomationTitle(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground font-medium">
                    <input
                      type="checkbox"
                      checked={autoIngest}
                      onChange={(e) => setAutoIngest(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>Automatically upload and commit generated image to Superadmin Vault</span>
                  </label>
                </div>

                <Button
                  variant="primary"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  onClick={handleRunAutomation}
                  disabled={runningScript || !automationPrompt.trim()}
                >
                  {runningScript ? (
                    <>
                      <PiSpinnerBold className="h-4 w-4 animate-spin mr-2" />
                      Executing Playwright CDP Runner...
                    </>
                  ) : (
                    <>
                      <PiLightningBold className="h-4 w-4 mr-2" />
                      Run Automation &amp; Ingest to Vault
                    </>
                  )}
                </Button>
              </Card>

              {/* Local Downloads Drawer */}
              <Card className="p-4 space-y-3 border-border">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <PiImagesBold className="h-4 w-4 text-muted-foreground" />
                    <span>Existing Local Downloads ({scriptDownloads.length})</span>
                  </h4>
                  <button
                    onClick={loadDownloads}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <PiArrowsClockwiseBold className={cn('h-3 w-3', loadingDownloads && 'animate-spin')} />
                    Refresh
                  </button>
                </div>

                {scriptDownloads.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 text-center">
                    No files currently in <code>scripts/downloads</code>.
                  </p>
                ) : (
                  <div className="max-h-52 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                    {scriptDownloads.map((f) => (
                      <div key={f.name} className="flex items-center justify-between p-2.5 text-xs">
                        <div className="space-y-0.5 truncate pr-2">
                          <p className="font-semibold text-foreground truncate">{f.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {Math.round(f.sizeBytes / 1024)} KB • {new Date(f.mtime).toLocaleTimeString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-[11px] h-7 px-2"
                          onClick={() => handleIngestDownload(f.name)}
                          disabled={ingestingDownload === f.name}
                        >
                          {ingestingDownload === f.name ? 'Importing...' : 'Import to Vault'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column: Live Streaming Terminal & Output */}
            <div className="lg:col-span-7 space-y-5">
              {/* Live Ingested Asset Preview */}
              {lastIngestedAsset && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <PiCheckCircleBold className="h-4 w-4" />
                      Successfully Ingested to Vault (Asset ID #{lastIngestedAsset.id})
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setPublishModalAsset(lastIngestedAsset);
                        setActiveTab('vault');
                      }}
                    >
                      <PiPaperPlaneTiltBold className="h-3.5 w-3.5 mr-1" />
                      Dispatch to Tenants Now
                    </Button>
                  </div>

                  <div className="flex gap-4 items-center">
                    <img
                      src={lastIngestedAsset.mediaUrl}
                      alt={lastIngestedAsset.title}
                      className="h-28 w-28 rounded-xl object-cover border border-emerald-500/30 shadow-md"
                    />
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-foreground text-sm">{lastIngestedAsset.title}</p>
                      <p className="text-muted-foreground line-clamp-2">{lastIngestedAsset.captionSuggestion}</p>
                      <p className="text-primary font-mono text-[11px]">{lastIngestedAsset.hashtags?.join(' ')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming Terminal Window */}
              <Card className="overflow-hidden border-border bg-zinc-950 text-zinc-100 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-zinc-400">
                      playwright-cdp-console ~ {automationScript}
                    </span>
                  </div>

                  {runningScript && (
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400 animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      Streaming Execution Output...
                    </span>
                  )}
                </div>

                <pre className="max-h-[500px] min-h-[380px] overflow-y-auto p-4 font-mono text-xs leading-relaxed text-emerald-400 selection:bg-emerald-900 selection:text-white whitespace-pre-wrap">
                  {scriptLog || (
                    <span className="text-zinc-600">
                      Ready to execute automation script.
                      {'\n'}Select an AI engine on the left, type your prompt, and click &ldquo;Run Automation &amp; Ingest to Vault&rdquo;.
                      {'\n'}Logs from your local Chrome CDP session will stream here in real-time.
                    </span>
                  )}
                </pre>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: PREVIEW ASSET DETAILS
      ────────────────────────────────────────────────────────────────────────── */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setPreviewAsset(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <PiXBold className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary uppercase">
                  {previewAsset.type}
                </span>
                <h3 className="text-lg font-bold text-foreground">{previewAsset.title}</h3>
              </div>

              <div className="max-h-[380px] w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-border">
                {previewAsset.type === 'video' ? (
                  <video src={previewAsset.mediaUrl} controls className="h-full w-full object-contain" />
                ) : (
                  <img
                    src={previewAsset.mediaUrl}
                    alt={previewAsset.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              {previewAsset.captionSuggestion && (
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Suggested Caption
                  </span>
                  <p className="text-sm text-foreground">{previewAsset.captionSuggestion}</p>
                </div>
              )}

              {previewAsset.hashtags && previewAsset.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {previewAsset.hashtags.map((h, i) => (
                    <span
                      key={i}
                      className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setPreviewAsset(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setPublishModalAsset(previewAsset);
                    setPreviewAsset(null);
                  }}
                >
                  <PiPaperPlaneTiltBold className="h-4 w-4 mr-1.5" />
                  Publish to Tenants
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MODAL: PUBLISH / DISPATCH ASSET TO TENANTS
      ────────────────────────────────────────────────────────────────────────── */}
      {publishModalAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setPublishModalAsset(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <PiXBold className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <PiPaperPlaneTiltBold className="h-5 w-5 text-primary" />
                  Dispatch Asset to Tenant Inboxes
                </h3>
                <p className="text-caption text-muted-foreground mt-1">
                  Select which tenant workspaces should receive &ldquo;{publishModalAsset.title}&rdquo; in their
                  social media marketing library.
                </p>
              </div>

              {/* Target Audience Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPublishTarget('all')}
                    className={cn(
                      'rounded-xl border p-3 text-center text-xs transition-all',
                      publishTarget === 'all'
                        ? 'border-primary bg-primary/10 font-bold text-primary shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    )}
                  >
                    All Tenants
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishTarget('industry')}
                    className={cn(
                      'rounded-xl border p-3 text-center text-xs transition-all',
                      publishTarget === 'industry'
                        ? 'border-primary bg-primary/10 font-bold text-primary shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    )}
                  >
                    By Industry
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishTarget('selected_tenants')}
                    className={cn(
                      'rounded-xl border p-3 text-center text-xs transition-all',
                      publishTarget === 'selected_tenants'
                        ? 'border-primary bg-primary/10 font-bold text-primary shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    )}
                  >
                    Specific IDs
                  </button>
                </div>
              </div>

              {/* Industry Dropdown if selected */}
              {publishTarget === 'industry' && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Choose Target Industry
                  </label>
                  <select
                    value={selectedIndustryId}
                    onChange={(e) => setSelectedIndustryId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select an industry...</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name || ind.title || `Industry #${ind.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Specific IDs input if selected */}
              {publishTarget === 'selected_tenants' && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Workspace IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1, 4, 12"
                    value={targetWorkspaceIds}
                    onChange={(e) => setTargetWorkspaceIds(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground block mb-0.5">Distribution Guarantee:</span>
                Tenants receive the high-resolution media, pre-filled captions, and hashtag suggestions.
                They can publish on their connected accounts or download for local print/WhatsApp.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setPublishModalAsset(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePublishAsset}
                  disabled={publishing}
                >
                  {publishing ? (
                    <>
                      <PiSpinnerBold className="h-4 w-4 animate-spin mr-1.5" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <PiPaperPlaneTiltBold className="h-4 w-4 mr-1.5" />
                      Dispatch to Inboxes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
