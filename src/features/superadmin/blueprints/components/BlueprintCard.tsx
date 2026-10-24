'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  PiBookBookmarkBold,
  PiForkKnifeBold,
  PiPaintBrushBold,
  PiArticleBold,
  PiTagBold,
  PiImageBold,
  PiQuestionBold,
  PiEyeBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiArrowCounterClockwiseBold,
  PiCheckBold,
  PiStarFill,
  PiCheckCircleFill,
} from 'react-icons/pi';
import { Badge, Button, Card } from '@/components/ui';
import { fadeInUp } from '@/lib/motion';
import type { BlueprintCardProps } from '../types';

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
    <motion.div variants={fadeInUp}>
      <Card
        className={`flex h-full flex-col overflow-hidden border transition-all ${
          isDefault
            ? 'border-emerald-500/80 shadow-md ring-2 ring-emerald-500/20'
            : 'border-border hover:border-primary/40 hover:shadow-lg'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between border-b border-border p-5 ${
            isDefault ? 'bg-emerald-500/10' : 'bg-muted/20'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg p-1.5 ${
                  isDefault
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <PiBookBookmarkBold className="size-5" />
              </span>
              <h2 className="text-h3 font-bold text-foreground">{bp.name}</h2>
            </div>
            <p className="text-caption text-muted-foreground">{bp.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            {isDefault && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <PiCheckCircleFill className="size-3.5" />
                Registration Default
              </span>
            )}
            <Badge tone={bp.badge === 'Most Popular' ? 'success' : 'primary'}>{bp.badge}</Badge>
          </div>
        </div>

        {/* Preloaded Storefront Modules Bar */}
        <div className="border-b border-border bg-primary/5 px-5 py-2.5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Full Storefront Preloaded Package
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
              <PiForkKnifeBold className="size-3.5 text-primary" />
              {bp.items.length} Dishes
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
              <PiPaintBrushBold className="size-3.5 text-amber-500" />
              Branding Palette
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
              <PiArticleBold className="size-3.5 text-blue-500" />
              Story & 4 Stats
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
              <PiTagBold className="size-3.5 text-rose-500" />
              {bp.offers?.length || 2} Offers
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
              <PiImageBold className="size-3.5 text-indigo-500" />
              {bp.gallery?.length || 4} Photos
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 font-semibold text-foreground border border-border shadow-2xs">
              <PiQuestionBold className="size-3.5 text-emerald-500" />
              {bp.faqs?.length || 3} FAQs
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="border-b border-border px-5 py-3 bg-card">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Categories Included
          </p>
          <div className="flex flex-wrap gap-1.5">
            {bp.categoryNames.map((cat) => (
              <span
                key={cat}
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Sample Dishes Grid */}
        <div className="flex-1 p-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Sample Dishes ({bp.items.length} Total)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {bp.items.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/10 p-2.5 transition hover:bg-muted/30"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.item}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{item.item}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="font-mono font-bold text-primary">${item.price}</span>
                    <span>•</span>
                    <span
                      className={
                        item.type === 'Veg'
                          ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'text-amber-600 font-medium'
                      }
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {bp.items.length > 4 && (
            <p className="mt-2.5 text-center text-caption text-muted-foreground">
              + {bp.items.length - 4} more dishes with full dietary tags & photos
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/10 p-4">
          <div className="flex items-center gap-1.5">
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
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
                title="Reset to factory default"
                leftIcon={<PiArrowCounterClockwiseBold size={14} />}
              >
                Reset
              </Button>
            )}
          </div>

          {isDefault ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <PiCheckBold className="size-4" />
              <span>Active Signup Default</span>
            </div>
          ) : (
            <Button
              onClick={() => onSetDefault(bp.id)}
              disabled={savingConfig}
              variant="primary"
              size="sm"
              leftIcon={<PiStarFill size={14} />}
            >
              Set as Default
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
