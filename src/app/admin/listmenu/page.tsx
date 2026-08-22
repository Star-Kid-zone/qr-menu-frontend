"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { menuService } from "@/services/menu.service";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { toast } from "@/components/ui/toast";
import { PiForkKnifeBold, PiPencilSimpleBold, PiPlusBold, PiTrashBold, PiDownloadSimpleBold } from "react-icons/pi";
import { downloadCsv } from "@/utils/downloadCsv";
import { useAsyncData } from "@/hooks/useAsyncData";

interface MenuItem {
  id: string;
  name?: string;
  item: string;
  category: string;
  price: number;
  availability: boolean;
  imageUrl?: string;
  type?: string;
  popular?: boolean;
}

import { cn } from "@/utils/cn";

const getItemDisplayName = (item: MenuItem) => item.item || item.name || "";

export default function ListMenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  const {
    data: itemsData,
    error: itemsError,
    refetch: fetchMenus,
  } = useAsyncData(
    async () => (await menuService.getMenus()).data as MenuItem[],
    [],
    "Failed to load menu items",
  );
  const items = itemsData ?? [];

  useEffect(() => {
    if (itemsError) toast.error(itemsError);
  }, [itemsError]);

  const handleDelete = async (id: string) => {
    try {
      await menuService.deleteMenu(id);
      toast.success("Menu item deleted");
      fetchMenus();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = getItemDisplayName(item).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Menu Management"
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              leftIcon={<PiDownloadSimpleBold size={16} />}
              onClick={() => downloadCsv('/menu/export.csv', 'menu-items.csv').catch(() => toast.error('Failed to export CSV'))}
            >
              Export CSV
            </Button>
            <Link href="/admin/addmenu" className={buttonVariants()}>
              <PiPlusBold size={16} />
              Add Menu Item
            </Link>
          </>
        }
      />

      <Card className="shrink-0">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mt-3 w-full overflow-hidden">
            <div className="inline-flex max-w-full items-center rounded-full border border-border bg-card p-1.5 overflow-x-auto no-scrollbar shrink-0">
              <div className="flex items-center gap-1">
                {categories.map((cat) => {
                  const selected = cat === selectedCategory;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      aria-pressed={selected}
                      className={cn(
                        "flex items-center gap-2.5 whitespace-nowrap rounded-full px-5 py-2 text-caption font-semibold transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                        selected
                          ? "bg-accent text-accent-foreground shadow-neu-inset-sm"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-150 ease-out",
                          selected ? "text-accent-foreground" : "text-muted-foreground",
                        )}
                      >
                        {cat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="min-h-0 flex-1 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={<PiForkKnifeBold size={32} />}
              title="No menu items found"
              description="No items match your filters yet. Try a different search term or category."
            />
          </div>
        ) : (
          <div className="grid h-full grid-cols-1 gap-4 overflow-y-auto pr-1 pb-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="animate-fade-in-up group flex h-[280px] shrink-0 flex-col overflow-hidden"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <div className="relative h-32 shrink-0 bg-muted">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={getItemDisplayName(item)} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <PiForkKnifeBold size={28} />
                    </div>
                  )}
                  <span
                    className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-caption ${
                      item.availability ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.availability ? "Active" : "Inactive"}
                  </span>
                </div>
                <CardContent className="flex flex-1 flex-col p-3">
                  <p className="text-caption uppercase tracking-wide text-primary">{item.category}</p>
                  <h3 className="mt-0.5 line-clamp-1 text-h3 text-foreground">{getItemDisplayName(item)}</h3>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="tabular-figures text-h3 text-foreground">
                      ${Number(item.price).toFixed(2)}
                    </span>
                    <div className="flex gap-1 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
                      <Link
                        href={`/admin/editmenu/${item.id}`}
                        aria-label={`Edit ${getItemDisplayName(item)}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors duration-150 ease-out hover:border-primary/30 hover:bg-accent hover:text-primary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <PiPencilSimpleBold size={13} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        aria-label={`Delete ${getItemDisplayName(item)}`}
                        className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors duration-150 ease-out hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <PiTrashBold size={13} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await handleDelete(deleteTarget.id);
        }}
        entityName="menu item"
        description={`Are you sure you want to delete "${deleteTarget ? getItemDisplayName(deleteTarget) : "this menu item"}"? This action cannot be undone.`}
      />
    </div>
  );
}
