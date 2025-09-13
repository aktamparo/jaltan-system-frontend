"use client";

import { useState } from "react";
import type { StockIn } from "@/components/inventory/StockInItems/CreateStockIn/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateStockInProps {
  item: StockIn;
  onClose: () => void;
  onSave: (createStockIn: any) => void;
}

export default function StockInDetailsModal({
  onClose,
  onSave,
}: CreateStockInProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [uomName, setUomName] = useState<string>("kg");

  return (
    <div className="space-y-4">

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2"> 
        <Label htmlFor="uom">Unit of Measurement</Label>
        <Input
          id="uom"
          type="text"
          value={uomName}
          onChange={(e) => setUomName(e.target.value)}
        />
      </div>

      <div className="flex justify-start gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave({ quantity, uomName, uomId: "UOM1" })}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
