"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMasterItem } from "@/lib/mutations/inventoryMutations";
import { useQueryClient } from "@tanstack/react-query";
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

export default function CreateItem() {
  const [showCreateMasterItem, setShowCreateMasterItem] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<("FRIDGE" | "PANTRY")[]>(["PANTRY"]);
  const [uomTypeId, setUomTypeId] = useState("");

  const { data: AllUOMTypes } = useGetAllUOMTypes(1, 100);
  const createMasterItem = useCreateMasterItem();
  const queryClient = useQueryClient();
  const toast = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMasterItem.mutate(
      {
        name,
        description,
        category,
        uomTypeId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
          queryClient.invalidateQueries({ queryKey: ["masterItems"] });
          setName("");
          setDescription("");
          setCategory(["PANTRY"]);
          setUomTypeId("");
          setShowCreateMasterItem(false);
          toast.success(
            "Item Created",
            "New master item has been successfully created."
          );
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to create item";

          toast.error("Item Creation Failed", errorMessage);
        },
      }
    );
  };
  return (
    <>
      <Button
        onClick={() => setShowCreateMasterItem(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Create a new Item</span>
        <span className="text-s text-gray-500">Create a new Master Item</span>
      </Button>

      <Modal
        isVisible={showCreateMasterItem}
        onClose={() => setShowCreateMasterItem(false)}
      >
        <ModalHeader>
          <ModalTitle>Create Master Item</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new master item
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full border rounded px-2 py-1"
                  value={category.join(",")}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "FRIDGE,PANTRY")
                      setCategory(["FRIDGE", "PANTRY"]);
                    else setCategory([val as "FRIDGE" | "PANTRY"]);
                  }}
                >
                  <option value="FRIDGE">FRIDGE</option>
                  <option value="PANTRY">PANTRY</option>
                  <option value="FRIDGE,PANTRY">FRIDGE & PANTRY</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uomTypeId">Type</Label>
                <select
                  id="uomTypeId"
                  className="w-full border rounded px-2 py-1"
                  value={uomTypeId}
                  onChange={(e) => setUomTypeId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  {(AllUOMTypes?.data ?? []).map((uomType: UomType) => (
                    <option key={uomType.id} value={uomType.id}>
                      {uomType.type}
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
