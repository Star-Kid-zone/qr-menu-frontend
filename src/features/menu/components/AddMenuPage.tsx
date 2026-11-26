"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PiMagicWandBold } from "react-icons/pi";
import { buttonVariants } from "@/components/ui";
import { MenuScanModal } from "./MenuScanModal";
import { MenuItemForm } from "./MenuItemForm";
import { useMenuItemForm } from "../hooks/useMenuItemForm";

export function AddMenuPage() {
  const router = useRouter();
  const form = useMenuItemForm();
  const [scanModalOpen, setScanModalOpen] = useState(false);

  return (
    <MenuItemForm
      form={form}
      title="Add dish"
      submitLabel="Add dish"
      headerExtra={
        <button type="button" onClick={() => setScanModalOpen(true)} className={buttonVariants({ variant: "ghost" })}>
          <PiMagicWandBold size={16} aria-hidden />
          Scan a menu photo instead
        </button>
      }
    >
      <MenuScanModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onImported={() => router.push("/admin/listmenu")}
        industryId={form.industryId}
        categories={form.categories}
        types={form.types}
        defaultCategory={form.selectedCategory}
        defaultType={form.selectedType}
      />
    </MenuItemForm>
  );
}
