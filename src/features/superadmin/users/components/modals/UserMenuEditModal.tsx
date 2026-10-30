"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  FormField,
} from "@/components/ui";
import { PiXBold, PiFloppyDiskBold } from "react-icons/pi";
import type { TenantMenuItem } from "../../types";

export interface UserMenuEditModalProps {
  editingItem: TenantMenuItem | null;
  setEditingItem: (item: TenantMenuItem | null) => void;
  menuSaving: boolean;
  handleSaveMenuItem: (e: React.FormEvent) => Promise<void>;
}

export function UserMenuEditModal({
  editingItem,
  setEditingItem,
  menuSaving,
  handleSaveMenuItem,
}: UserMenuEditModalProps) {
  return (
    <AnimatePresence>
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">
                Edit Menu Item
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <PiXBold size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="mt-4 space-y-4">
              <FormField label="Item Name">
                <Input
                  value={editingItem.item}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, item: e.target.value })
                  }
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price ($)">
                  <Input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: e.target.value })
                    }
                    required
                  />
                </FormField>
                <FormField label="Category">
                  <Input
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    required
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Food Type">
                  <Select
                    value={editingItem.type}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, type: e.target.value })
                    }
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </Select>
                </FormField>
                <div className="flex items-center pt-6">
                  <Checkbox
                    id="edit-popular"
                    label="Mark as Popular"
                    checked={editingItem.popular}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        popular: e.target.checked,
                      })
                    }
                  />
                </div>
              </div>

              <FormField label="Description">
                <Textarea
                  value={editingItem.description || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Ingredients, recipe details, etc."
                />
              </FormField>

              <div className="flex items-center pt-2">
                <Checkbox
                  id="edit-availability"
                  label="Available for ordering / public viewing"
                  checked={editingItem.availability}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      availability: e.target.checked,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={menuSaving}
                  leftIcon={<PiFloppyDiskBold size={15} />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
