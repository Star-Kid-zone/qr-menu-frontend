'use client';

import {
  PiNotebookBold,
  PiSparkleBold,
  PiStarBold,
  PiStarFill,
  PiCopyBold,
  PiCheckBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiCameraBold,
  PiLightbulbFilamentBold,
  PiEyeBold,
} from 'react-icons/pi';
import Image from '@/components/ui/Image';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { PromptCardProps } from '../types';

export function PromptCard({
  prompt: p,
  copiedId,
  onCopy,
  onUseInStudio,
  onToggleFavorite,
  onEdit,
  onDelete,
  onPreviewRef,
}: PromptCardProps) {
  const hasRefs = p.referenceImages && p.referenceImages.length > 0;

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border border-border bg-card hover:border-primary/50 transition-all hover:shadow-md rounded-2xl p-6 space-y-4">
      {/* 1. Header: Badges & Favorite */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tone="primary" className="text-caption font-semibold">
            {p.category}
          </Badge>
          <Badge
            tone={p.mediaType === 'video' ? 'warning' : 'neutral'}
            className="text-caption uppercase font-bold"
          >
            {p.mediaType === 'video' ? '🎬 Reel' : p.mediaType === 'poster' ? '📄 Poster' : '📷 Photo'}
          </Badge>
          <span className="rounded bg-muted px-2 py-0.5 font-mono text-caption text-muted-foreground border border-border/60">
            {p.aspectRatio}
          </span>
        </div>

        <button
          onClick={(e) => onToggleFavorite(p.id, e)}
          className={cn(
            'rounded-lg p-2 transition-colors',
            p.isFavorite
              ? 'text-warning-foreground hover:text-warning-foreground'
              : 'text-muted-foreground hover:text-warning-foreground hover:bg-warning/10'
          )}
          title={p.isFavorite ? 'Starred' : 'Star this prompt'}
        >
          {p.isFavorite ? (
            <PiStarFill className="h-4 w-4" />
          ) : (
            <PiStarBold className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 2. Title & Recommended Model */}
      <div>
        <h3 className="font-bold text-foreground text-base tracking-tight" title={p.title}>
          {p.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <PiLightbulbFilamentBold className="h-3.5 w-3.5 text-warning-foreground shrink-0" />
          <span className="font-medium text-foreground/80">{p.recommendedModel}</span>
          {p.stylePreset && <span>• {p.stylePreset}</span>}
        </div>
      </div>

      {/* 3. THE PROMPT BOX (HERO OF THE CARD) */}
      <div className="relative rounded-xl border border-border bg-muted/30 p-4 group/box hover:bg-muted/40 transition-colors">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-caption font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <PiNotebookBold className="h-3 w-3 text-primary" />
            AI Prompt
          </span>
          <button
            onClick={() => onCopy(p)}
            className="flex items-center gap-1 text-caption font-semibold text-primary hover:underline transition-all"
            title="Copy full prompt"
          >
            {copiedId === p.id ? (
              <>
                <PiCheckBold className="h-3.5 w-3.5 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <PiCopyBold className="h-3.5 w-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-foreground/95 leading-relaxed font-sans line-clamp-5 select-all">
          {p.prompt}
        </p>
      </div>

      {/* 4. Optional Visual Reference Thumbnail & Camera Notes */}
      {(hasRefs || p.cameraNotes) && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/60">
          {hasRefs && (
            <div
              onClick={() => onPreviewRef(p.referenceImages[0])}
              className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-950 border border-border shrink-0 cursor-pointer group/ref hover:ring-2 hover:ring-primary transition-all"
              title="Click to view full reference benchmark"
            >
              <Image
                src={p.referenceImages[0]}
                alt="Ref"
                fill
                sizes="48px"
                className="object-cover transition-transform group-hover/ref:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/ref:opacity-100 transition-opacity">
                <PiEyeBold className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0 text-caption">
            {p.cameraNotes ? (
              <div className="flex items-start gap-1 text-muted-foreground">
                <PiCameraBold className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{p.cameraNotes}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 font-medium text-foreground">
                <PiCameraBold className="h-3 w-3 text-warning-foreground" />
                <span>Plating Benchmark Attached</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tags */}
      {p.tags && p.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {p.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-muted/60 px-2 py-0.5 text-caption font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
          {p.tags.length > 4 && (
            <span className="text-caption text-muted-foreground">
              +{p.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* 6. Footer Actions */}
      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onUseInStudio(p)}
          className="flex-1 flex items-center justify-center gap-2 font-semibold text-xs"
        >
          <PiSparkleBold className="h-3.5 w-3.5" />
          <span>Use in Studio</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={(e) => onEdit(p, e)}
          className="px-3 text-xs"
          title="Edit Prompt"
        >
          <PiPencilSimpleBold className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDelete(p.id, e)}
          className="px-3 text-xs text-destructive hover:bg-destructive/10"
          title="Delete Prompt"
        >
          <PiTrashBold className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
