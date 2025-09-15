"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Searchbar from "@/components/ui/searchbar";
import { SelectableInventoryTable } from "@/components/inventory/PaginatedInventory/selectable-inventory-table";
import { UnifiedItemRow } from "@/components/inventory/shared/UnifiedItemRow";
import { usePaginatedInventoryItems } from "@/lib/queries/inventoryQueries";
import {
  useCreateStockIn,
  useCreateStockOut,
} from "@/lib/mutations/inventoryMutations";
import { useMultipleUoMQueries } from "@/lib/hooks/useMultipleUoMQueries";
import { PaginationParams, InventoryItem } from "@/lib/types/inventory";
import { UoM } from "@/lib/types/uom";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

type OperationType = "stock-in" | "stock-out";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [operationType, setOperationType] = useState<OperationType>("stock-in");
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  // Stock In quantities
  const [quantities, setQuantities] = useState<
    Record<string, { quantity: number; uomId: string }>
  >({});

  // Stock Out quantities with additional fields
  const [stockOutQuantities, setStockOutQuantities] = useState<
    Record<
      string,
      {
        quantity: number;
        uomId: string;
        isDamagedGoods: boolean;
        comment: string;
      }
    >
  >({});

  const pageSize = 15;

  const createStockInMutation = useCreateStockIn();
  const createStockOutMutation = useCreateStockOut();

  const paginationParams: PaginationParams = {
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
  };

  const {
    data: response,
    isLoading,
    error,
  } = usePaginatedInventoryItems(paginationParams);

  // Get unique UoM type IDs from selected items
  const uniqueUomTypeIds = useMemo(() => {
    const typeIds = selectedItems.map((item) => item.masterItem.uomTypeId);
    return [...new Set(typeIds)];
  }, [selectedItems]);

  // Optimized UoM fetching using the new hook
  const {
    uomsByType,
    isLoading: isLoadingUoms,
    error: uomsError,
  } = useMultipleUoMQueries(uniqueUomTypeIds);

  // Function to get UoMs for a specific item
  const getUomsForItem = useCallback(
    (item: InventoryItem): UoM[] => {
      return uomsByType[item.masterItem.uomTypeId] || [];
    },
    [uomsByType]
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStartStockIn = () => {
    setOperationType("stock-in");
    setIsSelectionMode(true);
    setSelectedItems([]);
  };

  const handleStartStockOut = () => {
    setOperationType("stock-out");
    setIsSelectionMode(true);
    setSelectedItems([]);
  };

  const handleCancelOperation = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
    setQuantities({});
    setStockOutQuantities({});
  };

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleNext = () => {
    if (operationType === "stock-in") {
      const initialQuantities: Record<
        string,
        { quantity: number; uomId: string }
      > = {};
      selectedItems.forEach((item) => {
        initialQuantities[item.id] = {
          quantity: 0,
          uomId: item.uom.id,
        };
      });
      setQuantities(initialQuantities);
    } else {
      const initialStockOutQuantities: Record<
        string,
        {
          quantity: number;
          uomId: string;
          isDamagedGoods: boolean;
          comment: string;
        }
      > = {};
      selectedItems.forEach((item) => {
        initialStockOutQuantities[item.id] = {
          quantity: 0,
          uomId: item.uom.id,
          isDamagedGoods: false,
          comment: "",
        };
      });
      setStockOutQuantities(initialStockOutQuantities);
    }
    setShowQuantityModal(true);
  };

  // Stock In handlers
  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
  };

  const handleUomChange = (itemId: string, uomId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], uomId },
    }));
  };

  // Stock Out handlers
  const handleStockOutQuantityChange = (itemId: string, quantity: number) => {
    setStockOutQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
  };

  const handleStockOutUomChange = (itemId: string, uomId: string) => {
    setStockOutQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], uomId },
    }));
  };

  const handleDamagedGoodsChange = (
    itemId: string,
    isDamagedGoods: boolean
  ) => {
    setStockOutQuantities((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        isDamagedGoods,
        comment: isDamagedGoods ? prev[itemId]?.comment || "" : "",
      },
    }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setStockOutQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], comment },
    }));
  };

  const handleSubmitStockIn = () => {
    const items = selectedItems.map((item) => ({
      itemId: item.id,
      uomId: quantities[item.id].uomId,
      quantity: quantities[item.id].quantity,
    }));

    createStockInMutation.mutate(
      { items },
      {
        onSuccess: () => {
          setShowQuantityModal(false);
          setIsSelectionMode(false);
          setSelectedItems([]);
          setQuantities({});
          alert("Stock-in created successfully!");
        },
        onError: (error) => {
          alert(`Failed to create stock-in: ${error.message}`);
        },
      }
    );
  };

  const handleSubmitStockOut = () => {
    const items = selectedItems.map((item) => ({
      itemId: item.id,
      uomId: stockOutQuantities[item.id].uomId,
      quantity: stockOutQuantities[item.id].quantity,
      isDamagedGoods: stockOutQuantities[item.id].isDamagedGoods,
      comment: stockOutQuantities[item.id].comment || undefined,
    }));

    createStockOutMutation.mutate(
      { items },
      {
        onSuccess: () => {
          setShowQuantityModal(false);
          setIsSelectionMode(false);
          setSelectedItems([]);
          setStockOutQuantities({});
          alert("Stock-out created successfully!");
        },
        onError: (error) => {
          alert(`Failed to create stock-out: ${error.message}`);
        },
      }
    );
  };

  const isValidSubmission = () => {
    if (operationType === "stock-in") {
      return selectedItems.every((item) => quantities[item.id]?.quantity > 0);
    } else {
      return selectedItems.every(
        (item) =>
          stockOutQuantities[item.id]?.quantity > 0 &&
          (!stockOutQuantities[item.id]?.isDamagedGoods ||
            stockOutQuantities[item.id]?.comment.trim().length > 0)
      );
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Inventory</h1>
        {!isSelectionMode && (
          <div className="flex gap-2">
            <Button onClick={handleStartStockIn}>Stock In</Button>
            <Button onClick={handleStartStockOut} variant="outline">
              Stock Out
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-2">
          <Searchbar
            onSearchChange={handleSearchChange}
            placeholder="Search inventory items..."
          />
        </div>
        {isSelectionMode && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 mr-2">
              {selectedItems.length} item(s) selected for {operationType}
            </span>
            <Button variant="outline" onClick={handleCancelOperation}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={selectedItems.length === 0}>
              Next
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full h-full gap-4">
        <SelectableInventoryTable
          data={response?.data || []}
          metadata={
            response?.metadata || {
              total: 0,
              totalPages: 0,
              currentPage: 1,
              limit: pageSize,
            }
          }
          onPageChange={handlePageChange}
          isLoading={isLoading}
          error={error}
          isSelectionMode={isSelectionMode}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
        />
      </div>

      {/* Quantity Modal */}
      <Modal
        isVisible={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
      >
        <ModalHeader>
          <ModalTitle>
            Set {operationType === "stock-in" ? "Stock In" : "Stock Out"}{" "}
            Details
          </ModalTitle>
          <ModalDescription>
            Enter the quantity
            {operationType === "stock-out" ? ", damaged goods status," : ""} and
            unit of measurement for each item
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <UnifiedItemRow
                key={item.id}
                item={item}
                mode={operationType}
                quantity={
                  operationType === "stock-in"
                    ? quantities[item.id]?.quantity || 0
                    : stockOutQuantities[item.id]?.quantity || 0
                }
                selectedUomId={
                  operationType === "stock-in"
                    ? quantities[item.id]?.uomId || item.uom.id
                    : stockOutQuantities[item.id]?.uomId || item.uom.id
                }
                availableUoms={getUomsForItem(item)}
                isLoadingUoms={isLoadingUoms}
                uomsError={uomsError}
                onQuantityChange={(quantity) => {
                  if (operationType === "stock-in") {
                    handleQuantityChange(item.id, quantity);
                  } else {
                    handleStockOutQuantityChange(item.id, quantity);
                  }
                }}
                onUomChange={(uomId) => {
                  if (operationType === "stock-in") {
                    handleUomChange(item.id, uomId);
                  } else {
                    handleStockOutUomChange(item.id, uomId);
                  }
                }}
                // Stock Out specific props
                isDamagedGoods={
                  stockOutQuantities[item.id]?.isDamagedGoods || false
                }
                comment={stockOutQuantities[item.id]?.comment || ""}
                onDamagedGoodsChange={(isDamaged) =>
                  handleDamagedGoodsChange(item.id, isDamaged)
                }
                onCommentChange={(comment) =>
                  handleCommentChange(item.id, comment)
                }
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowQuantityModal(false)}
            >
              Back
            </Button>
            <Button
              onClick={
                operationType === "stock-in"
                  ? handleSubmitStockIn
                  : handleSubmitStockOut
              }
              disabled={
                (operationType === "stock-in"
                  ? createStockInMutation.isPending
                  : createStockOutMutation.isPending) || !isValidSubmission()
              }
            >
              {(
                operationType === "stock-in"
                  ? createStockInMutation.isPending
                  : createStockOutMutation.isPending
              )
                ? "Submitting..."
                : `Submit ${
                    operationType === "stock-in" ? "Stock In" : "Stock Out"
                  }`}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
