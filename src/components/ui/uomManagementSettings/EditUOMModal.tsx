"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateUoM } from "../../../lib/mutations/uomMutations";
import { useGetAllUOMTypes } from "@/lib/queries/uomQueries";
import { UoM } from "@/lib/types/uom";

import { useToast } from "@/components/ui/toast";

interface EditUOMModalProps {
  uom: UoM;
  onClose: () => void;
}

export default function EditUOMModal({ uom, onClose }: EditUOMModalProps) {
  const updateUoMMutation = useUpdateUoM();
  const queryClient = useQueryClient();
  const { data: allUOMTypes } = useGetAllUOMTypes(1, 100);
  const toast = useToast();

  const [name, setName] = useState(uom.name);
  const [symbol, setSymbol] = useState(uom.symbol);
  const [conversionFactor, setConversionFactor] = useState(
    uom.conversionFactor.toString()
  );
  const [uomTypeId, setUomTypeId] = useState(uom.uomTypeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send fields that have changed
    const payload: {
      id: string;
      name?: string;
      symbol?: string;
      conversionFactor?: number;
      uomTypeId?: string;
    } = { id: uom.id };
    if (name && name.trim() !== "" && name !== uom.name) payload.name = name;
    if (symbol && symbol.trim() !== "" && symbol !== uom.symbol) payload.symbol = symbol;
    if (conversionFactor && conversionFactor.trim() !== "" && parseFloat(conversionFactor) !== uom.conversionFactor)
      payload.conversionFactor = parseFloat(conversionFactor);
    // Only include uomTypeId if it has actually changed
    if (uomTypeId && uomTypeId.trim() !== "" && uomTypeId !== uom.uomTypeId) 
      payload.uomTypeId = uomTypeId;

    updateUoMMutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["uom"] });
        queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
        queryClient.invalidateQueries({ queryKey: ["uomsByType"] });
        onClose();
        toast.success(
          "UoM Updated",
          "Unit of measurement has been successfully updated."
        );
      },
      onError: (err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update UoM";

        toast.error("UoM Update Failed", errorMessage);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Unit of Measurement Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter UoM name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Input
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter UoM symbol"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conversionFactor">Conversion Factor</Label>
        <Input
          id="conversionFactor"
          type="number"
          step="0.001"
          value={conversionFactor}
          onChange={(e) => setConversionFactor(e.target.value)}
          placeholder="Enter conversion factor"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="uomTypeId">Unit of Measurement Type</Label>
        <select
          id="uomTypeId"
          className="w-full border rounded px-2 py-1"
          value={uomTypeId}
          onChange={(e) => setUomTypeId(e.target.value)}
          disabled={uom.isBase}
        >
          <option value="">Select UoM Type</option>
          {(allUOMTypes?.data ?? []).map(
            (uomType: { id: string; type: string }) => (
              <option key={uomType.id} value={uomType.id}>
                {uomType.type}
              </option>
            )
          )}
        </select>
        {uom.isBase && (
          <p className="text-sm text-gray-500">
            Cannot change type - this is a base unit
          </p>
        )}
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
