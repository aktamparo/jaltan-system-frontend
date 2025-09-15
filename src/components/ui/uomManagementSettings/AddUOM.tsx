"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import {useCreateUOM} from "@/lib/mutations/uomMutations";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useGetAllUOMTypes } from "@/lib/queries/uomQueries";
import {Uom,UomType} from "@/lib/types/uom";
export default function AddUOM() {
  const [showCreateUOM, setShowCreateUOM] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [conversionFactor, setConversionFactor] = useState("");
  const [uomTypeId, setUomTypeId] = useState("");
  const queryClient = useQueryClient();
  const createUOM = useCreateUOM();
  const { data: AllUOMType, isLoading: isLoadingAllUOMTypes } = useGetAllUOMTypes(1, 100);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUOM.mutate(
      {
        name,
        symbol,
        conversionFactor: conversionFactor === "" ? 0 : parseFloat(conversionFactor),
        uomTypeId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          setName("");
          setSymbol("");
          setConversionFactor("");
          setUomTypeId("");
          setShowCreateUOM(false)
        },
        onError: (err: unknown) => {
          let errorMsg = "Failed to create user";
          if (err instanceof Error && err.message) {
            errorMsg = err.message;
          }
          alert(errorMsg);
        },
      }
    );
  };


  return (
    <>
      <Button
        onClick={() => setShowCreateUOM(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Add New UOM</span>
        <span className="text-s text-gray-500">
          Register a Unit of Measurement into the system
        </span>
      </Button>

      <Modal
        isVisible={showCreateUOM}
        onClose={() => setShowCreateUOM(false)}
      >
        <ModalHeader>
          <ModalTitle>Create UOM Type</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new Unit of Measurement type
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="uomName">Name</Label>
                <Input id="uomName" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uomSymbol">Symbol</Label>
                <Input id="uomSymbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uomConversionFactor">Conversion Factor</Label>
                <Input id="uomConversionFactor" value={conversionFactor} onChange={e => setConversionFactor(e.target.value)} type="number" step="any" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standardUoMId">Standard UOM</Label>
                <select
                  id="uomTypeId"
                  className="w-full border rounded px-2 py-1"
                  value={uomTypeId}
                  onChange={e => setUomTypeId(e.target.value)}
                >
                  <option value="" disabled>Select a UOM Type</option>
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
            <Button type="submit">
              Save
            </Button>
          </ModalFooter>

        </form>
      </Modal>
    </>
  );
}
