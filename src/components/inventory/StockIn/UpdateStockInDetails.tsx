"use client";

import { useState } from "react";
import type { StockIn } from "@/components/inventory/StockIn/UpdateStockInDetails/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateStockInProps {
  item: StockIn | null;
  onClose: () => void;
  onSave: (details: {
    itemId: string;
    quantity: number;
    uomName: string;
    uomId: string;
  }[]) => void;
}

const UOM_OPTIONS = [
  { id: "UOM1", label: "kg" },
  { id: "UOM2", label: "g" },
  { id: "UOM3", label: "pcs" },
];

export default function UpdateStockInDetails({
  item,
  onClose,
  onSave,
}: UpdateStockInProps) {

  const [detail, setDetail] = useState(() => ({
    itemId: item?.id ?? "",
    quantity: 0,
    uomName: UOM_OPTIONS[0].label,
    uomId: UOM_OPTIONS[0].id,
  }));


  if (!item) return null;

  const handleChange = (field: string, value: string | number) => {
    setDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleUomChange = (uomId: string) => {
    const uom = UOM_OPTIONS.find((u) => u.id === uomId);
    if (uom) {
      setDetail((prev) => ({ ...prev, uomId, uomName: uom.label }));
    }
  };

  const handleSave = () => {
    onSave([detail]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
            {/* small subtitle - use category or placeholder */}
            <div className="mt-1 text-xs text-muted-foreground">
              {item.category && item.category.length > 0
                ? item.category.join(", ")
                : ""}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Current stock: {typeof item.quantity === 'number' ? item.quantity.toFixed(2) : String(item.quantity)}</div>
          </div>

          <div className="flex items-center gap-3">
            <Input
              id={`quantity-${item.id}`}
              type="number"
              value={detail.quantity}
              onChange={(e) => handleChange("quantity", Number(e.target.value))}
              className="w-28"
              min={0}
              placeholder="Quantity"
            />

            <div className="w-28">
              <Select value={detail.uomId} onValueChange={(val) => handleUomChange(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="UOM" />
                </SelectTrigger>
                <SelectContent>
                  {UOM_OPTIONS.map((uom) => (
                    <SelectItem key={uom.id} value={uom.id}>
                      {uom.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Back
        </Button>
        <Button type="button" onClick={handleSave}>
          Submit Stock In
        </Button>
      </div>
    </div>
  );
}
