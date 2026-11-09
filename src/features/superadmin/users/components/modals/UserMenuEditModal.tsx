"use client";

import React, { useId } from "react";
import { Modal } from "@/components/Modal";
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  FormField,
} from "@/components/ui";
import { ModalFooter } from "@/components/ui/ModalFooter";
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
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  if (!editingItem) return null;

  const close = () => setEditingItem(null);

  const footer = (
    <ModalFooter>
      <Button type="button" variant="secondary" onClick={close}>
        Cancel
      </Button>
      <Button type="submit" form={formId} loading={menuSaving}>
        Save changes
      </Button>
    </ModalFooter>
  );

  return (
    <Modal isOpen onClose={close} title="Edit dish" maxWidth="max-w-lg" footer={footer}>
      <form id={formId} onSubmit={handleSaveMenuItem} className="space-y-4">
        <FormField label="Name" htmlFor={fieldId("name")} required>
          <Input
            id={fieldId("name")}
            value={editingItem.item}
            onChange={(e) => setEditingItem({ ...editingItem, item: e.target.value })}
            required
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price" htmlFor={fieldId("price")} required>
            <Input
              id={fieldId("price")}
              type="number"
              step="0.01"
              value={editingItem.price}
              onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
              required
            />
          </FormField>
          <FormField label="Category" htmlFor={fieldId("category")} required>
            <Input
              id={fieldId("category")}
              value={editingItem.category}
              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Food type" htmlFor={fieldId("type")}>
            <Select
              id={fieldId("type")}
              value={editingItem.type}
              onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-veg</option>
            </Select>
          </FormField>
          <div className="flex items-center pt-6">
            <Checkbox
              id={fieldId("popular")}
              label="Mark as popular"
              checked={editingItem.popular}
              onChange={(e) => setEditingItem({ ...editingItem, popular: e.target.checked })}
            />
          </div>
        </div>

        <FormField label="Description" htmlFor={fieldId("description")}>
          <Textarea
            id={fieldId("description")}
            value={editingItem.description || ""}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            rows={3}
            placeholder="Ingredients, how it's made, etc."
          />
        </FormField>

        <Checkbox
          id={fieldId("availability")}
          label="Show on the menu and allow ordering"
          checked={editingItem.availability}
          onChange={(e) => setEditingItem({ ...editingItem, availability: e.target.checked })}
        />
      </form>
    </Modal>
  );
}
