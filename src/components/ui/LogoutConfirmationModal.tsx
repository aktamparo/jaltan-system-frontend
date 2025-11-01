"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
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
    <Modal isVisible={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Confirm Logout</ModalTitle>
        <ModalDescription>
          Are you sure you want to log out? You will need to sign in again to
          access your account.
        </ModalDescription>
      </ModalHeader>
      <ModalContent>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Any unsaved changes will be lost. Make sure you have saved your work before logging out.
          </p>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoggingOut}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
