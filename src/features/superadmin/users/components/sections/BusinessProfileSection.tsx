'use client';

import React from 'react';
import {
  Card,
  Button,
  Input,
  FormField,
} from '@/components/ui';
import {
  PiBriefcaseBold,
  PiPencilSimpleBold,
  PiPhoneBold,
  PiWhatsappLogoBold,
  PiClockBold,
  PiMapPinBold,
  PiGlobeBold,
  PiShareNetworkBold,
  PiFloppyDiskBold,
  PiArrowSquareOutBold,
} from 'react-icons/pi';
import { getSocialPlatformIcon } from '@/components/templates/core/socialPlatforms';
import type { BusinessFormData, UserDetailResponse } from '../../types';

interface BusinessProfileSectionProps {
  primaryBusiness: UserDetailResponse['businesses'][0] | undefined;
  businessForm: BusinessFormData;
  setBusinessForm: React.Dispatch<React.SetStateAction<BusinessFormData>>;
  isEditingBusiness: boolean;
  setIsEditingBusiness: (val: boolean) => void;
  businessSaving: boolean;
  handleSaveBusiness: (e: React.FormEvent) => Promise<void>;
}

export function BusinessProfileSection({
  primaryBusiness,
  businessForm,
  setBusinessForm,
  isEditingBusiness,
  setIsEditingBusiness,
  businessSaving,
  handleSaveBusiness,
}: BusinessProfileSectionProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-2">
          <PiBriefcaseBold className="size-5 text-primary" />
          <h2 className="text-h3 font-bold text-foreground">
            Business Profile &amp; Settings
          </h2>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditingBusiness(!isEditingBusiness)}
          leftIcon={<PiPencilSimpleBold size={14} />}
        >
          {isEditingBusiness ? 'Cancel Editing' : 'Edit Business'}
        </Button>
      </div>

      <div className="p-6">
        {isEditingBusiness ? (
          <form onSubmit={handleSaveBusiness} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Business Name">
                <Input
                  value={businessForm.businessName}
                  onChange={(e) =>
                    setBusinessForm({
                      ...businessForm,
                      businessName: e.target.value,
                    })
                  }
                  required
                />
              </FormField>
              <FormField label="Contact Phone">
                <Input
                  value={businessForm.phone}
                  onChange={(e) =>
                    setBusinessForm({
                      ...businessForm,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </FormField>
              <FormField label="WhatsApp Number">
                <Input
                  value={businessForm.whatsappNumber}
                  onChange={(e) =>
                    setBusinessForm({
                      ...businessForm,
                      whatsappNumber: e.target.value,
                    })
                  }
                  placeholder="+1 555 010 2020"
                />
              </FormField>
              <FormField label="Website URL">
                <Input
                  value={businessForm.websiteUrl}
                  onChange={(e) =>
                    setBusinessForm({
                      ...businessForm,
                      websiteUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
              </FormField>
            </div>

            <FormField label="Address">
              <Input
                value={businessForm.address}
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    address: e.target.value,
                  })
                }
                placeholder="123 Gourmet Ave, Food City"
              />
            </FormField>

            <FormField label="Google Maps Location URL">
              <Input
                value={businessForm.locationUrl}
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    locationUrl: e.target.value,
                  })
                }
                placeholder="https://maps.google.com/?q=..."
              />
            </FormField>

            <FormField label="Operating Hours">
              <Input
                value={businessForm.businessHours}
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    businessHours: e.target.value,
                  })
                }
                placeholder="09:00 AM - 10:00 PM"
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditingBusiness(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={businessSaving}
                leftIcon={<PiFloppyDiskBold size={15} />}
              >
                Save Business Settings
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-caption font-bold text-muted-foreground">
                    Business name
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">
                    {primaryBusiness?.businessName || 'No business name set'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="flex items-center gap-1 text-caption font-bold text-muted-foreground">
                      <PiPhoneBold size={12} /> Phone
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground">
                      {primaryBusiness?.phone || '—'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="flex items-center gap-1 text-caption font-bold text-muted-foreground">
                      <PiWhatsappLogoBold size={12} /> WhatsApp
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground">
                      {primaryBusiness?.whatsappNumber || '—'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="flex items-center gap-1 text-caption font-bold text-muted-foreground">
                    <PiClockBold size={12} /> Hours
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {primaryBusiness?.businessHours || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="flex items-center gap-1 text-caption font-bold text-muted-foreground">
                    <PiMapPinBold size={12} /> Address
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {primaryBusiness?.address || 'No address on record'}
                  </p>
                  {primaryBusiness?.locationUrl && (
                    <a
                      href={primaryBusiness.locationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                    >
                      Open in Google Maps <PiArrowSquareOutBold size={12} />
                    </a>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="flex items-center gap-1 text-caption font-bold text-muted-foreground">
                    <PiGlobeBold size={12} /> Website URL
                  </p>
                  {primaryBusiness?.websiteUrl ? (
                    <a
                      href={primaryBusiness.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline"
                    >
                      {primaryBusiness.websiteUrl}{' '}
                      <PiArrowSquareOutBold size={12} />
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      No website URL
                    </p>
                  )}
                </div>

                {/* Social Media Channels */}
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="flex items-center gap-2 text-caption font-bold text-muted-foreground">
                    <PiShareNetworkBold size={12} /> Social Media Channels
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.isArray(primaryBusiness?.socialLinks) &&
                    primaryBusiness.socialLinks.length > 0 ? (
                      primaryBusiness.socialLinks.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <span className="text-primary">
                            {getSocialPlatformIcon(s.platform)}
                          </span>
                          <span className="capitalize">{s.platform}</span>
                          <PiArrowSquareOutBold
                            size={11}
                            className="text-muted-foreground"
                          />
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No social media links connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Day-by-Day Availability Schedule */}
            {Array.isArray(primaryBusiness?.availability) &&
              primaryBusiness.availability.length > 0 && (
                <div className="mt-4 rounded-xl border border-border bg-muted/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <PiClockBold className="size-3.5 text-primary" />
                    <p className="text-caption font-bold text-muted-foreground">
                      Opening hours by day
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
                    {primaryBusiness.availability.map((slot: { day: string; startTime: string; endTime: string }, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-card p-2 text-center"
                      >
                        <p className="text-caption font-bold text-foreground">
                          {slot.day}
                        </p>
                        <p className="mt-0.5 font-mono text-caption text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </Card>
  );
}
