'use client';

import Image from '@/components/ui/Image';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui';
import { ModalFooter } from '@/components/ui/ModalFooter';
import { SubTabPills } from '@/components/ui/SubTabPills';
import type { BlueprintPreviewModalProps, PreviewTab } from '../types';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-body-medium text-foreground">{children}</h3>;
}

function ColourSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
      <span className="size-7 shrink-0 rounded-md border border-border" style={{ backgroundColor: value }} aria-hidden />
      <div className="min-w-0">
        <span className="block text-caption font-medium text-foreground">{label}</span>
        <span className="block truncate font-mono text-caption text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}

export function BlueprintPreviewModal({
  blueprint: previewBlueprint,
  defaultBlueprintId,
  activeTab: activePreviewTab,
  onTabChange: setActivePreviewTab,
  onClose,
  onSetDefault,
}: BlueprintPreviewModalProps) {
  if (!previewBlueprint) return null;

  const isDefault = previewBlueprint.id === defaultBlueprintId;

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: 'dishes', label: `Dishes (${previewBlueprint.items.length})` },
    { id: 'branding', label: 'Look and colours' },
    { id: 'story', label: 'Story and stats' },
    { id: 'offers', label: `Offers (${previewBlueprint.offers?.length || 0})` },
    {
      id: 'gallery_faqs',
      label: `Gallery (${previewBlueprint.gallery?.length || 0}) and FAQs (${previewBlueprint.faqs?.length || 0})`,
    },
  ];

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={onClose}>
        Close
      </Button>
      {!isDefault && (
        <Button
          type="button"
          onClick={() => {
            onSetDefault(previewBlueprint.id);
            onClose();
          }}
        >
          Use for new sign-ups
        </Button>
      )}
    </ModalFooter>
  );

  return (
    <Modal isOpen onClose={onClose} title={previewBlueprint.name} maxWidth="max-w-4xl" footer={footer}>
      <div className="space-y-6">
        <div className="space-y-2">
          {previewBlueprint.tagline && (
            <p className="text-body text-muted-foreground">{previewBlueprint.tagline}</p>
          )}
          {isDefault && (
            <span className="inline-flex rounded-full bg-success/10 px-3 py-0.5 text-caption font-medium text-success">
              Used for new sign-ups
            </span>
          )}
        </div>

        <SubTabPills options={tabs} active={activePreviewTab} onChange={setActivePreviewTab} />

        <div role="tabpanel" className="space-y-4">
          {activePreviewTab === 'dishes' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SectionLabel>{previewBlueprint.items.length} dishes</SectionLabel>
                <div className="flex flex-wrap gap-1">
                  {previewBlueprint.categoryNames.map((cat) => (
                    <span key={cat} className="rounded-md bg-muted px-2 py-0.5 text-caption text-foreground">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {previewBlueprint.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="relative size-18 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={item.imageUrl} alt={item.item} fill sizes="72px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <p className="truncate text-body-medium text-foreground">{item.item}</p>
                        <span className="text-body-medium text-foreground">${item.price}</span>
                      </div>
                      <p className="line-clamp-2 text-caption text-muted-foreground">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-caption">
                        <span className="rounded bg-muted px-2 py-0.5 text-foreground">{item.category}</span>
                        <span className={item.type === 'Veg' ? 'text-success' : 'text-muted-foreground'}>
                          {item.type}
                        </span>
                        {item.popular && <span className="text-primary">Popular</span>}
                        {item.calories && <span className="text-muted-foreground">{item.calories} kcal</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePreviewTab === 'branding' && previewBlueprint.theme && (
            <div className="space-y-6">
              <div className="space-y-2">
                <SectionLabel>Banner image</SectionLabel>
                <div className="relative h-44 w-full overflow-hidden rounded-lg border border-border">
                  <Image src={previewBlueprint.theme.bannerUrl} alt="Banner" fill className="object-cover" />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4 text-white"
                    style={{ background: previewBlueprint.theme.heroOverlay }}
                  >
                    <span className="text-caption text-white/80">{previewBlueprint.theme.themeBadge}</span>
                    <p className="text-h3">{previewBlueprint.name}</p>
                    <p className="text-caption text-white/90">{previewBlueprint.theme.heroTagline}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <SectionLabel>Colours</SectionLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <ColourSwatch label="Main" value={previewBlueprint.theme.primaryColor} />
                  <ColourSwatch label="Secondary" value={previewBlueprint.theme.secondaryColor} />
                  <ColourSwatch label="Background" value={previewBlueprint.theme.accentColor} />
                  <ColourSwatch label="Footer" value={previewBlueprint.theme.footerBgColor} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 rounded-lg border border-border bg-card p-4">
                  <SectionLabel>Font</SectionLabel>
                  <p className="text-body text-foreground">{previewBlueprint.theme.fontFamily}</p>
                  <p className="text-caption text-muted-foreground">Card style: {previewBlueprint.theme.cardStyle}</p>
                </div>

                <div className="space-y-1 rounded-lg border border-border bg-card p-4">
                  <SectionLabel>Announcement bar</SectionLabel>
                  <p className="text-body text-foreground">{previewBlueprint.theme.announcementText}</p>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'story' && previewBlueprint.story && (
            <div className="space-y-6">
              <div className="space-y-2 rounded-lg border border-border bg-card p-6">
                <p className="text-h3 text-foreground">{previewBlueprint.story.headline}</p>
                <p className="text-body text-muted-foreground">{previewBlueprint.story.body}</p>
              </div>

              <div className="space-y-2">
                <SectionLabel>Stats</SectionLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {previewBlueprint.story.stats.map((s, idx) => (
                    <div key={idx} className="rounded-lg border border-border bg-card p-4 text-center">
                      <span className="block text-h3 text-foreground">{s.value}</span>
                      <span className="block text-caption text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {previewBlueprint.business && (
                <div className="space-y-1 rounded-lg border border-border bg-card p-4">
                  <SectionLabel>Opening hours</SectionLabel>
                  <p className="text-body text-muted-foreground">{previewBlueprint.business.businessHours}</p>
                </div>
              )}
            </div>
          )}

          {activePreviewTab === 'offers' && (
            <div className="space-y-4">
              <SectionLabel>{previewBlueprint.offers?.length || 0} offers</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2">
                {(previewBlueprint.offers || []).map((offer, idx) => (
                  <div key={idx} className="flex overflow-hidden rounded-lg border border-border bg-card">
                    <div className="relative size-28 shrink-0 bg-muted">
                      <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1 p-4">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-body-medium text-foreground">{offer.title}</p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-caption text-primary">
                          {offer.discount}
                        </span>
                      </div>
                      <p className="text-caption text-muted-foreground">{offer.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePreviewTab === 'gallery_faqs' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <SectionLabel>{previewBlueprint.gallery?.length || 0} gallery photos</SectionLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(previewBlueprint.gallery || []).map((g, idx) => (
                    <div key={idx} className="relative h-28 overflow-hidden rounded-lg border border-border">
                      <Image src={g.imageUrl} alt={`Gallery photo ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <SectionLabel>{previewBlueprint.faqs?.length || 0} FAQs</SectionLabel>
                <dl className="space-y-2">
                  {(previewBlueprint.faqs || []).map((faq, idx) => (
                    <div key={idx} className="space-y-1 rounded-lg border border-border bg-card p-4">
                      <dt className="text-body-medium text-foreground">{faq.question}</dt>
                      <dd className="text-body text-muted-foreground">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
