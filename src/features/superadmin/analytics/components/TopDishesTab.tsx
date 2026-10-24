'use client';

import Image from 'next/image';
import { Card, Badge } from '@/components/ui';
import { PiForkKnifeBold } from 'react-icons/pi';
import type { TopDishesTabProps } from '../types';

export function TopDishesTab({ platform }: TopDishesTabProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h2 text-foreground">Cross-Tenant Dish Popularity Leaderboard</h2>
            <p className="text-caption text-muted-foreground">
              Most viewed and clicked dishes across all restaurant menus on the platform
            </p>
          </div>
          <Badge tone="primary">Top {(platform.top_dishes || []).length} Items</Badge>
        </div>

        {(platform.top_dishes && platform.top_dishes.length > 0) ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platform.top_dishes.map((dish, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl bg-muted">
                    {dish.imageUrl ? (
                      <Image
                        src={dish.imageUrl}
                        alt={dish.item}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <PiForkKnifeBold className="size-10 opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-0.5 backdrop-blur-md">
                      <span className="text-[10px] font-bold text-primary">#{idx + 1}</span>
                    </div>
                    {dish.type && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          tone={dish.type.toLowerCase().includes('non') ? 'danger' : 'success'}
                          className="text-[9px]"
                        >
                          {dish.type}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <h3 className="line-clamp-1 font-bold text-foreground text-body" title={dish.item}>
                    {dish.item}
                  </h3>
                  <p className="mt-0.5 text-caption text-muted-foreground line-clamp-1">
                    {dish.restaurantName}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Price</span>
                    <p className="font-mono font-bold text-foreground">₹{dish.price}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Interactions</span>
                    <p className="font-mono font-bold text-primary">{dish.count.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl">
            <PiForkKnifeBold className="size-10 text-muted-foreground mb-3 opacity-40" />
            <p className="text-body font-semibold text-foreground">No dish interaction data yet</p>
            <p className="text-caption text-muted-foreground max-w-md mt-1">
              Once guests click on dish cards, open details, or view menu items, the most popular dishes will appear here.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
