'use client';

import { PiEyeBold, PiTrashBold } from 'react-icons/pi';
import { Badge, Button, Card } from '@/components/ui';
import type { BadgeTone } from '@/types/components/ui/Badge.types';
import type { PlatformAnnouncement } from '@/services/superadmin.service';

export interface AnnouncementCardProps {
  item: PlatformAnnouncement;
  onToggle: (announcement: PlatformAnnouncement) => void;
  onDelete: (id: string) => void;
}

export function getToneFromType(type: string): BadgeTone {
  switch (type) {
    case 'warning':
      return 'warning';
    case 'promo':
      return 'primary';
    case 'feature':
      return 'success';
    default:
      return 'neutral';
  }
}

export function AnnouncementCard({ item, onToggle, onDelete }: AnnouncementCardProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5 transition-all hover:border-border sm:flex-row sm:items-center">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone={item.isActive ? 'success' : 'neutral'}>
            {item.isActive ? 'Live' : 'Archived'}
          </Badge>
          <Badge tone={getToneFromType(item.type)}>
            {item.badgeText || item.type.toUpperCase()}
          </Badge>
          <span className="text-caption text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()} by {item.createdBy || 'Superadmin'}
          </span>
          {item.readCount !== undefined && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-caption font-medium text-muted-foreground">
              <PiEyeBold className="size-3 text-primary" />
              <span>{item.readCount} {item.readCount === 1 ? 'tenant read' : 'tenant reads'}</span>
            </span>
          )}
        </div>

        <h3 className="text-body font-bold text-foreground">{item.title}</h3>
        <p className="max-w-3xl text-caption text-muted-foreground">{item.content}</p>

        {item.actionUrl && (
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <span>CTA: {item.actionText || 'Learn More'}</span>
            <span className="text-muted-foreground font-mono">({item.actionUrl})</span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
        <Button
          variant={item.isActive ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onToggle(item)}
        >
          {item.isActive ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(item.id)}
          title="Delete announcement"
        >
          <PiTrashBold className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
