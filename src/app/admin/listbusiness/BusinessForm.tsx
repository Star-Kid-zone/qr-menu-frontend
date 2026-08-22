"use client";

import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PiMinusBold, PiPlusBold } from "react-icons/pi";
import {
  SOCIAL_PLATFORM_OPTIONS,
  getSocialPlatformIcon,
} from "@/components/templates/core/socialPlatforms";

import {
  Button,
  Card,
  FormField,
  Input,
  Select,
  ToggleCard,
} from "@/components/ui";

import type { Industry } from "@/types";

// Form Schema
export const businessSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  phone: z.string().regex(/^\d{10,15}$/, "Phone number must be 10-15 digits"),
  address: z.string().min(1, "Address is required"),
  website_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  industry_id: z.number().nullable().optional(),
  social_media: z.array(
    z.object({
      platform: z.string().min(1, "Platform name is required"),
      url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    }),
  ),
  availability: z.array(
    z.object({
      day: z.string().min(1, "Day is required"),
      startTime: z.string().min(1, "Start time is required"),
      endTime: z.string().min(1, "End time is required"),
    }),
  ),
  active: z.boolean(),
});

export type BusinessSchemaValues = z.infer<typeof businessSchema>;

// `<input type="time">` only accepts/displays 24-hour "HH:mm". Seeded/legacy
// availability data stores 12-hour "hh:mm AM/PM" strings (fine as plain text
// on the public site), so convert to 24-hour here or the time boxes render blank.
function to24HourTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
  if (!match) return value;
  let hours = parseInt(match[1], 10) % 12;
  if (/pm/i.test(match[3])) hours += 12;
  return `${String(hours).padStart(2, "0")}:${match[2]}`;
}

interface RawSocialLink {
  platform?: string;
  icon?: string;
  name?: string;
  url?: string;
}

export interface BusinessFormInitialData {
  id: number;
  business_name?: string;
  phone?: string;
  address?: string;
  website_url?: string;
  industry_id?: number | null;
  active?: boolean;
  social_media?: RawSocialLink[];
  social_links?: RawSocialLink[];
  availability?: Array<{ day: string; startTime: string; endTime: string }>;
}

export const editBusinessFormId = (id: number) => `inline-edit-business-${id}`;

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function BusinessForm({
  formId,
  initialData,
  onSubmit,
  onLoadingChange,
  onValuesChange,
  industries,
  disabled = false,
  section = "profile",
}: {
  formId: string;
  initialData?: BusinessFormInitialData;
  onSubmit: (values: BusinessSchemaValues) => Promise<void>;
  onLoadingChange?: (loading: boolean) => void;
  onValuesChange?: (values: BusinessSchemaValues) => void;
  industries: Industry[];
  disabled?: boolean;
  section?: "profile" | "social" | "hours";
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessSchemaValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      business_name: "",
      phone: "",
      address: "",
      website_url: "",
      industry_id: null,
      social_media: [],
      availability: [],
      active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      const rawSocial = initialData.social_media ?? initialData.social_links;
      const normalizedSocial = Array.isArray(rawSocial)
        ? rawSocial.map((s: RawSocialLink) => ({
            platform: (s.platform || s.icon || "").toString(),
            url: (s.url || "").toString(),
          }))
        : [];

      reset({
        business_name: initialData.business_name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        website_url: initialData.website_url || "",
        industry_id: initialData.industry_id || null,
        active: Boolean(initialData.active),
        social_media: normalizedSocial,
        availability: Array.isArray(initialData.availability)
          ? initialData.availability.map((slot) => ({
              ...slot,
              startTime: to24HourTime(slot.startTime),
              endTime: to24HourTime(slot.endTime),
            }))
          : [],
      });
    }
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_media",
  });

  const {
    fields: availabilityFields,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    control,
    name: "availability",
  });

  const active = watch("active");
  const watchedValues = useWatch({ control });

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  useEffect(() => {
    if (!disabled) onValuesChange?.(watchedValues as BusinessSchemaValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, disabled]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex h-full min-h-0 flex-col gap-4">
        {section === "profile" && (
          <Card className="space-y-4 p-4 md:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                label="Business Name"
                htmlFor="business-name"
                error={errors.business_name?.message}
                required
              >
                <Input
                  id="business-name"
                  placeholder="e.g. Skyline Cafe"
                  invalid={Boolean(errors.business_name)}
                  disabled={disabled}
                  {...register("business_name")}
                />
              </FormField>
              <FormField
                label="Phone Number"
                htmlFor="business-phone"
                error={errors.phone?.message}
                required
              >
                <Input
                  id="business-phone"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  invalid={Boolean(errors.phone)}
                  disabled={disabled}
                  {...register("phone")}
                />
              </FormField>
              <FormField
                label="Industry"
                htmlFor="business-industry"
                error={errors.industry_id?.message}
              >
                <Select
                  id="business-industry"
                  invalid={Boolean(errors.industry_id)}
                  disabled={disabled}
                  // Explicit `value` makes this a controlled select so it stays
                  // correctly selected even if the `industries` options prop
                  // (fetched separately, async) resolves after `reset()` has
                  // already set industry_id — with only `register`, the
                  // uncontrolled DOM select silently fails to select an
                  // <option> that doesn't exist yet and never re-syncs.
                  value={watch("industry_id") ?? ""}
                  {...register("industry_id", {
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                >
                  <option value="">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField
                label="Website URL"
                htmlFor="business-website"
                error={errors.website_url?.message}
              >
                <Input
                  id="business-website"
                  type="url"
                  placeholder="https://..."
                  invalid={Boolean(errors.website_url)}
                  disabled={disabled}
                  {...register("website_url")}
                />
              </FormField>
              <FormField
                label="Business Address"
                htmlFor="business-address"
                error={errors.address?.message}
                required
                className="md:col-span-2"
              >
                <Input
                  id="business-address"
                  placeholder="Full address of the branch"
                  invalid={Boolean(errors.address)}
                  disabled={disabled}
                  {...register("address")}
                />
              </FormField>
            </div>
          </Card>
        )}

        {section === "social" && (
        <Card className="space-y-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-h3 text-foreground">Social Media</h2>
              <p className="text-caption text-muted-foreground">
                Add only the channels you want to display publicly.
              </p>
            </div>
            {!disabled && (
              <Button
                type="button"
                size="sm"
                leftIcon={<PiPlusBold />}
                onClick={() => append({ platform: "", url: "" })}
              >
                Add Platform
              </Button>
            )}
          </div>
          {fields.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <FormField
                    label="Platform"
                    htmlFor={`social-media-platform-${index}`}
                    error={errors.social_media?.[index]?.platform?.message}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                        {getSocialPlatformIcon(watch(`social_media.${index}.platform`))}
                      </div>
                      <Select
                        id={`social-media-platform-${index}`}
                        invalid={Boolean(errors.social_media?.[index]?.platform)}
                        disabled={disabled}
                        {...register(`social_media.${index}.platform`)}
                      >
                        <option value="">Select platform</option>
                        {SOCIAL_PLATFORM_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </FormField>
                  <FormField
                    label="URL"
                    htmlFor={`social-media-url-${index}`}
                    error={errors.social_media?.[index]?.url?.message}
                  >
                    <Input
                      id={`social-media-url-${index}`}
                      type="url"
                      placeholder="https://..."
                      invalid={Boolean(errors.social_media?.[index]?.url)}
                      disabled={disabled}
                      {...register(`social_media.${index}.url`)}
                    />
                  </FormField>
                  {!disabled && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="min-h-11 px-3 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <PiMinusBold />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/10 px-6 py-8 text-center text-caption text-muted-foreground">
              No social media links added yet.
            </div>
          )}
        </Card>
        )}

        {section === "hours" && (
        <Card className="space-y-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-h3 text-foreground">Availability</h2>
              <p className="text-caption text-muted-foreground">
                Keep operating hours consistent across every branch.
              </p>
            </div>
            {!disabled && (
              <Button
                type="button"
                size="sm"
                leftIcon={<PiPlusBold />}
                onClick={() =>
                  appendAvailability({ day: "", startTime: "", endTime: "" })
                }
              >
                Add Hours
              </Button>
            )}
          </div>
          {availabilityFields.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {availabilityFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <FormField
                    label="Day"
                    htmlFor={`availability-day-${index}`}
                    error={errors.availability?.[index]?.day?.message}
                  >
                    <Select
                      id={`availability-day-${index}`}
                      invalid={Boolean(errors.availability?.[index]?.day)}
                      disabled={disabled}
                      {...register(`availability.${index}.day`)}
                    >
                      <option value="">Select day</option>
                      {weekDays.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField
                    label="Start"
                    htmlFor={`availability-start-${index}`}
                    error={errors.availability?.[index]?.startTime?.message}
                  >
                    <Input
                      id={`availability-start-${index}`}
                      type="time"
                      invalid={Boolean(errors.availability?.[index]?.startTime)}
                      disabled={disabled}
                      {...register(`availability.${index}.startTime`)}
                    />
                  </FormField>
                  <FormField
                    label="End"
                    htmlFor={`availability-end-${index}`}
                    error={errors.availability?.[index]?.endTime?.message}
                  >
                    <Input
                      id={`availability-end-${index}`}
                      type="time"
                      invalid={Boolean(errors.availability?.[index]?.endTime)}
                      disabled={disabled}
                      {...register(`availability.${index}.endTime`)}
                    />
                  </FormField>
                  {!disabled && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="min-h-11 px-3 text-muted-foreground hover:text-destructive"
                        onClick={() => removeAvailability(index)}
                      >
                        <PiMinusBold />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/10 px-6 py-8 text-center text-caption text-muted-foreground">
              No operating hours added yet.
            </div>
          )}
        </Card>
        )}

        {section === "profile" && (
        <Card className="p-4 md:p-5">
          <ToggleCard
            checked={active}
            onChange={() => {
              if (!disabled)
                setValue("active", !active, { shouldDirty: true, shouldValidate: true });
            }}
            label="Operational Status"
            description={active ? "Visible to guests" : "Hidden from guests"}
          />
        </Card>
        )}
      </form>
    </div>
  );
}
