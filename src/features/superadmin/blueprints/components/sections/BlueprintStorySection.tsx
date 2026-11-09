'use client';

import React from 'react';
import type { MenuBlueprint, BlueprintStory } from '@/services/superadmin.service';

interface BlueprintStorySectionProps {
  story?: BlueprintStory;
  setFormData: React.Dispatch<React.SetStateAction<MenuBlueprint>>;
}

export function BlueprintStorySection({
  story,
  setFormData,
}: BlueprintStorySectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-bold text-foreground">Story Headline</label>
        <input
          type="text"
          value={story?.headline || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              story: {
                headline: e.target.value,
                body: prev.story?.body ?? '',
                stats: prev.story?.stats ?? [],
              },
            }))
          }
          placeholder="e.g. Crafted with passion, baked with patience"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold text-foreground">Story Narrative Body</label>
        <textarea
          rows={4}
          value={story?.body || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              story: {
                headline: prev.story?.headline ?? '',
                body: e.target.value,
                stats: prev.story?.stats ?? [],
              },
            }))
          }
          placeholder="Describe your kitchen roots, culinary philosophies, and signature ingredient origins..."
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none leading-relaxed"
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground">
          Proof Metrics (4 Stats)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(story?.stats || []).map((st, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
              <input
                type="text"
                value={st.value}
                onChange={(e) => {
                  const nextStats = [...(story?.stats || [])];
                  nextStats[idx] = { ...nextStats[idx], value: e.target.value };
                  setFormData((prev) => ({
                    ...prev,
                    story: {
                      ...prev.story,
                      stats: nextStats,
                      headline: prev.story?.headline || '',
                      body: prev.story?.body || '',
                    },
                  }));
                }}
                placeholder="Value (e.g. 7+)"
                className="w-24 rounded border border-border px-2 py-1 text-xs font-bold text-primary"
              />
              <input
                type="text"
                value={st.label}
                onChange={(e) => {
                  const nextStats = [...(story?.stats || [])];
                  nextStats[idx] = { ...nextStats[idx], label: e.target.value };
                  setFormData((prev) => ({
                    ...prev,
                    story: {
                      ...prev.story,
                      stats: nextStats,
                      headline: prev.story?.headline || '',
                      body: prev.story?.body || '',
                    },
                  }));
                }}
                placeholder="Label (e.g. Years Roasting)"
                className="flex-1 rounded border border-border px-2 py-1 text-xs text-foreground"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
