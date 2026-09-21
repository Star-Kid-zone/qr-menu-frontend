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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-h3 font-bold text-foreground">Compose Platform Broadcast</h3>
                  <p className="text-caption text-muted-foreground">
                    This banner will appear in all tenant dashboards immediately upon activation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <PiXBold className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Broadcast Type">
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                      className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="feature">New Feature (Emerald)</option>
                      <option value="info">General Info (Slate)</option>
                      <option value="warning">Maintenance / Warning (Amber/Red)</option>
                      <option value="promo">Promotion / Festival (Purple/Orange)</option>
                    </select>
                  </FormField>

                  <FormField label="Badge Pill Label">
                    <Input
                      value={form.badgeText}
                      onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                      placeholder="e.g. New Feature, Maintenance, Holiday"
                    />
                  </FormField>
                </div>

                <FormField label="Headline / Title">
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Mother's Day Poster Templates Are Live!"
                    required
                  />
                </FormField>

                <FormField label="Message Body">
                  <Textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Provide a clear, helpful message explaining the update or instruction..."
                    rows={3}
                    required
                  />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Action URL (Optional)">
                    <Input
                      value={form.actionUrl}
                      onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
                      placeholder="e.g. /admin/social-media"
                    />
                  </FormField>

                  <FormField label="Button Label (Optional)">
                    <Input
                      value={form.actionText}
                      onChange={(e) => setForm({ ...form, actionText: e.target.value })}
                      placeholder="e.g. View Posters, Update Menu"
                    />
                  </FormField>
                </div>

                {/* Live Preview Card */}
                <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <PiEyeBold className="size-3.5" />
                    <span>Tenant Live Preview</span>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-primary/20 px-2 py-0.5 text-[11px] font-bold text-primary">
                          {form.badgeText || 'Update'}
                        </span>
                        <strong className="text-sm font-semibold text-foreground">
                          {form.title || 'Announcement Title'}
                        </strong>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {form.content || 'Your message content will be displayed here for all restaurant owners.'}
                      </p>
                    </div>
                    {form.actionText && (
                      <span className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                        {form.actionText}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                  <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting}>
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
