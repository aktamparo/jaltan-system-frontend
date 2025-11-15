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
import { useGetAllUOMTypes, useGetUOMsByTypeId } from "@/lib/queries/uomQueries";
import { UoM, UomType } from "@/lib/types/uom";
import EditUOMModal from "@/components/ui/uomManagementSettings/EditUOMModal";
import { queryClient } from "@/lib/react-query";

export default function EditUOM() {
  const [showSelectTypeModal, setShowSelectTypeModal] = useState(false);
  const [showSelectUOMModal, setShowSelectUOMModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUOMTypeId, setSelectedUOMTypeId] = useState<string | null>(null);
  const [selectedUOMId, setSelectedUOMId] = useState<string | null>(null);
  const [typeSelectionPage, setTypeSelectionPage] = useState(1);
  const [uomSelectionPage, setUomSelectionPage] = useState(1);
  
  const { data: AllUOMTypes } = useGetAllUOMTypes(typeSelectionPage, 10);
  const { data: UOMsByType } = useGetUOMsByTypeId(
    selectedUOMTypeId || "",
    uomSelectionPage,
    10
  );

  const typeColumns: ColumnDef<UomType>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="uomTypeSelect"
          checked={selectedUOMTypeId === row.original.id}
          onChange={() => setSelectedUOMTypeId(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "type",
      header: "UOM Type",
    },
  ];

  const uomColumns: ColumnDef<UoM>[] = [
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
      accessorKey: "symbol",
      header: "Symbol",
    },
    {
      accessorKey: "isBase",
      header: "Is Base?",
      cell: ({ row }) => (row.original.isBase ? "Yes" : "No"),
    },
    {
      accessorKey: "conversionFactor",
      header: "Conversion Factor",
    },
  ];

  const handleTypeSelected = () => {
    if (selectedUOMTypeId) {
      setShowSelectTypeModal(false);
      setUomSelectionPage(1);
      setShowSelectUOMModal(true);
    }
  };

  const handleUOMSelected = () => {
    if (selectedUOMId) {
      setShowSelectUOMModal(false);
      queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
      setShowEditModal(true);
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedUOMId(null);
    setSelectedUOMTypeId(null);
    queryClient.invalidateQueries({ queryKey: ["uom"] });
    queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
    queryClient.invalidateQueries({ queryKey: ["uomsByType"] });
  };

  return (
    <>
      <Button
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          setShowSelectTypeModal(true);
        }}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit Unit of Measurement</span>
        <span className="text-s text-gray-500">
          Edit an existing unit of measurement
        </span>
      </Button>

      {/* Step 1: Select UOM Type */}
      <Modal
        isVisible={showSelectTypeModal}
        onClose={() => setShowSelectTypeModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Select UOM Type</ModalTitle>
          <ModalDescription>
            Choose the unit of measurement type
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={typeColumns} data={AllUOMTypes?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="relative flex w-full items-center justify-center">
            <PaginationControls
              currentPage={typeSelectionPage}
              totalPages={AllUOMTypes?.metadata?.totalPages || 1}
              onPageChange={setTypeSelectionPage}
            />
            <div className="absolute right-0">
              <Button
                onClick={handleTypeSelected}
                type="button"
                disabled={!selectedUOMTypeId}
              >
                Continue
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      {/* Step 2: Select UOM from Type */}
      <Modal
        isVisible={showSelectUOMModal}
        onClose={() => setShowSelectUOMModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Select Unit of Measurement</ModalTitle>
          <ModalDescription>
            {UOMsByType?.uomTypeName 
              ? `Choose a unit from ${UOMsByType.uomTypeName} to edit` 
              : "Choose a unit of measurement to edit"}
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={uomColumns} data={UOMsByType?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="relative flex w-full items-center justify-center">
            <PaginationControls
              currentPage={uomSelectionPage}
              totalPages={UOMsByType?.metadata?.totalPages || 1}
              onPageChange={setUomSelectionPage}
            />
            <div className="absolute right-0">
              <Button
                onClick={handleUOMSelected}
                type="button"
                disabled={!selectedUOMId}
              >
                Edit Selected UoM
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      {/* Step 3: Edit UOM */}
      {showEditModal && selectedUOMId && (
        <Modal
          isVisible={showEditModal}
          onClose={handleCloseEdit}
        >
          <ModalHeader>
            <ModalTitle>Edit Unit of Measurement</ModalTitle>
          </ModalHeader>
          <ModalContent>
            {(() => {
              const selectedUOM = UOMsByType?.data.find(uom => uom.id === selectedUOMId);
              if (!selectedUOM) return null;
              return (
                <EditUOMModal
                  onClose={handleCloseEdit}
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
