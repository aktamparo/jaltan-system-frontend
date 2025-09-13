"use client";

import { useState } from "react";
import type { StockOut } from "@/components/inventory/StockOutItems/CreateStockOut/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateStockOutProps {
  item: StockOut;
  onClose: () => void;
  onSave: (createStockOut: any) => void;
}

export default function StockInDetailsModal({
  onClose,
  onSave,
}: CreateStockOutProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [uomName, setUomName] = useState<string>("kg");
  const [isDamagedGoods, setIsDamagedGoods] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

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

      <div className="flex items-center gap-2">
        <input
          id="isDamagedGoods"
          type="checkbox"
          checked={isDamagedGoods}
          onChange={(e) => setIsDamagedGoods(e.target.checked)}
        />
        <Label htmlFor="isDamagedGoods">Damaged Goods? (optional)</Label>
      </div>

      {/* ✅ Comment input always visible */}
      <div className="space-y-2">
        <Label htmlFor="comment">Comment (optional)</Label>
        <Input
          id="comment"
          type="text"
          placeholder="Add comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex justify-start gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSave({
              quantity,
              uomName,
              uomId: "UOM1",
              isDamagedGoods,
              comment: comment || undefined,
            })
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
}
