"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { columns as ViewColumns } from "@/components/ui/userViewComponents/columns";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetAllAccounts } from "@/lib/queries/accountQueries";
export default function ViewUser() {
  const [showViewTable, setShowViewTable] = useState(false);
  const [page, setPage] = useState(1);
  const { data: AllUsers } = useGetAllAccounts(page);
  // const { data: AllUsers, isLoading: isLoadingAllAccounts } =
  // useGetAllAccounts();

  return (
    <div>
      <Button
        onClick={() => setShowViewTable(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">View All Users</span>
        <span className="text-s text-gray-500">
          See all registered users and their access levels
        </span>
      </Button>

      <Modal isVisible={showViewTable} onClose={() => setShowViewTable(false)}>
        <ModalHeader>
          <ModalTitle>View All Users</ModalTitle>
          <ModalDescription>
            All registered users in the system
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={ViewColumns} data={AllUsers?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <PaginationControls
            currentPage={page}
            totalPages={AllUsers?.metadata?.totalPages || 1}
            onPageChange={setPage}
          />
        </ModalFooter>
      </Modal>
    </div>
  );
}
