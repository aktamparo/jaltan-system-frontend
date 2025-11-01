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

interface UnifiedItemRowProps {
  item: InventoryItem;
  quantity: number;
  selectedUomId: string;
  availableUoms: UoM[];
  isLoadingUoms?: boolean;
  uomsError?: Error | null;
  onQuantityChange: (quantity: number) => void;
  onUomChange: (uomId: string) => void;

  // Stock Out specific props (optional)
  isDamagedGoods?: boolean;
  comment?: string;
  onDamagedGoodsChange?: (isDamaged: boolean) => void;
  onCommentChange?: (comment: string) => void;

  // Configuration
  mode: "stock-in" | "stock-out";
}

export function UnifiedItemRow({
  item,
  quantity,
  selectedUomId,
  availableUoms,
  isLoadingUoms = false,
  uomsError = null,
  onQuantityChange,
  onUomChange,
  isDamagedGoods = false,
  comment = "",
  onDamagedGoodsChange,
  onCommentChange,
  mode,
}: UnifiedItemRowProps) {
  // Set initial UoM if not already set
  useEffect(() => {
    if (availableUoms?.length > 0 && !selectedUomId) {
      const defaultUom =
        availableUoms.find((uom) => uom.id === item.uom.id) || availableUoms[0];
      onUomChange(defaultUom.id);
    }
  }, [availableUoms, selectedUomId, item.uom.id, onUomChange]);

  const renderUomSelect = () => {
    if (isLoadingUoms) {
      return (
        <div className="w-24 h-10 border rounded flex items-center justify-center">
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      );
    }

    if (uomsError) {
      return (
        <div className="w-24 h-10 border rounded flex items-center justify-center">
          <span className="text-sm text-red-400">Error</span>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      {/* Item Info & Controls Row */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h4 className="font-medium">{item.masterItem.name}</h4>
          <p className="text-sm text-gray-600">{item.masterItem.description}</p>
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
          {renderUomSelect()}
        </div>
      </div>

      {/* Stock Out Specific Controls */}
      {mode === "stock-out" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`damaged-${item.id}`}
              checked={isDamagedGoods}
              onChange={(e) => onDamagedGoodsChange?.(e.target.checked)}
              className="rounded"
            />
            <label
              htmlFor={`damaged-${item.id}`}
              className="text-sm font-medium cursor-pointer"
            >
              Damaged Goods
            </label>
          </div>
          {isDamagedGoods && (
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Comment
              </label>
              <Input
                type="text"
                placeholder="Add comment about damage..."
                value={comment}
                onChange={(e) => onCommentChange?.(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
