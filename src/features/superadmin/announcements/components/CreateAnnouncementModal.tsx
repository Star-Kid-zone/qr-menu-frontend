'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PiMegaphoneBold, PiXBold, PiEyeBold } from 'react-icons/pi';
import { Button, FormField, Input, Textarea } from '@/components/ui';

export interface AnnouncementFormData {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'feature' | 'promo';
  badgeText: string;
  actionUrl: string;
  actionText: string;
  isActive: boolean;
}

export interface CreateAnnouncementModalProps {
  isOpen: boolean;
  form: AnnouncementFormData;
  setForm: React.Dispatch<React.SetStateAction<AnnouncementFormData>>;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateAnnouncementModal({
  isOpen,
  form,
  setForm,
  submitting,
  onClose,
  onSubmit,
}: CreateAnnouncementModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
            className="relative flex w-full max-w-2xl max-h-[92vh] flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xl overflow-hidden"
          >
            {/* Pinned Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">Compose Platform Broadcast</h3>
                <p className="text-xs text-muted-foreground">
                  This banner will appear across all tenant dashboards immediately upon activation.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <PiXBold className="size-4.5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col justify-between py-2.5 sm:py-3 space-y-2.5 overflow-y-auto">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <FormField label="Broadcast Type" className="space-y-1">
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-xs sm:text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="feature" className="bg-card text-foreground py-1">New Feature (Emerald)</option>
                    <option value="info" className="bg-card text-foreground py-1">General Info (Slate)</option>
                    <option value="warning" className="bg-card text-foreground py-1">Maintenance / Warning (Amber/Red)</option>
                    <option value="promo" className="bg-card text-foreground py-1">Promotion / Festival (Purple/Orange)</option>
                  </select>
                </FormField>

                <FormField label="Badge Pill Label" className="space-y-1">
                  <Input
                    value={form.badgeText}
                    onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                    placeholder="e.g. New Feature, Maintenance, Holiday"
                    className="h-9 text-xs sm:text-sm"
                  />
                </FormField>
              </div>

              <FormField label="Headline / Title" className="space-y-1">
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mother's Day Poster Templates Are Live!"
                  className="h-9 text-xs sm:text-sm"
                  required
                />
              </FormField>

              <FormField label="Message Body" className="space-y-1">
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Provide a clear, concise message for restaurant owners..."
                  className="min-h-[54px] h-[54px] resize-none py-1.5 px-3 text-xs sm:text-sm"
                  required
                />
              </FormField>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <FormField label="Action URL (Optional)" className="space-y-1">
                  <Input
                    value={form.actionUrl}
                    onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
                    placeholder="e.g. /admin/social-media"
                    className="h-9 text-xs sm:text-sm font-mono"
                  />
                </FormField>

                <FormField label="Button Label (Optional)" className="space-y-1">
                  <Input
                    value={form.actionText}
                    onChange={(e) => setForm({ ...form, actionText: e.target.value })}
                    placeholder="e.g. View Posters, Update Menu"
                    className="h-9 text-xs sm:text-sm"
                  />
                </FormField>
              </div>

              {/* Live Preview Card */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-2.5">
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px]">
                    <PiEyeBold className="size-3 text-primary" />
                    Tenant Live Preview
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">Top banner in /admin</span>
                </div>

                <div className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs transition-colors ${
                  form.type === 'warning'
                    ? 'border-destructive/30 bg-destructive/5'
                    : form.type === 'promo'
                    ? 'border-purple-500/30 bg-purple-500/5'
                    : form.type === 'feature'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-primary/20 bg-primary/5'
                }`}>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      form.type === 'warning'
                        ? 'border-destructive/30 bg-destructive/20 text-destructive'
                        : form.type === 'promo'
                        ? 'border-purple-500/30 bg-purple-500/20 text-purple-700 dark:text-purple-300'
                        : form.type === 'feature'
                        ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-primary/30 bg-primary/20 text-primary'
                    }`}>
                      <PiMegaphoneBold className="size-2.5" />
                      <span>{form.badgeText || 'Update'}</span>
                    </span>
                    <div className="min-w-0 truncate text-xs">
                      <span className="font-semibold text-foreground mr-1">
                        {form.title || 'Announcement Title'}:
                      </span>
                      <span className="text-muted-foreground">
                        {form.content || 'Your message content will be displayed here for all restaurant owners.'}
                      </span>
                    </div>
                  </div>

                  {form.actionText && (
                    <span className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-xs">
                      {form.actionText}
                    </span>
                  )}
                </div>
              </div>

              {/* Pinned Footer Actions */}
              <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-border pt-3">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={submitting}>
                  Publish Broadcast
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
