'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  PiMegaphoneBold,
  PiPlusBold,
  PiTrashBold,
  PiCheckBold,
  PiXBold,
  PiInfoBold,
  PiWarningBold,
  PiSparkleBold,
  PiTagBold,
  PiArrowSquareOutBold,
  PiEyeBold,
} from 'react-icons/pi';
import {
  superadminService,
  type PlatformAnnouncement,
} from '@/services/superadmin.service';
import { Badge, Button, Card, EmptyState, FormField, Input, Textarea, toast } from '@/components/ui';
import type { BadgeTone } from '@/types/components/ui/Badge.types';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';

export default function SuperadminAnnouncementsPage() {
  const reduceMotion = useReducedMotion();
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'feature' as 'info' | 'warning' | 'feature' | 'promo',
    badgeText: 'New Update',
    actionUrl: '',
    actionText: '',
    isActive: true,
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const list = await superadminService.getAnnouncements();
      setAnnouncements(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Please provide a title and content for the broadcast');
      return;
    }

    try {
      setSubmitting(true);
      const created = await superadminService.createAnnouncement(form);
      setAnnouncements((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
      toast.success('Broadcast published successfully.');
      setIsCreateOpen(false);
      setForm({
        title: '',
        content: '',
        type: 'feature',
        badgeText: 'New Update',
        actionUrl: '',
        actionText: '',
        isActive: true,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish broadcast');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (announcement: PlatformAnnouncement) => {
    const newState = !announcement.isActive;
    try {
      await superadminService.toggleAnnouncement(announcement.id, newState);
      setAnnouncements((prev) =>
        (Array.isArray(prev) ? prev : []).map((a) => (a.id === announcement.id ? { ...a, isActive: newState } : a))
      );
      toast.success(`Announcement ${newState ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broadcast?')) return;
    try {
      await superadminService.deleteAnnouncement(id);
      setAnnouncements((prev) => (Array.isArray(prev) ? prev : []).filter((a) => a.id !== id));
      toast.success('Announcement deleted.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete announcement');
    }
  };

  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];
  const activeCount = useMemo(() => safeAnnouncements.filter((a) => a.isActive).length, [safeAnnouncements]);

  const getToneFromType = (type: string): BadgeTone => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'promo':
        return 'primary';
      case 'feature':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <motion.div
      className="flex h-full flex-col gap-6 overflow-y-auto pb-10"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge tone="primary">Communication Hub</Badge>
            <span className="text-caption uppercase tracking-wide text-muted-foreground">Broadcast Dispatcher</span>
          </div>
          <h1 className="text-display text-foreground">Platform Broadcasts</h1>
          <p className="text-body max-w-2xl text-muted-foreground">
            Send high-visibility notifications, maintenance alerts, and product feature releases directly to tenant admin dashboards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-sm">
            <PiMegaphoneBold className="size-4 text-primary" />
            <span className="font-semibold text-foreground">{activeCount}</span>
            <span className="text-muted-foreground">Live Broadcasts</span>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} leftIcon={<PiPlusBold size={16} />}>
            New Broadcast
          </Button>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-card/60" />
          ))}
        </div>
      ) : safeAnnouncements.length === 0 ? (
        <EmptyState
          icon={<PiMegaphoneBold className="size-8 text-muted-foreground" />}
          title="No broadcasts yet"
          description="Create your first platform announcement to communicate with all restaurant owners."
          action={
            <Button onClick={() => setIsCreateOpen(true)} leftIcon={<PiPlusBold size={16} />}>
              Create Broadcast
            </Button>
          }
        />
      ) : (
        <motion.div
          className="space-y-4"
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={staggerContainer(0.05)}
        >
          {safeAnnouncements.map((item) => (
            <motion.div key={item.id} variants={fadeInUp}>
              <Card className="flex flex-col justify-between gap-4 p-5 transition-all hover:border-border sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge tone={item.isActive ? 'success' : 'neutral'}>
                      {item.isActive ? 'Live' : 'Archived'}
                    </Badge>
                    <Badge tone={getToneFromType(item.type)}>
                      {item.badgeText || item.type.toUpperCase()}
                    </Badge>
                    <span className="text-caption text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()} by {item.createdBy || 'Superadmin'}
                    </span>
                    {item.readCount !== undefined && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-caption font-medium text-muted-foreground">
                        <PiEyeBold className="size-3 text-primary" />
                        <span>{item.readCount} {item.readCount === 1 ? 'tenant read' : 'tenant reads'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-body font-bold text-foreground">{item.title}</h3>
                  <p className="max-w-3xl text-caption text-muted-foreground">{item.content}</p>

                  {item.actionUrl && (
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                      <span>CTA: {item.actionText || 'Learn More'}</span>
                      <span className="text-muted-foreground font-mono">({item.actionUrl})</span>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
                  <Button
                    variant={item.isActive ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleToggle(item)}
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    title="Delete announcement"
                  >
                    <PiTrashBold className="size-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Broadcast Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsCreateOpen(false)}
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
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <PiXBold className="size-4.5" />
                </button>
              </div>

              {/* Form Body - Compact & scroll-free on standard screens */}
              <form onSubmit={handleCreate} className="flex min-h-0 flex-1 flex-col justify-between py-2.5 sm:py-3 space-y-2.5 overflow-y-auto">
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
                  <Button variant="secondary" size="sm" onClick={() => setIsCreateOpen(false)}>
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
    </motion.div>
  );
}
