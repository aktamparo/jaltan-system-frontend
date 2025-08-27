"use client"

import { useState } from "react";
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

            <div className="space-y-2">
              <ViewTable columns={columns} data={data} />
            </div>

          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button 
            type="submit"
            onClick={() => setShowEditBranch(false)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}