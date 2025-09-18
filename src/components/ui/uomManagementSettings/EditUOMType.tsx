"use client";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { UomType } from "@/lib/types/uom";
import EditUOMTypeModals from "@/components/ui/uomManagementSettings/EditUoMTypeModals";
export default function EditUOMType() {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUOMId, setSelectedUOMId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data: AllUOMTypes } = useGetAllUOMTypes(page);

  useEffect(() => {
    if (showSelectModal) {
      queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
      queryClient.invalidateQueries({ queryKey: ["uom"] });
    }
  }, [showSelectModal, queryClient]);

  useEffect(() => {
    if (showEditModal) {
      queryClient.invalidateQueries({ queryKey: ["uom"] });
      queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
    }
  }, [showEditModal, queryClient]);
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
  const columns: ColumnDef<UomType>[] = [
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
      cell: ({ row }) => {
        const id = row.original.standardUoMId;
        return id ? (uomIdToName[id] || id) : "-";
      },
    },
  ];

  return (
    <>
      <Button
        onClick={() => setShowSelectModal(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit Unit of Measurement Type</span>
        <span className="text-s text-gray-500">
          Edit an existing unit of measurement type.
        </span>
      </Button>

      <Modal
        isVisible={showSelectModal}
        onClose={() => setShowSelectModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Edit Unit of Measurement Type</ModalTitle>
          <ModalDescription>
            Edit an existing unit of measurement type.
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
            {(() => {
              const selectedUOMType = AllUOMTypes?.data.find(uomType => uomType.id === selectedUOMId);
              if (!selectedUOMType) return null;
              return (
                <EditUOMTypeModals
                  onClose={() => setShowEditModal(false)}
                  uomType={selectedUOMType}
                />
              );
            })()}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
