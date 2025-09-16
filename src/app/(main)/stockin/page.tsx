"use client";

import { useState, useEffect } from "react";
import Searchbar from "@/components/ui/searchbar";
import { StockInTable } from "@/components/inventory/PaginatedStockIn/stock-in-table";
import { SelectableStockInTable } from "@/components/inventory/PaginatedStockIn/selectable-stock-in-table";
import { StockIn } from "@/components/inventory/PaginatedStockIn/columns";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StockInReceipt, { ReceiptData } from "@/components/inventory/StockIn/StockInReceipt"; // Import the receipt component

// Local type for pagination metadata
type PaginationMetadata = {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
};

export default function StockInPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockIn | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState(0);
  const [selectedUoM, setSelectedUoM] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false); // NEW: state for receipt modal
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null); // NEW: state for receipt data

  // Mock data for testing the UI
  const data: StockIn[] = [
    {
      id: "1",
      name: "Milk",
      category: ["FRIDGE", "DAIRY"],
      quantity: 50,
      createdAt: "2023-10-15T08:30:00Z",
      createdById: "user123",
      modifiedAt: "2023-10-20T14:25:00Z",
      modifiedById: "user456",
    },
    {
      id: "2",
      name: "Bread",
      category: ["PANTRY"],
      quantity: 30,
      createdAt: "2023-10-16T09:15:00Z",
      createdById: "user789",
      modifiedAt: "2023-10-19T11:40:00Z",
      modifiedById: "user123",
    },
  ];

  const metadata: PaginationMetadata = {
    currentPage: 1,
    totalPages: 1,
    total: 2,
    limit: 10,
  };

  // Function to generate receipt data from a StockIn item
  const generateReceiptData = (item: StockIn): ReceiptData => {
    return {
      stockIn: {
        id: item.id,
        createdAt: item.createdAt,
        modifiedAt: item.modifiedAt,
        createdBy: {
          employee: {
            firstName: "User", // You can extract first name from ID if needed
            lastName: item.createdById
          }
        },
        modifiedBy: {
          employee: {
            firstName: "User", // You can extract first name from ID if needed
            lastName: item.modifiedById
          }
        }
      },
      items: [
        {
          itemId: item.id,
          itemName: item.name,
          quantity: item.quantity,
          uomSymbol: "pcs" // Default UoM, you can customize this
        }
      ]
    };
  };

  // Function to handle viewing receipt
  const handleViewReceipt = (item: StockIn) => {
    const receiptData = generateReceiptData(item);
    setSelectedReceipt(receiptData);
    setShowReceiptModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStartUpdate = () => {
    setIsSelectionMode(true);
    setSelectedItem(null);
  };

  const handleCancelOperation = () => {
    setIsSelectionMode(false);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: StockIn) => {
    setSelectedItem(item);
  };

  const handleNext = () => {
    if (selectedItem) {
      setUpdateQuantity(selectedItem.quantity);
      setSelectedUoM(""); // reset UoM when opening modal
      setShowUpdateModal(true);
    }
  };

  const handleSubmitUpdate = () => {
    if (!selectedItem || !selectedUoM) return;

    console.log("Updating stock-in:", {
      itemId: selectedItem.id,
      newQuantity: updateQuantity,
      selectedUoM,
      originalQuantity: selectedItem.quantity,
    });

    // TODO: Replace with mutation call

    setShowUpdateModal(false);
    setIsSelectionMode(false);
    setSelectedItem(null);
    alert("Stock-in updated successfully!");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
  <>
    <div className="flex flex-row items-center justify-between mb-4">
      <h1 className="text-xl font-medium m-0">Stock In</h1>
      {!isSelectionMode && (
        <Button onClick={handleStartUpdate}>Update Stock In</Button>
      )}
    </div>

    <div className="flex flex-row items-center justify-between mb-4">
      <Searchbar
        onSearchChange={handleSearchChange}
        placeholder="Search stock-in items"
      />
      {isSelectionMode && (
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 mr-2">
            {selectedItem ? "1 item selected" : "No item selected"}
          </span>
          <Button variant="outline" onClick={handleCancelOperation}>
            Cancel
          </Button>
          <Button onClick={handleNext} disabled={!selectedItem}>
            Next
          </Button>
        </div>
      )}
    </div>

    {/* ✅ This part is missing in your snippet */}
    {isSelectionMode ? (
      <SelectableStockInTable
        data={data}
        metadata={metadata}
        onPageChange={handlePageChange}
        isSelectionMode={isSelectionMode}
        selectedItem={selectedItem}
        onItemSelect={handleItemSelect}

      />
    ) : (
      <StockInTable
        data={data}
        metadata={metadata}
        onPageChange={handlePageChange}
        onViewReceipt={handleViewReceipt} // NEW: pass the receipt
      />
    )}

      {/* Update Quantity + UoM Modal */}
      <Modal
        isVisible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Update Stock In</ModalTitle>
          <ModalDescription>
            Enter details for {selectedItem?.name}
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          {selectedItem && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{selectedItem.name}</span>
                <span className="text-sm text-gray-600">
                  Current: {selectedItem.quantity}
                </span>
              </div>

              {/* Quantity + UoM (consistent with UnifiedItemRow) */}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={updateQuantity || ""}
                  onChange={(e) => setUpdateQuantity(Number(e.target.value))}
                  className="w-24"
                  min="0.1"
                  step="0.1"
                />

                <Select value={selectedUoM} onValueChange={setSelectedUoM}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Select UoM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="liters">liters</SelectItem>
                    <SelectItem value="packs">packs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {updateQuantity !== selectedItem.quantity && (
                <div className="text-sm text-gray-600">
                  Change: {updateQuantity > selectedItem.quantity ? "+" : ""}
                  {updateQuantity - selectedItem.quantity}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Back
            </Button>
            <Button
              onClick={handleSubmitUpdate}
              disabled={
                updateQuantity < 0 ||
                !selectedUoM
              }
            >
              Update Stock In
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isVisible={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Stock In Receipt</ModalTitle>
          <ModalDescription>
            Details for stock in transaction
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          {selectedReceipt && (
            <div className="pb-6"> {/* ✅ Adds padding at the bottom */}
              <StockInReceipt 
                receiptData={selectedReceipt} 
                onClose={() => setShowReceiptModal(false)} 
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}