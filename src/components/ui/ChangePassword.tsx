"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

export default function ChangePassword() {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowChangePassword(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Change Password</span>
        <span className="text-s text-gray-500">
          Update your password to keep your account secure
        </span>
      </Button>
      
      <Modal
        isVisible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      >
        <ModalHeader>
          <ModalTitle>Change Password</ModalTitle>
          <ModalDescription>
            Update your password to keep your account secure
          </ModalDescription>
        </ModalHeader>
        
        <ModalContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" required />
            </div>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button 
            type="submit"
            onClick={() => setShowChangePassword(false)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}