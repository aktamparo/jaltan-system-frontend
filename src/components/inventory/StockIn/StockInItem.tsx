"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// Update the import path below to the correct location of user-view-table
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

//import EditStockIn from "@/components/inventory/StockInItems/EditStockIn";
import StockInReceipt from "@/components/inventory/StockIn/StockInReceipt";
import StockInItems from "@/components/inventory/StockIn/CreateStockIn";

interface StockInItemProps {
  data?: StockIn[];
}

export default function StockInItem({ data = [] }: StockInItemProps) {
  const [showStockInItem, setShowStockInItem] = useState(false); //first modal
  const [showStockInItems, setShowStockInItems] = useState(false); //second modal
  //const [showEditStockIn, setShowEditStockIn] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const dummyData: StockIn[] = [
    { id: "1", name: "Rice", category: ["PANTRY"], quantity: 5, uomSymbol: "kg" },
    { id: "2", name: "Chicken", category: ["FRIDGE"], quantity: 10 , uomSymbol: "kg" },
    { id: "3", name: "Milk", category: ["FRIDGE", "PANTRY"], quantity: 100, uomSymbol: "ml" },
  ];

  const columns = getStockInColumns(selectedIds, setSelectedIds);
  const selectedItems = dummyData.filter((item) => selectedIds.includes(item.id));

  // Save handler for StockDetailsModal (now for multiple items)
  const handleSaveStockInDetails = async (stockDetailsArray: any[]) => {
    // stockDetailsArray: [{ itemId, uomId, quantity, uomName }]
 const dummyReceipt = {
  message: "Stock-in created successfully",
  stockInReceipt: {
    stockIn: {
      id: "STOCKIN123",
      createdAt: new Date().toISOString(),
      createdBy: {
        employee: {
          firstName: "John",
          lastName: "Doe",
        },
      },
      modifiedAt: new Date().toISOString(),
      modifiedBy: {
        employee: {
          firstName: "John",
          lastName: "Doe",
        },
      },
    },
    items: stockDetailsArray.map((details, idx) => ({
      stockInId: "STOCKIN123",
      name: details.name || details.itemId,
      inventoryId: `INV${idx + 1}`,
      uomId: details.uomId || "UOM1",
      quantity: details.quantity || 0,
      convertedQuantity: details.quantity || 1,
      uomName: details.uomName || "kilogram",
      uomSymbol: details.uomSymbol || "kg",
    })),
  },
};

setReceiptData(dummyReceipt.stockInReceipt);
setShowStockInItems(false);
setShowReceipt(true);

};

  return (
    <>
      <Button onClick={() => setShowStockInItem(true)}>Stock In Items</Button>

      {/* first modal - stock in items */}
      <Modal
        isVisible={showStockInItem}
        onClose={() => setShowStockInItem(false)}
      >
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
            type="submit"
            onClick={() => setShowStockInItems(true)}
            disabled={selectedIds.length === 0}
          >
            Next
          </Button>
          <Button type="submit" onClick={() => setShowStockInItem(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* second modal - create stock in (for multiple items) */}
      {showStockInItems && (
        <Modal
          isVisible={showStockInItems}
          onClose={() => setShowStockInItems(false)}
        >
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

      {/* third modal - edit stock in (for single item only)
      {showEditStockIn && selectedItems.length === 0 && (
        <Modal
          isVisible={showEditStockIn}
          onClose={() => setShowEditStockIn(false)}
        >
          <ModalHeader>
            <ModalTitle>Enter Stock Details for {selectedItems[0].name}</ModalTitle>
            <ModalDescription>
              Enter quantity, unit of measurement, and category
            </ModalDescription>
          </ModalHeader>
          <ModalContent>
            <EditStockIn
              item={selectedItems[0]}
              onClose={() => setShowEditStockIn(false)}
              onSave={(details) => handleSaveStockInDetails([{ ...details, itemId: selectedItems[0].id }])}
            />
          </ModalContent>
        </Modal>
      )} */}

      {/* fourth modal - stock in receipt */}
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
            <Button type="submit" onClick={() => setShowReceipt(false)}>
              Done
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}