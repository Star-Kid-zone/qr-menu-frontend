'use client';

import React from 'react';
import type { MenuBlueprint, BlueprintTheme, BlueprintSite } from '@/services/superadmin.service';
import { BlueprintSiteSection } from './BlueprintSiteSection';

interface BlueprintThemeSectionProps {
  theme?: BlueprintTheme;
  site?: BlueprintSite;
  setFormData: React.Dispatch<React.SetStateAction<MenuBlueprint>>;
}

export function BlueprintThemeSection({
  theme,
  site,
  setFormData,
}: BlueprintThemeSectionProps) {
  return (
    <div className="space-y-4">
      <BlueprintSiteSection site={site} setFormData={setFormData} />

      {/* Color Palette */}
      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground">
          Colours (used only when no style is chosen)
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-foreground">
              Primary Accent (Buttons/Badges)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme?.primaryColor || '#0F766E'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value } as BlueprintTheme,
                  }))
                }
                className="size-8 cursor-pointer rounded border border-border"
              />
              <input
                type="text"
                value={theme?.primaryColor || '#0F766E'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value } as BlueprintTheme,
                  }))
                }
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1 text-xs font-mono text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-foreground">
              Surface / Card Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme?.secondaryColor || '#FFFFFF'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, secondaryColor: e.target.value } as BlueprintTheme,
                  }))
                }
                className="size-8 cursor-pointer rounded border border-border"
              />
              <input
                type="text"
                value={theme?.secondaryColor || '#FFFFFF'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, secondaryColor: e.target.value } as BlueprintTheme,
                  }))
                }
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1 text-xs font-mono text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-foreground">Page Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme?.accentColor || '#F8FAFC'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, accentColor: e.target.value } as BlueprintTheme,
                  }))
                }
                className="size-8 cursor-pointer rounded border border-border"
              />
              <input
                type="text"
                value={theme?.accentColor || '#F8FAFC'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, accentColor: e.target.value } as BlueprintTheme,
                  }))
                }
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1 text-xs font-mono text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-foreground">Text Heading Color</label>
            <input
              type="text"
              value={theme?.textPrimaryColor || '#0F172A'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, textPrimaryColor: e.target.value } as BlueprintTheme,
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-foreground">Text Body Color</label>
            <input
              type="text"
              value={theme?.textSecondaryColor || '#475569'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, textSecondaryColor: e.target.value } as BlueprintTheme,
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Imagery & Announcement */}
      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground">
          Hero & Storefront Branding
        </h3>
        <div>
          <label className="mb-1 block text-xs font-bold text-foreground">Hero Banner Image URL</label>
          <input
            type="text"
            value={theme?.bannerUrl || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                theme: { ...prev.theme, bannerUrl: e.target.value } as BlueprintTheme,
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-foreground">Announcement Strip Text</label>
          <input
            type="text"
            value={theme?.announcementText || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                theme: { ...prev.theme, announcementText: e.target.value } as BlueprintTheme,
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
