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

export default function ViewArchive() {
  const [showViewArchive, setShowViewArchive] = useState(false);

  return (
    <>
      <Button onClick={() => setShowViewArchive(true)}>View Archive</Button>

      <Modal
        isVisible={showViewArchive} onClose={() => setShowViewArchive(false)}
      >
        <ModalHeader>
          <ModalTitle>Archived Items</ModalTitle>
          <ModalDescription>
            View all archived items here or select an item you want to restore
          </ModalDescription>
        </ModalHeader>

        <ModalContent className="mb-4"> 
            table for archived items here
        </ModalContent>

        <ModalFooter className="space-y-2 gap-2">
          <Button type="submit">Save</Button>
          <Button
            type="button"
            onClick={() => setShowViewArchive(false)}
            variant="secondary"
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

