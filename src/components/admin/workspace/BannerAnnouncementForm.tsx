'use client';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PiMegaphoneBold } from 'react-icons/pi';
import { FormField, StatusMessage, Textarea, ToggleCard } from '@/components/ui';
import { cn } from '@/utils/cn';
import { BannerAnnouncementFormProps, BannerAnnouncementValues } from "@/types/components/admin/workspace/BannerAnnouncementForm.types";

export const bannerAnnouncementSchema = z.object({
  announcement_enabled: z.boolean(),
  announcement_text: z.string(),
});

export function BannerAnnouncementForm({
  formId,
  isOpen,
  readOnly,
  compact = false,
  initialValues,
  onSubmit,
  error,
  loading = false,
  onValuesChange,
}: BannerAnnouncementFormProps) {
  const disabled = loading || readOnly;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BannerAnnouncementValues>({
    resolver: zodResolver(bannerAnnouncementSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(initialValues);
    }
  }, [initialValues, isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      reset(initialValues);
    }
  }, [isOpen, initialValues, reset]);

  const announcementEnabled = useWatch({ control, name: 'announcement_enabled' });
  const announcementText = useWatch({ control, name: 'announcement_text' });
  const charCount = announcementText?.length ?? 0;

  useEffect(() => {
    if (isOpen) {
      onValuesChange?.({ announcement_enabled: Boolean(announcementEnabled), announcement_text: announcementText ?? '' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementEnabled, announcementText, isOpen]);

  const cardClass = 'space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm';

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        void handleSubmit(onSubmit)(e);
      }}
      className={cn('py-1', compact ? 'space-y-4' : 'space-y-6 py-2')}
    >
      <section className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <PiMegaphoneBold className="size-5" />
          </div>
          <div>
            <h3 className="text-h3 text-foreground">Announcement banner</h3>
            <p className="text-caption text-muted-foreground">
              Short message shown at the top of your landing page
            </p>
          </div>
        </div>

        <Controller
          name="announcement_enabled"
          control={control}
          render={({ field }) => (
            <ToggleCard
              checked={Boolean(field.value)}
              onChange={field.onChange}
              label="Show announcement"
              description="Turn on to display the banner text to guests"
              disabled={disabled}
            />
          )}
        />

        {announcementEnabled ? (
          <FormField
            label="Announcement text"
            htmlFor={`${formId}-announcement`}
            error={errors.announcement_text?.message}
            hint={
              <span className={charCount > 60 ? 'text-warning' : undefined}>
                {charCount}/60 — keep it short for best visibility
              </span>
            }
          >
            <Textarea
              id={`${formId}-announcement`}
              rows={3}
              invalid={Boolean(errors.announcement_text)}
              className="resize-none"
              disabled={disabled}
              placeholder="Tonight's chef special is live from 7 PM."
              {...register('announcement_text')}
            />
          </FormField>
        ) : null}
      </section>

      {error ? <StatusMessage variant="error">{error}</StatusMessage> : null}
    </form>
  );
}
