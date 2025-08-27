"use client"

import React, { useState } from "react";
// import { useUpdateBranch } from "@/lib/mutations/branchMutations"; // Uncomment and implement if you have this
// import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Branch } from "@/components/ui/branchMangementModals/branchViewDetails/columns";
import { DataTable as ViewTable } from "@/components/ui/branchMangementModals/branchEditDetails/user-view-table";
import { getColumns } from "@/components/ui/branchMangementModals/branchEditDetails/columns";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
interface ViewBranchProps {
  data: Branch[];
}

export default function EditBranch({ data }: ViewBranchProps) {
  const [showEditBranch, setShowEditBranch] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const columns = getColumns(selectedId, setSelectedId);

  // const updateBranchMutation = useUpdateBranch(); // Uncomment and implement if you have this
  // const queryClient = useQueryClient();

  // Find the selected branch
  const selectedBranch = data.find((b) => b.id === selectedId) || null;

  // Local state for editing branch fields
  const [name, setName] = useState("");
  // If your Branch type does not have address or status, you can remove or adjust these fields as needed
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // When a branch is selected, populate the form fields
  React.useEffect(() => {
    if (selectedBranch) {
      setName(selectedBranch.name || "");
      // If address or status do not exist on Branch, these will fallback to ""
      setAddress((selectedBranch as any).address || "");
      setStatus(((selectedBranch as any).status as "ACTIVE" | "INACTIVE") || "ACTIVE");
    }
  }, [selectedBranch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // updateBranchMutation.mutate(
    //   { id: selectedBranch.id, name, address, status },
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({ queryKey: ["branches"] });
    //       setShowEditBranch(false);
    //     },
    //     onError: (err: unknown) => {
    //       console.error("Update failed:", err);
    //       alert("Failed to update branch");
    //     },
    //   }
    // );
    setShowEditBranch(false); // Remove this when mutation is implemented
  };

  return (
    <>
      <Button
        onClick={() => setShowEditBranch(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit all branches</span>
        <span className="text-s text-gray-500">
          Edit all branches
        </span>
      </Button>
      
      <Modal
        isVisible={showEditBranch}
        onClose={() => setShowEditBranch(false)}
      >
        <ModalHeader>
          <ModalTitle>Edit Branch</ModalTitle>
          <ModalDescription>
            Edit the branch details
          </ModalDescription>
        </ModalHeader>
        
        <ModalContent>
          <div className="space-y-4">
            {/* Table for selecting a branch */}
            <div className="space-y-2">
              <ViewTable columns={columns} data={data} />
            </div>

            {/* Show form if a branch is selected */}
            {selectedBranch && (
              <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-muted">
                <div className="space-y-2">
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input
                    id="branchName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchAddress">Address</Label>
                  <Input
                    id="branchAddress"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchStatus">Status</Label>
                  <select
                    id="branchStatus"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" onClick={() => setShowEditBranch(false)} variant="secondary">
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}