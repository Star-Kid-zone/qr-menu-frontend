"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/ui/toast";
import { socialService, type WeeklyPoster } from "@/services/social.service";

export default function WeeklyPostersPage() {
  const [posters, setPosters] = useState<WeeklyPoster[]>([]);
  const [file, setFile] = useState<File>();
  const [title, setTitle] = useState("");
  const [weekStart, setWeekStart] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    socialService
      .getWeeklyPosters()
      .then((response) => setPosters(Array.isArray(response.data) ? response.data : []))
      .catch(() => toast.error("Could not load weekly posters."));
  }, []);

  async function send() {
    if (!file || !title.trim()) {
      toast.warning("Choose a poster and enter a title.");
      return;
    }
    try {
      const { data } = await socialService.createWeeklyPoster(file, title, weekStart);
      setPosters((current) => [data.poster, ...current]);
      setFile(undefined);
      setTitle("");
      toast.success("Weekly poster sent to all workspaces.");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Could not send weekly poster.");
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pb-4">
      <PageHeader
        title="Weekly Posters"
        description="Send one shared poster to every workspace each week. Users can select it and publish to either platform."
      />
      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Poster title"
            className="rounded-lg border border-border bg-background px-3 py-2 text-body"
          />
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-body"
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="rounded-lg border border-border px-3 py-2 text-caption"
          />
          <button
            onClick={send}
            className="rounded-lg bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Send poster
          </button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          {posters.map((poster) => (
            <div key={poster.id} className="overflow-hidden rounded-xl border border-border">
              <img
                src={poster.thumbnailUrl ?? poster.imageUrl}
                alt={poster.title}
                className="aspect-square w-full object-cover"
              />
              <div className="p-3 text-caption">
                <p className="font-semibold">{poster.title}</p>
                <p className="text-muted-foreground">Week of {poster.weekStart}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
