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
  const [showCreateBranch, setShowCreateBranch] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowCreateBranch(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Create Branch</span>
        <span className="text-s text-gray-500">
          Create a new branch
        </span>
      </Button>
      
      <Modal
        isVisible={showCreateBranch}
        onClose={() => setShowCreateBranch(false)}
      >
        <ModalHeader>
          <ModalTitle>Create Branch</ModalTitle>
          <ModalDescription>
            Create a new branch
          </ModalDescription>
        </ModalHeader>
        
        <ModalContent>
          <div className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input id="branchName" type="text" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input id="street" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input id="province" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                type="number"
                min="0"
                step="1"
                required
                onInput={e => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                }}
              />
            </div>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button 
            type="submit"
            onClick={() => setShowCreateBranch(false)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}