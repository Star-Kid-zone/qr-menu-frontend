'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useMemo, type SetStateAction } from 'react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { LoadErrorNotice } from '@/components/feedback/LoadErrorNotice';
import { motion, useReducedMotion } from 'framer-motion';
import { PiMegaphoneBold, PiPlusBold } from 'react-icons/pi';
import {
  superadminService,
  type PlatformAnnouncement,
} from '@/services/superadmin.service';
import { Button, EmptyState, toast } from '@/components/ui';
import { fadeIn, staggerContainer } from '@/lib/motion';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { AnnouncementCard } from './AnnouncementCard';
import { CreateAnnouncementModal, type AnnouncementFormData } from './CreateAnnouncementModal';
import { getApiErrorMessage } from "@/utils/errors";

export function AnnouncementsPage() {
  const reduceMotion = useReducedMotion();
  const { confirm, confirmDialog } = useConfirmDialog();
  const { data, loading, error: loadError, refetch, setData } = useAsyncData(
    async () => {
      const list = await superadminService.getAnnouncements();
      return Array.isArray(list) ? list : [];
    },
    [],
    'Failed to load announcements',
  );
  const announcements: PlatformAnnouncement[] = useMemo(() => data ?? [], [data]);
  const setAnnouncements = (update: SetStateAction<PlatformAnnouncement[]>) =>
    setData((prev) => (typeof update === 'function' ? update(prev ?? []) : update));
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
      toast.error(getApiErrorMessage(err, 'Failed to publish broadcast'));
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
      toast.error(getApiErrorMessage(err, 'Failed to toggle status'));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete broadcast?',
      description: 'Are you sure you want to delete this broadcast?',
      confirmLabel: 'Delete broadcast',
    });
    if (!confirmed) return;
    try {
      await superadminService.deleteAnnouncement(id);
      setAnnouncements((prev) => (Array.isArray(prev) ? prev : []).filter((a) => a.id !== id));
      toast.success('Announcement deleted.');
    } catch (err) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to delete announcement'));
    }
  };

  const safeAnnouncements = useMemo(
    () => (Array.isArray(announcements) ? announcements : []),
    [announcements]
  );
  const activeCount = useMemo(
    () => safeAnnouncements.filter((a) => a.isActive).length,
    [safeAnnouncements]
  );

  return (
    <motion.div
      className="flex h-full flex-col gap-4 sm:gap-4 overflow-y-auto pb-6"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeIn}
    >
      <PageHeader
        title="Announcements"
        description={`Banners shown at the top of every restaurant's dashboard. ${activeCount} live now.`}
        actions={
          <Button onClick={() => setIsCreateOpen(true)} leftIcon={<PiPlusBold size={16} />}>
            New announcement
          </Button>
        }
      />
      {/* Announcements List */}
      {loadError && !loading ? (
        <LoadErrorNotice title="We couldn't load the announcements" message={loadError} onRetry={refetch} />
      ) : loading ? (
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
      {confirmDialog}
    </motion.div>
  );
}
