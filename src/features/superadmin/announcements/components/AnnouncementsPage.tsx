'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PiMegaphoneBold, PiPlusBold } from 'react-icons/pi';
import {
  superadminService,
  type PlatformAnnouncement,
} from '@/services/superadmin.service';
import { Badge, Button, EmptyState, toast } from '@/components/ui';
import { fadeIn, staggerContainer } from '@/lib/motion';
import { AnnouncementCard } from './AnnouncementCard';
import { CreateAnnouncementModal, type AnnouncementFormData } from './CreateAnnouncementModal';

export function AnnouncementsPage() {
  const reduceMotion = useReducedMotion();
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    type: 'feature',
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
            <AnnouncementCard
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      {/* Create Broadcast Modal */}
      <CreateAnnouncementModal
        isOpen={isCreateOpen}
        form={form}
        setForm={setForm}
        submitting={submitting}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </motion.div>
  );
}
