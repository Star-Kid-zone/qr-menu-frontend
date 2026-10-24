'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiXBold,
  PiForkKnifeBold,
  PiPaintBrushBold,
  PiArticleBold,
  PiTagBold,
  PiImageBold,
  PiQuestionBold,
  PiClockBold,
  PiStarFill,
} from 'react-icons/pi';
import { Button } from '@/components/ui';
import type { BlueprintPreviewModalProps } from '../types';

export function BlueprintPreviewModal({
  blueprint: previewBlueprint,
  defaultBlueprintId,
  activeTab: activePreviewTab,
  onTabChange: setActivePreviewTab,
  onClose,
  onSetDefault,
}: BlueprintPreviewModalProps) {
  if (!previewBlueprint) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-border p-5 bg-card">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">{previewBlueprint.name}</h3>
                {previewBlueprint.id === defaultBlueprintId && (
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Active Default for Signups
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{previewBlueprint.tagline}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <PiXBold className="size-5" />
            </button>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex border-b border-border bg-muted/20 px-5 pt-2 gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActivePreviewTab('dishes')}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                activePreviewTab === 'dishes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <PiForkKnifeBold className="size-4" />
              <span>Menu Dishes ({previewBlueprint.items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('branding')}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                activePreviewTab === 'branding'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <PiPaintBrushBold className="size-4" />
              <span>Theme & Branding</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('story')}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                activePreviewTab === 'story'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <PiArticleBold className="size-4" />
              <span>Our Story & Stats</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('offers')}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                activePreviewTab === 'offers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <PiTagBold className="size-4" />
              <span>Special Offers ({previewBlueprint.offers?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('gallery_faqs')}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                activePreviewTab === 'gallery_faqs'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <PiImageBold className="size-4" />
              <span>
                Gallery ({previewBlueprint.gallery?.length || 0}) & FAQs ({previewBlueprint.faqs?.length || 0})
              </span>
            </button>
          </div>

          {/* Modal Body Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* 1. DISHES TAB */}
            {activePreviewTab === 'dishes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Preloaded Menu Catalog ({previewBlueprint.items.length} Items)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {previewBlueprint.categoryNames.map((cat) => (
                      <span key={cat} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {previewBlueprint.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs transition hover:border-primary/40"
                    >
                      <div className="relative size-18 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={item.imageUrl}
                          alt={item.item}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <p className="truncate text-xs font-bold text-foreground">{item.item}</p>
                          <span className="font-mono text-xs font-bold text-primary">${item.price}</span>
                        </div>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-medium text-foreground">
                            {item.category}
                          </span>
                          <span
                            className={
                              item.type === 'Veg'
                                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                : 'text-amber-600 font-semibold'
                            }
                          >
                            {item.type}
                          </span>
                          {item.popular && (
                            <span className="text-primary font-semibold">★ Popular</span>
                          )}
                          {item.calories && (
                            <span className="text-muted-foreground">{item.calories} kcal</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. THEME & BRANDING TAB */}
            {activePreviewTab === 'branding' && previewBlueprint.theme && (
              <div className="space-y-6">
                {/* Hero Banner Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Preloaded Hero Banner Image
                  </p>
                  <div className="relative h-44 w-full overflow-hidden rounded-xl border border-border">
                    <Image
                      src={previewBlueprint.theme.bannerUrl}
                      alt="Hero Banner"
                      fill
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-4 text-white"
                      style={{ background: previewBlueprint.theme.heroOverlay }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        {previewBlueprint.theme.themeBadge}
                      </span>
                      <h4 className="text-lg font-bold">{previewBlueprint.name}</h4>
                      <p className="text-xs text-white/90">{previewBlueprint.theme.heroTagline}</p>
                    </div>
                  </div>
                </div>

                {/* Color Palette Chips */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Branding Colors & Visual Tokens
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                      <span
                        className="size-7 rounded-lg border shadow-xs"
                        style={{ backgroundColor: previewBlueprint.theme.primaryColor }}
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-foreground">Primary</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          {previewBlueprint.theme.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                      <span
                        className="size-7 rounded-lg border shadow-xs"
                        style={{ backgroundColor: previewBlueprint.theme.secondaryColor }}
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-foreground">Secondary</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          {previewBlueprint.theme.secondaryColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                      <span
                        className="size-7 rounded-lg border shadow-xs"
                        style={{ backgroundColor: previewBlueprint.theme.accentColor }}
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-foreground">Accent / Canvas</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          {previewBlueprint.theme.accentColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3">
                      <span
                        className="size-7 rounded-lg border shadow-xs"
                        style={{ backgroundColor: previewBlueprint.theme.footerBgColor }}
                      />
                      <div>
                        <span className="block text-[11px] font-bold text-foreground">Footer Dark</span>
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          {previewBlueprint.theme.footerBgColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography & Marquee */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Typography System
                    </span>
                    <p className="text-xs font-semibold text-foreground">{previewBlueprint.theme.fontFamily}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Card Styling: <span className="font-mono text-primary">{previewBlueprint.theme.cardStyle}</span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Announcement Banner
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {previewBlueprint.theme.announcementText}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. OUR STORY & STATS TAB */}
            {activePreviewTab === 'story' && previewBlueprint.story && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Preloaded Story Narrative
                  </span>
                  <h4 className="text-lg font-bold text-foreground">{previewBlueprint.story.headline}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{previewBlueprint.story.body}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Preloaded Proof Stats
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {previewBlueprint.story.stats.map((s, idx) => (
                      <div key={idx} className="rounded-xl border border-border bg-card p-4 text-center">
                        <span className="block text-2xl font-bold text-primary">{s.value}</span>
                        <span className="block text-[11px] font-medium text-muted-foreground">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {previewBlueprint.business && (
                  <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PiClockBold className="size-5 text-primary" />
                      <div>
                        <span className="block text-xs font-bold text-foreground">Operating Schedule</span>
                        <span className="block text-xs text-muted-foreground">
                          {previewBlueprint.business.businessHours}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      7-Day Hours Configured
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 4. SPECIAL OFFERS TAB */}
            {activePreviewTab === 'offers' && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Preloaded Promotional Deals ({previewBlueprint.offers?.length || 0})
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(previewBlueprint.offers || []).map((offer, idx) => (
                    <div
                      key={idx}
                      className="flex overflow-hidden rounded-xl border border-border bg-card shadow-2xs"
                    >
                      <div className="relative size-28 shrink-0 bg-muted">
                        <Image
                          src={offer.imageUrl}
                          alt={offer.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3.5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-foreground">{offer.title}</h5>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                              {offer.discount}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                            {offer.description}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                          ✓ Auto-Active on Guest Portal
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. GALLERY & FAQS TAB */}
            {activePreviewTab === 'gallery_faqs' && (
              <div className="space-y-6">
                {/* Gallery photos */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Preloaded Atmosphere Photo Gallery ({previewBlueprint.gallery?.length || 0} Photos)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(previewBlueprint.gallery || []).map((g, idx) => (
                      <div key={idx} className="relative h-28 overflow-hidden rounded-xl border border-border">
                        <Image
                          src={g.imageUrl}
                          alt={`Gallery photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Preloaded Guest FAQs ({previewBlueprint.faqs?.length || 0} Questions)
                  </p>
                  <div className="space-y-2.5">
                    {(previewBlueprint.faqs || []).map((faq, idx) => (
                      <div key={idx} className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                        <p className="text-xs font-bold text-foreground flex items-center gap-2">
                          <PiQuestionBold className="size-3.5 text-primary shrink-0" />
                          {faq.question}
                        </p>
                        <p className="text-xs text-muted-foreground pl-5.5 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-border bg-muted/10 p-4">
            <Button variant="secondary" onClick={onClose}>
              Close Preview
            </Button>

            {previewBlueprint.id !== defaultBlueprintId ? (
              <Button
                onClick={() => {
                  onSetDefault(previewBlueprint.id);
                  onClose();
                }}
                variant="primary"
                leftIcon={<PiStarFill size={14} />}
              >
                Set as Registration Default
              </Button>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Currently Selected as Default
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
