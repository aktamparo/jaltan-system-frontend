"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockInReceiptItem } from "@/lib/types/inventory";
import { UoM } from "@/lib/types/uom";
import { useUpdateStockIn } from "@/lib/mutations/inventoryMutations";
import { useGetAllUOM } from "@/lib/queries/uomQueries";
import { useToast } from "@/components/ui/toast";

interface EditStockInReceiptData {
  stockIn: {
    id: string;
    createdAt: string;
    createdById: string;
    modifiedAt: string;
    modifiedById: string;
  };
  items: StockInReceiptItem[];
}

interface EditStockInProps {
  receiptData: EditStockInReceiptData;
  onClose: () => void;
  onSuccess: () => void;
}

interface EditableItem {
  inventoryId: string;
  itemId: string;
  uomId: string;
  quantity: number;
  name: string;
  uomSymbol: string;
}

export default function EditStockIn({
  receiptData,
  onClose,
  onSuccess,
}: EditStockInProps) {
  const [items, setItems] = useState<EditableItem[]>(
    receiptData.items.map((item) => ({
      inventoryId: item.inventoryId,
      itemId: item.itemId,
      uomId: item.uomId,
      quantity: item.quantity,
      name: item.name,
      uomSymbol: item.uomSymbol,
    }))
  );

  const { data: uomData } = useGetAllUOM(1, 100);
  const updateStockIn = useUpdateStockIn();
  const { success, error: errorToast } = useToast();

  const handleItemChange = (
    index: number,
    field: keyof EditableItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = () => {
    const payload = {
      items: items.map((item) => ({
        itemId: item.itemId,
        uomId: item.uomId,
        quantity: Number(item.quantity),
      })),
    };

    updateStockIn.mutate(
      {
        id: receiptData.stockIn.id,
        payload,
      },
      {
        onSuccess: () => {
          success("Stock in updated successfully");
          onSuccess();
        },
        onError: (error: Error) => {
          errorToast(error.message || "Failed to update stock in");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Edit Stock In Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update the quantity and unit of measurement for each item
        </p>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 border rounded space-y-4">
            {/* Item Info and Controls */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-xs text-gray-500">
                  Current stock: {Number(item.quantity).toFixed(2)} {item.uomSymbol}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                  className="w-24"
                  min="0.1"
                  step="0.1"
                />
                <select
                  value={item.uomId}
                  onChange={(e) => {
                    const selectedUom = uomData?.data.find(
                      (u: UoM) => u.id === e.target.value
                    );
                    handleItemChange(index, "uomId", e.target.value);
                    if (selectedUom) {
                      handleItemChange(index, "uomSymbol", selectedUom.symbol);
                    }
                  }}
                  className="w-24 h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {uomData?.data.map((uom: UoM) => (
                    <option key={uom.id} value={uom.id}>
                      {uom.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={onClose}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={updateStockIn.isPending}
        >
          {updateStockIn.isPending ? "Submitting..." : "Submit Stock In"}
        </Button>
      </div>
    </div>
  );
}
