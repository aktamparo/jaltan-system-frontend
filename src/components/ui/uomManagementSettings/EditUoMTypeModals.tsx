"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateUoMType } from "../../../lib/mutations/uomMutations";
import { useGetAllUOM } from "@/lib/queries/uomQueries";  
import {UomType} from "@/lib/types/uom";
interface EditUOMTypeModalProps {
  uomType: UomType;
  onClose: () => void;
  
}


export default function EditUOMTypeModal({ uomType, onClose }: EditUOMTypeModalProps) {
  
  const updateUoMTypeMutation = useUpdateUoMType();
  const queryClient = useQueryClient();
  const { data: allUOMs } = useGetAllUOM(1,100);

  const [type, setType] = useState(uomType.type);
  const [standardUoMId, setStandardUoMId] = useState(uomType.standardUoMId);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["uom"] });
    queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
  }, [queryClient]);
  
console.log({ id: uomType.id, type, standardUoMId: standardUoMId || undefined });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send fields that are non-empty
    const payload: { id: string; type?: string; standardUoMId?: string } = { id: uomType.id };
    if (type && type.trim() !== "") payload.type = type;
    if (standardUoMId && standardUoMId.trim() !== "") payload.standardUoMId = standardUoMId;
    updateUoMTypeMutation.mutate(
      payload,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["uom"] });
          onClose();
        },
        onError: async (err: unknown) => {
          let errorMsg = "Failed to update UOM Type";
          if (err instanceof Response) {
            try {
              const data = await err.json();
              errorMsg = data.message || errorMsg;
            } catch {
              errorMsg = await err.text();
            }
          } else if (err instanceof Error) {
            errorMsg = err.message;
          }
          console.error("Update failed:", errorMsg);
          alert(errorMsg);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="type">UOM Type Name</Label>
        <Input
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter UOM type name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="standardUoMId">Standard UOM</Label>
        <select
          id="standardUoMId"
          className="w-full border rounded px-2 py-1"
          value={standardUoMId}
          onChange={(e) => setStandardUoMId(e.target.value)}
          required
        >
          <option value="">Select UOM</option>
          {(allUOMs?.data ?? []).map((uom: { id: string; name: string }) => (
            <option key={uom.id} value={uom.id}>
              {uom.name}
            </option>
          ))}
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
