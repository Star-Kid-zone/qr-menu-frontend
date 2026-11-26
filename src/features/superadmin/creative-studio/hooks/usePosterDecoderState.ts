'use client';

import { useState, useRef } from 'react';
import { superadminService } from '@/services/superadmin.service';
import { toast } from '@/components/ui';
import { getApiErrorMessage } from '@/utils/errors';

interface UsePosterDecoderStateProps {
  onSaveSuccess: () => Promise<void>;
}

export function usePosterDecoderState({ onSaveSuccess }: UsePosterDecoderStateProps) {
  const [decoderImageUrl, setDecoderImageUrl] = useState('');
  const [decoderFile, setDecoderFile] = useState<File | null>(null);
  const [uploadingDecoderFile, setUploadingDecoderFile] = useState(false);
  const [decoderInputMode, setDecoderInputMode] = useState<'upload' | 'url'>('upload');
  const [decoderContext, setDecoderContext] = useState('');
  const [decoderModel, setDecoderModel] = useState('google/gemini-2.0-flash-exp:free');
  const [decoding, setDecoding] = useState(false);
  const [decodedSpec, setDecodedSpec] = useState<Record<string, unknown> | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [refining, setRefining] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err: unknown) {
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
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Poster decoding failed'));
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
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to refine blueprint'));
    } finally {
      setRefining(false);
    }
  };

  // Save Decoded Poster to Vault
  const handleSaveDecodedToVault = async () => {
    if (!decodedSpec) return;
    try {
      setSavingTemplate(true);
      const specMeta = decodedSpec.meta as { title?: string } | undefined;
      const specLayers = decodedSpec.layers as Array<{ role?: string; text?: string }> | undefined;
      const specCanvas = decodedSpec.canvas as { width?: number; height?: number } | undefined;

      const title =
        specMeta?.title ||
        specLayers?.find((l) => l.role === 'headline')?.text ||
        'Decoded Poster Blueprint';

      await superadminService.createMarketingAsset({
        title,
        type: 'poster_spec',
        mediaUrl: decoderImageUrl,
        thumbnailUrl: decoderImageUrl,
        spec: decodedSpec,
        aspectRatio: `${specCanvas?.width || 1080}:${specCanvas?.height || 1350}`,
        captionSuggestion: `✨ ${title}! Freshly crafted for your menu. Order now via our online QR portal.`,
        hashtags: ['#FoodieSpecials', '#RestaurantDeals', '#FreshDaily', '#GourmetExperience'],
        categoryTag: 'Blueprint Template',
      });

      toast.success('Saved to Vault as Template!');
      await onSaveSuccess();
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to save blueprint'));
    } finally {
      setSavingTemplate(false);
    }
  };

  return {
    decoderImageUrl,
    setDecoderImageUrl,
    decoderFile,
    setDecoderFile,
    uploadingDecoderFile,
    decoderInputMode,
    setDecoderInputMode,
    decoderContext,
    setDecoderContext,
    decoderModel,
    setDecoderModel,
    decoding,
    decodedSpec,
    setDecodedSpec,
    refinementPrompt,
    setRefinementPrompt,
    refining,
    savingTemplate,
    fileInputRef,
    handleDecoderFileUpload,
    handleDecode,
    handleRefine,
    handleSaveDecodedToVault,
  };
}
