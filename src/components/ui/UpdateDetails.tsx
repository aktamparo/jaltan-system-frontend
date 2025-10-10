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

export default function UpdateDetails() {
    const [showPersonalDetails, setShowPersonalDetails] = useState(false);

    return (
    <>
    <Button
            onClick={() => setShowPersonalDetails(true)}
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Update Personal Details</span>
            <span className="text-s text-gray-500">
              Modify your name, contact number, and branch assignment
            </span>
          </Button>
          
          <Modal
            isVisible={showPersonalDetails}
            onClose={() => setShowPersonalDetails(false)}
          >
            <ModalHeader>
              <ModalTitle>Update Personal Details</ModalTitle>
              <ModalDescription>
                Modify your name, contact number, and branch assignment
              </ModalDescription>
            </ModalHeader>
            
            <ModalContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input id="firstname" type="text" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input id="lastname" type="text" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="lastname" type="text" required />
                </div>
              </div>
            </ModalContent>
            
            <ModalFooter>
              <div className="flex flex-col w-full gap-4">
              <Button className="self-end" type="submit">
                Update
              </Button>
            </div>
            </ModalFooter>
          </Modal>
    </>
  );
}