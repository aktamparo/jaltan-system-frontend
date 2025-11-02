"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateUOMWithType } from "@/lib/mutations/uomMutations";
import { useToast } from "@/components/ui/toast";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

interface TempUoM {
  id: string;
  name: string;
  symbol: string;
  conversionFactor: number;
  isBase: boolean;
}

export default function AddUOMType() {
  const [showCreateUOMType, setShowCreateUOMType] = useState(false);
  const [showAddUOMModal, setShowAddUOMModal] = useState(false);
  const [uomTypeName, setUOMTypeName] = useState("");
  const [uomList, setUomList] = useState<TempUoM[]>([]);
  
  // Add UOM modal fields
  const [newUomName, setNewUomName] = useState("");
  const [newUomSymbol, setNewUomSymbol] = useState("");
  const [newUomConversionFactor, setNewUomConversionFactor] = useState("");
  
  const queryClient = useQueryClient();
  const createUOMWithType = useCreateUOMWithType();
  const toast = useToast();

  const handleOpenAddUOM = () => {
    setNewUomName("");
    setNewUomSymbol("");
    setNewUomConversionFactor("");
    setShowAddUOMModal(true);
  };

  const handleSaveNewUOM = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUom: TempUoM = {
      id: Date.now().toString(),
      name: newUomName,
      symbol: newUomSymbol,
      conversionFactor: parseFloat(newUomConversionFactor),
      isBase: uomList.length === 0, // First UOM is automatically base
    };
    
    setUomList([...uomList, newUom]);
    setShowAddUOMModal(false);
  };

  const handleDeleteUOM = (id: string) => {
    const updatedList = uomList.filter((uom) => uom.id !== id);
    
    // If we deleted the base UOM and there are still UOMs left, make the first one base
    if (updatedList.length > 0) {
      const hasBase = updatedList.some((uom) => uom.isBase);
      if (!hasBase) {
        updatedList[0].isBase = true;
      }
    }
    
    setUomList(updatedList);
  };

  const handleSetBase = (id: string) => {
    setUomList(
      uomList.map((uom) => ({
        ...uom,
        isBase: uom.id === id,
      }))
    );
  };

  const handleCreate = () => {
    if (!uomTypeName.trim()) {
      toast.error("Validation Error", "Please enter a UOM type name");
      return;
    }

    if (uomList.length === 0) {
      toast.error("Validation Error", "Please add at least one unit of measurement");
      return;
    }

    const baseUom = uomList.find((uom) => uom.isBase);
    if (!baseUom) {
      toast.error("Validation Error", "Please select a base unit");
      return;
    }

    createUOMWithType.mutate(
      {
        uomType: {
          type: uomTypeName,
        },
        uoms: uomList.map((uom) => ({
          name: uom.name,
          symbol: uom.symbol,
          conversionFactor: uom.conversionFactor,
          isStandard: uom.isBase,
        })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["uomTypes"] });
          queryClient.invalidateQueries({ queryKey: ["uom"] });
          setUOMTypeName("");
          setUomList([]);
          setShowCreateUOMType(false);
          toast.success(
            "UoM Type Created",
            "New UoM type with units has been successfully created."
          );
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to create UoM type";

          toast.error("UoM Type Creation Failed", errorMessage);
        },
      }
    );
  };

  const handleClose = () => {
    setShowCreateUOMType(false);
    setUOMTypeName("");
    setUomList([]);
  };

  return (
    <>
      <Button
        onClick={() => setShowCreateUOMType(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">
          Add New Unit of Measurement Type
        </span>
        <span className="text-s text-gray-500">
          Register a unit of measurement type with multiple units
        </span>
      </Button>

      {/* Main Create UOM Type Modal */}
      <Modal isVisible={showCreateUOMType} onClose={handleClose}>
        <ModalHeader>
          <ModalTitle>Add New Unit of Measurement Type</ModalTitle>
          <ModalDescription>
            Create a new unit of measurement type and add its units
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uomType">Unit of Measurement Type Name</Label>
              <Input
                id="uomType"
                value={uomTypeName}
                onChange={(e) => setUOMTypeName(e.target.value)}
                placeholder="e.g., Weight, Length, Volume"
                required
              />
            </div>

            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">Units of Measurement</div>
              
              {/* Table with scrollable container */}
              <div className="border rounded-md max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50">Symbol</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50">Conversion Factor</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 bg-gray-50">Base</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 bg-gray-50">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {uomList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                          No units added yet. Click "Add UoM" to get started.
                        </td>
                      </tr>
                    ) : (
                      uomList.map((uom) => (
                        <tr key={uom.id} className="border-b last:border-b-0">
                          <td className="px-4 py-2 text-sm">{uom.name}</td>
                          <td className="px-4 py-2 text-sm">{uom.symbol}</td>
                          <td className="px-4 py-2 text-sm">{uom.conversionFactor}</td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="radio"
                              name="baseUom"
                              checked={uom.isBase}
                              onChange={() => handleSetBase(uom.id)}
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUOM(uom.id)}
                              className="bg-[#D22929] hover:bg-[#B71C1C]"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="flex flex-row w-full gap-4 mt-6 justify-end">
            <Button type="button" onClick={handleOpenAddUOM} variant="secondary">
              Add UoM
            </Button>
            <Button type="button" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Add UOM Modal */}
      <Modal isVisible={showAddUOMModal} onClose={() => setShowAddUOMModal(false)}>
        <ModalHeader>
          <ModalTitle>Add Unit of Measurement</ModalTitle>
          <ModalDescription>
            Fill in the details for the new unit
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSaveNewUOM}>
          <ModalContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newUomName">Name</Label>
                <Input
                  id="newUomName"
                  value={newUomName}
                  onChange={(e) => setNewUomName(e.target.value)}
                  placeholder="e.g., Kilogram, Gram"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newUomSymbol">Symbol</Label>
                <Input
                  id="newUomSymbol"
                  value={newUomSymbol}
                  onChange={(e) => setNewUomSymbol(e.target.value)}
                  placeholder="e.g., kg, g"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newUomConversionFactor">Conversion Factor</Label>
                <Input
                  id="newUomConversionFactor"
                  type="number"
                  step="any"
                  value={newUomConversionFactor}
                  onChange={(e) => setNewUomConversionFactor(e.target.value)}
                  placeholder="e.g., 1, 0.001"
                  required
                />
              </div>
              {uomList.length === 0 && (
                <p className="text-sm text-gray-500">
                  Note: This will be set as the base unit automatically.
                </p>
              )}
            </div>
          </ModalContent>

          <ModalFooter>
            <div className="flex flex-row w-full gap-4 mt-6 justify-end">
              <Button 
                type="button" 
                onClick={() => setShowAddUOMModal(false)} 
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
