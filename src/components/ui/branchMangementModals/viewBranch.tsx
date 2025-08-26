"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Branch } from "@/components/ui/branchMangementModals/branchViewDetails/columns";
import { DataTable as ViewTable } from "@/components/ui/branchMangementModals/branchViewDetails/user-view-table";
import { columns as branchColumns } from "@/components/ui/branchMangementModals/branchViewDetails/columns";
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



export default function viewBranch({data}: ViewBranchProps) {
  const [showCreateBranch, setShowCreateBranch] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowCreateBranch(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">View all branches</span>
        <span className="text-s text-gray-500">
          View the details of all branches
        </span>
      </Button>
      
      <Modal
        isVisible={showCreateBranch}
        onClose={() => setShowCreateBranch(false)}
      >
        <ModalHeader>
          <ModalTitle>View Branch</ModalTitle>
          <ModalDescription>
            Edit the branch details
          </ModalDescription>
        </ModalHeader>
        
        <ModalContent>
          <div className="space-y-4">

            <div className="space-y-2">
              <ViewTable columns ={branchColumns} data={data}/>
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