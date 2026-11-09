'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Link from 'next/link';
import {
  workspaceService,
  type GoogleReviewRecord,
} from '@/services/workspace.service';
import {
  PiEyeBold,
  PiEyeSlashBold,
  PiGoogleLogoBold,
  PiQuotesFill,
  PiStarBold,
  PiStarFill,
  PiUserCircleFill,
} from 'react-icons/pi';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/ui/Pagination';
import { routes } from '@/config/routes';

export interface ListGoogleReviewsHandle {
  refresh: () => void | Promise<void>;
}

export interface ListGoogleReviewsProps {
  embedded?: boolean;
  initialReviews?: GoogleReviewRecord[];
  onChanged?: () => void | Promise<void>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <PiStarFill key={i} size={13} className="text-warning-foreground" />
        ) : (
          <PiStarBold key={i} size={13} className="text-border" />
        )
      )}
    </div>
  );
}

export const ListGoogleReviews = forwardRef<ListGoogleReviewsHandle, ListGoogleReviewsProps>(({
  embedded = false,
  initialReviews,
  onChanged,
}, ref) => {
  const [items, setItems] = useState<GoogleReviewRecord[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(!initialReviews);
  const [toggling, setToggling] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      if (onChanged) await onChanged();
    },
  }));

  // Follow the parent's reviews when it passes them; without them, fall back
  // to loading here (adjusted during render, then fetched by the effect below).
  const [syncedReviews, setSyncedReviews] = useState(initialReviews);
  if (syncedReviews !== initialReviews) {
    setSyncedReviews(initialReviews);
    if (initialReviews) {
      setItems(initialReviews);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  useEffect(() => {
    if (initialReviews) return;
    let cancelled = false;
    workspaceService
      .getGoogleReviews()
      .then((res) => {
        if (!cancelled) setItems(res.data.reviews || []);
      })
      .catch((err) => {
        console.error('Failed to load Google reviews:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialReviews]);

  const { page, pageCount, pageItems, pageSize, totalItems, setPage } = usePagination(items, 9);

  const refresh = async () => {
    if (onChanged) await onChanged();
  };

  const handleToggle = async (r: GoogleReviewRecord) => {
    setToggling(r.id);
    try {
      await workspaceService.toggleGoogleReviewFeatured(r.id);
      await refresh();
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setToggling(null);
    }
  };

  const list = loading ? (
    <div className="flex h-full min-h-[12rem] items-center justify-center">
      <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ) : items.length === 0 ? (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PiGoogleLogoBold className="text-4xl" />
      </div>
      <h3 className="text-h2 text-foreground">No Google Reviews Yet</h3>
      <p className="mt-2 max-w-md text-body text-muted-foreground">
        Link your Google Business Profile and sync reviews from the Reviews page. Once synced, pick which ones show on your landing page here.
      </p>
      <Link
        href={routes.admin.listReview}
        className="mt-8 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go to Reviews
      </Link>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {(embedded ? pageItems : items).map((r) => (
        <div key={r.id} className="relative flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
          <PiQuotesFill size={22} className="absolute right-4 top-4 text-primary/10" />
          <div className="flex items-center gap-3">
            {r.authorPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.authorPhotoUrl}
                alt=""
                className="size-10 shrink-0 rounded-full object-cover ring-1 ring-border"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                <PiUserCircleFill size={24} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-body font-semibold text-foreground">{r.authorName}</p>
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-0.5 text-caption font-semibold ${r.isFeatured ? 'border-success/20 bg-success/15 text-success' : 'border-border bg-muted text-muted-foreground'}`}>
                  {r.isFeatured ? 'Shown on landing page' : 'Hidden'}
                </span>
              </div>
              <StarRating rating={r.rating} />
            </div>
          </div>

          {r.text ? (
            <p className="line-clamp-4 break-words text-body text-muted-foreground">{r.text}</p>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3">
            {r.relativePublishDescription ? (
              <p className="text-caption text-muted-foreground/80">{r.relativePublishDescription}</p>
            ) : (
              <span />
            )}
            <button
              onClick={() => handleToggle(r)}
              disabled={toggling === r.id}
              className="shrink-0 rounded-lg border border-border bg-secondary p-3 text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
              title={r.isFeatured ? 'Hide from landing page' : 'Show on landing page'}
            >
              {r.isFeatured ? <PiEyeBold className="text-lg" /> : <PiEyeSlashBold className="text-lg" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={embedded ? 'flex h-full flex-col gap-6' : 'mx-auto max-w-7xl space-y-8'}>
      {!embedded && (
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-h1 text-foreground">Google Reviews</h1>
            <p className="mt-1 text-body text-muted-foreground">Pick which real reviews appear on your landing page.</p>
          </div>
        </div>
      )}

      <div className={embedded ? 'min-h-0 flex-1 overflow-y-auto pr-1' : ''}>{list}</div>

      {embedded && !loading && items.length > 0 ? (
        <div className="shrink-0">
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
        </div>
      ) : null}
    </div>
  );
});

ListGoogleReviews.displayName = 'ListGoogleReviews';
