'use client';

import React from 'react';
import Image from 'next/image';
import { PiPlusBold, PiTrashBold } from 'react-icons/pi';
import { Button } from '@/components/ui';
import type {
  BlueprintOffer,
  BlueprintGalleryItem,
  BlueprintFaq,
} from '@/services/superadmin.service';

interface BlueprintOffersFaqsSectionProps {
  offers?: BlueprintOffer[];
  gallery?: BlueprintGalleryItem[];
  faqs?: BlueprintFaq[];
  addOffer: () => void;
  updateOffer: (index: number, updates: Partial<BlueprintOffer>) => void;
  removeOffer: (index: number) => void;
  updateGalleryUrl: (index: number, url: string) => void;
  addGalleryImage: () => void;
  removeGalleryImage: (index: number) => void;
  addFaq: () => void;
  updateFaq: (index: number, updates: Partial<BlueprintFaq>) => void;
  removeFaq: (index: number) => void;
}

export function BlueprintOffersFaqsSection({
  offers = [],
  gallery = [],
  faqs = [],
  addOffer,
  updateOffer,
  removeOffer,
  updateGalleryUrl,
  addGalleryImage,
  removeGalleryImage,
  addFaq,
  updateFaq,
  removeFaq,
}: BlueprintOffersFaqsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Offers Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground">
              Special Offers
            </h3>
            <p className="text-caption text-muted-foreground">Preloaded promotional deals.</p>
          </div>
          <Button onClick={addOffer} variant="secondary" size="sm" leftIcon={<PiPlusBold size={12} />}>
            Add Offer
          </Button>
        </div>

        <div className="space-y-3">
          {offers.map((offer, idx) => (
            <div key={idx} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => updateOffer(idx, { title: e.target.value })}
                  placeholder="Offer title"
                  className="flex-1 rounded border border-border px-3 py-1 text-xs font-bold text-foreground"
                />
                <input
                  type="text"
                  value={offer.discount}
                  onChange={(e) => updateOffer(idx, { discount: e.target.value })}
                  placeholder="Discount (e.g. 15% OFF)"
                  className="w-28 rounded border border-border px-2 py-1 text-xs font-semibold text-primary"
                />
                <button
                  type="button"
                  onClick={() => removeOffer(idx)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <PiTrashBold size={14} />
                </button>
              </div>
              <input
                type="text"
                value={offer.description}
                onChange={(e) => updateOffer(idx, { description: e.target.value })}
                placeholder="Offer details and terms..."
                className="rounded border border-border px-3 py-1 text-xs text-muted-foreground"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground">
            Gallery Photos
          </h3>
          <Button onClick={addGalleryImage} variant="secondary" size="sm" leftIcon={<PiPlusBold size={12} />}>
            Add Image
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {gallery.map((img, idx) => (
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
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="text-muted-foreground hover:text-destructive"
              >
                <PiTrashBold size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Guest FAQs */}
      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground">
            Guest FAQs
          </h3>
          <Button onClick={addFaq} variant="secondary" size="sm" leftIcon={<PiPlusBold size={12} />}>
            Add FAQ
          </Button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-background p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, { question: e.target.value })}
                  placeholder="Question..."
                  className="flex-1 rounded border border-border px-3 py-1 text-xs font-bold text-foreground"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <PiTrashBold size={14} />
                </button>
              </div>
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                placeholder="Answer..."
                className="w-full rounded border border-border px-3 py-1 text-xs text-foreground"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
