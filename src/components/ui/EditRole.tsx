"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AllBranches, Branch } from "@/lib/types/branch";
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
import {useGetAllAccounts} from "@/lib/queries/accountQueries";
import React from "react";
import { AllUsers, User } from "@/lib/types/account";
import PaginationControls from "@/components/ui/PaginationControls";
export default function EditRole() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showViewTable, setShowViewTable] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [page, setPage] = useState(1);
  const { data: AllUsers, isLoading: isLoadingAllAccounts } = useGetAllAccounts(page);
  const userArray: User[] = AllUsers?.data ?? [];
  const selectedUser: User | undefined = userArray.find((user: User) => user.id === selectedId);


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
              data={userArray}
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="flex flex-col w-full gap-4">
            <PaginationControls
              currentPage={page}
              totalPages={AllUsers?.metadata?.totalPages || 1}
              onPageChange={setPage}
            />
            <Button
              onClick={() => setShowEditUser(true)}
              disabled={!selectedUser}
              className="self-end"
            >
              Edit Selected User
            </Button>
          </div>
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
