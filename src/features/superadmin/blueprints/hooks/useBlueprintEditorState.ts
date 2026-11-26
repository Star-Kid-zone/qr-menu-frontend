'use client';

import { useState } from 'react';
import {
  superadminService,
  type MenuBlueprint,
  type BlueprintMenuItem,
  type BlueprintOffer,
  type BlueprintFaq,
} from '@/services/superadmin.service';
import { toast } from '@/components/ui';
import { getApiErrorMessage } from '@/utils/errors';
import { DEFAULT_NEW_BLUEPRINT } from '@/constants/blueprint.constants';


export type EditorTab = 'basic' | 'dishes' | 'theme' | 'story' | 'content' | 'offers_faqs';

interface UseBlueprintEditorStateProps {
  blueprint: MenuBlueprint | null;
  onSaved: (savedBp: MenuBlueprint) => void;
  onClose: () => void;
}

export function useBlueprintEditorState({
  blueprint,
  onSaved,
  onClose,
}: UseBlueprintEditorStateProps) {
  const isEditing = Boolean(blueprint);
  const [activeTab, setActiveTab] = useState<EditorTab>('basic');
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<MenuBlueprint>(() => {
    if (blueprint) {
      return JSON.parse(JSON.stringify(blueprint));
    }
    return JSON.parse(JSON.stringify(DEFAULT_NEW_BLUEPRINT));
  });

  const [categoriesStr, setCategoriesStr] = useState<string>(() => {
    return (blueprint?.categoryNames || DEFAULT_NEW_BLUEPRINT.categoryNames).join(', ');
  });

  const handleCategoriesChange = (val: string) => {
    setCategoriesStr(val);
    const parsed = val
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      categoryNames: parsed.length > 0 ? parsed : ['General'],
    }));
  };

  // Dish management
  const addDish = () => {
    const newItem: BlueprintMenuItem = {
      item: 'New Dish',
      price: '12.00',
      description: 'Description of this dish.',
      category: formData.categoryNames[0] || 'General',
      type: 'Food',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500&h=350',
      popular: false,
      dietaryTags: [],
      allergens: [],
      spiceLevel: 0,
      calories: 450,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const updateDish = (index: number, updates: Partial<BlueprintMenuItem>) => {
    setFormData((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], ...updates };
      return { ...prev, items: nextItems };
    });
  };

  const removeDish = (index: number) => {
    if (formData.items.length <= 1) {
      toast.error('A blueprint must have at least 1 dish.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Offer management
  const addOffer = () => {
    const newOffer: BlueprintOffer = {
      title: 'Special Promotion',
      description: 'Order today and enjoy this limited-time reward.',
      discount: '20% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400&h=250',
      badgeText: '20% OFF',
    };
    setFormData((prev) => ({
      ...prev,
      offers: [...(prev.offers || []), newOffer],
    }));
  };

  const updateOffer = (index: number, updates: Partial<BlueprintOffer>) => {
    setFormData((prev) => {
      const nextOffers = [...(prev.offers || [])];
      nextOffers[index] = { ...nextOffers[index], ...updates };
      return { ...prev, offers: nextOffers };
    });
  };

  const removeOffer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      offers: (prev.offers || []).filter((_, i) => i !== index),
    }));
  };

  // FAQ management
  const addFaq = () => {
    const newFaq: BlueprintFaq = {
      question: 'Frequently Asked Question',
      answer: 'Detailed helpful answer for dining guests.',
    };
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq],
    }));
  };

  const updateFaq = (index: number, updates: Partial<BlueprintFaq>) => {
    setFormData((prev) => {
      const nextFaqs = [...(prev.faqs || [])];
      nextFaqs[index] = { ...nextFaqs[index], ...updates };
      return { ...prev, faqs: nextFaqs };
    });
  };

  const removeFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index),
    }));
  };

  // Gallery management
  const updateGalleryUrl = (index: number, url: string) => {
    setFormData((prev) => {
      const nextGallery = [...(prev.gallery || [])];
      nextGallery[index] = { ...nextGallery[index], imageUrl: url };
      return { ...prev, gallery: nextGallery };
    });
  };

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [
        ...(prev.gallery || []),
        { imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800&h=800' },
      ],
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  // Save handler
  const handleSave = async () => {
    // Validation
    const cleanId = formData.id.trim().toLowerCase();
    if (!cleanId || !/^[a-z0-9_-]+$/.test(cleanId)) {
      toast.error('Identifier must contain only lowercase letters, numbers, hyphens, or underscores.');
      setActiveTab('basic');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Blueprint name is required.');
      setActiveTab('basic');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('Blueprint must contain at least 1 menu dish.');
      setActiveTab('dishes');
      return;
    }

    try {
      setSaving(true);
      const payload: MenuBlueprint = {
        ...formData,
        id: cleanId,
        categoryNames: formData.categoryNames.filter(Boolean),
      };

      let result: MenuBlueprint;
      if (isEditing) {
        const res = await superadminService.updateBlueprint(cleanId, payload);
        result = res.blueprint;
        toast.success(`Blueprint '${result.name}' updated successfully.`);
      } else {
        const res = await superadminService.createBlueprint(payload);
        result = res.blueprint;
        toast.success(`New blueprint '${result.name}' created successfully.`);
      }

      onSaved(result);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to save blueprint'));
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
