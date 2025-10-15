"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable as ViewTable } from "@/components/inventory/StockIn/UpdateStockInItems/user-view-table";
import { ColumnDef } from "@tanstack/react-table";
import StockOutReceipt, { ReceiptData } from "@/components/inventory/StockOut/StockOutReceipt";
import UpdateStockInDetails from "@/components/inventory/StockIn/UpdateStockInDetails";
import StockOutDetails from "./StockOutDetails";
import type { StockIn } from "@/components/inventory/StockIn/UpdateStockInItems/columns";
import { getStockInColumns } from "@/components/inventory/StockIn/UpdateStockInItems/columns";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

export default function UpdateStockOut() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [showSelectItems, setShowSelectItems] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const dummyData: StockIn[] = [
    { id: "1", name: "Rice", category: ["PANTRY"], quantity: 5, uomSymbol: "kg" },
    { id: "2", name: "Chicken", category: ["FRIDGE"], quantity: 10, uomSymbol: "kg" },
    { id: "3", name: "Milk", category: ["FRIDGE", "PANTRY"], quantity: 100, uomSymbol: "ml" },
  ];

  const columns: ColumnDef<StockIn>[] = getStockInColumns(selectedId, (id: string) => setSelectedId(id));
  const selectedItem = dummyData.find((i) => i.id === selectedId) || null;

  const handleSave = (details: { itemId: string; quantity: number; uomName: string; uomId: string; isDamaged?: boolean; comment?: string }[]) => {
    const dummyReceipt: ReceiptData = {
      stockOut: {
        id: "STOCKOUT123",
        createdAt: new Date().toISOString(),
        createdBy: { employee: { firstName: "Jane", lastName: "Doe" } },
        modifiedAt: new Date().toISOString(),
        modifiedBy: { employee: { firstName: "Jane", lastName: "Doe" } },
      },
      items: details.map((d, idx) => ({
        itemId: `OUT${idx + 1}`,
        itemName: selectedItem?.name || d.itemId,
        quantity: d.quantity,
        uomSymbol: selectedItem?.uomSymbol || d.uomName,
        isDamagedGoods: d.isDamaged,
        comment: d.comment,
      })),
    };

    setReceiptData(dummyReceipt);
    setShowSelectItems(false);
    setShowReceipt(true);
  };

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => setShowUpdate(true)}>
        Update Stock Out
      </Button>

      <Modal isVisible={showUpdate} onClose={() => setShowUpdate(false)}>
        <ModalHeader>
          <ModalTitle>Update Stock Out Items</ModalTitle>
          <ModalDescription>Select one item you want to update</ModalDescription>
        </ModalHeader>
        <ModalContent>
          <ViewTable columns={columns} data={dummyData} />
        </ModalContent>
        <ModalFooter className="flex gap-2">
          <Button size="sm" onClick={() => { setShowSelectItems(true); }} disabled={!selectedItem}>Next</Button>
          <Button variant="outline" size="sm" onClick={() => setShowUpdate(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {showSelectItems && (
        <Modal isVisible={showSelectItems} onClose={() => setShowSelectItems(false)}>
          <ModalHeader>
            <ModalTitle>Update Stock Out</ModalTitle>
            <ModalDescription>Enter quantity, unit, damaged flag and optional comment for the selected item</ModalDescription>
          </ModalHeader>

          <ModalContent>
            <StockOutDetails item={selectedItem} onClose={() => setShowSelectItems(false)} onSave={handleSave} />
          </ModalContent>
        </Modal>
      )}

      {showReceipt && receiptData && (
        <Modal isVisible={showReceipt} onClose={() => setShowReceipt(false)}>
          <ModalHeader>
            <ModalTitle>Stock-Out Receipt</ModalTitle>
            <ModalDescription>Review your stock-out details below.</ModalDescription>
          </ModalHeader>

          <ModalContent>
            <StockOutReceipt receiptData={receiptData} onClose={() => setShowReceipt(false)} />
          </ModalContent>

          <ModalFooter className="space-y-2 gap-2">
            <Button onClick={() => { setShowReceipt(false); setShowUpdate(true); }}>Done</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
