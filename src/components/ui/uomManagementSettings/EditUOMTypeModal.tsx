"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUoMType } from "@/lib/mutations/uomMutations";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllUOM } from "@/lib/queries/uomQueries";

interface EditUOMTypeModalProps {
  onClose: () => void;
}

export default function EditUOMTypeModal({ onClose }: EditUOMTypeModalProps) {
  const updateUoMTypeMutation = useUpdateUoMType();
  const queryClient = useQueryClient();
  const { data: allUOMs } = useGetAllUOM(1); // page 1 for all

  const [name, setName] = useState("");
  const [selectedUOMId, setSelectedUOMId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUOMId) return;
    updateUoMTypeMutation.mutate(
      {
        id: selectedUOMId,
        type: name,
        standardUoMId: selectedUOMId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          onClose();
        },
        onError: (err: unknown) => {
          console.error("Update failed:", err);
          alert("Failed to update UOM Type");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">UOM Type Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new UOM type name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uom">Select UOM</Label>
        <select
          id="uom"
          className="w-full border rounded px-2 py-1"
          value={selectedUOMId}
          onChange={(e) => setSelectedUOMId(e.target.value)}
          required
        >
          <option value="">Select UOM</option>
          {(allUOMs?.data ?? []).map((uom: any) => (
            <option key={uom.id} value={uom.id}>
              {uom.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={!selectedUOMId || !name}>
          Save
        </Button>
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
