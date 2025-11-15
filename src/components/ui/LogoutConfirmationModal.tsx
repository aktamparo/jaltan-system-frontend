"use client";

import { useState } from "react";
import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onConfirm();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Modal isVisible={isOpen} onClose={onClose} className="max-w-md" hideCloseButton>
      <ModalHeader className="text-center items-center">
        <ModalTitle className="text-lg font-semibold">Confirmation</ModalTitle>
        <ModalDescription>
          Are you sure you want to log out?
        </ModalDescription>
      </ModalHeader>
      <ModalFooter className="justify-center gap-3">
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          disabled={isLoggingOut}
          className="min-w-24 bg-[#D22929] hover:bg-[#B71C1C]"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoggingOut}
          className="min-w-24"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
