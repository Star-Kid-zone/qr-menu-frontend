"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PiFacebookLogoBold, PiImagesBold, PiInstagramLogoBold } from "react-icons/pi";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PosterCanvas } from "@/components/marketing/PosterCanvas";
import { POSTER_CATEGORIES, POSTER_TEMPLATES } from "@/components/marketing/posterTemplates";
import { cn } from "@/utils/cn";

const THUMBNAIL_WIDTH = 260;
const CATEGORY_TABS = ["All", ...POSTER_CATEGORIES] as const;

export default function SocialMediaPage() {
  const [category, setCategory] = useState<string>("All");

  const filteredTemplates = useMemo(() => {
    if (category === "All") return POSTER_TEMPLATES;
    return POSTER_TEMPLATES.filter((template) => template.category === category);
  }, [category]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pb-4">
      <PageHeader
        title="Marketing"
        description="Connect your social accounts and create posters for your business."
      />

      <Card className="shrink-0">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 text-foreground">Social Connections</h2>
            <p className="text-caption text-muted-foreground">
              Link Instagram and Facebook to your workspace — coming soon.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-caption font-semibold text-muted-foreground opacity-60"
            >
              <PiInstagramLogoBold size={16} /> Connect Instagram
            </button>
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-caption font-semibold text-muted-foreground opacity-60"
            >
              <PiFacebookLogoBold size={16} /> Connect Facebook
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="shrink-0">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-h3 text-foreground">Poster Templates</h2>
            <span className="text-caption text-muted-foreground">{POSTER_TEMPLATES.length} templates</span>
          </div>
          <div className="w-full overflow-hidden">
            <div className="no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card p-1.5">
              {CATEGORY_TABS.map((cat) => {
                const selected = cat === category;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    aria-pressed={selected}
                    className={cn(
                      "whitespace-nowrap rounded-full px-4 py-2 text-caption font-semibold transition-colors duration-150 ease-out",
                      selected
                        ? "bg-accent text-accent-foreground shadow-neu-inset-sm"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="min-h-0 flex-1">
        {filteredTemplates.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={<PiImagesBold size={32} />}
              title="No templates in this category"
              description="Try a different category."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template, index) => (
              <Link
                key={template.slug}
                href={`/admin/social-media/editor/${template.slug}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <Card className="overflow-hidden transition-shadow duration-150 group-hover:shadow-neu">
                  <div className="flex items-center justify-center bg-muted p-3">
                    <div
                      className="overflow-hidden rounded-lg shadow-sm"
                      style={{ width: THUMBNAIL_WIDTH }}
                    >
                      <PosterCanvas config={template} renderWidth={THUMBNAIL_WIDTH} editable={false} />
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-caption uppercase tracking-wide text-primary">{template.category}</p>
                    <h3 className="mt-0.5 line-clamp-1 text-h3 text-foreground">{template.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
