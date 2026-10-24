'use client';

import { useState, useRef } from 'react';
import {
  PiNotebookBold,
  PiXBold,
  PiCameraBold,
  PiSpinnerBold,
  PiUploadSimpleBold,
  PiTrashBold,
  PiStarFill,
} from 'react-icons/pi';
import { Button } from '@/components/ui';
import { PRESET_CATEGORIES, RECOMMENDED_MODELS } from '../constants';
import type { PromptModalProps } from '../types';

export function PromptModal({
  isOpen,
  editingPrompt,
  form: modalForm,
  setForm: setModalForm,
  actionLoading,
  onClose,
  onSave,
  onUploadRefImage,
  uploadingRefImage,
}: PromptModalProps) {
  const [tagInput, setTagInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAddRefUrl = () => {
    if (!urlInput.trim()) return;
    setModalForm((prev) => ({
      ...prev,
      referenceImages: [...prev.referenceImages, urlInput.trim()],
    }));
    setUrlInput('');
  };

  const handleRemoveRefImage = (index: number) => {
    setModalForm((prev) => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index),
    }));
  };

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

  const handleRemoveTag = (tag: string) => {
    setModalForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
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
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <PiXBold className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-4">
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
                onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Category *
              </label>
              <select
                value={modalForm.category}
                onChange={(e) => setModalForm((prev) => ({ ...prev, category: e.target.value }))}
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
                  setModalForm((prev) => ({
                    ...prev,
                    mediaType: e.target.value as any,
                    aspectRatio: e.target.value === 'video' ? '9:16' : prev.aspectRatio,
                  }))
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
                onChange={(e) => setModalForm((prev) => ({ ...prev, aspectRatio: e.target.value }))}
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
                onChange={(e) => setModalForm((prev) => ({ ...prev, recommendedModel: e.target.value }))}
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
              onChange={(e) => setModalForm((prev) => ({ ...prev, prompt: e.target.value }))}
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
                onChange={(e) => setModalForm((prev) => ({ ...prev, negativePrompt: e.target.value }))}
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
                onChange={(e) => setModalForm((prev) => ({ ...prev, cameraNotes: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* REFERENCE IMAGES SECTION */}
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

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => onUploadRefImage(e.target.files?.[0])}
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

          {/* Tags */}
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
              onChange={(e) => setModalForm((prev) => ({ ...prev, isFavorite: e.target.checked }))}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="modal-fav" className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1.5">
              <PiStarFill className="h-3.5 w-3.5 text-amber-500" />
              <span>Mark as Starred / Favorite Prompt</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
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
  );
}
