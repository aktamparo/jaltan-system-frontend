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
import { useUpdateUser } from "@/lib/mutations/accountMutations";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAccount } from "@/lib/queries/accountQueries";
import { useToast } from "@/components/ui/toast";
import { User } from "@/lib/types/account";
import { Branch } from "@/lib/types/branch";
import { useGetAllBranches } from "@/lib/queries/branchQueries";

export default function UpdateDetails() {
    const [showPersonalDetails, setShowPersonalDetails] = useState(false);
    
    const { data: currentUser, isLoading } = useGetAccount();
    const updateUserMutation = useUpdateUser();
    const queryClient = useQueryClient();
    const toast = useToast();
    const { data: AllBranches } = useGetAllBranches(1, 100);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [branchId, setBranchId] = useState("");

    // Initialize form when modal opens
    const handleOpenModal = () => {
      if (currentUser) {
        setFirstName(currentUser.firstName || "");
        setLastName(currentUser.lastName || "");
        setContactNumber(currentUser.contactNumber || "");
        setBranchId(currentUser.branch || "");
      }
      setShowPersonalDetails(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentUser) {
        toast.error("Error", "User information not available");
        return;
      }

      // Create a User object that matches the expected type
      const userData: User = {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
        employee: {
          firstName,
          lastName,
          contactNumber,
          branch: {
            id: branchId,
          },
        },
      };

      updateUserMutation.mutate(
        userData,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["account"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            setShowPersonalDetails(false);
            toast.success(
              "Details Updated",
              "Your personal details have been successfully updated."
            );
          },
          onError: (err: unknown) => {
            const errorMessage =
              err instanceof Error ? err.message : "Failed to update details";

            toast.error("Update Failed", errorMessage);
          },
        }
      );
    };

    if (isLoading) {
      return null;
    }

    return (
    <>
    <Button
            onClick={handleOpenModal}
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
            <form onSubmit={handleSubmit}>
              <ModalContent>
                <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input 
                    id="firstname" 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input 
                    id="lastname" 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input 
                    id="contact" 
                    type="text" 
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required 
                  />
                </div>

                {currentUser?.role === "ADMIN" && (
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <select
                      id="branch"
                      className="w-full border rounded px-2 py-1"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      required
                    >
                      {(AllBranches?.data ?? []).map((branch: Branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </ModalContent>
            
            <ModalFooter className="mt-6">
              <div className="flex flex-row w-full gap-4 justify-end">
                <Button 
                  type="submit"
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </ModalFooter>
            </form>
          </Modal>
    </>
  );
}