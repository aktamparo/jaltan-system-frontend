"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable as ViewTable } from "@/components/inventory/StockInItems/CreateStockIn/user-view-table";
import { getStockInColumns } from "@/components/inventory/StockInItems/CreateStockIn/columns";
import type { StockIn } from "@/components/inventory/StockInItems/CreateStockIn/columns";

import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

import EditStockIn from "@/components/inventory/StockInItems/EditStockIn";
import StockInReceipt from "@/components/inventory/StockInItems/StockInReceipt";
import CreateStockIn from "@/components/inventory/StockInItems/CreateStockIn";

interface StockInItemProps {
  data?: StockIn[];
}

export default function StockInItem({ data = [] }: StockInItemProps) {
  const [showStockInItem, setShowStockInItem] = useState(false);
  const [showCreateStockIn, setShowCreateStockIn] = useState(false);
  const [showEditStockIn, setShowEditStockIn] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const dummyData: StockIn[] = [
    { id: "1", name: "Rice", category: ["PANTRY"], quantity: 100 },
    { id: "2", name: "Chicken", category: ["FRIDGE"], quantity: 50 },
    { id: "3", name: "Milk", category: ["FRIDGE", "PANTRY"], quantity: 30 },
  ];

  const columns = getStockInColumns(selectedId, setSelectedId);
  const selectedItem = dummyData.find((item) => item.id === selectedId);

  // Save handler for StockDetailsModal
  const handleSaveStockInDetails = async (stockDetails: any) => {
    const dummyReceipt = {
      message: "Stock-in created successfully",
      stockInReceipt: {
        stockIn: {
          id: "STOCKIN123",
          createdAt: new Date().toISOString(),
          createdById: "USER1",
          modifiedAt: new Date().toISOString(),
          modifiedById: "USER1",
        },
        items: [
          {
            stockInId: "STOCKIN123",
            itemId: selectedItem?.id,
            inventoryId: "INV123",
            uomId: stockDetails?.uomId || "UOM1",
            quantity: stockDetails?.quantity || 0,
            convertedQuantity: stockDetails?.quantity || 0,
            uomName: stockDetails?.uomName || "kg",
          },
        ],
      },
    };

    setReceiptData(dummyReceipt.stockInReceipt);
    setShowEditStockIn(false);
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
            Select an item you want to stock in
          </ModalDescription>
        </ModalHeader>

        <ModalContent className="mb-4">
          <ViewTable columns={columns} data={dummyData} />
        </ModalContent>

        <ModalFooter className="flex gap-2">
          <Button type="submit" onClick={() => setShowCreateStockIn(true)} disabled={!selectedItem}>
            Create Stock In
          </Button>
          <Button
            onClick={() => setShowEditStockIn(true)}
            disabled={!selectedItem}
          >
            Edit
          </Button>
          
          <Button type="submit" onClick={() => setShowStockInItem(false)}>
            Cancel
          </Button>
          
        </ModalFooter>
      </Modal>


      {/* second modal - create stock in */}
      {showCreateStockIn && (
      <Modal
        isVisible={showCreateStockIn}
        onClose={() => setShowCreateStockIn(false)}
      >
        <ModalHeader>
          <ModalTitle>Create Stock In</ModalTitle>
          <ModalDescription>
            Enter quantity, and unit of measurement
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <CreateStockIn
            item={dummyData[0]} // Pass a default or selected StockIn item here
            onClose={() => setShowCreateStockIn(false)}
            onSave={handleSaveStockInDetails} // <-- hook into save
          />
        </ModalContent>

      </Modal>
)}



      {/* third modal - edit stock in */}
      {showEditStockIn && selectedItem && (
        <Modal
          isVisible={showEditStockIn}
          onClose={() => setShowEditStockIn(false)}
        >
          <ModalHeader>
            <ModalTitle>Enter Stock Details for {selectedItem.name}</ModalTitle>
            <ModalDescription>
              Enter quantity, unit of measurement, and category
            </ModalDescription>
          </ModalHeader>
          <ModalContent>
            <EditStockIn 
              item={selectedItem}
              onClose={() => setShowEditStockIn(false)}
              onSave={handleSaveStockInDetails}
            />
          </ModalContent>
        </Modal>
      )}

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

