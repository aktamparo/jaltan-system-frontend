"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { columns as ViewColumns, type User } from "@/components/ui/userViewComponents/columns";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";


interface ViewAllUsersProps {
  data: User[];
}


export default function ViewAllUsers({ data }: ViewAllUsersProps) {
  const [showViewTable, setShowViewTable] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowViewTable(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Show all users</span>
        <span className="text-s text-gray-500">
          View and manage all users in the system
        </span>
      </Button>
      
      <Modal
        isVisible={showViewTable}
        onClose={() => setShowViewTable(false)}
      >
        <ModalHeader>
          <ModalTitle>View All Users</ModalTitle>
          <ModalDescription>
            I miss her
          </ModalDescription>
        </ModalHeader>
        
        <ModalContent>
            <div className="w-full py-10">
                     <ViewTable columns={ViewColumns} data={data} />
                   </div>
        </ModalContent>
        
        <ModalFooter>

        </ModalFooter>
      </Modal>
    </>
  );
}