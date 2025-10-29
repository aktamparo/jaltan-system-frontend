"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Branch } from "@/lib/types/branch";
import EditBranchModal from "@/components/ui/branchMangementModals/editBranchModal";
import { DataTable as ViewTable } from "@/components/ui/branchMangementModals/branchEditDetails/user-view-table";
import { getColumns } from "@/components/ui/branchMangementModals/branchEditDetails/columns";
import { useGetAllBranches } from "@/lib/queries/branchQueries";
import PaginationControls from "@/components/ui/PaginationControls";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

export default function EditBranch() {
  const [showEditBranch, setShowEditBranch] = useState(false);
  const [showEditBranchModal, setShowEditBranchModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const columns = getColumns(selectedId, setSelectedId);

  const [page, setPage] = useState(1);
  const { data: AllBranches } = useGetAllBranches(page);
  const selectedBranch: Branch | undefined = AllBranches?.data.find(
    (branch: Branch) => branch.id === selectedId
  );

  return (
    <>
      <Button
        onClick={() => setShowEditBranch(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit Branch</span>
        <span className="text-s text-gray-500">Edit the selected branch</span>
      </Button>

      <Modal
        isVisible={showEditBranch}
        onClose={() => setShowEditBranch(false)}
      >
        <ModalHeader>
          <ModalTitle>Edit Branch</ModalTitle>
          <ModalDescription>Edit the branch details</ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <ViewTable columns={columns} data={AllBranches?.data ?? []} />
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="relative flex w-full items-center justify-center">
            <PaginationControls
              currentPage={page}
              totalPages={AllBranches?.metadata?.totalPages || 1}
              onPageChange={setPage}
            />
            <div className="absolute right-0">
              <Button
                onClick={() => setShowEditBranchModal(true)}
                disabled={!selectedBranch}
              >
                Edit Selected Branch
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {showEditBranchModal && selectedBranch && (
        <Modal
          isVisible={showEditBranchModal}
          onClose={() => setShowEditBranchModal(false)}
        >
          <ModalHeader>
            <ModalTitle>Edit Branch Details</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <EditBranchModal
              branch={selectedBranch}
              onClose={() => setShowEditBranchModal(false)}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
