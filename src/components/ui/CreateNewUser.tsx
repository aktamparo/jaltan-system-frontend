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
import {type User} from "@/components/ui/userEditComponents/columns";
export default function CreateUser() {
  const [showCreateUser, setShowCreateUser] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowCreateUser(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Create User</span>
        <span className="text-s text-gray-500">
          Fill in the details to create a new user account
        </span>
      </Button>
      
      <Modal
        isVisible={showCreateUser}
        onClose={() => setShowCreateUser(false)}
      >
        <ModalHeader>
          <ModalTitle>Create User</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new user account
          </ModalDescription>
        </ModalHeader>
        
        <ModalContent>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input id="contactNumber" />
          </div>
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select id="role" className="w-full border rounded px-2 py-1">
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" className="w-full border rounded px-2 py-1">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button 
            type="submit"
            onClick={() => setShowCreateUser(false)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}