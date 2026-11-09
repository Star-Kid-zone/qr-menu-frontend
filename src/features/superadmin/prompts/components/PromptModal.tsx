'use client';

import { useId, useRef, useState } from 'react';
import { PiTrashBold, PiUploadSimpleBold, PiXBold } from 'react-icons/pi';
import { Modal } from '@/components/Modal';
import { Button, FormField, Input, Textarea } from '@/components/ui';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { Select } from '@/components/ui/Select';
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
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

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

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" form={formId} loading={actionLoading}>
        {editingPrompt ? 'Save changes' : 'Save prompt'}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={editingPrompt ? 'Edit prompt' : 'New prompt'}
      maxWidth="max-w-2xl"
      footer={footer}
    >
      <form id={formId} onSubmit={onSave} className="space-y-4">
        <p className="text-body text-muted-foreground">
          Save image and video prompts for food photos, with reference pictures.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor={fieldId('title')} required>
            <Input
              id={fieldId('title')}
              required
              placeholder="e.g. Hyderabadi dum biryani in a clay pot"
              value={modalForm.title}
              onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </FormField>

          <FormField label="Category" htmlFor={fieldId('category')} required>
            <Select
              id={fieldId('category')}
              value={modalForm.category}
              onChange={(e) => setModalForm((prev) => ({ ...prev, category: e.target.value }))}
              options={PRESET_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Made for" htmlFor={fieldId('media')}>
            <Select
              id={fieldId('media')}
              value={modalForm.mediaType}
              onChange={(e) =>
                setModalForm((prev) => ({
                  ...prev,
                  mediaType: e.target.value as typeof prev.mediaType,
                  aspectRatio: e.target.value === 'video' ? '9:16' : prev.aspectRatio,
                }))
              }
              options={[
                { value: 'image', label: 'Photo' },
                { value: 'video', label: 'Reel or video' },
                { value: 'poster', label: 'Poster' },
              ]}
            />
          </FormField>

          <FormField label="Shape" htmlFor={fieldId('aspect')}>
            <Select
              id={fieldId('aspect')}
              value={modalForm.aspectRatio}
              onChange={(e) => setModalForm((prev) => ({ ...prev, aspectRatio: e.target.value }))}
              options={[
                { value: '1:1', label: 'Square (1:1)' },
                { value: '4:5', label: 'Portrait (4:5)' },
                { value: '9:16', label: 'Tall, for stories and reels (9:16)' },
                { value: '16:9', label: 'Wide, for web banners (16:9)' },
              ]}
            />
          </FormField>

          <FormField label="Best AI tool" htmlFor={fieldId('model')}>
            <Select
              id={fieldId('model')}
              value={modalForm.recommendedModel}
              onChange={(e) => setModalForm((prev) => ({ ...prev, recommendedModel: e.target.value }))}
              options={RECOMMENDED_MODELS.map((m) => ({ value: m, label: m }))}
            />
          </FormField>
        </div>

        <FormField
          label="Prompt"
          htmlFor={fieldId('prompt')}
          required
          hint={`${modalForm.prompt.length} characters. Describe lighting, plating, texture, garnish, background and camera angle.`}
        >
          <Textarea
            id={fieldId('prompt')}
            required
            rows={4}
            value={modalForm.prompt}
            onChange={(e) => setModalForm((prev) => ({ ...prev, prompt: e.target.value }))}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Things to avoid" htmlFor={fieldId('negative')} hint="Optional, e.g. blurry, oversaturated">
            <Textarea
              id={fieldId('negative')}
              rows={2}
              className="min-h-0"
              value={modalForm.negativePrompt}
              onChange={(e) => setModalForm((prev) => ({ ...prev, negativePrompt: e.target.value }))}
            />
          </FormField>

          <FormField label="Camera notes" htmlFor={fieldId('camera')} hint="Optional, e.g. 45° angle, warm side light">
            <Textarea
              id={fieldId('camera')}
              rows={2}
              className="min-h-0"
              value={modalForm.cameraNotes}
              onChange={(e) => setModalForm((prev) => ({ ...prev, cameraNotes: e.target.value }))}
            />
          </FormField>
        </div>

        <fieldset className="space-y-3 rounded-lg border border-border p-4">
          <legend className="px-1 text-body-medium text-foreground">Reference pictures</legend>
          <p className="text-caption text-muted-foreground">
            {modalForm.referenceImages.length} added. Real photos of food, lighting or style help guide the result.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              aria-hidden
              tabIndex={-1}
              onChange={(e) => onUploadRefImage(e.target.files?.[0])}
            />

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              loading={uploadingRefImage}
              leftIcon={<PiUploadSimpleBold className="size-4" aria-hidden />}
              className="shrink-0"
            >
              Upload picture
            </Button>

            <div className="flex flex-1 items-center gap-2">
              <Input
                id={fieldId('ref-url')}
                aria-label="Picture link"
                placeholder="Or paste a picture link (https://…)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="h-8"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddRefUrl} disabled={!urlInput.trim()}>
                Add link
              </Button>
            </div>
          </div>

          {modalForm.referenceImages.length > 0 && (
            <ul className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-4">
              {modalForm.referenceImages.map((imgUrl, idx) => (
                <li key={idx} className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external reference URLs */}
                  <img src={imgUrl} alt={`Reference ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveRefImage(idx)}
                    aria-label={`Remove reference ${idx + 1}`}
                    className="absolute right-1 top-1 rounded-full bg-card p-2 text-foreground shadow-sm hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <PiTrashBold className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <FormField label="Tags" htmlFor={fieldId('tags')} hint="Press Enter to add, e.g. biryani">
          <div className="flex items-center gap-2">
            <Input
              id={fieldId('tags')}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add tag
            </Button>
          </div>
        </FormField>

        {modalForm.tags.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2">
            {modalForm.tags.map((t) => (
              <li
                key={t}
                className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-caption text-foreground"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  aria-label={`Remove tag ${t}`}
                  className="rounded text-muted-foreground hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <PiXBold className="size-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={fieldId('fav')}
            checked={modalForm.isFavorite}
            onChange={(e) => setModalForm((prev) => ({ ...prev, isFavorite: e.target.checked }))}
            className="size-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor={fieldId('fav')} className="cursor-pointer text-body text-foreground">
            Star this prompt
          </label>
        </div>
      </form>
    </Modal>
  );
}
