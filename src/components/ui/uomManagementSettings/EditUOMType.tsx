"use client";
import { useState } from "react";
import EditUOMTypeModal from "@/components/ui/uomManagementSettings/EditUOMTypeModal";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetAllUOMTypes } from "@/lib/queries/uomQueries";
import { getUOMById } from "@/lib/services/uomServices";
import { useQueries } from "@tanstack/react-query";

export default function EditUOMType() {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUOMId, setSelectedUOMId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data: AllUOMTypes } = useGetAllUOMTypes(page);
  // Get all unique standardUoMId values from UOM types
  const standardUoMIds = Array.from(
    new Set(
      (AllUOMTypes?.data ?? [])
        .map((uomType) => uomType.standardUoMId)
        .filter(Boolean)
    )
  );

  // Use useQueries to fetch each UOM by its ID
  const uomQueries = useQueries({
    queries: standardUoMIds.map((id) => ({
      queryKey: ["uom", id],
      queryFn: () => getUOMById(id as string),
      enabled: typeof id === "string" && !!id,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
    })),
  });

  // Build a mapping from standardUoMId to UOM name
  const uomIdToName: Record<string, string> = {};
  uomQueries.forEach((q, idx) => {
    if (q.data && standardUoMIds[idx]) {
      uomIdToName[standardUoMIds[idx]] = q.data.name;
    }
  });

  // Table columns: type, standardUoMId, radio select
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="uomTypeSelect"
          checked={selectedUOMId === row.original.id}
          onChange={() => setSelectedUOMId(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "standardUoMId",
      header: "Standard UOM",
      cell: ({ getValue }) => uomIdToName[getValue() as string] || getValue(),
    },
  ];

  return (
    <>
      <Button
        onClick={() => setShowSelectModal(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Select UOM Type</span>
        <span className="text-s text-gray-500">
          Choose one UOM type from the list
        </span>
      </Button>

      <Modal
        isVisible={showSelectModal}
        onClose={() => setShowSelectModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Select UOM Type</ModalTitle>
          <ModalDescription>
            All registered UOM Types in the system. Only one can be selected.
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={columns} data={AllUOMTypes?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <PaginationControls
            currentPage={page}
            totalPages={AllUOMTypes?.metadata?.totalPages || 1}
            onPageChange={setPage}
          />
          <Button
            type="button"
            disabled={!selectedUOMId}
            onClick={() => {
              if (selectedUOMId) {
                setShowSelectModal(false);
                setShowEditModal(true);
              }
            }}
            className="ml-4"
          >
            Edit Selected UOM Type
          </Button>
        </ModalFooter>
      </Modal>
      {showEditModal && selectedUOMId && (
        <Modal
          isVisible={showEditModal}
          onClose={() => setShowEditModal(false)}
        >
          <ModalHeader>
            <ModalTitle>Edit UOM Type</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <EditUOMTypeModal onClose={() => setShowEditModal(false)} />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
