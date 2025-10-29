"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable as ViewTable } from "@/components/inventory/StockIn/StockInItems/user-view-table";
import { getStockInColumns } from "@/components/inventory/StockIn/StockInItems/columns";
import type { StockIn } from "@/components/inventory/StockIn/StockInItems/columns";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import StockInReceipt, { ReceiptData } from "@/components/inventory/StockIn/StockInReceipt";
import StockInItems from "@/components/inventory/StockIn/CreateStockIn";

interface StockInItemProps {
  data?: StockIn[];
}

type StockInSaveDetails = {
  itemId: string;
  quantity: number;
  uomName: string;
  uomId: string;
};

export default function StockInItem({}: StockInItemProps) {
  const [showStockInItem, setShowStockInItem] = useState(false);
  const [showStockInItems, setShowStockInItems] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const dummyData: StockIn[] = [
    { id: "1", name: "Rice", category: ["PANTRY"], quantity: 5, uomSymbol: "kg" },
    { id: "2", name: "Chicken", category: ["FRIDGE"], quantity: 10, uomSymbol: "kg" },
    { id: "3", name: "Milk", category: ["FRIDGE", "PANTRY"], quantity: 100, uomSymbol: "ml" },
  ];

  const columns = getStockInColumns(selectedIds, setSelectedIds);
  const selectedItems = dummyData.filter((item) => selectedIds.includes(item.id));

  const handleSaveStockInDetails = async (stockDetailsArray: StockInSaveDetails[]) => {
    const dummyReceipt: ReceiptData = {
      stockIn: {
        id: "STOCKIN123",
        referenceNumber: "REF-" + new Date().getTime(),
        createdAt: new Date().toISOString(),
        createdBy: { employee: { firstName: "John", lastName: "Doe" } },
        modifiedAt: new Date().toISOString(),
        modifiedBy: { employee: { firstName: "John", lastName: "Doe" } },
      },
      items: stockDetailsArray.map((details, idx) => ({
        itemId: `INV${idx + 1}`,
        itemName: selectedItems.find((i) => i.id === details.itemId)?.name || details.itemId,
        quantity: details.quantity,
        uomSymbol:
          selectedItems.find((i) => i.id === details.itemId)?.uomSymbol || details.uomName,
      })),
    };

    setReceiptData(dummyReceipt);
    setShowStockInItems(false);
    setShowReceipt(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="button" onClick={() => setShowStockInItem(true)}>
        Stock In Items
      </Button>

      {/* Select items modal */}
      <Modal isVisible={showStockInItem} onClose={() => setShowStockInItem(false)}>
        <ModalHeader>
          <ModalTitle>Stock In Items</ModalTitle>
          <ModalDescription>
            Select one or more items you want to stock in
          </ModalDescription>
        </ModalHeader>

        <ModalContent className="mb-4">
          <ViewTable columns={columns} data={dummyData} />
        </ModalContent>

        <ModalFooter className="flex gap-2">
          <Button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              setShowStockInItem(false);
              setShowStockInItems(true);
            }}
          >
            Next
          </Button>
          <Button type="button" onClick={() => setShowStockInItem(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Enter quantities modal */}
      {showStockInItems && (
        <Modal isVisible={showStockInItems} onClose={() => setShowStockInItems(false)}>
          <ModalHeader>
            <ModalTitle>Create Stock In</ModalTitle>
            <ModalDescription>
              Enter quantity and unit of measurement for each item
            </ModalDescription>
          </ModalHeader>

          <ModalContent>
            <StockInItems
              items={selectedItems}
              onClose={() => setShowStockInItems(false)}
              onSave={handleSaveStockInDetails}
            />
          </ModalContent>
        </Modal>
      )}

      {/* Receipt modal */}
      {showReceipt && receiptData && (
        <Modal isVisible={showReceipt} onClose={() => setShowReceipt(false)}>
          <ModalHeader>
            <ModalTitle>Stock-In Receipt</ModalTitle>
            <ModalDescription>
              Review your stock-in details below.
            </ModalDescription>
          </ModalHeader>

          <ModalContent>
            <StockInReceipt
              receiptData={receiptData}
              onClose={() => setShowReceipt(false)}
            />
          </ModalContent>

          <ModalFooter className="space-y-2 gap-2">
            <Button type="submit" 
            onClick={() => {
              setShowReceipt(false); 
              setShowStockInItem(true); 
            }}>Done</Button>
          </ModalFooter>
        </Modal>
      )}
    </form>
  );
}
