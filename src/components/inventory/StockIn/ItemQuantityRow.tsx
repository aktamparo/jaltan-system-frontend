import { useEffect } from "react";
import { InventoryItem } from "@/lib/types/inventory";
import { UoM } from "@/lib/types/uom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemQuantityRowProps {
  item: InventoryItem;
  quantity: number;
  selectedUomId: string;
  availableUoms: UoM[];
  isLoadingUoms?: boolean;
  uomsError?: Error | null;
  onQuantityChange: (quantity: number) => void;
  onUomChange: (uomId: string) => void;
}

export function ItemQuantityRow({
  item,
  quantity,
  selectedUomId,
  availableUoms,
  isLoadingUoms = false,
  uomsError = null,
  onQuantityChange,
  onUomChange,
}: ItemQuantityRowProps) {
  // Set initial UoM if not already set
  useEffect(() => {
    if (availableUoms && availableUoms.length > 0 && !selectedUomId) {
      // Default to the current UoM or the first available one
      const defaultUom =
        availableUoms.find((uom) => uom.id === item.uom.id) || availableUoms[0];
      onUomChange(defaultUom.id);
    }
  }, [availableUoms, selectedUomId, item.uom.id, onUomChange]);

  return (
    <div className="flex items-center gap-4 p-4 border rounded">
      <div className="flex-1">
        <h4 className="font-medium">{item.masterItem.name}</h4>
        <p className="text-sm text-gray-600">{item.masterItem.description}</p>
        <p className="text-xs text-gray-500">
          Current stock: {Number(item.quantity).toFixed(2)} {item.uom?.symbol || '-'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity || ""}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="w-24"
          min="0.1"
          step="0.1"
        />
        {isLoadingUoms ? (
          <div className="w-20 h-10 border rounded flex items-center justify-center">
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        ) : uomsError ? (
          <div className="w-20 h-10 border rounded flex items-center justify-center">
            <span className="text-sm text-red-400">Error</span>
          </div>
        ) : (
          <Select value={selectedUomId} onValueChange={onUomChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableUoms?.map((uom) => (
                <SelectItem key={uom.id} value={uom.id}>
                  {uom.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
