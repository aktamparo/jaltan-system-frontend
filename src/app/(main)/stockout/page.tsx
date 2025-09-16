"use client";

import { useState, useEffect } from "react";
import Searchbar from "@/components/ui/searchbar";
import { StockOutTable } from "@/components/inventory/PaginatedStockOut/stock-out-table";
import { SelectableStockOutTable } from "@/components/inventory/PaginatedStockOut/selectable-stock-out-table";
import { StockOut } from "@/components/inventory/PaginatedStockOut/columns";
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
import StockOutReceipt, {
  ReceiptData,
} from "@/components/inventory/StockOut/StockOutReceipt";

type PaginationMetadata = {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
};

export default function StockOutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockOut | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState(0);
  const [selectedUoM, setSelectedUoM] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] =
    useState<ReceiptData | null>(null);
  const [isDamagedGoods, setIsDamagedGoods] = useState(false);
  const [comment, setComment] = useState("");

  const data: StockOut[] = [
    {
      id: "1",
      name: "Eggs",
      category: ["FRIDGE"],
      quantity: 20,
      createdAt: "2023-10-10T08:30:00Z",
      createdById: "user111",
      modifiedAt: "2023-10-12T14:25:00Z",
      modifiedById: "user222",
    },
    {
      id: "2",
      name: "Juice",
      category: ["DRINKS"],
      quantity: 15,
      createdAt: "2023-10-11T09:15:00Z",
      createdById: "user333",
      modifiedAt: "2023-10-13T11:40:00Z",
      modifiedById: "user111",
    },
  ];

  const metadata: PaginationMetadata = {
    currentPage: 1,
    totalPages: 1,
    total: 2,
    limit: 10,
  };

  const generateReceiptData = (item: StockOut): ReceiptData => {
    return {
      stockOut: {
        id: item.id,
        createdAt: item.createdAt,
        modifiedAt: item.modifiedAt,
        createdBy: {
          employee: {
            firstName: "User",
            lastName: item.createdById,
          },
        },
        modifiedBy: {
          employee: {
            firstName: "User",
            lastName: item.modifiedById,
          },
        },
      },
      items: [
        {
          itemId: item.id,
          itemName: item.name,
          quantity: item.quantity,
          uomSymbol: "pcs",
          isDamagedGoods: true, 
          comment: "Broken during transport", 
        },
      ],
    };
  };

  const handleViewReceipt = (item: StockOut) => {
    const receiptData = generateReceiptData(item);
    setSelectedReceipt(receiptData);
    setShowReceiptModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const handleItemSelect = (item: StockOut) => {
    setSelectedItem(item);
  };

  const handleNext = () => {
    if (selectedItem) {
      setUpdateQuantity(selectedItem.quantity);
      setSelectedUoM("");
      setIsDamagedGoods(false);
      setComment("");
      setShowUpdateModal(true);
    }
  };

  const handleSubmitUpdate = () => {
    if (!selectedItem || !selectedUoM) return;

    console.log("Updating stock-out:", {
      itemId: selectedItem.id,
      newQuantity: updateQuantity,
      selectedUoM,
      isDamagedGoods,
      comment,
      originalQuantity: selectedItem.quantity,
    });

    // TODO: Replace with mutation call

    setShowUpdateModal(false);
    setIsSelectionMode(false);
    setSelectedItem(null);
    alert("Stock-out updated successfully!");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Stock Out</h1>
        {!isSelectionMode && (
          <Button onClick={handleStartUpdate}>Update Stock Out</Button>
        )}
      </div>

      <div className="flex flex-row items-center justify-between mb-4">
        <Searchbar
          onSearchChange={handleSearchChange}
          placeholder="Search stock-out items"
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

      {isSelectionMode ? (
        <SelectableStockOutTable
          data={data}
          metadata={metadata}
          onPageChange={handlePageChange}
          isSelectionMode={isSelectionMode}
          selectedItem={selectedItem}
          onItemSelect={handleItemSelect}
        />
      ) : (
        <StockOutTable
          data={data}
          metadata={metadata}
          onPageChange={handlePageChange}
          onViewReceipt={handleViewReceipt}
        />
      )}

      {/* Update Modal */}
      <Modal
        isVisible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Update Stock Out</ModalTitle>
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

              <div className="flex items-center gap-2">
                <input
                  id="damaged"
                  type="checkbox"
                  checked={isDamagedGoods}
                  onChange={(e) => setIsDamagedGoods(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="damaged" className="text-sm text-gray-700">
                  Mark as damaged goods
                </label>
              </div>

              {isDamagedGoods && (
                <div>
                  <textarea
                    placeholder="Add a comment (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                    rows={3}
                  />
                </div>
              )}

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
              disabled={updateQuantity < 0 || !selectedUoM}
            >
              Update Stock Out
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
          <ModalTitle>Stock Out Receipt</ModalTitle>
          <ModalDescription>
            Details for stock out transaction
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          {selectedReceipt && (
            <div className="pb-6">
              <StockOutReceipt
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




