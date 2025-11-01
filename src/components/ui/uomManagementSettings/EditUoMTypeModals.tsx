"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateUoMType } from "../../../lib/mutations/uomMutations";
import { useGetAllUOM } from "@/lib/queries/uomQueries";
import { UomType } from "@/lib/types/uom";
import { useToast } from "@/components/ui/toast";

interface EditUOMTypeModalProps {
  uomType: UomType;
  onClose: () => void;
}

export default function EditUOMTypeModal({
  uomType,
  onClose,
}: EditUOMTypeModalProps) {
  const updateUoMTypeMutation = useUpdateUoMType();
  const queryClient = useQueryClient();
  const { data: allUOMs } = useGetAllUOM(1, 100);
  const toast = useToast();

  const [type, setType] = useState(uomType.type);
  const [standardUoMId, setStandardUoMId] = useState(uomType.standardUoMId);
  console.log({
    id: uomType.id,
    type,
    standardUoMId: standardUoMId || undefined,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send fields that are non-empty
    const payload: { id: string; type?: string; standardUoMId?: string } = {
      id: uomType.id,
    };
    if (type && type.trim() !== "") payload.type = type;
    if (standardUoMId && standardUoMId.trim() !== "")
      payload.standardUoMId = standardUoMId;
    updateUoMTypeMutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["uom"] });
        onClose();
        toast.success(
          "UOM Type Updated",
          "UOM type has been successfully updated."
        );
      },
      onError: (err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update UOM Type";

        toast.error("UOM Type Update Failed", errorMessage);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="type">Unit of Measurement Type Name</Label>
        <Input
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter UoM type name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="standardUoMId">Standard Unit of Measurement</Label>
        <select
          id="standardUoMId"
          className="w-full border rounded px-2 py-1"
          value={standardUoMId}
          onChange={(e) => setStandardUoMId(e.target.value)}
          required
        >
          <option value="">Select UoM</option>
          {(allUOMs?.data ?? []).map((uom: { id: string; name: string }) => (
            <option key={uom.id} value={uom.id}>
              {uom.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-row w-full gap-4 mt-6 justify-end">
        <Button type="submit">
          Save
        </Button>
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
