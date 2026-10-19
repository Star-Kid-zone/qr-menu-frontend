'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiXBold,
  PiFloppyDiskBold,
  PiPlusBold,
  PiTrashBold,
  PiForkKnifeBold,
  PiPaintBrushBold,
  PiArticleBold,
  PiTagBold,
  PiImageBold,
  PiQuestionBold,
  PiClockBold,
  PiSparkleBold,
  PiCheckBold,
} from 'react-icons/pi';
import {
  superadminService,
  type MenuBlueprint,
  type BlueprintMenuItem,
  type BlueprintOffer,
  type BlueprintFaq,
  type BlueprintTheme,
} from '@/services/superadmin.service';
import { Button, toast } from '@/components/ui';

type EditorTab = 'basic' | 'dishes' | 'theme' | 'story' | 'offers_faqs';

interface BlueprintEditorModalProps {
  blueprint: MenuBlueprint | null; // null if creating a new blueprint
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedBp: MenuBlueprint) => void;
}

const DEFAULT_NEW_BLUEPRINT: MenuBlueprint = {
  id: '',
  name: '',
  tagline: '',
  categoryNames: ['Starters', 'Mains', 'Desserts', 'Beverages'],
  icon: 'utensils',
  badge: 'Custom',
  isCustom: true,
  theme: {
    landingTheme: 'bento-grid',
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

export function BlueprintEditorModal({
  blueprint,
  isOpen,
  onClose,
  onSaved,
}: BlueprintEditorModalProps) {
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

  if (!isOpen) return null;

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
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || err?.message || 'Failed to save blueprint');
    } finally {
      setSaving(false);
    }
  };

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
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">
                    Identifier Slug <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isEditing}
                    value={formData.id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
                    placeholder="e.g. taco_fiesta"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-60 focus:border-primary focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">Unique machine ID (lowercase letters, numbers, dashes, underscores).</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">
                    Blueprint Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Taqueria & Mezcal Bar"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">Marketing Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Wood-grilled street tacos, fresh guacamole, and hand-shaken agave cocktails"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">Badge Label</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Trending, Most Popular, Chef Special"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">Icon Name</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="utensils">Utensils (General)</option>
                    <option value="coffee">Coffee / Cafe</option>
                    <option value="pizza">Pizza / Bistro</option>
                    <option value="hamburger">Burger / Diner</option>
                    <option value="bowl-food">Bowl / Asian / Noodle</option>
                    <option value="fire">Fire / Grill / BBQ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">
                  Menu Categories Included (comma separated) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoriesStr}
                  onChange={(e) => handleCategoriesChange(e.target.value)}
                  placeholder="Street Tacos, Antojitos & Sides, Especiales, Margaritas"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {formData.categoryNames.map((cat) => (
                    <span key={cat} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISHES */}
          {activeTab === 'dishes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Menu Items ({formData.items.length})</h3>
                  <p className="text-xs text-muted-foreground">Every dish pre-loads directly into the tenant's live catalog.</p>
                </div>
                <Button onClick={addDish} variant="secondary" size="sm" leftIcon={<PiPlusBold size={14} />}>
                  Add Dish
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((dish, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={dish.item}
                        onChange={(e) => updateDish(idx, { item: e.target.value })}
                        placeholder="Dish name"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-muted-foreground">$</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={dish.price}
                          onChange={(e) => updateDish(idx, { price: e.target.value })}
                          placeholder="Price"
                          className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-bold text-primary text-right"
                        />
                      </div>
                      <button
                        onClick={() => removeDish(idx)}
                        className="text-muted-foreground hover:text-rose-500 p-1"
                        title="Delete dish"
                      >
                        <PiTrashBold size={16} />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground">Category</label>
                        <select
                          value={dish.category}
                          onChange={(e) => updateDish(idx, { category: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                        >
                          {formData.categoryNames.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground">Type</label>
                        <select
                          value={dish.type}
                          onChange={(e) => updateDish(idx, { type: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                        >
                          <option value="Food">Food</option>
                          <option value="Beverage">Beverage</option>
                          <option value="Dessert">Dessert</option>
                          <option value="Veg">Vegetarian</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                          <input
                            type="checkbox"
                            checked={Boolean(dish.popular)}
                            onChange={(e) => updateDish(idx, { popular: e.target.checked })}
                            className="size-4 rounded border-border text-primary focus:ring-primary"
                          />
                          Featured Popular Dish
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                      <textarea
                        rows={2}
                        value={dish.description}
                        onChange={(e) => updateDish(idx, { description: e.target.value })}
                        placeholder="Dish description with ingredients and craft notes..."
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground">Photo URL</label>
                        <input
                          type="text"
                          value={dish.imageUrl}
                          onChange={(e) => updateDish(idx, { imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground">
                          Dietary Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={(dish.dietaryTags || []).join(', ')}
                          onChange={(e) =>
                            updateDish(idx, {
                              dietaryTags: e.target.value
                                .split(',')
                                .map((t) => t.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Gluten-Free, Organic, Chef Special"
                          className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THEME & PALETTE */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Layout Templates</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">Landing Theme</label>
                    <select
                      value={formData.theme?.landingTheme || 'swiss'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, landingTheme: e.target.value } as BlueprintTheme,
                        }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                    >
                      <option value="swiss">Swiss Minimal</option>
                      <option value="bento-grid">Bento Grid</option>
                      <option value="card-based-ui">Card Based UI</option>
                      <option value="serif-elegance">Serif Elegance</option>
                      <option value="editorial-magazine">Editorial Magazine</option>
                      <option value="warm-rustic">Warm Rustic</option>
                      <option value="dark-mode-noir">Dark Mode Noir</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">Landing Structure</label>
                    <select
                      value={formData.theme?.landingStructure || 'split'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, landingStructure: e.target.value } as BlueprintTheme,
                        }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                    >
                      <option value="split">Split Layout</option>
                      <option value="cards">Stacked Cards</option>
                      <option value="dashboard">Dashboard Cards</option>
                      <option value="tabs">Tabbed Sections</option>
                      <option value="minimal">Minimal Grid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Color Palette (Tailored Tokens)</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">Primary Accent (Buttons/Badges)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.theme?.primaryColor || '#0F766E'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value } as BlueprintTheme,
                          }))
                        }
                        className="size-8 cursor-pointer rounded border border-border"
                      />
                      <input
                        type="text"
                        value={formData.theme?.primaryColor || '#0F766E'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value } as BlueprintTheme,
                          }))
                        }
                        className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">Surface / Card Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.theme?.secondaryColor || '#FFFFFF'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, secondaryColor: e.target.value } as BlueprintTheme,
                          }))
                        }
                        className="size-8 cursor-pointer rounded border border-border"
                      />
                      <input
                        type="text"
                        value={formData.theme?.secondaryColor || '#FFFFFF'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, secondaryColor: e.target.value } as BlueprintTheme,
                          }))
                        }
                        className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">Page Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.theme?.accentColor || '#F8FAFC'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, accentColor: e.target.value } as BlueprintTheme,
                          }))
                        }
                        className="size-8 cursor-pointer rounded border border-border"
                      />
                      <input
                        type="text"
                        value={formData.theme?.accentColor || '#F8FAFC'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, accentColor: e.target.value } as BlueprintTheme,
                          }))
                        }
                        className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">Text Heading Color</label>
                    <input
                      type="text"
                      value={formData.theme?.textPrimaryColor || '#0F172A'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, textPrimaryColor: e.target.value } as BlueprintTheme,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">Text Body Color</label>
                    <input
                      type="text"
                      value={formData.theme?.textSecondaryColor || '#475569'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, textSecondaryColor: e.target.value } as BlueprintTheme,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Imagery & Announcement */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hero & Storefront Branding</h3>
                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">Hero Banner Image URL</label>
                  <input
                    type="text"
                    value={formData.theme?.bannerUrl || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, bannerUrl: e.target.value } as BlueprintTheme,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">Announcement Strip Text</label>
                  <input
                    type="text"
                    value={formData.theme?.announcementText || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, announcementText: e.target.value } as BlueprintTheme,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORY & PROOF STATS */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">Story Headline</label>
                <input
                  type="text"
                  value={formData.story?.headline || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      story: { headline: e.target.value, body: prev.story?.body ?? '', stats: prev.story?.stats ?? [] },
                    }))
                  }
                  placeholder="e.g. Crafted with passion, baked with patience"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">Story Narrative Body</label>
                <textarea
                  rows={4}
                  value={formData.story?.body || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      story: { headline: prev.story?.headline ?? '', body: e.target.value, stats: prev.story?.stats ?? [] },
                    }))
                  }
                  placeholder="Describe your kitchen roots, culinary philosophies, and signature ingredient origins..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>

              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Proof Metrics (4 Stats)</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(formData.story?.stats || []).map((st, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5">
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const nextStats = [...(formData.story?.stats || [])];
                          nextStats[idx] = { ...nextStats[idx], value: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            story: { ...prev.story, stats: nextStats, headline: prev.story?.headline || '', body: prev.story?.body || '' },
                          }));
                        }}
                        placeholder="Value (e.g. 7+)"
                        className="w-24 rounded border border-border px-2 py-1 text-xs font-bold text-primary"
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const nextStats = [...(formData.story?.stats || [])];
                          nextStats[idx] = { ...nextStats[idx], label: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            story: { ...prev.story, stats: nextStats, headline: prev.story?.headline || '', body: prev.story?.body || '' },
                          }));
                        }}
                        placeholder="Label (e.g. Years Roasting)"
                        className="flex-1 rounded border border-border px-2 py-1 text-xs text-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OFFERS, GALLERY & FAQS */}
          {activeTab === 'offers_faqs' && (
            <div className="space-y-6">
              {/* Offers Section */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Special Offers</h3>
                    <p className="text-[11px] text-muted-foreground">Preloaded promotional deals.</p>
                  </div>
                  <Button onClick={addOffer} variant="secondary" size="sm" leftIcon={<PiPlusBold size={12} />}>
                    Add Offer
                  </Button>
                </div>

                <div className="space-y-3">
                  {(formData.offers || []).map((offer, idx) => (
                    <div key={idx} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={offer.title}
                          onChange={(e) => updateOffer(idx, { title: e.target.value })}
                          placeholder="Offer title"
                          className="flex-1 rounded border border-border px-2.5 py-1 text-xs font-bold text-foreground"
                        />
                        <input
                          type="text"
                          value={offer.discount}
                          onChange={(e) => updateOffer(idx, { discount: e.target.value })}
                          placeholder="Discount (e.g. 15% OFF)"
                          className="w-28 rounded border border-border px-2 py-1 text-xs font-semibold text-primary"
                        />
                        <button
                          onClick={() => removeOffer(idx)}
                          className="text-muted-foreground hover:text-rose-500"
                        >
                          <PiTrashBold size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={offer.description}
                        onChange={(e) => updateOffer(idx, { description: e.target.value })}
                        placeholder="Offer details and terms..."
                        className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gallery Photos</h3>
                  <Button onClick={addGalleryImage} variant="secondary" size="sm" leftIcon={<PiPlusBold size={12} />}>
                    Add Image
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(formData.gallery || []).map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                        <Image src={img.imageUrl} alt="preview" fill sizes="40px" className="object-cover" />
                      </div>
                      <input
                        type="text"
                        value={img.imageUrl}
                        onChange={(e) => updateGalleryUrl(idx, e.target.value)}
                        placeholder="Image URL"
                        className="flex-1 rounded border border-border px-2 py-1 text-xs text-foreground"
                      />
                      <button onClick={() => removeGalleryImage(idx)} className="text-muted-foreground hover:text-rose-500">
                        <PiTrashBold size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest FAQs */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Guest FAQs</h3>
                  <Button onClick={addFaq} variant="secondary" size="sm" leftIcon={<PiPlusBold size={12} />}>
                    Add FAQ
                  </Button>
                </div>

                <div className="space-y-3">
                  {(formData.faqs || []).map((faq, idx) => (
                    <div key={idx} className="rounded-lg border border-border bg-background p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, { question: e.target.value })}
                          placeholder="Question..."
                          className="flex-1 rounded border border-border px-2.5 py-1 text-xs font-bold text-foreground"
                        />
                        <button onClick={() => removeFaq(idx)} className="text-muted-foreground hover:text-rose-500">
                          <PiTrashBold size={14} />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                        placeholder="Answer..."
                        className="w-full rounded border border-border px-2.5 py-1 text-xs text-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
