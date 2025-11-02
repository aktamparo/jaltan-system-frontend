"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateUOM } from "@/lib/mutations/uomMutations";
import { useToast } from "@/components/ui/toast";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useGetAllUOMTypes } from "@/lib/queries/uomQueries";
import { UomType } from "@/lib/types/uom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";

export default function AddUOM() {
  const [showSelectTypeModal, setShowSelectTypeModal] = useState(false);
  const [showCreateUOMModal, setShowCreateUOMModal] = useState(false);
  const [selectedUOMTypeId, setSelectedUOMTypeId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");
  
  const queryClient = useQueryClient();
  const createUOM = useCreateUOM();
  const { data: AllUOMTypes } = useGetAllUOMTypes(page, 10);
  const toast = useToast();

  const columns: ColumnDef<UomType>[] = [
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

  const handleTypeSelected = () => {
    if (selectedUOMTypeId) {
      setShowSelectTypeModal(false);
      setShowCreateUOMModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUOMTypeId) {
      toast.error("Error", "Please select a UOM type");
      return;
    }

    createUOM.mutate(
      {
        name,
        symbol,
        conversionFactor: conversionFactor === "" ? 0 : parseFloat(conversionFactor),
        uomTypeId: selectedUOMTypeId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          queryClient.invalidateQueries({ queryKey: ["uom"] });
          queryClient.invalidateQueries({ queryKey: ["uomsByType", selectedUOMTypeId] });
          setName("");
          setSymbol("");
          setConversionFactor("");
          setSelectedUOMTypeId(null);
          setShowCreateUOMModal(false);
          toast.success(
            "UOM Created",
            "New unit of measurement has been successfully created."
          );
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to create UOM";

          toast.error("UOM Creation Failed", errorMessage);
        },
      }
    );
  };

  const handleCloseCreateModal = () => {
    setShowCreateUOMModal(false);
    setName("");
    setSymbol("");
    setConversionFactor("");
    setSelectedUOMTypeId(null);
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
        <span className="text-s text-black">
          Add a New Unit of Measurement
        </span>
        <span className="text-s text-gray-500">
          Register a unit of measurement into the system
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
            Choose the unit of measurement type for the new UOM
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={columns} data={AllUOMTypes?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="relative flex w-full items-center justify-center">
            <PaginationControls
              currentPage={page}
              totalPages={AllUOMTypes?.metadata?.totalPages || 1}
              onPageChange={setPage}
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

      {/* Create UOM Modal */}
      <Modal 
        isVisible={showCreateUOMModal} 
        onClose={handleCloseCreateModal}
      >
        <ModalHeader>
          <ModalTitle>Add a New Unit of Measurement</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new unit of measurement
          </ModalDescription>
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uomName">Name</Label>
                <Input
                  id="uomName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Gram, Centimeter"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uomSymbol">Symbol</Label>
                <Input
                  id="uomSymbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g., g, cm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uomConversionFactor">Conversion Factor</Label>
                <Input
                  id="uomConversionFactor"
                  value={conversionFactor}
                  onChange={(e) => setConversionFactor(e.target.value)}
                  type="number"
                  step="any"
                  placeholder="Conversion factor to base unit"
                  required
                />
              </div>
            </div>
          </ModalContent>

          <ModalFooter>
            <div className="flex flex-col w-full gap-4 mt-6">
              <Button className="self-end" type="submit">
                Save
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
