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

export default function UpdateStockIn({ data = [] }: UpdateStockInProps) {
  const [showUpdateStockIn, setShowUpdateStockIn] = useState(false);
  const [showUpdateStockInItems, setShowUpdateStockInItems] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns = getStockInColumns(selectedId, setSelectedId);
  const selectedItem = data.find((item) => item.id === selectedId) || null;

  const handleSaveStockInDetails = async (stockDetailsArray: StockInSaveDetails[]) => {
    // TODO: Implement actual stock-in update logic with backend API
    console.log("Stock-in details saved:", stockDetailsArray);
    setShowUpdateStockInItems(false);
    setShowUpdateStockIn(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (showUpdateStockIn) {
          setShowUpdateStockInItems(true);
        }
      }}
    >
      <Button type="button" onClick={() => setShowUpdateStockIn(true)}>
        Update Stock In Items
      </Button>

      {/* Select item modal */}
      <Modal isVisible={showUpdateStockIn} onClose={() => setShowUpdateStockIn(false)}>
        <ModalHeader>
          <ModalTitle>Update Stock In Items</ModalTitle>
          <ModalDescription>Select one item you want to stock in</ModalDescription>
        </ModalHeader>

        <ModalContent className="mb-4">
          <ViewTable columns={columns} data={data} />
        </ModalContent>

        <ModalFooter className="flex gap-2">
          <Button type="submit" disabled={!selectedItem}>
            Next
          </Button>
          <Button type="button" onClick={() => setShowUpdateStockIn(false)}>
            Cancel
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
    </form>
  );
}

