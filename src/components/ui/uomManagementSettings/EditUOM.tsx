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
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetAllUOM, useGetUOMTypeById } from "@/lib/queries/uomQueries";
import { UoM, UomType } from "@/lib/types/uom";
import EditUOMModal from "@/components/ui/uomManagementSettings/EditUOMModal";

export default function EditUOM() {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUOMId, setSelectedUOMId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data: AllUOMs } = useGetAllUOM(page);

  // Table columns: name, symbol, isBase, conversionFactor, radio select
  const columns: ColumnDef<UoM>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="uomSelect"
          checked={selectedUOMId === row.original.id}
          onChange={() => setSelectedUOMId(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "UOM Name",
    },
    {
      accessorKey: "uomTypeId",
      header: "UOM Type Name",
      cell: ({ getValue }) => {
        const uomTypeId = getValue() as string;
        const { data } = useGetUOMTypeById(uomTypeId);
        const uomType = data as UomType | undefined;
        return uomType?.type || uomTypeId;
      },
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
    },
    {
      accessorKey: "isBase",
      header: "Is Base?",
    },
    {
      accessorKey: "conversionFactor",
      header: "Conversion Factor",
    },
  ];

  return (
    <>
      <Button
        onClick={() => setShowSelectModal(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit Unit of Measurement</span>
        <span className="text-s text-gray-500">
          Edit an existing unit of measurement.
        </span>
      </Button>

      <Modal
        isVisible={showSelectModal}
        onClose={() => setShowSelectModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Select UOM</ModalTitle>
          <ModalDescription>
            All registered UOMs in the system. Only one can be selected.
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={columns} data={AllUOMs?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <PaginationControls
            currentPage={page}
            totalPages={AllUOMs?.metadata?.totalPages || 1}
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
            Edit Selected UOM
          </Button>
        </ModalFooter>
      </Modal>
      {showEditModal && selectedUOMId && (
        <Modal
          isVisible={showEditModal}
          onClose={() => setShowEditModal(false)}
        >
          <ModalHeader>
            <ModalTitle>Edit UOM</ModalTitle>
          </ModalHeader>
          <ModalContent>
            {(() => {
              const selectedUOM = AllUOMs?.data.find(uom => uom.id === selectedUOMId);
              if (!selectedUOM) return null;
              return (
                <EditUOMModal
                  onClose={() => setShowEditModal(false)}
                  uom={selectedUOM}
                />
              );
            })()}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
