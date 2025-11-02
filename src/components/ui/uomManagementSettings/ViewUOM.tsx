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
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetAllUOMTypes, useGetUOMsByTypeId } from "@/lib/queries/uomQueries";
import { queryClient } from "@/lib/react-query";
import { UomType, UoM } from "@/lib/types/uom";
import { ColumnDef } from "@tanstack/react-table";

export default function ViewUOM() {
  const [showSelectTypeModal, setShowSelectTypeModal] = useState(false);
  const [showViewUOMsModal, setShowViewUOMsModal] = useState(false);
  const [selectedUOMTypeId, setSelectedUOMTypeId] = useState<string | null>(null);
  const [typeSelectionPage, setTypeSelectionPage] = useState(1);
  const [uomsPage, setUomsPage] = useState(1);
  
  const { data: AllUOMTypes } = useGetAllUOMTypes(typeSelectionPage, 10);
  const { data: UOMsByType } = useGetUOMsByTypeId(
    selectedUOMTypeId || "",
    uomsPage,
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
      setUomsPage(1);
      setShowViewUOMsModal(true);
    }
  };

  const handleCloseViewUOMs = () => {
    setShowViewUOMsModal(false);
    setSelectedUOMTypeId(null);
  };

  return (
    <div>
      <Button
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          setShowSelectTypeModal(true);
        }}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">View All Unit of Measurements</span>
        <span className="text-s text-gray-500">
          See all registered units of measurement by type
        </span>
      </Button>

      {/* UOM Type Selection Modal */}
      <Modal 
        isVisible={showSelectTypeModal} 
        onClose={() => setShowSelectTypeModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Select UOM Type</ModalTitle>
          <ModalDescription>
            Choose a unit of measurement type to view its units
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
                View UOMs
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      {/* View UOMs Modal */}
      <Modal 
        isVisible={showViewUOMsModal} 
        onClose={handleCloseViewUOMs}
      >
        <ModalHeader>
          <ModalTitle>Units of Measurement</ModalTitle>
          <ModalDescription>
            {UOMsByType?.uomTypeName 
              ? `All units under ${UOMsByType.uomTypeName}` 
              : "All registered units of measurement"}
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={uomColumns} data={UOMsByType?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="flex w-full items-center justify-center">
            <PaginationControls
              currentPage={uomsPage}
              totalPages={UOMsByType?.metadata?.totalPages || 1}
              onPageChange={setUomsPage}
            />
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
