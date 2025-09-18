"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditMasterItem } from "@/lib/mutations/inventoryMutations";
import { useQueryClient } from "@tanstack/react-query";
import { EditMasterItem } from "@/lib/types/inventory";
import { useGetAllUOMTypes } from "@/lib/queries/uomQueries";
import { useToast } from "@/components/ui/toast";

interface EditItemModalProps {
  item: EditMasterItem;
  onClose: () => void;
}

export default function EditItemModal({ item, onClose }: EditItemModalProps) {
  const updateItemMutation = useEditMasterItem();
  const [name, setName] = useState(item.name || "");
  const [description, setDescription] = useState(item.description || "");
  const [category, setCategory] = useState(item.category || []);
  const [uomTypeId, setUomTypeId] = useState(item.uomTypeId || "");
  const { data: allUOMTypes } = useGetAllUOMTypes(1); // page 1 for all
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateItemMutation.mutate(
      {
        id: item.id,
        name,
        description,
        category,
        uomTypeId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["masterItems"] });
          onClose();
          toast.success(
            "Item Updated",
            "Master item has been successfully updated."
          );
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to update item";

          toast.error("Update Failed", errorMessage);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full border rounded px-2 py-1"
          value={category.join(",")}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "FRIDGE,PANTRY") setCategory(["FRIDGE", "PANTRY"]);
            else setCategory([val as "FRIDGE" | "PANTRY"]);
          }}
        >
          <option value="FRIDGE">FRIDGE</option>
          <option value="PANTRY">PANTRY</option>
          <option value="FRIDGE,PANTRY">FRIDGE & PANTRY</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="uomTypeId">UOM Type</Label>
        <select
          id="uomTypeId"
          className="w-full border rounded px-2 py-1"
          value={uomTypeId}
          onChange={(e) => setUomTypeId(e.target.value)}
        >
          <option value="">Select UOM Type</option>
          {(allUOMTypes?.data ?? []).map(
            (uomType: { id: string; type: string }) => (
              <option key={uomType.id} value={uomType.id}>
                {uomType.type}
              </option>
            )
          )}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
