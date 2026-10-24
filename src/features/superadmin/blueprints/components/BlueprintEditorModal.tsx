'use client';

import { motion } from 'framer-motion';
import {
  PiXBold,
  PiFloppyDiskBold,
  PiForkKnifeBold,
  PiPaintBrushBold,
  PiArticleBold,
  PiTagBold,
  PiSparkleBold,
} from 'react-icons/pi';
import type { MenuBlueprint } from '@/services/superadmin.service';
import { Button } from '@/components/ui';
import { useBlueprintEditorState } from '../hooks/useBlueprintEditorState';
import {
  BlueprintBasicSection,
  BlueprintDishesSection,
  BlueprintThemeSection,
  BlueprintStorySection,
  BlueprintOffersFaqsSection,
} from './sections';

interface BlueprintEditorModalProps {
  blueprint: MenuBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedBp: MenuBlueprint) => void;
}

export function BlueprintEditorModal({
  blueprint,
  isOpen,
  onClose,
  onSaved,
}: BlueprintEditorModalProps) {
  const {
    isEditing,
    activeTab,
    setActiveTab,
    saving,
    formData,
    setFormData,
    categoriesStr,
    handleCategoriesChange,
    addDish,
    updateDish,
    removeDish,
    addOffer,
    updateOffer,
    removeOffer,
    addFaq,
    updateFaq,
    removeFaq,
    updateGalleryUrl,
    addGalleryImage,
    removeGalleryImage,
    handleSave,
  } = useBlueprintEditorState({ blueprint, onSaved, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PiPaintBrushBold size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {isEditing ? `Edit Blueprint: ${formData.name}` : 'Create New Blueprint'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure full restaurant package (dishes, branding, story, offers, gallery, schedule, FAQs)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <PiXBold size={16} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex shrink-0 overflow-x-auto border-b border-border bg-muted/20 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <PiArticleBold size={15} />
            Basic Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dishes')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'dishes'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <PiForkKnifeBold size={15} />
            Dishes ({formData.items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <PiPaintBrushBold size={15} />
            Theme & Palette
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'story'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <PiSparkleBold size={15} />
            Story & Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('offers_faqs')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'offers_faqs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <PiTagBold size={15} />
            Offers, Gallery & FAQs
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'basic' && (
            <BlueprintBasicSection
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              categoriesStr={categoriesStr}
              handleCategoriesChange={handleCategoriesChange}
            />
          )}

          {activeTab === 'dishes' && (
            <BlueprintDishesSection
              items={formData.items}
              categoryNames={formData.categoryNames}
              addDish={addDish}
              updateDish={updateDish}
              removeDish={removeDish}
            />
          )}

          {activeTab === 'theme' && (
            <BlueprintThemeSection
              theme={formData.theme}
              setFormData={setFormData}
            />
          )}

          {activeTab === 'story' && (
            <BlueprintStorySection
              story={formData.story}
              setFormData={setFormData}
            />
          )}

          {activeTab === 'offers_faqs' && (
            <BlueprintOffersFaqsSection
              offers={formData.offers}
              gallery={formData.gallery}
              faqs={formData.faqs}
              addOffer={addOffer}
              updateOffer={updateOffer}
              removeOffer={removeOffer}
              updateGalleryUrl={updateGalleryUrl}
              addGalleryImage={addGalleryImage}
              removeGalleryImage={removeGalleryImage}
              addFaq={addFaq}
              updateFaq={updateFaq}
              removeFaq={removeFaq}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
          <Button onClick={onClose} variant="ghost" size="sm">
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            size="sm"
            leftIcon={<PiFloppyDiskBold size={15} />}
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Blueprint'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
