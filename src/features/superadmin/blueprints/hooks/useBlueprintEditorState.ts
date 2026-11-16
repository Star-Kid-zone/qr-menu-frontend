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
import { DEFAULT_TEMPLATE_SLUG } from '@/components/templates/core/defaultTemplate';

export type EditorTab = 'basic' | 'dishes' | 'theme' | 'story' | 'content' | 'offers_faqs';

export const DEFAULT_NEW_BLUEPRINT: MenuBlueprint = {
  id: '',
  name: '',
  tagline: '',
  categoryNames: ['Starters', 'Mains', 'Desserts', 'Beverages'],
  icon: 'utensils',
  badge: 'Custom',
  isCustom: true,
  site: { businessType: '', layout: '', skinId: '' },
  content: { amenities: [], awards: [], team: [], events: [] },
  theme: {
    landingTheme: DEFAULT_TEMPLATE_SLUG,
    menuTheme: 'modern-compact',
    landingStructure: 'split',
    menuStructure: 'accordion',
    primaryColor: '#0F766E',
    secondaryColor: '#FFFFFF',
    accentColor: '#F8FAFC',
    textPrimaryColor: '#0F172A',
    textSecondaryColor: '#475569',
    accentTextColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    footerBgColor: '#0F172A',
    sectionBgColor: '#F1F5F9',
    fontFamily: '"Plus Jakarta Sans","Inter",sans-serif',
    cardStyle: 'rounded-2xl shadow-sm border',
    heroOverlay: 'linear-gradient(to bottom, rgba(15,23,42,0.6), rgba(15,118,110,0.4))',
    themeBadge: '★ Handcrafted Cuisine ★',
    themeMarquee: 'Locally Sourced · Fresh Daily · Artisanal Recipes',
    heroTagline: 'Exceptional dining crafted with heart and passion',
    announcementText: 'Welcome! Explore our seasonal favorites today.',
    announcementEnabled: true,
    bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1400&h=600',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300&h=300',
  },
  story: {
    headline: 'Our Passion for Flavour',
    body: 'Born from a love of culinary excellence, every plate is prepared with fresh local ingredients and timeless kitchen craft.',
    stats: [
      { label: 'Years of Craft', value: '5+' },
      { label: 'Signature Dishes', value: '24' },
      { label: 'Happy Guests', value: '50k+' },
      { label: 'Guest Rating', value: '4.9★' },
    ],
  },
  business: {
    businessHours: 'Mon–Sun: 11:00 AM – 10:00 PM',
    availability: [
      { day: 'Monday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Tuesday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Wednesday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Thursday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Friday', startTime: '11:00 AM', endTime: '11:00 PM' },
      { day: 'Saturday', startTime: '10:00 AM', endTime: '11:00 PM' },
      { day: 'Sunday', startTime: '10:00 AM', endTime: '10:00 PM' },
    ],
  },
  items: [
    {
      item: 'Chef Signature Dish',
      price: '18.50',
      description: 'Slow-braised with organic herbs and served with seasonal garden vegetables.',
      category: 'Mains',
      type: 'Food',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500&h=350',
      popular: true,
      dietaryTags: ['Chef Special'],
      allergens: [],
      spiceLevel: 0,
      calories: 580,
    },
  ],
  offers: [
    {
      title: 'Welcome Special',
      description: 'Enjoy 15% off your entire first table order when ordering online.',
      discount: '15% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400&h=250',
      badgeText: '15% OFF',
    },
  ],
  gallery: [
    { imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800&h=800' },
    { imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800&h=800' },
    { imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800&h=800' },
    { imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800&h=800' },
  ],
  faqs: [
    { question: 'Do you take table reservations?', answer: 'Yes, reservations can be placed via phone or our online reservation portal.' },
    { question: 'Are vegetarian and vegan options available?', answer: 'Yes! We offer a variety of vegetarian, vegan, and gluten-sensitive selections.' },
  ],
};

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
