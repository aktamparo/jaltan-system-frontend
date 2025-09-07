"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { IconArchive } from "@tabler/icons-react";

export default function ArchiveItem() {
  const [showArchiveItem, setShowArchiveItem] = useState(false);

  const handleClose = () => {
    setShowArchiveItem(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => setShowArchiveItem(true)}
      >
        <IconArchive />
      </Button>

      <Modal
        className="w-full h-full max-w-sm max-h-[185px]"
        isVisible={showArchiveItem} onClose={() => setShowArchiveItem(false)}
      >
        <ModalHeader>
          <ModalTitle>Archive Item</ModalTitle>
        </ModalHeader>

        <ModalContent>
          <p>Are you sure you want to archive this item?</p>
        </ModalContent>

        <ModalFooter className="justify-center items center gap-4">
          <Button variant="outline" onClick={handleClose}>
            No
          </Button>
          <Button variant="destructive" onClick={handleClose}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
