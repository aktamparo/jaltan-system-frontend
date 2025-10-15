"use client";

import { useState } from "react";
import type { StockIn } from "@/components/inventory/StockIn/UpdateStockInItems/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props {
  item: StockIn | null;
  onClose: () => void;
  onSave: (details: { itemId: string; quantity: number; uomName: string; uomId: string; isDamaged?: boolean; comment?: string }[]) => void;
}

export default function StockOutDetails({ item, onClose, onSave }: Props) {
  const [quantity, setQuantity] = useState<number>(0);
  const [uomId, setUomId] = useState<string>("UOM1");
  const [uomName, setUomName] = useState<string>("kg");
  const [isDamaged, setIsDamaged] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  if (!item) return null;

  const handleSave = () => {
    onSave([{ itemId: item.id, quantity, uomName, uomId, isDamaged, comment }]);
  };
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-medium">{item.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{item.category && item.category.length ? item.category.join(", ") : ""}</div>
            <div className="mt-2 text-xs text-muted-foreground">Current stock: {typeof item.quantity === 'number' ? item.quantity.toFixed(2) : String(item.quantity)} {item.uomSymbol ?? ""}</div>
          </div>

          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Quantity"
              className="w-32"
            />

            <Select value={uomId} onValueChange={(val) => { setUomId(val); const map: Record<string,string> = { UOM1: 'kg', UOM2: 'g', UOM3: 'pcs' }; setUomName(map[val] ?? val); }}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="kg" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UOM1">kg</SelectItem>
                <SelectItem value="UOM2">g</SelectItem>
                <SelectItem value="UOM3">pcs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={isDamaged} onChange={(e) => setIsDamaged(e.target.checked)} className="h-4 w-4" />
            <span className="text-sm font-medium">Damaged Goods</span>
          </label>
        </div>

        {isDamaged && (
          <div className="mt-3">
            <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add comment about damage..." />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={onClose}>Back</Button>
        <Button size="sm" onClick={handleSave}>Submit Stock Out</Button>
      </div>
    </div>
  );
}
