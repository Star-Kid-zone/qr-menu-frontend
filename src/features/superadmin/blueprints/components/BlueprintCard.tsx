'use client';

import Image from 'next/image';
import {
  PiEyeBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiArrowCounterClockwiseBold,
  PiCheckBold,
  PiStarFill,
} from 'react-icons/pi';
import { Badge, Button, Card } from '@/components/ui';
import type { BlueprintCardProps } from '../types';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** One sentence built only from what the starter menu actually contains. */
function includes(bp: BlueprintCardProps['blueprint']) {
  const parts = [plural(bp.items.length, 'dish', 'dishes')];
  if (bp.offers?.length) parts.push(plural(bp.offers.length, 'offer', 'offers'));
  if (bp.gallery?.length) parts.push(plural(bp.gallery.length, 'photo', 'photos'));
  if (bp.faqs?.length) parts.push(plural(bp.faqs.length, 'question and answer', 'questions and answers'));
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0];
}

export function BlueprintCard({
  blueprint: bp,
  isDefault,
  savingConfig,
  onPreview,
  onEdit,
  onDelete,
  onReset,
  onSetDefault,
}: BlueprintCardProps) {
  return (
    <div>
      <Card
        className={`flex h-full flex-col overflow-hidden border ${isDefault ? 'border-success' : 'border-border'}`}
      >
        <div className="space-y-1 border-b border-border p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-h3 text-foreground">{bp.name}</h2>
            {bp.badge && <Badge tone="neutral">{bp.badge}</Badge>}
          </div>
          {bp.tagline && <p className="text-caption text-muted-foreground">{bp.tagline}</p>}
        </div>

        <div className="space-y-1 border-b border-border px-6 py-3 text-caption text-muted-foreground">
          <p>
            Includes {includes(bp)}.
          </p>
          {bp.categoryNames.length > 0 && <p>Categories: {bp.categoryNames.join(', ')}.</p>}
        </div>

        <div className="flex-1 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {bp.items.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-md border border-border p-2">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={item.imageUrl} alt={item.item} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-medium text-foreground">{item.item}</p>
                  <p className="text-caption text-muted-foreground">
                    ${item.price}, {item.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {bp.items.length > 4 && (
            <p className="mt-2 text-caption text-muted-foreground">and {bp.items.length - 4} more dishes</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/10 p-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPreview(bp, 'dishes')}
              variant="secondary"
              size="sm"
              leftIcon={<PiEyeBold size={14} />}
            >
              Preview
            </Button>
            <Button
              onClick={() => onEdit(bp)}
              variant="secondary"
              size="sm"
              leftIcon={<PiPencilSimpleBold size={14} />}
            >
              Edit
            </Button>
            {bp.isCustom ? (
              !isDefault && (
                <Button
                  onClick={() => onDelete(bp)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/30"
                  title="Delete custom blueprint"
                  leftIcon={<PiTrashBold size={14} />}
                >
                  Delete
                </Button>
              )
            ) : (
              <Button
                onClick={() => onReset(bp)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                leftIcon={<PiArrowCounterClockwiseBold size={14} />}
              >
                Restore original
              </Button>
            )}
          </div>

          {isDefault ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-success dark:text-success">
              <PiCheckBold className="size-4" />
              <span>Used for new sign-ups</span>
            </div>
          ) : (
            <Button
              onClick={() => onSetDefault(bp.id)}
              disabled={savingConfig}
              variant="primary"
              size="sm"
              leftIcon={<PiStarFill size={14} />}
            >
              Use for new sign-ups
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
