"use client";

import { useState, useEffect } from "react";
import Searchbar from "@/components/ui/searchbar";
import StockInItem from "@/components/inventory/StockIn/StockInItem";
import UpdateStockIn from "@/components/inventory/StockIn/UpdateStockIn";
import { SelectableInventoryTable } from "@/components/inventory/PaginatedInventory/selectable-inventory-table";
import { ItemQuantityRow } from "@/components/inventory/StockIn/ItemQuantityRow";
import { usePaginatedInventoryItems } from "@/lib/queries/inventoryQueries";
import { useCreateStockIn } from "@/lib/mutations/inventoryMutations";
import { PaginationParams, InventoryItem } from "@/lib/types/inventory";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantities, setQuantities] = useState<
    Record<string, { quantity: number; uomId: string }>
  >({});
  const pageSize = 15;

  const createStockInMutation = useCreateStockIn();

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStartStockIn = () => {
    setIsSelectionMode(true);
    setSelectedItems([]);
  };

  const handleCancelStockIn = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
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
    // Initialize quantities for selected items
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
    setShowQuantityModal(true);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity,
      },
    }));
  };

  const handleUomChange = (itemId: string, uomId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        uomId,
      },
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Inventory</h1>
        {!isSelectionMode && (
          <Button onClick={handleStartStockIn}>Stock In</Button>
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
              {selectedItems.length} item(s) selected
            </span>
            <Button variant="outline" onClick={handleCancelStockIn}>
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

        {!isSelectionMode && (
          <div className="flex flex-row items-center gap-2 mt-2 ml-auto">
            <StockInItem />
            <UpdateStockIn />
            {/* <StockOutItem /> */}
          </div>
        )}
      </div>

      {/* Quantity Modal */}
      <Modal
        isVisible={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Set Quantities</ModalTitle>
          <ModalDescription>
            Enter the quantity and unit of measurement for each item
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <ItemQuantityRow
                key={item.id}
                item={item}
                quantity={quantities[item.id]?.quantity || 0}
                selectedUomId={quantities[item.id]?.uomId || item.uom.id}
                onQuantityChange={(quantity) =>
                  handleQuantityChange(item.id, quantity)
                }
                onUomChange={(uomId) => handleUomChange(item.id, uomId)}
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
              onClick={handleSubmitStockIn}
              disabled={
                createStockInMutation.isPending ||
                selectedItems.some(
                  (item) =>
                    !quantities[item.id]?.quantity ||
                    quantities[item.id]?.quantity <= 0
                )
              }
            >
              {createStockInMutation.isPending
                ? "Submitting..."
                : "Submit Stock In"}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
