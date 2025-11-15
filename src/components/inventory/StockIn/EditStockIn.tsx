"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockInReceiptItem } from "@/lib/types/inventory";
import { UoM } from "@/lib/types/uom";
import { useUpdateStockIn } from "@/lib/mutations/inventoryMutations";
import { useToast } from "@/components/ui/toast";
import { useQueries } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/config";
import { useMultipleUoMQueries } from "@/lib/hooks/useMultipleUoMQueries";

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

  const updateStockIn = useUpdateStockIn();
  const { success, error: errorToast } = useToast();

  // Fetch inventory items in parallel to get uomTypeId
  const inventoryQueries = useQueries({
    queries: receiptData.items.map((item) => ({
      queryKey: ["inventoryItem", item.itemId],
      queryFn: async () => {
        const response = await fetch(`${BASE_URL}/inventory/${item.itemId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch inventory item");
        return response.json();
      },
      staleTime: 1000 * 60 * 5,
    })),
  });

  // Extract unique UOM type IDs
  const uniqueUomTypeIds = useMemo(() => {
    const typeIds: string[] = [];
    inventoryQueries.forEach((query) => {
      if (query.data?.masterItem?.uomTypeId) {
        typeIds.push(query.data.masterItem.uomTypeId);
      }
    });
    return [...new Set(typeIds)];
  }, [inventoryQueries]);

  // Fetch UOMs by type
  const {
    uomsByType,
    isLoading: isLoadingUoms,
  } = useMultipleUoMQueries(uniqueUomTypeIds);

  // Map itemId to uomTypeId
  const itemUomTypes = useMemo(() => {
    const map: Record<string, string> = {};
    receiptData.items.forEach((item, index) => {
      const queryData = inventoryQueries[index]?.data;
      if (queryData?.masterItem?.uomTypeId) {
        map[item.itemId] = queryData.masterItem.uomTypeId;
      }
    });
    return map;
  }, [inventoryQueries, receiptData.items]);

  const isLoadingInventory = inventoryQueries.some((query) => query.isLoading);

  const handleItemChange = (
    index: number,
    field: keyof EditableItem,
    value: string | number
  ) => {
    console.log(`handleItemChange called: index=${index}, field=${field}, value=${value}`);
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      console.log('Updated items:', newItems);
      return newItems;
    });
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
        {isLoadingInventory || isLoadingUoms ? (
          <div className="text-center py-4">Loading items...</div>
        ) : (
          items.map((item, index) => {
            const uomTypeId = itemUomTypes[item.itemId];
            const availableUoms = uomTypeId ? uomsByType[uomTypeId] || [] : [];
            
            return (
              <div key={`${item.itemId}-${index}`} className="p-4 border rounded space-y-4">\n                {/* Item Info and Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
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
                        console.log("Changing UOM from", item.uomId, "to", e.target.value);
                        const selectedUom = availableUoms.find(
                          (u: UoM) => u.id === e.target.value
                        );
                        handleItemChange(index, "uomId", e.target.value);
                        if (selectedUom) {
                          handleItemChange(index, "uomSymbol", selectedUom.symbol);
                        }
                      }}
                      className="w-24 h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {/* Show current UOM if not in available list */}
                      {!availableUoms.some((u: UoM) => u.id === item.uomId) && (
                        <option value={item.uomId}>{item.uomSymbol} (current)</option>
                      )}
                      {availableUoms.map((uom: UoM) => (
                        <option key={uom.id} value={uom.id}>
                          {uom.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
