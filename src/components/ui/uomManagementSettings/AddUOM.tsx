"use client";
import { useEffect } from "react";
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
export default function AddUOM() {
  const [showCreateUOM, setShowCreateUOM] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");
  const [uomTypeId, setUomTypeId] = useState("");
  const queryClient = useQueryClient();
  const createUOM = useCreateUOM();
  const { data: AllUOMType } = useGetAllUOMTypes(1, 100);
  const toast = useToast();

  useEffect(() => {
    if (showCreateUOM) {
      queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
    }
  }, [showCreateUOM, queryClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUOM.mutate(
      {
        name,
        symbol,
        conversionFactor:
          conversionFactor === "" ? 0 : parseFloat(conversionFactor),
        uomTypeId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          setName("");
          setSymbol("");
          setConversionFactor("");
          setUomTypeId("");
          setShowCreateUOM(false);
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

  return (
    <>
      <Button
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          setShowCreateUOM(true);
        }}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">
          Add a new Unit of Meassurement
        </span>
        <span className="text-s text-gray-500">
          Register a Unit of Measurement into the system
        </span>
      </Button>

      <Modal isVisible={showCreateUOM} onClose={() => setShowCreateUOM(false)}>
        <ModalHeader>
          <ModalTitle>Create UoM</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new Unit of Measurement.
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uomSymbol">Symbol</Label>
                <Input
                  id="uomSymbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standardUoMId">Standard UOM</Label>
                <select
                  id="uomTypeId"
                  className="w-full border rounded px-2 py-1"
                  value={uomTypeId}
                  onChange={(e) => setUomTypeId(e.target.value)}
                >
                  <option value="" disabled>
                    Select a UOM Type
                  </option>
                  {(AllUOMType?.data ?? []).map((uom: UomType) => (
                    <option key={uom.id} value={uom.id}>
                      {uom.type}
                    </option>
                  ))}
                </select>
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
