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

export default function StockOutItem() {
  const [showStockOutItem, setShowStockOutItem] = useState(false);

  return (
    <>
      <Button onClick={() => setShowStockOutItem(true)}>Stock Out Items</Button>

      <Modal
        isVisible={showStockOutItem} onClose={() => setShowStockOutItem(false)}
      >
        <ModalHeader>
          <ModalTitle>Stock Out Items</ModalTitle>
          <ModalDescription>
            Select an item you want to stock out
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