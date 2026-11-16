'use client';

import type { MenuBlueprint } from '@/services/superadmin.service';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { SubTabPills } from '@/components/ui/SubTabPills';
import { useBlueprintEditorState, type EditorTab } from '../hooks/useBlueprintEditorState';
import {
  BlueprintBasicSection,
  BlueprintDishesSection,
  BlueprintThemeSection,
  BlueprintStorySection,
  BlueprintOffersFaqsSection,
} from './sections';
import { BlueprintContentSection } from './sections/BlueprintContentSection';

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

  const tabs: { id: EditorTab; label: string }[] = [
    { id: 'basic', label: 'Details' },
    { id: 'dishes', label: `Dishes (${formData.items.length})` },
    { id: 'theme', label: 'Theme and colours' },
    { id: 'story', label: 'Story and stats' },
    { id: 'content', label: 'Website content' },
    { id: 'offers_faqs', label: 'Offers, gallery and FAQs' },
  ];

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" onClick={handleSave} loading={saving}>
        {isEditing ? 'Save changes' : 'Add starter menu'}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit starter menu: ${formData.name}` : 'New starter menu'}
      maxWidth="max-w-4xl"
      footer={footer}
    >
      <div className="space-y-6">
        <p className="text-body text-muted-foreground">
          Dishes, look, story, website content, offers, gallery and FAQs that a new restaurant starts with.
        </p>

        <SubTabPills options={tabs} active={activeTab} onChange={setActiveTab} />

        <div role="tabpanel" className="space-y-6">
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
            <BlueprintThemeSection theme={formData.theme} site={formData.site} setFormData={setFormData} />
          )}

          {activeTab === 'story' && (
            <BlueprintStorySection story={formData.story} setFormData={setFormData} />
          )}

          {activeTab === 'content' && <BlueprintContentSection content={formData.content} setFormData={setFormData} />}

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
      </div>
    </Modal>
  );
}
