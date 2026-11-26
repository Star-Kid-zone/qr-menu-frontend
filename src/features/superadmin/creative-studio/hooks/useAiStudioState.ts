'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { superadminService } from '@/services/superadmin.service';
import { toast } from '@/components/ui';
import { getApiErrorMessage } from '@/utils/errors';

interface UseAiStudioStateProps {
  onSaveSuccess: () => Promise<void>;
}

export function useAiStudioState({ onSaveSuccess }: UseAiStudioStateProps) {
  const searchParams = useSearchParams();

  // AI Mode & Prompt State
  const [aiMode, setAiMode] = useState<'image' | 'video'>('image');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageRatio, setImageRatio] = useState<'1:1' | '4:5' | '9:16' | '16:9'>('4:5');
  const [imageProvider, setImageProvider] = useState<'cloudflare' | 'pollinations' | 'openrouter'>('cloudflare');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Visual Reference Image
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
  const [copyVariants, setCopyVariants] = useState<Array<{ caption?: string; hashtags?: string[] }>>([]);
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [assetTitleInput, setAssetTitleInput] = useState('');
  const [savingAiAsset, setSavingAiAsset] = useState(false);

  // Search parameters synchronization (adjusted during render whenever the params change)
  const [syncedSearchParams, setSyncedSearchParams] = useState<typeof searchParams | null>(null);
  if (syncedSearchParams !== searchParams) {
    setSyncedSearchParams(searchParams);
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
        setImageRatio(ratioParam as '1:1' | '4:5' | '9:16' | '16:9');
      }
    }
  }

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

  // Upload Reference Image in Studio
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
      toast.error(getApiErrorMessage(err, 'Failed to upload reference image'));
    } finally {
      setUploadingStudioRef(false);
    }
  };

  // Generate Image
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
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'AI image generation failed'));
    } finally {
      setGeneratingImage(false);
    }
  };

  // Generate Video Reel
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
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Video reel generation failed'));
      setGeneratingVideo(false);
    }
  };

  // Save Prompt to Prompt Library: ask for a title in a PromptDialog, then save.
  const [promptTitleDefault, setPromptTitleDefault] = useState<string | null>(null);

  const handleSaveToPromptLibrary = async () => {
    const currentPrompt = aiMode === 'image' ? imagePrompt.trim() : videoPrompt.trim();
    if (!currentPrompt) {
      toast.warning('Please enter a prompt first to save it to your library');
      return;
    }
    setPromptTitleDefault((assetTitleInput || currentPrompt.slice(0, 35) + ' Special').trim());
  };

  const closePromptTitleDialog = () => setPromptTitleDefault(null);

  const savePromptWithTitle = async (title: string) => {
    const currentPrompt = aiMode === 'image' ? imagePrompt.trim() : videoPrompt.trim();
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
      setPromptTitleDefault(null);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to save prompt to library'));
    } finally {
      setSavingToLibrary(false);
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
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Copy generation failed'));
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
      await onSaveSuccess();
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to save to Vault'));
    } finally {
      setSavingAiAsset(false);
    }
  };

  return {
    promptTitleDefault,
    closePromptTitleDialog,
    savePromptWithTitle,
    aiMode,
    setAiMode,
    imagePrompt,
    setImagePrompt,
    imageRatio,
    setImageRatio,
    imageProvider,
    setImageProvider,
    generatingImage,
    generatedImageUrl,
    studioRefImage,
    setStudioRefImage,
    uploadingStudioRef,
    studioRefInputRef,
    handleStudioRefUpload,
    videoPrompt,
    setVideoPrompt,
    videoDuration,
    setVideoDuration,
    videoRatio,
    setVideoRatio,
    generatingVideo,
    videoStatus,
    generatedVideoUrl,
    savingToLibrary,
    copyTopic,
    copyVariants,
    generatingCopy,
    assetTitleInput,
    setAssetTitleInput,
    savingAiAsset,
    handleGenerateImage,
    handleGenerateVideo,
    handleSaveToPromptLibrary,
    handleGenerateCopy,
    handleSaveAiToVault,
  };
}
