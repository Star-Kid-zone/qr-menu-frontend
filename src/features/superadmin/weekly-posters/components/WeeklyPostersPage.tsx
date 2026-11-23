'use client';

import { useEffect, useState } from 'react';
import Image from '@/components/ui/Image';
import { Button, Card, Input, PageHeader, toast } from '@/components/ui';
import { getApiErrorMessage } from '@/utils/errors';
import { socialService, type WeeklyPoster } from '@/services/social.service';
import { PiPaperPlaneTiltBold } from 'react-icons/pi';

export function WeeklyPostersPage() {
  const [posters, setPosters] = useState<WeeklyPoster[]>([]);
  const [file, setFile] = useState<File>();
  const [title, setTitle] = useState('');
  const [weekStart, setWeekStart] = useState(new Date().toISOString().slice(0, 10));
  const [sending, setSending] = useState(false);

  useEffect(() => {
    socialService
      .getWeeklyPosters()
      .then((response) => setPosters(Array.isArray(response.data) ? response.data : []))
      .catch((err) => toast.error(getApiErrorMessage(err, 'Could not load weekly posters.')));
  }, []);

  async function send() {
    if (!file || !title.trim()) {
      toast.warning('Choose a poster and enter a title.');
      return;
    }
    try {
      setSending(true);
      const { data } = await socialService.createWeeklyPoster(file, title, weekStart);
      setPosters((current) => [data.poster, ...current]);
      setFile(undefined);
      setTitle('');
      toast.success('Weekly poster sent to all workspaces.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not send weekly poster.'));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pb-6">
      <PageHeader
        title="Weekly posters"
        description="Send one poster to every restaurant. They can post it to Facebook or Instagram."
      />

      <Card className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Poster title"
          />
          <Input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground cursor-pointer file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-xs file:font-semibold file:text-foreground"
          />
          <Button
            onClick={send}
            loading={sending}
            size="md"
            leftIcon={<PiPaperPlaneTiltBold size={14} />}
          >
            Send poster
          </Button>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posters.map((poster) => (
            <div key={poster.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition hover:shadow-sm">
              <div className="relative aspect-square w-full">
                <Image
                  src={poster.thumbnailUrl ?? poster.imageUrl}
                  alt={poster.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-caption">
                <p className="font-semibold text-foreground text-sm truncate">{poster.title}</p>
                <p className="text-muted-foreground mt-0.5">Week of {poster.weekStart}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
