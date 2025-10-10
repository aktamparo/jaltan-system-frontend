"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBranch } from "@/lib/mutations/branchMutations";
import { useQueryClient } from "@tanstack/react-query";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

export default function CreateBranch() {
const createBranchMutation = useCreateBranch();
const [name, setName] = useState("");
const [street, setStreet] = useState("");
const [city, setCity] = useState("");
const [province, setProvince] = useState("");
const [zipCode, setZipCode] = useState("");

  const [showCreateBranch, setShowCreateBranch] = useState(false);
   const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBranchMutation.mutate(
      {
        name,
        street,
        city,
        province,
        zipCode,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["branches"] });
          setName("");
          setStreet("");
          setCity("");
          setProvince("");
          setZipCode("");
          setShowCreateBranch(false);
        },
        onError: (err: unknown) => {
          let errorMsg = "Failed to create branch";
          if (err instanceof Error && err.message) {
            errorMsg = err.message;
          }
          alert(errorMsg);
        },
      }
    );
  };
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
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>Create Branch</ModalTitle>
          <ModalDescription>
            Create a new branch
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="name">Branch Name</Label>
              <Input id="name" type="text" required value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input id="street" type="text" required value={street} onChange={e => setStreet(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" type="text" required value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input id="province" type="text" required value={province} onChange={e => setProvince(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                type="number"
                min="0"
                step="1"
                required
                value={zipCode}
                onChange={e => setZipCode(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <div className="flex flex-col w-full gap-4 mt-6">
              <Button className="self-end" type="submit">
                Save
              </Button>
            </div>
        </ModalFooter>
        </form>
      </Modal>
    
    </>
  );
}