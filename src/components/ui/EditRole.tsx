"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { getColumns as EditColumns } from "@/components/ui/userEditComponents/columns";
import { DataTable as EditTable } from "@/components/ui/userEditComponents/user-view-table";
import EditUser from "@/components/ui/editUser";
import React from "react";
import { AllUsers } from "@/lib/types/account";

export default function ViewAllUsers({ data }: AllUsers) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showViewTable, setShowViewTable] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const selectedUser = data.find((user) => user.id === selectedId);

  return (
    <>
      <Button
        onClick={() => setShowViewTable(true)} // This was missing in the second version
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit User Role</span>
        <span className="text-s text-gray-500">
          Update user role or branch assignment
        </span>
      </Button>

      <Modal isVisible={showViewTable} onClose={() => setShowViewTable(false)}>
        <ModalHeader>
          <ModalTitle>Edit a User</ModalTitle>
          <ModalDescription>
            Select a user to edit their role and permissions
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <EditTable
              columns={EditColumns(selectedId, setSelectedId)}
              data={data}
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            onClick={() => setShowEditUser(true)}
            disabled={!selectedUser}
          >
            Edit Selected User
          </Button>
        </ModalFooter>
      </Modal>

      {/* Render EditUser inside a modal if showEditUser is true and a user is selected */}
      <Modal isVisible={showEditUser} onClose={() => setShowEditUser(false)}>
        <ModalHeader>
          <ModalTitle>Edit User</ModalTitle>
        </ModalHeader>
        <ModalContent>
          {selectedUser ? (
            <EditUser
              user={selectedUser}
              onClose={() => setShowEditUser(false)}
            />
          ) : (
            <div className="p-4">No user selected.</div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
