"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalDescription
} from "@/components/ui/modal";

export default function StockInItem() {
  const [showStockInItem, setShowStockInItem] = useState(false);

  return (
    <>
      <Button onClick={() => setShowStockInItem(true)}>Stock In Items</Button>

      <Modal
        isVisible={showStockInItem} onClose={() => setShowStockInItem(false)}
      >
        <ModalHeader>
          <ModalTitle>Stock In Items</ModalTitle>
          <ModalDescription>
            Select an item you want to stock in
          </ModalDescription>
        </ModalHeader>

        {/* radio buttons for items saame with edit user */}
        <ModalContent className="mb-4"> 
            table for items here
        </ModalContent>

        <ModalFooter className="space-y-2 gap-2">
          <Button
                    //   onClick={() => setShowEditUser(true)} (StockDetails component)
                    //   disabled={!selectedUser}
                    >
                      Enter Stock Details
                    </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}