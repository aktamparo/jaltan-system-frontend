"use client";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateUOMType } from "@/lib/mutations/uomMutations";
import { useGetAllUOM } from "@/lib/queries/uomQueries";
import { UoM } from "@/lib/types/uom";
import { useToast } from "@/components/ui/toast";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

export default function AddUOMType() {
  const [showCreateUOMType, setShowCreateUOMType] = useState(false);
  const [uomType, setUOMType] = useState("");
  const [uom, setUOM] = useState("");
  const queryClient = useQueryClient();
  const createUOMType = useCreateUOMType();
  const { data: AllUOM } = useGetAllUOM(1, 100);
  const toast = useToast();
  useEffect(() => {
    if (showCreateUOMType) {
      queryClient.invalidateQueries({ queryKey: ["uom"] });
    }
  }, [showCreateUOMType, queryClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUOMType.mutate(
      { type: uomType, standardUoMId: uom },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          setUOMType("");
          setShowCreateUOMType(false);
          toast.success(
            "UOM Type Created",
            "New UOM type has been successfully created."
          );
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to create UOM type";

          toast.error("UOM Type Creation Failed", errorMessage);
        },
      }
    );
  };

  return (
    <>
      <Button
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ["uom"] });
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] })
          setShowCreateUOMType(true);}}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">
          Add New Unit of Measurement Type
        </span>
        <span className="text-s text-gray-500">
          Register a UOM Type into the system
        </span>
      </Button>

      <Modal
        isVisible={showCreateUOMType}
        onClose={() => setShowCreateUOMType(false)}
      >
        <ModalHeader>
          <ModalTitle>Create UOM Type</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new UOM type
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uomType">Type</Label>
                <Input
                  id="uomType"
                  value={uomType}
                  onChange={(e) => setUOMType(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standardUoMId">Standard UOM</Label>
                <select
                  id="uom"
                  className="w-full border rounded px-2 py-1"
                  value={uom}
                  onChange={(e) => setUOM(e.target.value)}
                >
                  <option value="" disabled>
                    Select a UOM Type
                  </option>
                  {(AllUOM?.data ?? []).map((uom: UoM) => (
                    <option key={uom.id} value={uom.id}>
                      {uom.name}
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
