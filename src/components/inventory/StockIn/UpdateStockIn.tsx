"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable as ViewTable } from "@/components/inventory/StockIn/UpdateStockInItems/user-view-table";
import { getStockInColumns } from "@/components/inventory/StockIn/UpdateStockInItems/columns";
import type { StockIn } from "@/components/inventory/StockIn/UpdateStockInItems/columns";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import StockInReceipt, { ReceiptData } from "@/components/inventory/StockIn/StockInReceipt";
import UpdateStockInDetails from "@/components/inventory/StockIn/UpdateStockInDetails";

interface UpdateStockInProps {
  data?: StockIn[];
}

type StockInSaveDetails = {
  itemId: string;
  quantity: number;
  uomName: string;
  uomId: string;
};

export default function UpdateStockIn({}: UpdateStockInProps) {
  const [showUpdateStockIn, setShowUpdateStockIn] = useState(false);
  const [showUpdateStockInItems, setShowUpdateStockInItems] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const dummyData: StockIn[] = [
    { id: "1", name: "Rice", category: ["PANTRY"], quantity: 5, uomSymbol: "kg" },
    { id: "2", name: "Chicken", category: ["FRIDGE"], quantity: 10, uomSymbol: "kg" },
    { id: "3", name: "Milk", category: ["FRIDGE", "PANTRY"], quantity: 100, uomSymbol: "ml" },
  ];

  const columns = getStockInColumns(selectedId, setSelectedId);
  const selectedItem = dummyData.find((item) => item.id === selectedId) || null;

  const handleSaveStockInDetails = async (stockDetailsArray: StockInSaveDetails[]) => {
    const dummyReceipt: ReceiptData = {
      stockIn: {
        id: "STOCKIN123",
        createdAt: new Date().toISOString(),
        createdBy: { employee: { firstName: "John", lastName: "Doe" } },
        modifiedAt: new Date().toISOString(),
        modifiedBy: { employee: { firstName: "John", lastName: "Doe" } },
      },
      items: stockDetailsArray.map((details, idx) => ({
        itemId: `INV${idx + 1}`,
        itemName: selectedItem?.name || details.itemId,
        quantity: details.quantity,
        uomSymbol: selectedItem?.uomSymbol || details.uomName,
      })),
    };

    setReceiptData(dummyReceipt);
    setShowUpdateStockInItems(false);
    setShowReceipt(true);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (showUpdateStockIn) {
          setShowUpdateStockInItems(true);
        } else if (showReceipt) {
          setShowReceipt(false);
        }
      }}
    >
      <Button type="button" size="sm" variant="outline" onClick={() => setShowUpdateStockIn(true)}>
        Update Stock In
      </Button>

      {/* Select item modal */}
      <Modal isVisible={showUpdateStockIn} onClose={() => setShowUpdateStockIn(false)}>
        <ModalHeader>
          <ModalTitle>Update Stock In Items</ModalTitle>
          <ModalDescription>Select one item you want to stock in</ModalDescription>
        </ModalHeader>

        <ModalContent className="mb-4">
          <ViewTable columns={columns} data={dummyData} />
        </ModalContent>

        <ModalFooter className="flex items-center justify-end gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setShowUpdateStockIn(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!selectedItem}>
            Next
          </Button>
        </ModalFooter>
      </Modal>

      {/* Enter quantity modal */}
      {showUpdateStockInItems && (
        <Modal
          isVisible={showUpdateStockInItems}
          onClose={() => setShowUpdateStockInItems(false)}
        >
          <ModalHeader>
            <ModalTitle>Update Stock In</ModalTitle>
            <ModalDescription>
              Enter quantity and unit of measurement for the selected item
            </ModalDescription>
          </ModalHeader>

          <ModalContent>
            <UpdateStockInDetails
              item={selectedItem}
              onClose={() => setShowUpdateStockInItems(false)}
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
            <ModalDescription>Review your stock-in details below.</ModalDescription>
          </ModalHeader>

          <ModalContent>
            <StockInReceipt receiptData={receiptData} onClose={() => setShowReceipt(false)} />
          </ModalContent>

          <ModalFooter className="space-y-2 gap-2">
            <Button type="submit"
            onClick={() => {
                setShowReceipt(false);
                setShowUpdateStockIn(true);  
                }}>Done</Button>
          </ModalFooter>
        </Modal>
      )}
    </form>
  );
}

