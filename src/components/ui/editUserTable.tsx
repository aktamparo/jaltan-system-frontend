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
import { getColumns as EditColumns, type User } from "@/components/ui/userEditComponents/columns";
import { DataTable as EditTable } from "@/components/ui/userEditComponents/user-view-table";
import EditUser from "@/components/ui/editUser";
import React from "react";




interface ViewAllUsersProps {
  data: User[];
}


export default function ViewAllUsers({ data }: ViewAllUsersProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showViewTable, setShowViewTable] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const selectedUser = data.find(user => user.id === selectedId);

  return (
    <>
      <Button
        onClick={() => setShowViewTable(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit User</span>
        <span className="text-s text-gray-500">
          Change a user's information
        </span>
      </Button>

      <Modal
        isVisible={showViewTable}
        onClose={() => setShowViewTable(false)}
      >
        <ModalHeader>
          <ModalTitle>Edit User</ModalTitle>
          <ModalDescription>
            i will die soon
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full py-10">
            <EditTable columns={EditColumns(selectedId, setSelectedId)} data={data} />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button onClick={() => setShowViewTable(false)}>Close</Button>
          <Button onClick={() => setShowEditUser(true)} disabled={!selectedUser}>
            Open Edit User Modal
          </Button>
        </ModalFooter>
      </Modal>

      {/* Render EditUser inside a modal if showEditUser is true and a user is selected */}
      <Modal
        isVisible={showEditUser}
        onClose={() => setShowEditUser(false)}
      >
        <ModalHeader>
          <ModalTitle>Edit User</ModalTitle>
        </ModalHeader>
        <ModalContent>
          {selectedUser ? (
            <EditUser user={selectedUser} onClose={() => setShowEditUser(false)} />
          ) : (
            <div className="p-4">No user selected.</div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}