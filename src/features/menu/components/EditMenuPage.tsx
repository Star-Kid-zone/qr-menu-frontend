"use client";

import { PageLoader } from "@/components/ui";
import { LoadErrorNotice } from "@/components/feedback/LoadErrorNotice";
import { MenuItemForm } from "./MenuItemForm";
import { useMenuItemForm } from "../hooks/useMenuItemForm";

export function EditMenuPage({ menuId }: { menuId: string }) {
  const form = useMenuItemForm({ menuId });

  if (form.itemLoading) return <PageLoader />;

  // Never show an empty form for a dish that failed to load: saving it would wipe the dish.
  if (form.itemError) {
    return (
      <div className="p-4">
        <LoadErrorNotice title="We couldn't load this dish" message={form.itemError} onRetry={form.retryItem} />
      </div>
    );
  }

  return <MenuItemForm form={form} title="Edit dish" submitLabel="Save changes" />;
}
