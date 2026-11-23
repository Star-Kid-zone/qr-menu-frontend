'use client';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PiMegaphoneBold } from 'react-icons/pi';
import { FormField, Textarea, ToggleCard, toast } from '@/components/ui';
import { cn } from '@/utils/cn';
import { BannerAnnouncementFormProps, BannerAnnouncementValues } from "@/types/admin/workspace/BannerAnnouncementForm.types";

export const bannerAnnouncementSchema = z.object({
  announcement_enabled: z.boolean(),
  announcement_text: z.string(),
  // datetime-local input values ("YYYY-MM-DDTHH:mm") or "" for unset — parsed
  // to/from ISO strings at the API boundary in listbusiness/page.tsx.
  announcement_starts_at: z.string(),
  announcement_ends_at: z.string(),
}).refine(
  (v) => !v.announcement_starts_at || !v.announcement_ends_at || v.announcement_starts_at < v.announcement_ends_at,
  { message: "Start must be before end.", path: ["announcement_ends_at"] },
);

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
  const startsAt = useWatch({ control, name: 'announcement_starts_at' });
  const endsAt = useWatch({ control, name: 'announcement_ends_at' });
  const charCount = announcementText?.length ?? 0;

  useEffect(() => {
    if (isOpen) {
      onValuesChange?.({
        announcement_enabled: Boolean(announcementEnabled),
        announcement_text: announcementText ?? '',
        announcement_starts_at: startsAt ?? '',
        announcement_ends_at: endsAt ?? '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementEnabled, announcementText, startsAt, endsAt, isOpen]);

  const cardClass = 'space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm';

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        void handleSubmit(
          onSubmit,
          (invalidErrors) => {
            console.error("Banner announcement validation failed:", invalidErrors);
            const firstError = Object.values(invalidErrors)[0];
            const msg =
              firstError && typeof firstError === "object" && "message" in firstError
                ? String(firstError.message)
                : "Please check the form for errors.";
            toast.error(msg);
          }
        )(e);
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

        {announcementEnabled ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Show starting (optional)"
              htmlFor={`${formId}-starts-at`}
              error={errors.announcement_starts_at?.message}
              hint="Leave blank to show as soon as it's enabled"
            >
              <input
                id={`${formId}-starts-at`}
                type="datetime-local"
                disabled={disabled}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('announcement_starts_at')}
              />
            </FormField>
            <FormField
              label="Hide after (optional)"
              htmlFor={`${formId}-ends-at`}
              error={errors.announcement_ends_at?.message}
              hint="Leave blank to show indefinitely"
            >
              <input
                id={`${formId}-ends-at`}
                type="datetime-local"
                disabled={disabled}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('announcement_ends_at')}
              />
            </FormField>
          </div>
        ) : null}
      </section>
    </form>
  );
}
